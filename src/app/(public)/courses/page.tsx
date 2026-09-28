import { PublicLayout } from '@/components/layouts/public-layout';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Search, Filter } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { fallbackCourses, fallbackCategories } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse all our premium online courses for Classes 6-12, JEE and NEET preparation.',
};

interface SearchParams {
  category?: string;
  grade?: string;
  subject?: string;
  search?: string;
  page?: string;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  let categoryId: string | undefined;
  if (searchParams.category) {
    const cat = await prisma.category.findUnique({ where: { slug: searchParams.category } }).catch(() => null);
    categoryId = cat?.id;
  }

  const where: Record<string, unknown> = { status: 'PUBLISHED' };
  if (categoryId) where.categoryId = categoryId;
  if (searchParams.grade) where.grade = searchParams.grade;
  if (searchParams.subject) where.subject = { contains: searchParams.subject, mode: 'insensitive' };
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  const [dbCourses, dbTotal, dbCategories] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { popular: 'desc' }, { createdAt: 'desc' }],
      include: {
        category: { select: { name: true, slug: true } },
        teachers: { where: { isPrimary: true }, include: { teacher: { select: { name: true, avatar: true } } } },
        _count: { select: { enrollments: true } },
      },
    }).catch(() => []),
    prisma.course.count({ where }).catch(() => 0),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }).catch(() => []),
  ]);

  const courses = dbCourses.length > 0 ? dbCourses : (fallbackCourses as any);
  const categories = dbCategories.length > 0 ? dbCategories : fallbackCategories;
  const total = dbTotal > 0 ? dbTotal : courses.length;

  const totalPages = Math.ceil(total / limit);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-muted/20 py-12">
        <div className="section-container">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-heading font-bold mb-3">All Courses</h1>
            <p className="text-muted-foreground">{total} courses available</p>
          </div>

          {/* Mobile Filter Pills (horizontally scrollable on mobile) */}
          <div className="lg:hidden mb-6 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <Link
                href="/courses"
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full border font-medium transition-colors ${!searchParams.category ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border'}`}
              >
                All Categories
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/courses?category=${cat.slug}`}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full border font-medium transition-colors ${searchParams.category === cat.slug ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border'}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-muted-foreground self-center mr-1 text-[11px] font-medium">Grades:</span>
              {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <Link
                  key={grade}
                  href={`/courses?grade=${grade}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                  className={`px-2.5 py-1 rounded-full border text-xs transition-colors shrink-0 ${searchParams.grade === grade ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-foreground'}`}
                >
                  Class {grade}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-8 flex-col lg:flex-row">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="card p-5 space-y-6 sticky top-20">
                <h3 className="font-heading font-semibold">Filters</h3>

                <div>
                  <h4 className="text-sm font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    <Link
                      href="/courses"
                      className={`block text-sm py-1.5 px-2 rounded-lg transition-colors ${!searchParams.category ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                      All Categories
                    </Link>
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/courses?category=${cat.slug}`}
                        className={`block text-sm py-1.5 px-2 rounded-lg transition-colors ${searchParams.category === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Grade</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                      <Link
                        key={grade}
                        href={`/courses?grade=${grade}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${searchParams.grade === grade ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'}`}
                      >
                        Class {grade}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Courses Grid */}
            <div className="flex-1">
              {courses.length === 0 ? (
                <div className="card p-16 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-heading font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                  <Button asChild>
                    <Link href="/courses">Clear Filters</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                    {courses.map((course: any) => {
                      const teacher = course.teachers[0]?.teacher;
                      const discount = course.salePrice !== null
                        ? Math.round(((course.price - course.salePrice) / course.price) * 100)
                        : null;

                      return (
                        <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                          <div className="card-hover overflow-hidden h-full flex flex-col">
                            <div className="relative aspect-video bg-muted overflow-hidden">
                              {course.thumbnail ? (
                                <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
                                  <BookOpen className="h-14 w-14 text-brand-300" />
                                </div>
                              )}
                              {discount && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">{discount}% OFF</div>
                              )}
                              {course.grade && (
                                <div className="absolute top-2 left-2 bg-black/40 text-white text-xs rounded-full px-2.5 py-0.5 backdrop-blur-sm">Class {course.grade}</div>
                              )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              {course.category && <span className="text-xs text-primary font-medium mb-1">{course.category.name}</span>}
                              <h3 className="font-heading font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                              {teacher && <p className="text-xs text-muted-foreground mb-3">by {teacher.name}</p>}
                              <div className="mt-auto flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-bold text-primary">
                                    {course.salePrice !== null ? (course.salePrice === 0 ? 'Free' : formatCurrency(course.salePrice)) : (course.price === 0 ? 'Free' : formatCurrency(course.price))}
                                  </span>
                                  {course.salePrice !== null && course.price > 0 && (
                                    <span className="text-xs text-muted-foreground line-through ml-2">{formatCurrency(course.price)}</span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{course._count.enrollments} enrolled</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {page > 1 && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/courses?page=${page - 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}>← Previous</Link>
                        </Button>
                      )}
                      <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                      {page < totalPages && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/courses?page=${page + 1}${searchParams.category ? `&category=${searchParams.category}` : ''}`}>Next →</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
