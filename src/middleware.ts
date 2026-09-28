import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Define route protection rules
const PUBLIC_ROUTES = [
  '/',
  '/courses',
  '/about',
  '/contact',
  '/faq',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/resources',
  '/demo',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/verify',
];

const ADMIN_ROUTES = ['/admin'];
const TEACHER_ROUTES = ['/teacher'];
const STUDENT_ROUTES = ['/student'];
const PARENT_ROUTES = ['/parent'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public assets and API routes (APIs handle their own auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow API routes to handle their own authentication
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  ) || pathname.startsWith('/courses/') || pathname.startsWith('/pages/');

  if (isPublicRoute) {
    return NextResponse.next();
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
