import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const settings = await prisma.siteSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
    return successResponse(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/admin/settings — update multiple settings
export async function PUT(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { settings } = await req.json(); // Array of { key, value }

    if (!Array.isArray(settings)) return errorResponse('settings must be an array', 400);

    await Promise.all(
      settings.map(({ key, value }: { key: string; value: string }) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    return successResponse(null, 'Settings updated');
  } catch (error) {
    return handleApiError(error);
  }
}
