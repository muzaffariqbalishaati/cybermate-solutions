import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.studyNote.findUnique({
      where: { id: params.id },
      select: { id: true, fileUrl: true, driveFileId: true, downloads: true },
    });

    if (!note) {
      return errorResponse('Note not found', 404);
    }

    await prisma.studyNote.update({
      where: { id: params.id },
      data: { downloads: { increment: 1 } },
    });

    let directDownload = note.fileUrl;
    if (note.driveFileId) {
      directDownload = `https://drive.google.com/uc?export=download&id=${note.driveFileId}`;
    }

    return successResponse({
      downloadUrl: directDownload,
      downloads: note.downloads + 1,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
