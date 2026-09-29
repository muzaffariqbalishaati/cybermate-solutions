import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { hashPassword, generateReferralCode } from '@/lib/utils';
import { successResponse, errorResponse, handleApiError, getPaginationParams, paginatedResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

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

// POST /api/admin/students — create new student or enroll
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const body = await req.json();

    // If creating a brand new student
    if (body.action === 'create_student' || (body.name && body.email && !body.courseId)) {
      const { name, email, phone, grade, password } = body;
      if (!name || !email) return errorResponse('Name and email are required', 400);

      const cleanEmail = email.toLowerCase().trim();
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) return errorResponse('A user with this email already exists', 400);

      const hashedPassword = await hashPassword(password || 'Student@123');
      const referralCode = generateReferralCode(name);

      const student = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: phone || null,
          password: hashedPassword,
          role: 'STUDENT',
          student: {
            create: {
              grade: grade || 'Class 10',
              referralCode,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      });

      return successResponse(student, 'Student account created successfully', 201);
    }

    // Manual course enrollment
    const { userId, courseId, expiresAt } = body;
    if (!userId || !courseId) return errorResponse('userId and courseId required for enrollment', 400);

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

// PATCH /api/admin/students — toggle active status or update student
export async function PATCH(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { id, isActive, name, phone, grade } = await req.json();

    if (!id) return errorResponse('Student ID is required', 400);

    const updated = await prisma.user.update({
      where: { id, role: 'STUDENT' },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(grade && {
          student: {
            upsert: {
              create: { grade },
              update: { grade },
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    return successResponse(updated, 'Student updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/students
export async function DELETE(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    let id = new URL(req.url).searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // body was empty
      }
    }

    if (!id) return errorResponse('Student ID is required', 400);

    await prisma.user.delete({ where: { id, role: 'STUDENT' } });
    return successResponse(null, 'Student deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
