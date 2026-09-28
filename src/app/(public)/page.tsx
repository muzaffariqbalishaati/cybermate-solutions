import { PublicLayout } from '@/components/layouts/public-layout';
import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { FeaturedCoursesSection } from '@/components/home/featured-courses-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { TeachersSection } from '@/components/home/teachers-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { FAQSection } from '@/components/home/faq-section';
import { CTASection } from '@/components/home/cta-section';
import { AnnouncementBar } from '@/components/home/announcement-bar';
import prisma from '@/lib/prisma';
import {
  fallbackCategories,
  fallbackCourses,
  fallbackTeachers,
  fallbackTestimonials,
  fallbackFAQs,
} from '@/lib/mock-data';

async function getHomepageData() {
  try {
    const [sections, featuredCourses, categories, testimonials, faqs, teachers] = await Promise.all([
      prisma.homepageSection.findMany({ orderBy: { order: 'asc' } }),
      prisma.course.findMany({
        where: { status: 'PUBLISHED', featured: true },
        include: { category: true, teachers: { include: { teacher: { select: { name: true, avatar: true } } } }, _count: { select: { enrollments: true } } },
        orderBy: { order: 'asc' },
        take: 6,
      }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 8 }),
      prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 }),
      prisma.fAQ.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 8 }),
      prisma.user.findMany({
        where: { role: 'TEACHER', teacher: { displayOnSite: true } },
        select: { id: true, name: true, avatar: true, teacher: { select: { specialization: true, experience: true, bio: true } } },
        take: 6,
      }),
    ]);

    return { sections, featuredCourses, categories, testimonials, faqs, teachers };
  } catch {
    // Return defaults if DB not connected
    return {
      sections: [],
      featuredCourses: [],
      categories: [],
      testimonials: [],
      faqs: [],
      teachers: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomepageData();

  const sectionMap: Record<string, any> = Object.fromEntries(
    data.sections.map(s => [s.sectionKey, s])
  );

  const courses = data.featuredCourses.length > 0 ? data.featuredCourses : fallbackCourses;
  const categories = data.categories.length > 0 ? data.categories : fallbackCategories;
  const teachers = (data.teachers.length > 0 ? data.teachers : fallbackTeachers) as any;
  const testimonials = data.testimonials.length > 0 ? data.testimonials : fallbackTestimonials;
  const faqs = data.faqs.length > 0 ? data.faqs : fallbackFAQs;

  return (
    <PublicLayout>
      <AnnouncementBar section={sectionMap['announcement_bar']} />
      <HeroSection section={sectionMap['hero']} />
      <StatsSection section={sectionMap['statistics']} />
      <FeaturedCoursesSection
        section={sectionMap['featured_courses']}
        courses={courses as any}
      />
      <CategoriesSection
        section={sectionMap['categories']}
        categories={categories as any}
      />
      <WhyChooseUsSection section={sectionMap['why_choose_us']} />
      <TeachersSection
        section={sectionMap['teachers']}
        teachers={teachers}
      />
      <TestimonialsSection
        section={sectionMap['testimonials']}
        testimonials={testimonials as any}
      />
      <FAQSection section={sectionMap['faq']} faqs={faqs} />
      <CTASection section={sectionMap['cta']} />
    </PublicLayout>
  );
}
