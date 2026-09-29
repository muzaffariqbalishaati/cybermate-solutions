import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, getSessionFromRequest, signToken, createAuthCookie } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { generateInvoiceNumber, hashPassword, generateReferralCode } from '@/lib/utils';
import { sendCourseEnrollmentEmail, sendPaymentConfirmationEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';
import { formatCurrency } from '@/lib/utils';

// POST /api/orders — create an order / checkout enrollment
export async function POST(req: NextRequest) {
  try {
    let session = await getSessionFromRequest(req);
    const body = await req.json();
    let { items, courseSlug, billingDetails, couponCode, paymentMethod } = body;

    let tokenToSet: string | null = null;

    // If not logged in, auto-register/login using billing details
    if (!session) {
      if (billingDetails?.email && billingDetails?.fullName) {
        const cleanEmail = billingDetails.email.toLowerCase().trim();
        let user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (!user) {
          const hashedPassword = await hashPassword(billingDetails.phone || 'Student@123');
          const newReferralCode = generateReferralCode(billingDetails.fullName);
          user = await prisma.user.create({
            data: {
              name: billingDetails.fullName,
              email: cleanEmail,
              phone: billingDetails.phone,
              password: hashedPassword,
              role: 'STUDENT',
              student: {
                create: {
                  referralCode: newReferralCode,
                  grade: billingDetails.grade || 'Class 10',
                  state: billingDetails.state || 'Delhi',
                },
              },
            },
          });
        }
        const token = await signToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        });
        tokenToSet = token;
        session = {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      } else {
        return errorResponse('Please log in or provide complete billing details.', 401);
      }
    }

    // Resolve course by slug if items array not provided
    if ((!items || items.length === 0) && courseSlug) {
      const course = await prisma.course.findFirst({
        where: {
          OR: [{ slug: courseSlug }, { id: courseSlug }],
          status: 'PUBLISHED',
        },
      });
      if (course) {
        items = [{ courseId: course.id }];
      } else {
        // Fallback to first available published course for demo slugs
        const fallbackCourse = await prisma.course.findFirst({ where: { status: 'PUBLISHED' } });
        if (fallbackCourse) {
          items = [{ courseId: fallbackCourse.id }];
        }
      }
    }

    if (!items || items.length === 0) {
      return errorResponse('Cart is empty', 400);
    }

    // Fetch items with prices
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      if (item.courseId) {
        const course = await prisma.course.findUnique({
          where: { id: item.courseId, status: 'PUBLISHED' },
          select: { id: true, title: true, price: true, salePrice: true },
        });
        if (!course) return errorResponse(`Course not found: ${item.courseId}`, 404);

        const price = course.price;
        const finalPrice = course.salePrice ?? course.price;
        subtotal += finalPrice;
        orderItems.push({ courseId: course.id, title: course.title, price, salePrice: course.salePrice, finalPrice });
      }

      if (item.bundleId) {
        const bundle = await prisma.bundle.findUnique({
          where: { id: item.bundleId, isActive: true },
          select: { id: true, title: true, price: true, salePrice: true },
        });
        if (!bundle) return errorResponse(`Bundle not found: ${item.bundleId}`, 404);

        const price = bundle.price;
        const finalPrice = bundle.salePrice ?? bundle.price;
        subtotal += finalPrice;
        orderItems.push({ bundleId: bundle.id, title: bundle.title, price, salePrice: bundle.salePrice, finalPrice });
      }
    }

    // Validate coupon server-side
    let couponDiscount = 0;
    let couponId: string | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true },
        include: { usages: { where: { userId: session.userId } } },
      });

      if (coupon) {
        const now = new Date();
        const isValid = (!coupon.startDate || coupon.startDate <= now) &&
                        (!coupon.expiryDate || coupon.expiryDate >= now) &&
                        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit);

        if (isValid) {
          if (coupon.type === 'PERCENTAGE') {
            couponDiscount = Math.min(subtotal, (subtotal * coupon.value) / 100);
            if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
          } else {
            couponDiscount = Math.min(subtotal, coupon.value);
          }
          couponId = coupon.id;
        }
      }
    }

    // Tax calculation
    const taxEnabled = process.env.TAX_ENABLED === 'true';
    const taxRate = taxEnabled ? parseFloat(process.env.TAX_RATE || '0') : 0;
    const taxableAmount = Math.max(0, subtotal - couponDiscount);
    const tax = taxEnabled ? (taxableAmount * taxRate) / 100 : 0;
    const total = taxableAmount + tax;

    const invoiceNumber = generateInvoiceNumber();

    // Create order and enroll student in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session!.userId,
          invoiceNumber,
          subtotal,
          discount: 0,
          couponDiscount,
          tax,
          total,
          couponId,
          status: 'COMPLETED',
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // Update coupon usage
      if (couponId && couponDiscount > 0) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
        await tx.couponUsage.create({
          data: {
            couponId,
            userId: session!.userId,
            orderId: newOrder.id,
            discount: couponDiscount,
          },
        });
      }

      // Auto-enroll student into purchased courses
      for (const item of orderItems) {
        if (item.courseId) {
          await tx.enrollment.upsert({
            where: { userId_courseId: { userId: session!.userId, courseId: item.courseId } },
            create: { userId: session!.userId, courseId: item.courseId, orderId: newOrder.id, isActive: true },
            update: { isActive: true },
          });
        }
      }

      // Create invoice
      await tx.invoice.create({
        data: {
          orderId: newOrder.id,
          invoiceNumber,
          studentName: session!.name,
          studentEmail: session!.email,
          items: orderItems,
          subtotal,
          discount: couponDiscount,
          tax,
          taxRate,
          total,
          status: 'paid',
        },
      });

      return newOrder;
    });

    // Send notifications (non-blocking)
    for (const item of orderItems) {
      if (item.courseId) {
        const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/student/courses/${item.courseId}`;
        sendCourseEnrollmentEmail(session.email, session.name, item.title, courseUrl).catch(console.error);
        createNotification({
          userId: session.userId,
          type: 'GENERAL',
          title: 'Course Enrolled! 🎓',
          message: `You are now enrolled in "${item.title}". Start learning now!`,
          link: `/student/courses`,
        }).catch(console.error);
      }
    }

    const response = NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        status: order.status,
        items: orderItems,
      },
      message: 'Enrollment successful! Welcome to the course.',
    }, { status: 201 });

    if (tokenToSet) {
      response.headers.set('Set-Cookie', createAuthCookie(tokenToSet));
    }

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/orders — list orders for current user
export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, ['STUDENT', 'ADMIN', 'PARENT', 'TEACHER']);
    const { searchParams } = new URL(req.url);

    const where = session.role === 'ADMIN'
      ? {}
      : { userId: session.userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
        payment: { select: { status: true, gatewayPaymentId: true, gateway: true } },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse(orders);
  } catch (error) {
    return handleApiError(error);
  }
}
