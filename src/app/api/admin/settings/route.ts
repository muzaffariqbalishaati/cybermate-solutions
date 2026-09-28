import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = [
  { key: 'site_name', value: 'CyberMate Solutions', type: 'text', group: 'general', label: 'Website Name' },
  { key: 'logo_url', value: '', type: 'image', group: 'general', label: 'Website Main Logo' },
  { key: 'admin_logo_url', value: '', type: 'image', group: 'general', label: 'Admin Panel Logo' },
  { key: 'favicon_url', value: '/favicon.ico', type: 'image', group: 'general', label: 'Favicon Icon' },
];

// GET /api/admin/settings
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    
    // Ensure essential branding settings exist
    for (const def of DEFAULT_SETTINGS) {
      const exists = await prisma.siteSetting.findUnique({ where: { key: def.key } });
      if (!exists) {
        await prisma.siteSetting.create({ data: def });
      }
    }

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
          create: { key, value, group: 'general' },
          update: { value },
        })
      )
    );

    return successResponse(null, 'Settings updated');
  } catch (error) {
    return handleApiError(error);
  }
}
