import * as jose from 'jose';
import prisma from '@/lib/prisma';

export interface GoogleDriveConfig {
  enabled: boolean;
  folderId?: string;
  clientEmail?: string;
  privateKey?: string;
  publicLink?: string;
  serviceAccountJson?: string;
}

export interface DriveUploadResult {
  fileId: string;
  name: string;
  webViewLink: string;
  downloadUrl: string;
  thumbnailUrl: string;
  size?: number;
  mimeType: string;
}

// In-memory token cache to prevent redundant OAuth token requests
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Clean & format the private key string (handling escaped newlines, quotes, etc.)
 */
export function formatPrivateKey(rawKey: string): string {
  if (!rawKey) return '';
  let key = rawKey.trim();
  // Strip outer quotes if any
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Replace escaped \n with actual newlines
  key = key.replace(/\\n/g, '\n');
  return key;
}

/**
 * Parse raw service account JSON if supplied as a single string
 */
export function parseServiceAccountJson(jsonString: string): {
  client_email?: string;
  private_key?: string;
  project_id?: string;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
      project_id: parsed.project_id,
    };
  } catch {
    return null;
  }
}

/**
 * Retrieve Google Drive configuration from Database SiteSettings,
 * falling back to process.env variables if not set in DB.
 */
export async function getGoogleDriveConfig(): Promise<GoogleDriveConfig> {
  try {
    const driveKeys = [
      'gdrive_enabled',
      'gdrive_folder_id',
      'gdrive_client_email',
      'gdrive_private_key',
      'gdrive_service_account_json',
      'gdrive_public_link',
    ];

    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: driveKeys } },
    });

    const settingsMap = new Map<string, string>();
    settings.forEach((s) => {
      if (s.value) settingsMap.set(s.key, s.value);
    });

    const jsonStr = settingsMap.get('gdrive_service_account_json') || '';
    const parsedJson = jsonStr ? parseServiceAccountJson(jsonStr) : null;

    const enabled =
      settingsMap.get('gdrive_enabled') === 'true' ||
      process.env.GOOGLE_DRIVE_ENABLED === 'true';

    const clientEmail =
      parsedJson?.client_email ||
      settingsMap.get('gdrive_client_email') ||
      process.env.GOOGLE_DRIVE_CLIENT_EMAIL ||
      '';

    const rawPrivateKey =
      parsedJson?.private_key ||
      settingsMap.get('gdrive_private_key') ||
      process.env.GOOGLE_DRIVE_PRIVATE_KEY ||
      '';

    const folderId =
      settingsMap.get('gdrive_folder_id') ||
      process.env.GOOGLE_DRIVE_FOLDER_ID ||
      '';

    const publicLink =
      settingsMap.get('gdrive_public_link') ||
      (folderId ? `https://drive.google.com/drive/folders/${folderId}` : '');

    return {
      enabled,
      folderId,
      clientEmail,
      privateKey: formatPrivateKey(rawPrivateKey),
      publicLink,
      serviceAccountJson: jsonStr,
    };
  } catch (error) {
    console.error('Error fetching Google Drive config:', error);
    return {
      enabled: false,
      folderId: '',
      clientEmail: '',
      privateKey: '',
    };
  }
}

/**
 * Generate a Google Drive Bearer Access Token via RS256 JWT assertion
 */
export async function getGoogleDriveAccessToken(customCreds?: {
  clientEmail: string;
  privateKey: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Use cached token if valid (5 min buffer)
  if (!customCreds && cachedToken && cachedToken.expiresAt > now + 300) {
    return cachedToken.token;
  }

  let clientEmail = customCreds?.clientEmail;
  let privateKeyPem = customCreds?.privateKey ? formatPrivateKey(customCreds.privateKey) : undefined;

  if (!clientEmail || !privateKeyPem) {
    const config = await getGoogleDriveConfig();
    clientEmail = config.clientEmail;
    privateKeyPem = config.privateKey;
  }

  if (!clientEmail || !privateKeyPem) {
    throw new Error('Google Drive service account credentials (client_email or private_key) are missing.');
  }

  try {
    const importedKey = await jose.importPKCS8(privateKeyPem, 'RS256');

    const jwt = await new jose.SignJWT({
      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file',
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(clientEmail)
      .setSubject(clientEmail)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(importedKey);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(
        tokenData.error_description ||
          tokenData.error ||
          'Failed to authenticate service account with Google OAuth2'
      );
    }

    const token = tokenData.access_token as string;
    const expiresIn = Number(tokenData.expires_in) || 3600;

    if (!customCreds) {
      cachedToken = {
        token,
        expiresAt: now + expiresIn,
      };
    }

    return token;
  } catch (err: any) {
    throw new Error(`Google Drive Authentication Error: ${err.message}`);
  }
}

/**
 * Verify Google Drive connection and folder access
 */
export async function testGoogleDriveConnection(params?: {
  clientEmail?: string;
  privateKey?: string;
  folderId?: string;
  serviceAccountJson?: string;
}): Promise<{
  success: boolean;
  folderName?: string;
  folderId?: string;
  email?: string;
  error?: string;
}> {
  try {
    let clientEmail = params?.clientEmail;
    let privateKey = params?.privateKey;
    let folderId = params?.folderId;

    if (params?.serviceAccountJson) {
      const parsed = parseServiceAccountJson(params.serviceAccountJson);
      if (parsed) {
        if (!clientEmail) clientEmail = parsed.client_email;
        if (!privateKey) privateKey = parsed.private_key;
      }
    }

    const config = await getGoogleDriveConfig();
    clientEmail = clientEmail || config.clientEmail;
    privateKey = privateKey || config.privateKey;
    folderId = (folderId || config.folderId)?.trim();

    if (!clientEmail) {
      return { success: false, error: 'Google Service Account Email is required.' };
    }
    if (!privateKey) {
      return { success: false, error: 'Google Service Account Private Key is required.' };
    }

    const token = await getGoogleDriveAccessToken({ clientEmail, privateKey });

    // If folderId is provided, check its existence and permissions
    if (folderId) {
      const folderRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
          folderId
        )}?fields=id,name,mimeType,capabilities`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const folderData = await folderRes.json();

      if (!folderRes.ok) {
        if (folderRes.status === 404) {
          return {
            success: false,
            error: `Folder "${folderId}" was not found. Please verify the Folder ID and make sure you shared this folder with "${clientEmail}" as Editor.`,
          };
        }
        return {
          success: false,
          error: folderData.error?.message || 'Error accessing specified Google Drive folder.',
        };
      }

      if (folderData.capabilities && !folderData.capabilities.canAddChildren) {
        return {
          success: false,
          error: `Service account "${clientEmail}" does not have edit permission for folder "${folderData.name}". Please grant "Editor" role.`,
        };
      }

      return {
        success: true,
        folderName: folderData.name,
        folderId: folderData.id,
        email: clientEmail,
      };
    }

    // If no folderId specified, check root drive accessibility
    const rootRes = await fetch(
      'https://www.googleapis.com/drive/v3/about?fields=user,storageQuota',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!rootRes.ok) {
      const rootData = await rootRes.json();
      return { success: false, error: rootData.error?.message || 'Failed to verify Drive access.' };
    }

    return {
      success: true,
      folderName: 'Google Drive Root (No specific folder linked)',
      email: clientEmail,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unknown connection error',
    };
  }
}

/**
 * Upload a binary Buffer or Base64 data directly to Google Drive via multipart REST API
 */
export async function uploadToGoogleDrive(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  folderId?: string;
}): Promise<DriveUploadResult> {
  const config = await getGoogleDriveConfig();
  const folderId = params.folderId || config.folderId;

  const token = await getGoogleDriveAccessToken();

  const boundary = '-------CyberMateUpload' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata: Record<string, any> = {
    name: params.fileName,
    mimeType: params.mimeType || 'application/octet-stream',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  // Construct multipart body
  const multipartBody = Buffer.concat([
    Buffer.from(
      delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${params.mimeType || 'application/octet-stream'}\r\n` +
        'Content-Transfer-Encoding: base64\r\n\r\n'
    ),
    Buffer.from(params.buffer.toString('base64')),
    Buffer.from(closeDelimiter),
  ]);

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size,mimeType',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  const uploadData = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(
      uploadData.error?.message || 'Failed to upload file to Google Drive.'
    );
  }

  const fileId = uploadData.id as string;

  // Make the file publicly accessible via link (viewer role)
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch (permErr) {
    console.warn('Could not set public permission on Google Drive file:', permErr);
  }

  const webViewLink =
    uploadData.webViewLink || `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;

  // Direct download link
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  // Direct thumbnail / preview link
  const thumbnailUrl = `https://lh3.googleusercontent.com/d/${fileId}=s1200`;

  return {
    fileId,
    name: uploadData.name || params.fileName,
    webViewLink,
    downloadUrl,
    thumbnailUrl,
    size: params.buffer.length,
    mimeType: params.mimeType,
  };
}

/**
 * Delete a file from Google Drive by its file ID
 */
export async function deleteFromGoogleDrive(fileId: string): Promise<boolean> {
  try {
    const token = await getGoogleDriveAccessToken();
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok || res.status === 404;
  } catch (err) {
    console.warn('Error deleting file from Google Drive:', err);
    return false;
  }
}
