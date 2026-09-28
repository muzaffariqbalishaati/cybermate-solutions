import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// Public GET /api/settings - returns public site branding and settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            'site_name',
            'logo_url',
            'admin_logo_url',
            'favicon_url',
            'contact_email',
            'phone',
            'whatsapp',
            'address',
            'copyright_text',
            'header_login_btn',
            'header_signup_btn',
            'footer_about',
            'social_facebook',
            'social_instagram',
            'social_youtube',
            'social_twitter',
            'social_linkedin',
          ],
        },
      },
    });

    const settingsMap: Record<string, string | null> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    // Defaults if empty
    if (!settingsMap['site_name']) settingsMap['site_name'] = 'CyberMate Solutions';

    return successResponse(settingsMap);
  } catch (error) {
    return handleApiError(error);
  }
}
