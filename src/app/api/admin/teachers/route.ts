import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { hashPassword } from '@/lib/utils';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/admin/teachers
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        teacher: {
          select: {
            specialization: true,
            experience: true,
            bio: true,
            qualification: true,
          },
        },
        _count: {
          select: { assignedCourses: true },
        },
      },
    });

    return successResponse(teachers);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/admin/teachers — create faculty
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const { name, email, phone, specialization, experience, bio, password } = await req.json();

    if (!name || !email) return errorResponse('Name and email are required', 400);

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) return errorResponse('A user with this email already exists', 400);

    const hashedPassword = await hashPassword(password || 'Teacher@123');
    const parsedExp = experience ? parseInt(String(experience).replace(/\D/g, '')) || 5 : 5;

    const teacher = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone || null,
        password: hashedPassword,
        role: 'TEACHER',
        teacher: {
          create: {
            specialization: specialization || 'General Faculty',
            experience: parsedExp,
            bio: bio || null,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    return successResponse(teacher, 'Faculty account created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/admin/teachers — update teacher or status
export async function PATCH(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const body = await req.json();
    const { id, isActive, name, email, phone, avatar, specialization, experience, bio, qualification } = body;

    if (!id) return errorResponse('Teacher ID required', 400);

    const parsedExp = experience !== undefined ? parseInt(String(experience).replace(/\D/g, '')) || 0 : undefined;

    const updated = await prisma.user.update({
      where: { id, role: 'TEACHER' },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(name && { name: name.trim() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
        ...((specialization !== undefined || parsedExp !== undefined || bio !== undefined || qualification !== undefined) && {
          teacher: {
            upsert: {
              create: {
                specialization: specialization || 'General Faculty',
                experience: parsedExp ?? 5,
                qualification: qualification || null,
                bio: bio || null,
              },
              update: {
                ...(specialization !== undefined && { specialization }),
                ...(parsedExp !== undefined && { experience: parsedExp }),
                ...(qualification !== undefined && { qualification }),
                ...(bio !== undefined && { bio }),
              },
            },
          },
        }),
      },
    });

    return successResponse(updated, 'Faculty profile updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/teachers
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

    if (!id) return errorResponse('Teacher ID required', 400);

    await prisma.user.delete({ where: { id, role: 'TEACHER' } });
    return successResponse(null, 'Faculty profile deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
