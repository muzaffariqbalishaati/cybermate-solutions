import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, getSessionFromRequest } from '@/lib/auth';
import { courseSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// GET /api/courses/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getSessionFromRequest(req);
    const isAdmin = session?.role === 'ADMIN';
    const isTeacher = session?.role === 'TEACHER';

    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        teachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                avatar: true,
                teacher: { select: { specialization: true, bio: true, experience: true } },
              },
            },
          },
        },
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            topics: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    videoDuration: true,
                    isFree: true,
                    isPublished: true,
                    order: true,
                    // Only include content for free lessons or if enrolled/admin
                    videoUrl: true, // Will be filtered below
                    content: true,
                    pdfUrl: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            chapters: true,
          },
        },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!course) {
      return errorResponse('Course not found', 404);
    }

    // Check if published for non-admins
    if (course.status !== 'PUBLISHED' && !isAdmin) {
      return errorResponse('Course not found', 404);
    }

    // Check enrollment for content access
    let isEnrolled = false;
    if (session?.userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.userId, courseId: course.id } },
      });
      isEnrolled = !!enrollment?.isActive;
    }

    // Filter protected content for non-enrolled users
    const filteredCourse = {
      ...course,
      chapters: course.chapters.map(chapter => ({
        ...chapter,
        topics: chapter.topics.map(topic => ({
          ...topic,
          lessons: topic.lessons.map(lesson => ({
            ...lesson,
            // Only expose URLs for free lessons or enrolled users
            videoUrl: (lesson.isFree || isEnrolled || isAdmin) ? lesson.videoUrl : null,
            content: (lesson.isFree || isEnrolled || isAdmin) ? lesson.content : null,
            pdfUrl: (lesson.isFree || isEnrolled || isAdmin) ? lesson.pdfUrl : null,
          })),
        })),
      })),
    };

    return successResponse({ ...filteredCourse, isEnrolled });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/courses/[slug]
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireRole(req, ['ADMIN']);

    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const course = await prisma.course.findUnique({ where: { slug: params.slug } });
    if (!course) return errorResponse('Course not found', 404);

    // Handle slug change
    let newSlug = parsed.data.slug || generateSlug(parsed.data.title);
    if (newSlug !== course.slug) {
      const existing = await prisma.course.findUnique({ where: { slug: newSlug } });
      if (existing) newSlug = `${newSlug}-${Date.now()}`;
    }

    const updated = await prisma.course.update({
      where: { id: course.id },
      data: { ...parsed.data, slug: newSlug },
    });

    return successResponse(updated, 'Course updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/courses/[slug]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireRole(req, ['ADMIN']);

    const course = await prisma.course.findUnique({ where: { slug: params.slug } });
    if (!course) return errorResponse('Course not found', 404);

    await prisma.course.delete({ where: { id: course.id } });
    return successResponse(null, 'Course deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
