import crypto from 'crypto';

/**
 * Validates Razorpay payment signature after client-side checkout
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  if (!secret) return false;
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch {
    return false;
  }
}

/**
 * Validates Razorpay Webhook signature
 */
export function verifyWebhookSignature({
  body,
  signature,
  secret,
}: {
  body: string;
  signature: string;
  secret: string;
}): boolean {
  if (!secret || !signature) return false;
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch {
    return false;
  }
}

/**
 * Safely instantiate Razorpay SDK if available
 */
export async function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  try {
    const Razorpay = (await import('razorpay')).default;
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error) {
    console.warn('Razorpay SDK not installed or failed to initialize:', error);
    return null;
  }
}
