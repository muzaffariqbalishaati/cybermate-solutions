import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest, requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { getGoogleDriveConfig, uploadToGoogleDrive } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

// Helper to extract Google Drive file ID from a share link
function extractDriveId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// GET /api/notes - list notes with filtering
export async function GET(req: NextRequest) {
  try {
    const authUser = await getSessionFromRequest(req);
    const isAdminOrTeacher = authUser && ['ADMIN', 'TEACHER'].includes(authUser.role);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const subject = searchParams.get('subject') || '';
    const courseId = searchParams.get('courseId') || '';
    const grade = searchParams.get('grade') || '';
    const freeOnly = searchParams.get('freeOnly') === 'true';

    const where: any = {};

    // Only staff can see unpublished notes
    if (!isAdminOrTeacher) {
      where.isPublished = true;
    }

    if (freeOnly) {
      where.isFree = true;
    }

    if (subject && subject !== 'all') {
      where.subject = { equals: subject, mode: 'insensitive' };
    }

    if (courseId && courseId !== 'all') {
      where.courseId = courseId;
    }

    if (grade && grade !== 'all') {
      where.grade = { equals: grade, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { chapter: { contains: search, mode: 'insensitive' } },
      ];
    }

    const notes = await prisma.studyNote.findMany({
      where,
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Also get list of distinct subjects for filters
    const allSubjects = await prisma.studyNote.findMany({
      where: isAdminOrTeacher ? {} : { isPublished: true },
      select: { subject: true },
      distinct: ['subject'],
    });

    const subjects = allSubjects.map((s) => s.subject).filter(Boolean);

    return successResponse({
      notes,
      total: notes.length,
      subjects,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/notes - upload/create note (Admin & Teacher)
export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, ['ADMIN', 'TEACHER']);

    const contentType = req.headers.get('content-type') || '';

    let title = '';
    let description = '';
    let subject = 'General';
    let grade = '';
    let chapter = '';
    let courseId: string | null = null;
    let isFree = true;
    let isPublished = true;
    let fileUrl = '';
    let fileName = 'Study_Note.pdf';
    let fileType = 'pdf';
    let fileSize: number | null = null;
    let driveFileId: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = (formData.get('title') as string) || '';
      description = (formData.get('description') as string) || '';
      subject = (formData.get('subject') as string) || 'General';
      grade = (formData.get('grade') as string) || '';
      chapter = (formData.get('chapter') as string) || '';
      courseId = (formData.get('courseId') as string) || null;
      isFree = formData.get('isFree') !== 'false';
      isPublished = formData.get('isPublished') !== 'false';

      const file = formData.get('file') as File | null;
      const externalLink = (formData.get('externalLink') as string) || '';

      if (file && file.size > 0) {
        fileName = file.name;
        fileSize = file.size;

        // Determine fileType
        const ext = file.name.split('.').pop()?.toLowerCase();
        fileType = ext || 'pdf';

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Google Drive if configured
        const driveConfig = await getGoogleDriveConfig();
        if (driveConfig.enabled && driveConfig.clientEmail && driveConfig.privateKey) {
          try {
            const driveRes = await uploadToGoogleDrive({
              buffer,
              fileName: file.name,
              mimeType: file.type || 'application/pdf',
              folderId: driveConfig.folderId,
            });
            fileUrl = driveRes.webViewLink;
            driveFileId = driveRes.fileId;
          } catch (driveErr) {
            console.error('Google drive upload failed for note, saving base64 fallback:', driveErr);
            fileUrl = `data:${file.type || 'application/pdf'};base64,${buffer.toString('base64')}`;
          }
        } else {
          // Google drive not configured, save as data url
          fileUrl = `data:${file.type || 'application/pdf'};base64,${buffer.toString('base64')}`;
        }
      } else if (externalLink) {
        fileUrl = externalLink;
        driveFileId = extractDriveId(externalLink);
        fileName = title ? `${title}.pdf` : 'Google_Drive_Note.pdf';
        fileType = 'pdf';
      }
    } else {
      // JSON body
      const body = await req.json();
      title = body.title;
      description = body.description || '';
      subject = body.subject || 'General';
      grade = body.grade || '';
      chapter = body.chapter || '';
      courseId = body.courseId || null;
      isFree = body.isFree !== false;
      isPublished = body.isPublished !== false;
      fileUrl = body.fileUrl || body.externalLink || '';
      fileName = body.fileName || (title ? `${title}.pdf` : 'Study_Material.pdf');
      fileType = body.fileType || 'pdf';
      fileSize = body.fileSize || null;
      driveFileId = body.driveFileId || extractDriveId(fileUrl);
    }

    if (!title) {
      return errorResponse('Title is required for the study note', 400);
    }

    if (!fileUrl) {
      return errorResponse('Please upload a file or provide a Google Drive / document link', 400);
    }

    const note = await prisma.studyNote.create({
      data: {
        title,
        description,
        subject,
        grade,
        chapter,
        courseId: courseId || undefined,
        isFree,
        isPublished,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        driveFileId,
        uploadedBy: user.userId,
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return successResponse(note, 'Study note uploaded and published successfully!', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
