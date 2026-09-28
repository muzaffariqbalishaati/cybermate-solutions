import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { generateInvoiceNumber } from '@/lib/utils';
import { sendCourseEnrollmentEmail, sendPaymentConfirmationEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';
import { formatCurrency } from '@/lib/utils';

// POST /api/orders — create an order
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['STUDENT', 'ADMIN', 'PARENT']);

    const body = await req.json();
    const { items, couponCode } = body;

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

        // Check if already enrolled
        const enrolled = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId: session.userId, courseId: item.courseId } },
        });
        if (enrolled?.isActive) {
          return errorResponse(`You are already enrolled in "${course.title}"`, 400);
        }

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

      if (!coupon) {
        return errorResponse('Invalid coupon code', 400);
      }

      const now = new Date();
      if (coupon.startDate && coupon.startDate > now) {
        return errorResponse('Coupon is not yet active', 400);
      }
      if (coupon.expiryDate && coupon.expiryDate < now) {
        return errorResponse('Coupon has expired', 400);
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return errorResponse('Coupon usage limit reached', 400);
      }
      if (coupon.usages.length >= coupon.perUserLimit) {
        return errorResponse('You have already used this coupon', 400);
      }
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return errorResponse(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
      }

      if (coupon.type === 'PERCENTAGE') {
        couponDiscount = Math.min(subtotal, (subtotal * coupon.value) / 100);
        if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      } else {
        couponDiscount = Math.min(subtotal, coupon.value);
      }

      couponId = coupon.id;
    }

    // Tax calculation
    const taxEnabled = process.env.TAX_ENABLED === 'true';
    const taxRate = taxEnabled ? parseFloat(process.env.TAX_RATE || '0') : 0;
    const taxableAmount = subtotal - couponDiscount;
    const tax = taxEnabled ? (taxableAmount * taxRate) / 100 : 0;
    const total = taxableAmount + tax;

    const invoiceNumber = generateInvoiceNumber();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.userId,
          invoiceNumber,
          subtotal,
          discount: 0,
          couponDiscount,
          tax,
          total,
          couponId,
          status: total === 0 ? 'COMPLETED' : 'PENDING',
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
            userId: session.userId,
            orderId: newOrder.id,
            discount: couponDiscount,
          },
        });
      }

      // If free (total = 0), auto-enroll
      if (total === 0) {
        for (const item of orderItems) {
          if (item.courseId) {
            await tx.enrollment.upsert({
              where: { userId_courseId: { userId: session.userId, courseId: item.courseId } },
              create: { userId: session.userId, courseId: item.courseId, orderId: newOrder.id },
              update: { isActive: true },
            });
          }
        }

        // Create invoice for free order
        await tx.invoice.create({
          data: {
            orderId: newOrder.id,
            invoiceNumber,
            studentName: session.name,
            studentEmail: session.email,
            items: orderItems,
            subtotal,
            discount: couponDiscount,
            tax,
            taxRate,
            total: 0,
            status: 'paid',
          },
        });
      }

      return newOrder;
    });

    // Send notifications for free orders
    if (total === 0) {
      for (const item of orderItems) {
        if (item.courseId) {
          const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/student/courses/${item.courseId}`;
          sendCourseEnrollmentEmail(session.email, session.name, item.title, courseUrl).catch(console.error);
          createNotification({
            userId: session.userId,
            type: 'GENERAL',
            title: 'Course Enrolled!',
            message: `You have been enrolled in "${item.title}"`,
            link: `/student/courses/${item.courseId}`,
          }).catch(console.error);
        }
      }
    }

    return successResponse(
      {
        orderId: order.id,
        invoiceNumber: order.invoiceNumber,
        total: order.total,
        status: order.status,
        items: orderItems,
        // Include Razorpay order ID if payment needed (will be created in payment route)
      },
      'Order created',
      201
    );
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
        items: true,
        payment: { select: { status: true, gatewayPaymentId: true } },
        invoice: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse(orders);
  } catch (error) {
    return handleApiError(error);
  }
}
