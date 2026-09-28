import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { formatCurrency } from '@/lib/utils';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';

// Disable Next.js body parser to preserve raw body for signature verification
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook secret and signature
    if (!webhookSecret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not set in environment variables');
      return NextResponse.json(
        { error: 'Webhook secret not configured on server' },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    const isValid = verifyWebhookSignature({
      body: rawBody,
      signature,
      secret: webhookSecret,
    });

    if (!isValid) {
      console.error('Invalid Razorpay webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    console.log(`[Razorpay Webhook] Received event: ${eventType} (ID: ${event.id || 'N/A'})`);

    const paymentEntity = event.payload?.payment?.entity;
    const orderEntity = event.payload?.order?.entity;

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const razorpayOrderId = orderEntity?.id || paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;
      const appOrderId = orderEntity?.notes?.orderId || paymentEntity?.notes?.orderId;

      // Find the application order
      let order = null;
      if (appOrderId) {
        order = await prisma.order.findUnique({
          where: { id: appOrderId },
          include: {
            items: {
              include: {
                course: true,
                bundle: { include: { courses: { include: { course: true } } } },
              },
            },
            user: { select: { id: true, name: true, email: true } },
          },
        });
      }

      if (!order && razorpayOrderId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: { gatewayOrderId: razorpayOrderId },
          include: {
            order: {
              include: {
                items: {
                  include: {
                    course: true,
                    bundle: { include: { courses: { include: { course: true } } } },
                  },
                },
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        });
        order = paymentRecord?.order || null;
      }

      if (!order) {
        console.warn(`[Razorpay Webhook] Order not found for RZP Order: ${razorpayOrderId}, App Order: ${appOrderId}`);
        return NextResponse.json({ received: true, note: 'Order not found' });
      }

      if (order.status === 'COMPLETED') {
        return NextResponse.json({ received: true, note: 'Order already processed' });
      }

      // Execute transaction to complete order, payment, enrollment & invoice
      await prisma.$transaction(async (tx) => {
        // Update payment record
        await tx.payment.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            amount: order.total,
            currency: 'INR',
            gateway: 'razorpay',
            gatewayOrderId: razorpayOrderId || `rzp_${order.id}`,
            gatewayPaymentId: razorpayPaymentId,
            gatewaySignature: signature,
            status: 'CAPTURED',
            paidAt: new Date(),
          },
          update: {
            gatewayPaymentId: razorpayPaymentId,
            gatewaySignature: signature,
            status: 'CAPTURED',
            paidAt: new Date(),
          },
        });

        // Update order status
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'COMPLETED' },
        });

        // Activate enrollments
        for (const item of order.items) {
          if (item.courseId && item.course) {
            const expiresAt = item.course.validity
              ? new Date(Date.now() + item.course.validity * 24 * 60 * 60 * 1000)
              : item.course.expiryDate || null;

            await tx.enrollment.upsert({
              where: { userId_courseId: { userId: order.userId, courseId: item.courseId } },
              create: {
                userId: order.userId,
                courseId: item.courseId,
                orderId: order.id,
                expiresAt,
                isActive: true,
              },
              update: { isActive: true, expiresAt },
            });
          }

          if (item.bundleId && item.bundle) {
            for (const bc of item.bundle.courses) {
              const expiresAt = item.bundle.validity
                ? new Date(Date.now() + item.bundle.validity * 24 * 60 * 60 * 1000)
                : null;

              await tx.enrollment.upsert({
                where: { userId_courseId: { userId: order.userId, courseId: bc.courseId } },
                create: {
                  userId: order.userId,
                  courseId: bc.courseId,
                  orderId: order.id,
                  expiresAt,
                  isActive: true,
                },
                update: { isActive: true, expiresAt },
              });
            }
          }
        }

        // Create Invoice if not already present
        const existingInvoice = await tx.invoice.findUnique({
          where: { orderId: order.id },
        });

        if (!existingInvoice) {
          const taxRate = parseFloat(process.env.TAX_RATE || '0');
          await tx.invoice.create({
            data: {
              orderId: order.id,
              invoiceNumber: order.invoiceNumber,
              studentName: order.user.name,
              studentEmail: order.user.email,
              items: order.items.map((item) => ({
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
        }
      });

      // Send email and notifications
      sendPaymentConfirmationEmail(
        order.user.email,
        order.user.name,
        order.invoiceNumber,
        formatCurrency(order.total)
      ).catch(console.error);

      createNotification({
        userId: order.userId,
        type: 'PAYMENT',
        title: 'Payment Confirmed (Webhook)',
        message: `Your payment of ${formatCurrency(order.total)} was verified. Invoice: ${order.invoiceNumber}`,
        link: `/student/orders/${order.id}`,
      }).catch(console.error);

      console.log(`[Razorpay Webhook] Successfully completed order: ${order.id} for user: ${order.user.email}`);
    } else if (eventType === 'payment.failed') {
      const razorpayOrderId = paymentEntity?.order_id;
      const failureReason = paymentEntity?.error_description || paymentEntity?.error_reason || 'Payment failed';

      if (razorpayOrderId) {
        await prisma.payment.updateMany({
          where: { gatewayOrderId: razorpayOrderId },
          data: {
            status: 'FAILED',
            failureReason,
          },
        });
        console.log(`[Razorpay Webhook] Marked payment as failed for gatewayOrderId: ${razorpayOrderId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Razorpay Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error in webhook handler' },
      { status: 500 }
    );
  }
}
