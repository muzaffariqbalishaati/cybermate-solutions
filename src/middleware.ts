import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const ADMIN_ROUTES = ['/admin'];
const TEACHER_ROUTES = ['/teacher'];
const STUDENT_ROUTES = ['/student'];
const PARENT_ROUTES = ['/parent'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes to handle their own authentication and add security headers
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  // Get auth token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const session = await verifyToken(token);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
  }

  // Check role-based access
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (TEACHER_ROUTES.some(route => pathname.startsWith(route))) {
    if (!['ADMIN', 'TEACHER'].includes(session.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (STUDENT_ROUTES.some(route => pathname.startsWith(route))) {
    if (!['ADMIN', 'STUDENT'].includes(session.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (PARENT_ROUTES.some(route => pathname.startsWith(route))) {
    if (!['ADMIN', 'PARENT'].includes(session.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Add user info to headers for server components
  const response = NextResponse.next();
  response.headers.set('x-user-id', session.userId);
  response.headers.set('x-user-role', session.role);
  response.headers.set('x-user-email', session.email);

  return response;
}

// Only run middleware on protected portals & APIs. Public pages load instantly with 0ms edge middleware overhead!
export const config = {
  matcher: [
    '/admin/:path*',
    '/teacher/:path*',
    '/student/:path*',
    '/parent/:path*',
    '/api/:path*',
  ],
};
