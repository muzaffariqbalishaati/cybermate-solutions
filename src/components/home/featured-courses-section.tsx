import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  shortDesc: string | null;
  price: number;
  salePrice: number | null;
  subject: string | null;
  grade: string | null;
  totalLessons: number;
  totalDuration: number;
  category: { name: string } | null;
  teachers: Array<{
    teacher: { name: string; avatar: string | null };
    isPrimary: boolean;
  }>;
  _count: { enrollments: number };
}

interface FeaturedCoursesSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
  courses: Course[];
}

export function FeaturedCoursesSection({ section, courses }: FeaturedCoursesSectionProps) {
  if (section && !section.isVisible) return null;

  const content = (section?.content as Record<string, string>) || {};
  const heading = content.heading || 'Featured Courses';
  const subheading = content.subheading || 'Handpicked courses from our expert teachers';

  if (courses.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="section-container text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">{heading}</h2>
          <p className="text-muted-foreground mb-8">{subheading}</p>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <BookOpen className="h-8 w-8" />
            <p>Courses will appear here once added from the Admin panel.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
              <Star className="h-3.5 w-3.5 fill-current" />
              Featured
            </div>
            <h2 className="text-4xl font-heading font-bold mb-2">{heading}</h2>
            <p className="text-muted-foreground">{subheading}</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/courses">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/courses">View All Courses <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const primaryTeacher = course.teachers.find(t => t.isPrimary) || course.teachers[0];
  const discount = course.salePrice
    ? Math.round(((course.price - course.salePrice) / course.price) * 100)
    : null;

  return (
    <Link href={`/courses/${course.slug}`} className="group">
      <div className="card-hover overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-brand-300" />
            </div>
          )}
          {discount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
              {discount}% OFF
            </div>
          )}
          {course.grade && (
            <div className="absolute top-3 left-3 bg-black/50 text-white text-xs rounded-full px-2.5 py-1 backdrop-blur-sm">
              Class {course.grade}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          {course.category && (
            <span className="text-xs text-primary font-medium mb-2">{course.category.name}</span>
          )}

          {/* Title */}
          <h3 className="font-heading font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          {course.shortDesc && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.shortDesc}</p>
          )}

          {/* Teacher */}
          {primaryTeacher && (
            <div className="flex items-center gap-2 mb-4">
              {primaryTeacher.teacher.avatar ? (
                <Image
                  src={primaryTeacher.teacher.avatar}
                  alt={primaryTeacher.teacher.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                  {primaryTeacher.teacher.name[0]}
                </div>
              )}
              <span className="text-xs text-muted-foreground">{primaryTeacher.teacher.name}</span>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.totalLessons} Lessons
            </span>
            {course.totalDuration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course._count.enrollments.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto flex items-center justify-between">
            <div>
              {course.salePrice !== null ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {course.salePrice === 0 ? 'Free' : formatCurrency(course.salePrice)}
                  </span>
                  {course.price > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(course.price)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xl font-bold text-primary">
                  {course.price === 0 ? 'Free' : formatCurrency(course.price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-medium text-foreground">4.8</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
