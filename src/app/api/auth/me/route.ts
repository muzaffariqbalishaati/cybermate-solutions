import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { hashPassword, verifyPassword } from '@/lib/utils';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return errorResponse('Not authenticated', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            grade: true,
            school: true,
            city: true,
            state: true,
            address: true,
            pincode: true,
            about: true,
            dateOfBirth: true,
            referralCode: true,
          },
        },
        teacher: {
          select: {
            id: true,
            qualification: true,
            specialization: true,
            experience: true,
            bio: true,
            linkedin: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return errorResponse('User not found or inactive', 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return errorResponse('Not authenticated', 401);
    }

    const body = await req.json();
    const {
      name,
      phone,
      avatar,
      currentPassword,
      newPassword,
      // Student specific
      grade,
      school,
      city,
      state,
      address,
      about,
      // Teacher specific
      qualification,
      specialization,
      experience,
      bio,
      linkedin,
    } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Handle password change if requested
    let updatedPasswordHash: string | undefined = undefined;
    if (newPassword) {
      if (newPassword.length < 6) {
        return errorResponse('New password must be at least 6 characters', 400);
      }
      if (currentPassword) {
        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
          return errorResponse('Current password does not match', 400);
        }
      }
      updatedPasswordHash = await hashPassword(newPassword);
    }

    // Parse teacher experience if provided
    const parsedExp = experience !== undefined ? parseInt(String(experience).replace(/\D/g, '')) || 0 : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
        ...(updatedPasswordHash && { password: updatedPasswordHash }),
        ...(user.role === 'STUDENT' && (grade !== undefined || school !== undefined || city !== undefined || state !== undefined || address !== undefined || about !== undefined) && {
          student: {
            upsert: {
              create: {
                grade: grade || 'Class 10',
                school: school || null,
                city: city || null,
                state: state || null,
                address: address || null,
                about: about || null,
              },
              update: {
                ...(grade !== undefined && { grade }),
                ...(school !== undefined && { school }),
                ...(city !== undefined && { city }),
                ...(state !== undefined && { state }),
                ...(address !== undefined && { address }),
                ...(about !== undefined && { about }),
              },
            },
          },
        }),
        ...(user.role === 'TEACHER' && (qualification !== undefined || specialization !== undefined || parsedExp !== undefined || bio !== undefined || linkedin !== undefined) && {
          teacher: {
            upsert: {
              create: {
                qualification: qualification || null,
                specialization: specialization || 'Educator',
                experience: parsedExp ?? 5,
                bio: bio || null,
                linkedin: linkedin || null,
              },
              update: {
                ...(qualification !== undefined && { qualification }),
                ...(specialization !== undefined && { specialization }),
                ...(parsedExp !== undefined && { experience: parsedExp }),
                ...(bio !== undefined && { bio }),
                ...(linkedin !== undefined && { linkedin }),
              },
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,
        student: {
          select: {
            id: true,
            grade: true,
            school: true,
            city: true,
            state: true,
            address: true,
            about: true,
            referralCode: true,
          },
        },
        teacher: {
          select: {
            id: true,
            qualification: true,
            specialization: true,
            experience: true,
            bio: true,
            linkedin: true,
          },
        },
      },
    });

    return successResponse(updatedUser, 'Profile updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
