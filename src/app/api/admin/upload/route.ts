import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { getGoogleDriveConfig, uploadToGoogleDrive } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

const BRANDING_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

const ALLOWED_MIME_TYPES = [
  ...BRANDING_MIME_TYPES,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'text/csv',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB for documents/drive files

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, ['ADMIN', 'TEACHER']);

    const contentType = req.headers.get('content-type') || '';

    let finalUrl = '';
    let downloadUrl = '';
    let fileName = 'upload';
    let mimeType = 'application/octet-stream';
    let fileSize = 0;
    let targetKey: string | null = null;
    let fileBuffer: Buffer | null = null;
    let driveFileId: string | null = null;
    let isGoogleDrive = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      targetKey = (formData.get('targetKey') as string) || null;

      if (!file) {
        return errorResponse('No file uploaded', 400);
      }

      // If it's a branding target, enforce image formats
      const isBranding = targetKey && ['logo_url', 'admin_logo_url', 'favicon_url'].includes(targetKey);
      if (isBranding && !BRANDING_MIME_TYPES.includes(file.type)) {
        return errorResponse(
          `Invalid image format (${file.type}). Allowed formats: PNG, JPG, WebP, SVG, GIF, ICO.`,
          400
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
        return errorResponse(
          `File type ${file.type} is not supported. Please upload an image, PDF, or Office document.`,
          400
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return errorResponse('File size exceeds the 50MB limit.', 400);
      }

      fileName = file.name;
      mimeType = file.type || 'application/octet-stream';
      fileSize = file.size;

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
    } else {
      // JSON body with direct base64 dataUrl or external link
      const body = await req.json();
      const dataUrl = body.dataUrl || body.url;
      fileName = body.filename || 'file';
      mimeType = body.mimeType || 'image/png';
      targetKey = body.targetKey || null;

      if (!dataUrl) {
        return errorResponse('Missing dataUrl or url in request body', 400);
      }

      if (dataUrl.startsWith('data:')) {
        const base64Data = dataUrl.split(',')[1];
        fileBuffer = Buffer.from(base64Data, 'base64');
        fileSize = fileBuffer.length;
      } else {
        // Direct URL already provided
        finalUrl = dataUrl;
        fileSize = dataUrl.length;
      }
    }

    // Check if Google Drive storage is configured and enabled
    const driveConfig = await getGoogleDriveConfig();

    if (fileBuffer && driveConfig.enabled && driveConfig.clientEmail && driveConfig.privateKey) {
      try {
        const driveResult = await uploadToGoogleDrive({
          buffer: fileBuffer,
          fileName,
          mimeType,
          folderId: driveConfig.folderId,
        });

        // Use direct preview / view URL for display, or download URL
        finalUrl = driveResult.webViewLink;
        downloadUrl = driveResult.downloadUrl;
        driveFileId = driveResult.fileId;
        isGoogleDrive = true;
      } catch (driveErr: any) {
        console.error('Google Drive upload failed, falling back to local/dataUrl:', driveErr);
        // Fallback to Base64 dataUrl if Google Drive upload encounters an error
        if (fileBuffer && !finalUrl) {
          finalUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        }
      }
    } else if (fileBuffer && !finalUrl) {
      // Google drive not enabled or not configured, store as Data URL
      finalUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    }

    // Save to Media library table
    const media = await prisma.media.create({
      data: {
        filename: `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        originalName: fileName,
        mimeType,
        size: fileSize,
        url: finalUrl,
        uploadedBy: user.userId,
        folder: isGoogleDrive ? 'google-drive' : targetKey ? 'branding' : 'general',
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
          value: finalUrl,
          group: 'general',
          type: 'image',
          label: labelMap[targetKey] || targetKey,
        },
        update: {
          value: finalUrl,
        },
      });
    }

    return successResponse(
      {
        url: finalUrl,
        downloadUrl: downloadUrl || finalUrl,
        mediaId: media.id,
        filename: fileName,
        targetKey,
        isGoogleDrive,
        driveFileId,
        size: fileSize,
      },
      isGoogleDrive
        ? 'File successfully uploaded and saved to Google Drive!'
        : 'File uploaded successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
