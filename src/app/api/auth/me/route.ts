import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
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
    },
  });

  if (!user || !user.isActive) {
    return errorResponse('User not found', 404);
  }

  return successResponse(user);
}
