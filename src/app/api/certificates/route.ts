import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { generateCertificateNumber } from '@/lib/utils';

// POST /api/certificates/generate — generate certificate for completed course
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['STUDENT', 'ADMIN']);
    const { courseId } = await req.json();

    const [enrollment, course] = await Promise.all([
      prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId } },
      }),
      prisma.course.findUnique({
        where: { id: courseId },
        include: { teachers: { where: { isPrimary: true }, include: { teacher: { select: { name: true } } } } },
      }),
    ]);

    if (!enrollment?.isActive) return errorResponse('Not enrolled in this course', 403);
    if ((enrollment.progress || 0) < 100) return errorResponse('Complete 100% of the course to get certificate', 400);
    if (!course) return errorResponse('Course not found', 404);

    // Check existing certificate
    const existing = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId } },
    });
    if (existing) return successResponse(existing, 'Certificate already exists');

    const certificateNo = generateCertificateNumber();
    const instructorName = course.teachers[0]?.teacher.name || 'CyberMate Solutions Team';
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateNo}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId: session.userId,
        courseId,
        certificateNo,
        studentName: session.name,
        courseName: course.title,
        instructorName,
        verifyUrl,
      },
    });

    return successResponse(certificate, 'Certificate generated', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/certificates — list user's certificates
export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, ['STUDENT', 'ADMIN']);
    const certificates = await prisma.certificate.findMany({
      where: session.role === 'ADMIN' ? {} : { userId: session.userId },
      include: { course: { select: { title: true, thumbnail: true } } },
      orderBy: { issuedAt: 'desc' },
    });
    return successResponse(certificates);
  } catch (error) {
    return handleApiError(error);
  }
}
