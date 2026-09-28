import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError, getPaginationParams, paginatedResponse } from '@/lib/api-response';

// GET /api/admin/students
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams);
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { role: 'STUDENT' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          lastLogin: true,
          student: {
            select: { grade: true, school: true, city: true },
          },
          _count: {
            select: { enrollments: true, orders: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(students, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/admin/students — manual enrollment
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { userId, courseId, expiresAt } = await req.json();

    if (!userId || !courseId) return errorResponse('userId and courseId required', 400);

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
      update: { isActive: true, expiresAt: expiresAt ? new Date(expiresAt) : null },
    });

    return successResponse(enrollment, 'Student enrolled successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
