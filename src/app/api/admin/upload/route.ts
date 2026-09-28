import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, ['ADMIN']);

    const contentType = req.headers.get('content-type') || '';

    let dataUrl = '';
    let fileName = 'upload.png';
    let mimeType = 'image/png';
    let fileSize = 0;
    let targetKey: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      targetKey = (formData.get('targetKey') as string) || null;

      if (!file) {
        return errorResponse('No file uploaded', 400);
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return errorResponse(
          `Invalid file format (${file.type}). Allowed formats: PNG, JPG, WebP, SVG, GIF, ICO.`,
          400
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return errorResponse('File size exceeds 5MB limit. Please upload a smaller image.', 400);
      }

      fileName = file.name;
      mimeType = file.type;
      fileSize = file.size;

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      dataUrl = `data:${file.type};base64,${base64}`;
    } else {
      // JSON body with direct base64 dataUrl or external url
      const body = await req.json();
      dataUrl = body.dataUrl || body.url;
      fileName = body.filename || 'logo.png';
      mimeType = body.mimeType || 'image/png';
      targetKey = body.targetKey || null;

      if (!dataUrl) {
        return errorResponse('Missing dataUrl or url in request body', 400);
      }
      fileSize = dataUrl.length;
    }

    // Save to Media library table
    const media = await prisma.media.create({
      data: {
        filename: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        originalName: fileName,
        mimeType,
        size: fileSize,
        url: dataUrl,
        uploadedBy: user.userId,
        folder: 'branding',
      },
    });

    // If targetKey is provided (e.g. logo_url or admin_logo_url), update site_settings directly
    if (targetKey) {
      const labelMap: Record<string, string> = {
        logo_url: 'Website Logo',
        admin_logo_url: 'Admin Panel Logo',
        favicon_url: 'Favicon Icon',
      };

      await prisma.siteSetting.upsert({
        where: { key: targetKey },
        create: {
          key: targetKey,
          value: dataUrl,
          group: 'general',
          type: 'image',
          label: labelMap[targetKey] || targetKey,
        },
        update: {
          value: dataUrl,
        },
      });
    }

    return successResponse(
      {
        url: dataUrl,
        mediaId: media.id,
        filename: fileName,
        targetKey,
      },
      'Image uploaded successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
