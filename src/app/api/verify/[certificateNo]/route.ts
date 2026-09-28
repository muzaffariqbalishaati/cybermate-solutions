import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// GET /api/verify/[certificateNo] — public certificate verification
export async function GET(
  req: NextRequest,
  { params }: { params: { certificateNo: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateNo: params.certificateNo },
      include: {
        course: { select: { title: true, subject: true, grade: true } },
        user: { select: { name: true } },
      },
    });

    if (!certificate) {
      return errorResponse('Certificate not found or invalid', 404);
    }

    return successResponse({
      isValid: true,
      certificateNo: certificate.certificateNo,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      issuedAt: certificate.issuedAt,
      course: certificate.course,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
