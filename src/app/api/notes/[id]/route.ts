import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { deleteFromGoogleDrive } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

// GET /api/notes/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.studyNote.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!note) {
      return errorResponse('Note not found', 404);
    }

    return successResponse(note);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/notes/[id] - update note
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, ['ADMIN', 'TEACHER']);

    const body = await req.json();
    const { title, description, subject, grade, chapter, isFree, isPublished, courseId } = body;

    const updated = await prisma.studyNote.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(subject !== undefined && { subject }),
        ...(grade !== undefined && { grade }),
        ...(chapter !== undefined && { chapter }),
        ...(isFree !== undefined && { isFree }),
        ...(isPublished !== undefined && { isPublished }),
        ...(courseId !== undefined && { courseId: courseId || null }),
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return successResponse(updated, 'Note updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/notes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(req, ['ADMIN', 'TEACHER']);

    const note = await prisma.studyNote.findUnique({
      where: { id: params.id },
    });

    if (!note) {
      return errorResponse('Note not found', 404);
    }

    // Optionally attempt to delete from Google Drive if stored there
    if (note.driveFileId) {
      try {
        await deleteFromGoogleDrive(note.driveFileId);
      } catch (err) {
        console.warn('Could not delete file from Google Drive:', err);
      }
    }

    await prisma.studyNote.delete({
      where: { id: params.id },
    });

    return successResponse(null, 'Note deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
