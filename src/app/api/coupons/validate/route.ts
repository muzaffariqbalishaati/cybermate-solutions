import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { couponSchema } from '@/lib/validations';

// POST /api/coupons/validate — validate a coupon (public)
export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal, courseIds } = await req.json();

    if (!code) return errorResponse('Coupon code is required', 400);

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), isActive: true },
      include: { courses: { select: { courseId: true } } },
    });

    if (!coupon) return errorResponse('Invalid coupon code', 400);

    const now = new Date();
    if (coupon.startDate && coupon.startDate > now) return errorResponse('Coupon is not yet active', 400);
    if (coupon.expiryDate && coupon.expiryDate < now) return errorResponse('Coupon has expired', 400);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return errorResponse('Coupon usage limit reached', 400);
    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
      return errorResponse(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400);
    }

    // Course-specific coupon check
    if (coupon.courses.length > 0 && courseIds) {
      const allowedCourseIds = coupon.courses.map(c => c.courseId);
      const hasMatch = courseIds.some((id: string) => allowedCourseIds.includes(id));
      if (!hasMatch) return errorResponse('Coupon is not valid for selected courses', 400);
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.min(orderTotal, (orderTotal * coupon.value) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = Math.min(orderTotal, coupon.value);
    }

    return successResponse({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.round(discount * 100) / 100,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
