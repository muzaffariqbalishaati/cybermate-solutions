import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, getSessionFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/admin/announcements
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return successResponse(announcements);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/admin/announcements — create notice
export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, ['ADMIN']);
    const body = await req.json();
    const { title, message, targetRole, priority } = body;

    if (!title || !message) {
      return errorResponse('Title and message are required', 400);
    }

    const roleEnum = targetRole && targetRole !== 'ALL' ? targetRole : null;

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        targetRole: roleEnum,
        priority: priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
        isActive: true,
        createdById: session.userId,
      },
    });

    // Push in-app notifications to targeted users (non-blocking)
    const usersWhere: Record<string, unknown> = { isActive: true };
    if (roleEnum) {
      usersWhere.role = roleEnum;
    }

    const targetedUsers = await prisma.user.findMany({
      where: usersWhere,
      select: { id: true },
    });

    if (targetedUsers.length > 0) {
      await prisma.notification.createMany({
        data: targetedUsers.map(u => ({
          userId: u.id,
          type: 'ANNOUNCEMENT',
          title: `📢 ${title}`,
          message,
          link: '/student',
        })),
      }).catch(console.error);
    }

    return successResponse(announcement, 'Announcement published successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/admin/announcements — toggle status or edit
export async function PATCH(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const body = await req.json();
    const { id, isActive, title, message } = body;

    if (!id) return errorResponse('Announcement ID required', 400);

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(title && { title: title.trim() }),
        ...(message && { message: message.trim() }),
      },
    });

    return successResponse(updated, 'Announcement updated');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/announcements
export async function DELETE(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    let id = new URL(req.url).searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // empty body
      }
    }

    if (!id) return errorResponse('Announcement ID required', 400);

    await prisma.announcement.delete({ where: { id } });
    return successResponse(null, 'Announcement deleted');
  } catch (error) {
    return handleApiError(error);
  }
}
