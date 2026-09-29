import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { testGoogleDriveConnection, getGoogleDriveConfig } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty if testing currently saved config
    }

    const { clientEmail, privateKey, folderId, serviceAccountJson } = body;

    const result = await testGoogleDriveConnection({
      clientEmail,
      privateKey,
      folderId,
      serviceAccountJson,
    });

    if (!result.success) {
      return errorResponse(result.error || 'Failed to connect to Google Drive', 400);
    }

    return successResponse(
      {
        folderName: result.folderName,
        folderId: result.folderId,
        email: result.email,
        connected: true,
      },
      `Successfully connected to Google Drive folder "${result.folderName}"!`
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const config = await getGoogleDriveConfig();

    return successResponse({
      enabled: config.enabled,
      folderId: config.folderId,
      clientEmail: config.clientEmail,
      publicLink: config.publicLink,
      hasPrivateKey: Boolean(config.privateKey),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
