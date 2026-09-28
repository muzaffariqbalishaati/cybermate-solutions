import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/utils';
import { signToken, createAuthCookie, logSession, updateLastLogin } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { handleApiError, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Use same error message to prevent email enumeration
      return errorResponse('Invalid email or password', 401);
    }

    if (!user.isActive) {
      return errorResponse('Your account has been deactivated. Please contact support.', 403);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Create JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Log session and update last login (non-blocking for performance)
    await Promise.all([
      logSession(user.id, token, req),
      updateLastLogin(user.id),
    ]);

    const response = NextResponse.json({
      success: true,
      data: {
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
      message: 'Login successful',
    });

    response.headers.set('Set-Cookie', createAuthCookie(token));
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
