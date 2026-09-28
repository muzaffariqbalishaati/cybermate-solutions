import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// GET /api/admin/homepage — get all homepage sections
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const sections = await prisma.homepageSection.findMany({
      orderBy: { order: 'asc' },
    });
    return successResponse(sections);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/admin/homepage — update a section
export async function PUT(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { sectionKey, content, isVisible, order } = await req.json();

    if (!sectionKey) return errorResponse('sectionKey is required', 400);

    const section = await prisma.homepageSection.upsert({
      where: { sectionKey },
      create: {
        sectionKey,
        content: content || {},
        isVisible: isVisible ?? true,
        order: order ?? 0,
      },
      update: {
        ...(content !== undefined && { content }),
        ...(isVisible !== undefined && { isVisible }),
        ...(order !== undefined && { order }),
      },
    });

    return successResponse(section, 'Section updated');
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/admin/homepage/reorder — reorder sections
export async function PATCH(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { sections } = await req.json(); // Array of { sectionKey, order }

    await Promise.all(
      sections.map(({ sectionKey, order }: { sectionKey: string; order: number }) =>
        prisma.homepageSection.update({
          where: { sectionKey },
          data: { order },
        })
      )
    );

    return successResponse(null, 'Sections reordered');
  } catch (error) {
    return handleApiError(error);
  }
}
