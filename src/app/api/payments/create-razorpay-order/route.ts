import { NextRequest } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { generateInvoiceNumber } from '@/lib/utils';
import { sendPaymentConfirmationEmail, sendCourseEnrollmentEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';

// POST /api/payments/create-razorpay-order — Create Razorpay order
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['STUDENT', 'ADMIN']);
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.role === 'ADMIN' ? undefined : session.userId },
      include: { items: true },
    });

    if (!order) return errorResponse('Order not found', 404);
    if (order.status !== 'PENDING') return errorResponse('Order already processed', 400);
    if (order.total === 0) return errorResponse('Free order does not need payment', 400);

    // Dynamic import for Razorpay (optional dependency)
    let razorpayOrder;
    try {
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.total * 100), // paise
        currency: 'INR',
        receipt: order.invoiceNumber,
        notes: {
          orderId: order.id,
          userId: session.userId,
        },
      });
    } catch (razorpayError) {
      console.error('Razorpay error:', razorpayError);
      // Return mock order for development without Razorpay
      if (process.env.NODE_ENV === 'development') {
        razorpayOrder = {
          id: `rzp_mock_${Date.now()}`,
          amount: Math.round(order.total * 100),
          currency: 'INR',
        };
      } else {
        return errorResponse('Payment gateway error', 502);
      }
    }

    // Store gateway order ID
    await prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        amount: order.total,
        currency: 'INR',
        gateway: 'razorpay',
        gatewayOrderId: razorpayOrder.id,
        status: 'PENDING',
      },
      update: {
        gatewayOrderId: razorpayOrder.id,
      },
    });

    return successResponse({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
