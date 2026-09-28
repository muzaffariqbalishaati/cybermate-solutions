import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

// POST /api/admin/payments/test — Test Razorpay credentials
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const body = await req.json().catch(() => ({}));
    
    const keyId = body.keyId || process.env.RAZORPAY_KEY_ID;
    const keySecret = body.keySecret || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return errorResponse('Razorpay Key ID and Secret are required', 400);
    }

    // Attempt to initialize and test by listing payments/orders with limit=1
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const orders = await instance.orders.all({ count: 1 });
      return successResponse({
        connected: true,
        mode: keyId.startsWith('rzp_live') ? 'LIVE' : 'TEST',
        ordersCount: orders.items?.length || 0,
        webhookConfigured: !!process.env.RAZORPAY_WEBHOOK_SECRET,
      }, 'Successfully connected to Razorpay API');
    } catch (rzpErr: any) {
      console.error('Razorpay test connection error:', rzpErr);
      return errorResponse(
        `Razorpay Authentication Failed: ${rzpErr?.error?.description || rzpErr?.message || 'Invalid key or secret'}`,
        400
      );
    }
  } catch (error) {
    return handleApiError(error);
  }
}
