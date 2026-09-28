import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, clearAuthCookie, invalidateSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (token) {
      await invalidateSession(token).catch(() => {}); // Non-blocking
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.headers.set('Set-Cookie', clearAuthCookie());
    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', clearAuthCookie());
    return response;
  }
}
