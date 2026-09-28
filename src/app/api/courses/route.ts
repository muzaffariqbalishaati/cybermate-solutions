import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, getSessionFromRequest } from '@/lib/auth';
import { courseSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { successResponse, errorResponse, paginatedResponse, handleApiError, getPaginationParams } from '@/lib/api-response';

// GET /api/courses — public course listing
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams);

    const category = searchParams.get('category');
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const popular = searchParams.get('popular');
    const status = searchParams.get('status');

    // Check if admin/teacher for status filter
    const session = await getSessionFromRequest(req);
    const isAdmin = session?.role === 'ADMIN';
    const isTeacher = session?.role === 'TEACHER';

    const where: Record<string, unknown> = {
      // Non-admins can only see published courses
      status: isAdmin ? (status || undefined) : 'PUBLISHED',
    };

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    if (grade) where.grade = grade;
    if (subject) where.subject = subject;
    if (featured === 'true') where.featured = true;
    if (popular === 'true') where.popular = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    // For teachers, only show their courses
    if (isTeacher && !isAdmin) {
      where.teachers = {
        some: { teacherId: session!.userId },
      };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        include: {
          category: { select: { name: true, slug: true } },
          teachers: {
            where: { isPrimary: true },
            include: { teacher: { select: { name: true, avatar: true } } },
          },
          _count: { select: { enrollments: true, reviews: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return paginatedResponse(courses, total, page, limit);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/courses — create course (admin only)
export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    const body = await req.json();
    const parsed = courseSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const data = parsed.data;
    const session = await getSessionFromRequest(req);

    // Generate slug if not provided
    let slug = data.slug || generateSlug(data.title);

    // Ensure slug uniqueness
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const course = await prisma.course.create({
      data: {
        ...data,
        slug,
        salePrice: data.salePrice ?? null,
        validity: data.validity ?? null,
        createdById: session!.userId,
      },
    });

    return successResponse(course, 'Course created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
