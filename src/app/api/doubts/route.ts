import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { doubtSchema } from '@/lib/validations';

// GET /api/doubts
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');

    let where: Record<string, unknown> = {};

    if (session.role === 'STUDENT') {
      where.studentId = session.userId;
    } else if (session.role === 'TEACHER') {
      where.teacherId = session.userId;
    }

    if (status) where.status = status;
    if (courseId) where.courseId = courseId;

    const doubts = await prisma.doubt.findMany({
      where,
      include: {
        student: { select: { name: true, avatar: true } },
        teacher: { select: { name: true, avatar: true } },
        course: { select: { title: true } },
        chapter: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse(doubts);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/doubts — submit a doubt
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (!['STUDENT', 'ADMIN'].includes(session.role)) {
      return errorResponse('Only students can submit doubts', 403);
    }

    const body = await req.json();
    const parsed = doubtSchema.safeParse(body);
    if (!parsed.success) return errorResponse(parsed.error.errors[0].message, 400);

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId: parsed.data.courseId } },
    });

    if (!enrollment?.isActive && session.role !== 'ADMIN') {
      return errorResponse('You are not enrolled in this course', 403);
    }

    const doubt = await prisma.doubt.create({
      data: {
        ...parsed.data,
        studentId: session.userId,
        status: 'PENDING',
      },
    });

    return successResponse(doubt, 'Doubt submitted successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
