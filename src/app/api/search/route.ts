import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/search — global search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return successResponse({ courses: [], total: 0 });
    }

    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { subject: { contains: q, mode: 'insensitive' } },
          { shortDesc: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        grade: true,
        subject: true,
        price: true,
        salePrice: true,
        category: { select: { name: true } },
      },
      take: 10,
    });

    return successResponse({
      courses,
      total: courses.length,
      query: q,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
