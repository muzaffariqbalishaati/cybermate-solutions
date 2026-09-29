import { z } from 'zod';

// ========================
// AUTH SCHEMAS
// ========================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ========================
// USER SCHEMAS
// ========================

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  dateOfBirth: z.string().optional(),
  grade: z.string().optional(),
  school: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  about: z.string().optional(),
});

// ========================
// COURSE SCHEMAS
// ========================

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDesc: z.string().nullable().optional(),
  language: z.string().default('en'),
  grade: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  price: z.number().min(0).default(0),
  salePrice: z.number().min(0).nullable().optional(),
  validity: z.number().nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  hasDemo: z.boolean().default(false),
  demoUrl: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDesc: z.string().nullable().optional(),
});

export const chapterSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  order: z.number().default(0),
  isFree: z.boolean().default(false),
});

export const topicSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  order: z.number().default(0),
});

export const lessonSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'TEXT', 'PDF', 'ATTACHMENT', 'QUIZ', 'ASSIGNMENT', 'LIVE_CLASS']),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  videoDuration: z.number().optional(),
  pdfUrl: z.string().optional(),
  attachmentUrl: z.string().optional(),
  isFree: z.boolean().default(false),
  order: z.number().default(0),
  isPublished: z.boolean().default(false),
});

// ========================
// TEST SCHEMAS
// ========================

export const testSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  instructions: z.string().optional(),
  duration: z.number().optional(),
  totalMarks: z.number().default(0),
  passingMarks: z.number().default(0),
  negativeMarking: z.number().default(0),
  maxAttempts: z.number().optional(),
  randomQuestions: z.boolean().default(false),
  showResult: z.boolean().default(true),
  showAnswers: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  courseId: z.string(),
});

export const questionSchema = z.object({
  question: z.string().min(5),
  questionType: z.enum(['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  marks: z.number().default(1),
  subject: z.string().optional(),
  courseId: z.string().optional(),
  topicId: z.string().optional(),
});

// ========================
// LIVE CLASS SCHEMAS
// ========================

export const liveClassSchema = z.object({
  courseId: z.string(),
  chapterId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  scheduledAt: z.string(),
  duration: z.number().default(60),
  meetingUrl: z.string().optional(),
  meetingId: z.string().optional(),
  maxStudents: z.number().optional(),
});

// ========================
// ASSIGNMENT SCHEMAS
// ========================

export const assignmentSchema = z.object({
  courseId: z.string(),
  chapterId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
  deadline: z.string().optional(),
  totalMarks: z.number().default(100),
  isPublished: z.boolean().default(false),
});

// ========================
// DOUBT SCHEMAS
// ========================

export const doubtSchema = z.object({
  courseId: z.string(),
  chapterId: z.string().optional(),
  title: z.string().min(5),
  question: z.string().min(10),
  imageUrl: z.string().optional(),
  fileUrl: z.string().optional(),
});

// ========================
// COUPON SCHEMAS
// ========================

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().optional(),
  perUserLimit: z.number().default(1),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  expiryDate: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
});

// ========================
// ORDER SCHEMAS
// ========================

export const createOrderSchema = z.object({
  items: z.array(z.object({
    courseId: z.string().optional(),
    bundleId: z.string().optional(),
  })).min(1, 'At least one item required'),
  couponCode: z.string().optional(),
});

// ========================
// ANNOUNCEMENT SCHEMAS
// ========================

export const announcementSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(10),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
  courseId: z.string().optional(),
  targetRole: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
  targetUser: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

// ========================
// SITE SETTINGS SCHEMAS
// ========================

export const siteSettingSchema = z.object({
  key: z.string(),
  value: z.string().optional(),
  type: z.string().default('text'),
  group: z.string().default('general'),
  label: z.string().optional(),
});

// ========================
// STUDY PLAN SCHEMAS
// ========================

export const studyPlanSchema = z.object({
  subject: z.string().min(2),
  task: z.string().min(5),
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  notes: z.string().optional(),
});

// ========================
// PAGE SCHEMAS
// ========================

export const pageSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  ogImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export const pageSectionSchema = z.object({
  type: z.enum([
    'HERO', 'TEXT', 'IMAGE', 'TEXT_IMAGE', 'COURSE_GRID', 'COURSE_CAROUSEL',
    'FEATURES', 'STATISTICS', 'TESTIMONIALS', 'TEACHER_PROFILES', 'FAQ',
    'CTA', 'VIDEO', 'ANNOUNCEMENT', 'CUSTOM_HTML'
  ]),
  title: z.string().optional(),
  content: z.record(z.unknown()).default({}),
  order: z.number().default(0),
  isVisible: z.boolean().default(true),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type CourseSchema = z.infer<typeof courseSchema>;
export type ChapterSchema = z.infer<typeof chapterSchema>;
export type TopicSchema = z.infer<typeof topicSchema>;
export type LessonSchema = z.infer<typeof lessonSchema>;
export type TestSchema = z.infer<typeof testSchema>;
export type CouponSchema = z.infer<typeof couponSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
