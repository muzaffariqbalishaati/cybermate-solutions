import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import prisma from './prisma';
import { Role } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  iat?: number;
  exp?: number;
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionFromRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(req: NextRequest): Promise<JWTPayload> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

export async function requireRole(req: NextRequest, roles: Role[]): Promise<JWTPayload> {
  const session = await requireAuth(req);
  if (!roles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export function createAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return `auth-token=${token}; Path=/; Expires=${expires.toUTCString()}; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;
}

export function clearAuthCookie(): string {
  return `auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`;
}

export async function logSession(userId: string, token: string, req?: NextRequest): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress: req?.ip || req?.headers.get('x-forwarded-for') || undefined,
      userAgent: req?.headers.get('user-agent') || undefined,
    },
  });
}

export async function invalidateSession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}

export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
}
