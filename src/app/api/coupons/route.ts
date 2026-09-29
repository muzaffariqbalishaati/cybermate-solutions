import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/coupons — list all promo coupons
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
        minOrderAmount: true,
        maxDiscount: true,
        usageLimit: true,
        usedCount: true,
        expiryDate: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(coupons);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/coupons — create coupon
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const body = await req.json();
    const { code, type, value, minOrder, maxDiscount, usageLimit, expiryDate } = body;

    if (!code || value === undefined) {
      return errorResponse('Coupon code and discount value are required', 400);
    }

    const cleanCode = code.toUpperCase().trim();
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return errorResponse(`Coupon code "${cleanCode}" already exists`, 400);
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        type: type === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
        value: parseFloat(value),
        minOrderAmount: minOrder ? parseFloat(minOrder) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: true,
      },
    });

    return successResponse(coupon, 'Coupon created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/coupons — toggle active status
export async function PATCH(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { id, isActive } = await req.json();

    if (!id) return errorResponse('Coupon ID is required', 400);

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });

    return successResponse(updated, 'Coupon status updated');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/coupons
export async function DELETE(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    let id = new URL(req.url).searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // empty body
      }
    }

    if (!id) return errorResponse('Coupon ID is required', 400);

    await prisma.coupon.delete({ where: { id } });
    return successResponse(null, 'Coupon deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
