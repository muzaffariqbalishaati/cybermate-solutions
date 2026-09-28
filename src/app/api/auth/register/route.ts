import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateReferralCode } from '@/lib/utils';
import { signToken, createAuthCookie, logSession } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { sendWelcomeEmail } from '@/lib/email';
import { handleApiError, errorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { name, email, password, phone, referralCode } = parsed.data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('An account with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate referral code for new user
    const newReferralCode = generateReferralCode(name);

    // Find referrer if referral code provided
    let referrerId: string | null = null;
    if (referralCode) {
      const referrerProfile = await prisma.studentProfile.findUnique({
        where: { referralCode },
      });
      if (referrerProfile) {
        referrerId = referrerProfile.userId;
      }
    }

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role: 'STUDENT',
          student: {
            create: {
              referralCode: newReferralCode,
            },
          },
        },
      });

      // Create referral record if applicable
      if (referrerId) {
        await tx.referral.create({
          data: {
            referrerId,
            referredId: newUser.id,
            referralCode: referralCode!,
          },
        });
      }

      return newUser;
    });

    // Create JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Log session
    await logSession(user.id, token, req);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    const response = NextResponse.json({
      success: true,
      data: { role: user.role, name: user.name },
      message: 'Account created successfully',
    });

    response.headers.set('Set-Cookie', createAuthCookie(token));
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
