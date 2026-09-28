import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  return NextResponse.json({ success: true, data, message } as ApiResponse<T>, { status });
}

export function errorResponse(error: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error } as ApiResponse, { status });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  } as ApiResponse<T[]>);
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return errorResponse('Authentication required', 401);
    }
    if (error.message === 'FORBIDDEN') {
      return errorResponse('Access denied', 403);
    }
    if (error.message === 'NOT_FOUND') {
      return errorResponse('Resource not found', 404);
    }
    // Don't expose internal error messages in production
    if (process.env.NODE_ENV === 'development') {
      return errorResponse(error.message, 500);
    }
  }

  return errorResponse('Internal server error', 500);
}

export function getPaginationParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
