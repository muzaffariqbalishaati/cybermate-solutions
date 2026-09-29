import { PublicLayout } from '@/components/layouts/public-layout';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Star, Clock, BookOpen, Users, CheckCircle2, PlayCircle,
  FileText, HelpCircle, Award, ShieldCheck, ChevronDown,
  Globe, Share2, Heart, ArrowRight
} from 'lucide-react';
import type { Metadata } from 'next';

interface CoursePageProps {
  params: { slug: string };
}

// Fallback course data if DB is offline or course not seeded yet
function getFallbackCourse(slug: string) {
  const title = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: 'demo-course-id',
    title: title || 'Comprehensive Class 10 Board Excellence Course',
    slug: slug,
    headline: 'Master Complete Science & Mathematics with Live Interactive Classes and Doubt Resolution',
    description: `This comprehensive masterclass is designed specifically for students aiming for 95%+ in their board exams. Covering full CBSE/ICSE curriculum with in-depth concept clarity, high-yield practice questions, previous year question analyses, and personalized doubt sessions.

Our top educators break down complex physics formulas, chemistry reactions, biology diagrams, and mathematics proofs into intuitive, easy-to-grasp concepts. With weekly live doubt-clearing sessions and adaptive quiz tests, you will build unwavering exam confidence.`,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    price: 4999,
    salePrice: 2499,
    subject: 'Science & Mathematics',
    grade: 'Class 10',
    board: 'CBSE / ICSE',
    language: 'English & Hindi',
    duration: 120, // hours
    totalLessons: 84,
    rating: 4.9,
    reviewCount: 428,
    enrollmentCount: 2340,
    category: { name: 'Board Exams', slug: 'board-exams' },
    teachers: [
      {
        teacher: {
          name: 'Dr. Rajesh Verma',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          title: 'Senior Physics & Math Faculty',
          experience: '14+ years teaching experience',
          bio: 'Former IIT Roorkee visiting scholar with over a decade of mentoring 50,000+ top scorers across India.',
        },
        isPrimary: true,
      }
    ],
    highlights: [
      '84+ High Definition Recorded Video Lectures',
      '24 Scheduled Live Interactive Doubt & Problem Solving Classes',
      'Complete Chapter-wise Study Notes & Formula Cheatsheets (PDF)',
      '15 Full Length Mock Tests with All India Percentile Ranking',
      'Past 10 Years Solved Board Papers with Step-by-Step Marking',
      'Direct 1-on-1 Doubt Resolution within 2 hours',
      'Verified Certificate of Completion upon course finish',
      'Mobile and Desktop Lifetime Access anytime, anywhere'
    ],
    learningOutcomes: [
      'Understand core principles of Physics, Chemistry, Biology & Mathematics with deep clarity',
      'Solve numerical problems in under 60 seconds using mental shortcuts and exam tricks',
      'Formulate answer sheets that score full marks according to board examiner criteria',
      'Master time management with simulated full-length timed board tests',
      'Eliminate exam anxiety through regular live mentorship and weekly parent-teacher updates'
    ],
    chapters: [
      {
        id: 'c1',
        title: 'Module 1: Chemical Reactions & Equations',
        duration: '14 hours',
        lessons: [
          { id: 'l1', title: '1.1 Introduction to Chemical Changes & Word Equations', type: 'VIDEO', duration: '28 min', isFree: true },
          { id: 'l2', title: '1.2 Balancing Chemical Equations Made Easy', type: 'VIDEO', duration: '35 min', isFree: true },
          { id: 'l3', title: '1.3 Types of Reactions: Combination & Decomposition', type: 'VIDEO', duration: '42 min', isFree: false },
          { id: 'l4', title: '1.4 Oxidation, Reduction & Corrosion in Daily Life', type: 'VIDEO', duration: '38 min', isFree: false },
          { id: 'l5', title: '1.5 Chapter Test & Previous 5 Years Board Questions', type: 'QUIZ', duration: '45 min', isFree: false },
        ]
      },
      {
        id: 'c2',
        title: 'Module 2: Light - Reflection and Refraction',
        duration: '18 hours',
        lessons: [
          { id: 'l6', title: '2.1 Laws of Reflection and Spherical Mirrors', type: 'VIDEO', duration: '40 min', isFree: false },
          { id: 'l7', title: '2.2 Ray Diagrams for Concave & Convex Mirrors', type: 'VIDEO', duration: '50 min', isFree: false },
          { id: 'l8', title: '2.3 Mirror Formula & Sign Convention Shortcuts', type: 'VIDEO', duration: '45 min', isFree: false },
          { id: 'l9', title: '2.4 Refraction through Glass Prism & Lens Formula', type: 'VIDEO', duration: '55 min', isFree: false },
          { id: 'l10', title: '2.5 Optics Practice Assignment with Solutions', type: 'ASSIGNMENT', duration: '60 min', isFree: false },
        ]
      },
      {
        id: 'c3',
        title: 'Module 3: Mathematics - Quadratic Equations & AP',
        duration: '16 hours',
        lessons: [
          { id: 'l11', title: '3.1 Standard Form and Factorization Techniques', type: 'VIDEO', duration: '45 min', isFree: false },
          { id: 'l12', title: '3.2 Quadratic Formula & Nature of Roots', type: 'VIDEO', duration: '40 min', isFree: false },
          { id: 'l13', title: '3.3 Real-life Word Problems Decoded', type: 'VIDEO', duration: '52 min', isFree: false },
          { id: 'l14', title: '3.4 Arithmetic Progression: nth Term & Sum Formula', type: 'VIDEO', duration: '48 min', isFree: false },
        ]
      },
      {
        id: 'c4',
        title: 'Module 4: Full Board Mock Series & Exam Strategy',
        duration: '20 hours',
        lessons: [
          { id: 'l15', title: '4.1 Examiner Mindset: How Answers are Evaluated', type: 'VIDEO', duration: '30 min', isFree: false },
          { id: 'l16', title: '4.2 Full Syllabus Mock Exam 1 (Board Standard)', type: 'QUIZ', duration: '180 min', isFree: false },
          { id: 'l17', title: '4.3 Full Syllabus Mock Exam 2 (Board Standard)', type: 'QUIZ', duration: '180 min', isFree: false },
        ]
      }
    ],
    faqs: [
      { q: 'Can I access this course on both mobile and laptop?', a: 'Yes! CyberMate Solutions works smoothly on all browsers, Windows, macOS, Android, and iOS devices with instant progress synchronization.' },
      { q: 'What happens if I miss a scheduled live class?', a: 'All live sessions are automatically recorded in Full HD and uploaded to your dashboard within 2 hours of completion for unlimited rewatching.' },
      { q: 'How does the 1-on-1 doubt clearing work?', a: 'You can submit doubts directly inside the lesson player via text or photo upload. Our subject teachers answer within 2 hours with step-by-step video or written solutions.' },
      { q: 'Is there a refund policy?', a: 'Yes, we offer a 100% money-back guarantee within 7 days of purchase if you are not completely satisfied with the course.' }
    ]
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ').toUpperCase()} | CyberMate Solutions Courses`,
    description: 'Enroll in premium online courses with live classes, study material, and doubt clearing.',
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  let dbCourse = null;
  try {
    dbCourse = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        teachers: {
          include: {
            teacher: {
              select: {
                name: true,
                avatar: true,
                teacher: { select: { specialization: true, experience: true, bio: true } }
              }
            }
          }
        },
        chapters: {
          include: {
            topics: {
              include: {
                lessons: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: { select: { enrollments: true, reviews: true } }
      }
    });
  } catch {
    dbCourse = null;
  }

  // Use fallback if not found or DB offline
  const fallback = getFallbackCourse(params.slug);
  const course = {
    title: dbCourse?.title || fallback.title,
    slug: dbCourse?.slug || fallback.slug,
    headline: dbCourse?.shortDesc || fallback.headline,
    description: dbCourse?.description || fallback.description,
    thumbnail: dbCourse?.thumbnail || fallback.thumbnail,
    price: dbCourse?.price ? Number(dbCourse.price) : fallback.price,
    salePrice: dbCourse?.salePrice ? Number(dbCourse.salePrice) : fallback.salePrice,
    subject: dbCourse?.subject || fallback.subject,
    grade: dbCourse?.grade || fallback.grade,
    duration: dbCourse?.totalDuration || fallback.duration,
    totalLessons: dbCourse?.totalLessons || fallback.totalLessons,
    category: dbCourse?.category?.name || fallback.category.name,
    highlights: fallback.highlights,
    learningOutcomes: fallback.learningOutcomes,
    chapters: fallback.chapters,
    faqs: fallback.faqs,
    teacher: fallback.teachers[0].teacher
  };

  const discountPercent = course.salePrice
    ? Math.round(((course.price - course.salePrice) / course.price) * 100)
    : 0;

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left 2 Cols: Course Overview */}
            <div className="lg:col-span-2 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                  {course.grade}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                  Best Seller
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                {course.headline}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                  <span className="text-slate-400 font-normal">(428 reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-brand-400" />
                  <span>2,340+ Students Enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-brand-400" />
                  <span>{course.duration} Hours of Content</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-brand-400" />
                  <span>English & Hindi</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-500"
                />
                <div>
                  <p className="text-xs text-slate-400">Created by</p>
                  <p className="font-semibold text-white">{course.teacher.name}</p>
                  <p className="text-xs text-slate-400">{course.teacher.title}</p>
                </div>
              </div>
            </div>

            {/* Right Col: Course Purchase Card (Desktop Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden sticky top-24">
                {/* Thumbnail / Video Preview */}
                <div className="relative aspect-video group cursor-pointer bg-slate-950">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 fill-white/20" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/75 text-white text-xs px-2.5 py-1 rounded backdrop-blur">
                    Preview Course
                  </span>
                </div>

                {/* Pricing & CTA */}
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-heading font-extrabold text-slate-900">
                        {formatCurrency(course.salePrice || course.price)}
                      </span>
                      {course.salePrice && (
                        <>
                          <span className="text-lg line-through text-slate-400">
                            {formatCurrency(course.price)}
                          </span>
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-red-500 font-medium mt-1">
                      🔥 Special batch price ends soon!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href={`/checkout?course=${encodeURIComponent(course.slug)}`}
                      className="w-full block"
                    >
                      <Button className="w-full py-6 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">
                        Enroll Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link
                      href={`/checkout?course=${encodeURIComponent(course.slug)}&trial=true`}
                      className="w-full block"
                    >
                      <Button variant="outline" className="w-full py-5 text-sm font-semibold">
                        Start 7-Day Free Trial
                      </Button>
                    </Link>
                  </div>

                  <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    7-Day Money-Back Guarantee • Instant Access
                  </p>

                  {/* Highlights checklist */}
                  <div className="border-t pt-4 space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      This course includes:
                    </p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>{course.duration} Hours on-demand HD video</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>Downloadable PDF notes & cheatsheets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>24/7 Priority teacher doubt clearing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>Shareable Certificate of Completion</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* What you'll learn */}
            <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">
                What you'll master in this course
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.learningOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Curriculum */}
            <section className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-slate-900">
                    Course Curriculum
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {course.chapters.length} Modules • {course.totalLessons} Lessons • {course.duration} Hours Total
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.chapters.map((chap, cIdx) => (
                  <div
                    key={chap.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
                  >
                    <div className="bg-slate-50/80 px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                          {cIdx + 1}
                        </span>
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                          {chap.title}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {chap.duration}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 px-5 py-2">
                      {chap.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="py-3 flex items-center justify-between text-sm hover:text-brand-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.type === 'VIDEO' && <PlayCircle className="w-4 h-4 text-slate-400" />}
                            {lesson.type === 'QUIZ' && <Award className="w-4 h-4 text-amber-500" />}
                            {lesson.type === 'ASSIGNMENT' && <FileText className="w-4 h-4 text-blue-500" />}
                            <span className="text-slate-800 text-sm font-medium">
                              {lesson.title}
                            </span>
                            {lesson.isFree && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Course Description
              </h2>
              <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {course.description}
              </div>
            </section>

            {/* Instructor Profile */}
            <section className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm space-y-5">
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Meet Your Instructor
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={course.teacher.avatar}
                  alt={course.teacher.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{course.teacher.name}</h3>
                  <p className="text-sm font-medium text-brand-600">{course.teacher.title}</p>
                  <p className="text-xs text-slate-500">{course.teacher.experience}</p>
                  <p className="text-sm text-slate-600 leading-relaxed pt-2">
                    {course.teacher.bio}
                  </p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {course.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-2">
                    <h3 className="font-semibold text-slate-900 text-base">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Col on mobile: Card CTA and Sticky Bottom Bar */}
          <div className="lg:hidden pb-16">
            <div className="card p-6 text-center space-y-4">
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(course.salePrice || course.price)}
              </div>
              <Link href={`/checkout?course=${encodeURIComponent(course.slug)}`} className="w-full block">
                <Button className="w-full py-6 font-bold bg-brand-600 text-white shadow-lg shadow-brand-500/25">
                  Enroll in this Course
                </Button>
              </Link>
            </div>
          </div>

          {/* Sticky Mobile Floating Bottom Enroll Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xl">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-heading text-slate-900">
                  {formatCurrency(course.salePrice || course.price)}
                </span>
                {course.salePrice && (
                  <span className="text-xs line-through text-slate-400">
                    {formatCurrency(course.price)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">{discountPercent}% OFF • Instant Access</span>
            </div>
            <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 shadow-md shadow-brand-500/20">
              <Link href={`/checkout?course=${encodeURIComponent(course.slug)}`}>
                Enroll Now →
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
