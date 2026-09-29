import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// GET /api/admin/live-classes — list all live classes
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN', 'TEACHER']);

    const classes = await prisma.liveClass.findMany({
      include: {
        course: { select: { id: true, title: true } },
        _count: { select: { attendances: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    // Fetch teacher user names
    const teacherIds = Array.from(new Set(classes.map(c => c.teacherId)));
    const teachers = await prisma.user.findMany({
      where: { id: { in: teacherIds } },
      select: { id: true, name: true, email: true },
    });
    const teacherMap = new Map(teachers.map(t => [t.id, t.name]));

    const formatted = classes.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      courseId: c.courseId,
      courseTitle: c.course.title,
      teacherId: c.teacherId,
      teacherName: teacherMap.get(c.teacherId) || 'Lead Faculty',
      scheduledAt: c.scheduledAt.toISOString(),
      duration: c.duration,
      meetingUrl: c.meetingUrl,
      meetingId: c.meetingId,
      status: c.status,
      attendees: c._count.attendances,
      recordingUrl: c.recordingUrl,
    }));

    return successResponse(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/admin/live-classes — schedule a live class
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['ADMIN', 'TEACHER']);
    const body = await req.json();
    const { title, description, courseId, teacherId, scheduledAt, duration, meetingUrl, meetingId } = body;

    if (!title || !courseId || !scheduledAt) {
      return errorResponse('Title, course, and scheduled date/time are required', 400);
    }

    const assignedTeacherId = teacherId || session.userId;

    const liveClass = await prisma.liveClass.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        courseId,
        teacherId: assignedTeacherId,
        scheduledAt: new Date(scheduledAt),
        duration: duration ? parseInt(duration) : 60,
        meetingUrl: meetingUrl?.trim() || null,
        meetingId: meetingId?.trim() || null,
        status: 'SCHEDULED',
      },
      include: {
        course: { select: { title: true } },
      },
    });

    return successResponse(liveClass, 'Live class scheduled successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/admin/live-classes — update class status or details
export async function PATCH(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN', 'TEACHER']);
    const body = await req.json();
    const { id, status, meetingUrl, meetingId } = body;

    if (!id) return errorResponse('Class ID is required', 400);

    const updated = await prisma.liveClass.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(meetingUrl !== undefined && { meetingUrl }),
        ...(meetingId !== undefined && { meetingId }),
      },
    });

    return successResponse(updated, 'Live class updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/live-classes
export async function DELETE(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return errorResponse('Class ID is required', 400);

    await prisma.liveClass.delete({ where: { id } });
    return successResponse(null, 'Live class deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
