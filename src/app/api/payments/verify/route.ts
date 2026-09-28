import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { generateInvoiceNumber, formatCurrency } from '@/lib/utils';
import { sendPaymentConfirmationEmail, sendCourseEnrollmentEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';

// POST /api/payments/verify — Verify Razorpay payment (server-side)
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['STUDENT', 'ADMIN']);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    // CRITICAL: Server-side signature verification
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isDevelopment = process.env.NODE_ENV === 'development';
    const isSignatureValid = isDevelopment
      ? true // Skip verification in dev mode
      : expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      // Log failed attempt
      await prisma.payment.updateMany({
        where: { orderId, gatewayOrderId: razorpay_order_id },
        data: { status: 'FAILED', failureReason: 'Invalid signature' },
      });
      return errorResponse('Payment verification failed. Invalid signature.', 400);
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { course: true, bundle: { include: { courses: { include: { course: true } } } } } } },
    });

    if (!order) return errorResponse('Order not found', 404);
    if (order.status === 'COMPLETED') {
      return successResponse({ alreadyProcessed: true }, 'Payment already processed');
    }
    if (order.userId !== session.userId && session.role !== 'ADMIN') {
      return errorResponse('Unauthorized', 403);
    }

    // Process in transaction
    await prisma.$transaction(async (tx) => {
      // Update payment
      await tx.payment.updateMany({
        where: { orderId },
        data: {
          gatewayPaymentId: razorpay_payment_id,
          gatewaySignature: razorpay_signature,
          status: 'CAPTURED',
          paidAt: new Date(),
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' },
      });

      // Enroll in all courses
      const courseIds: string[] = [];

      for (const item of order.items) {
        if (item.courseId && item.course) {
          const expiresAt = item.course.validity
            ? new Date(Date.now() + item.course.validity * 24 * 60 * 60 * 1000)
            : item.course.expiryDate || null;

          await tx.enrollment.upsert({
            where: { userId_courseId: { userId: order.userId, courseId: item.courseId } },
            create: { userId: order.userId, courseId: item.courseId, orderId, expiresAt, isActive: true },
            update: { isActive: true, expiresAt },
          });
          courseIds.push(item.courseId);
        }

        if (item.bundleId && item.bundle) {
          for (const bc of item.bundle.courses) {
            const expiresAt = item.bundle.validity
              ? new Date(Date.now() + item.bundle.validity * 24 * 60 * 60 * 1000)
              : null;

            await tx.enrollment.upsert({
              where: { userId_courseId: { userId: order.userId, courseId: bc.courseId } },
              create: { userId: order.userId, courseId: bc.courseId, orderId, expiresAt, isActive: true },
              update: { isActive: true, expiresAt },
            });
            courseIds.push(bc.courseId);
          }
        }
      }

      // Create invoice
      const taxRate = parseFloat(process.env.TAX_RATE || '0');
      await tx.invoice.create({
        data: {
          orderId,
          invoiceNumber: order.invoiceNumber,
          studentName: session.name,
          studentEmail: session.email,
          items: order.items.map(item => ({
            title: item.title,
            price: item.price,
            finalPrice: item.finalPrice,
          })),
          subtotal: order.subtotal,
          discount: order.couponDiscount,
          tax: order.tax,
          taxRate,
          total: order.total,
          status: 'paid',
        },
      });
    });

    // Send notifications (non-blocking)
    const user = await prisma.user.findUnique({ where: { id: order.userId }, select: { email: true, name: true } });
    if (user) {
      sendPaymentConfirmationEmail(
        user.email,
        user.name,
        order.invoiceNumber,
        formatCurrency(order.total)
      ).catch(console.error);

      createNotification({
        userId: order.userId,
        type: 'PAYMENT',
        title: 'Payment Successful!',
        message: `Your payment of ${formatCurrency(order.total)} was successful. Invoice: ${order.invoiceNumber}`,
        link: `/student/orders/${orderId}`,
      }).catch(console.error);
    }

    return successResponse({
      verified: true,
      invoiceNumber: order.invoiceNumber,
    }, 'Payment verified and enrollment activated');
  } catch (error) {
    return handleApiError(error);
  }
}
