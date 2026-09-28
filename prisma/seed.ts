import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EduPro database...\n');

  // ========================
  // CLEAN EXISTING DATA (in reverse dependency order)
  // ========================
  await prisma.notificationPreference.deleteMany().catch(() => {});
  await prisma.auditLog.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.emailLog.deleteMany().catch(() => {});
  await prisma.liveAttendance.deleteMany().catch(() => {});
  await prisma.testAttempt.deleteMany().catch(() => {});
  await prisma.assignmentSubmission.deleteMany().catch(() => {});
  await prisma.doubt.deleteMany().catch(() => {});
  await prisma.studyPlan.deleteMany().catch(() => {});
  await prisma.wishlist.deleteMany().catch(() => {});
  await prisma.certificate.deleteMany().catch(() => {});
  await prisma.review.deleteMany().catch(() => {});
  await prisma.lessonProgress.deleteMany().catch(() => {});
  await prisma.couponUsage.deleteMany().catch(() => {});
  await prisma.couponCourse.deleteMany().catch(() => {});
  await prisma.bundleCourse.deleteMany().catch(() => {});
  await prisma.invoice.deleteMany().catch(() => {});
  await prisma.payment.deleteMany().catch(() => {});
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.refundRequest.deleteMany().catch(() => {});
  await prisma.referral.deleteMany().catch(() => {});
  await prisma.scholarship.deleteMany().catch(() => {});
  await prisma.announcement.deleteMany().catch(() => {});
  await prisma.testQuestion.deleteMany().catch(() => {});
  await prisma.test.deleteMany().catch(() => {});
  await prisma.question.deleteMany().catch(() => {});
  await prisma.questionBank.deleteMany().catch(() => {});
  await prisma.assignment.deleteMany().catch(() => {});
  await prisma.lesson.deleteMany().catch(() => {});
  await prisma.topic.deleteMany().catch(() => {});
  await prisma.chapter.deleteMany().catch(() => {});
  await prisma.liveClass.deleteMany().catch(() => {});
  await prisma.courseFile.deleteMany().catch(() => {});
  await prisma.courseTeacher.deleteMany().catch(() => {});
  await prisma.enrollment.deleteMany().catch(() => {});
  await prisma.course.deleteMany().catch(() => {});
  await prisma.bundle.deleteMany().catch(() => {});
  await prisma.coupon.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.parentStudentLink.deleteMany().catch(() => {});
  await prisma.studentProfile.deleteMany().catch(() => {});
  await prisma.teacherProfile.deleteMany().catch(() => {});
  await prisma.parentProfile.deleteMany().catch(() => {});
  await prisma.session.deleteMany().catch(() => {});
  await prisma.passwordReset.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  await prisma.fAQ.deleteMany().catch(() => {});
  await prisma.testimonial.deleteMany().catch(() => {});
  await prisma.homepageSection.deleteMany().catch(() => {});
  await prisma.menuItem.deleteMany().catch(() => {});
  await prisma.menu.deleteMany().catch(() => {});
  await prisma.pageSection.deleteMany().catch(() => {});
  await prisma.page.deleteMany().catch(() => {});
  await prisma.siteSetting.deleteMany().catch(() => {});
  await prisma.emailTemplate.deleteMany().catch(() => {});
  await prisma.media.deleteMany().catch(() => {});

  console.log('✅ Cleaned existing data');

  // ========================
  // SITE SETTINGS
  // ========================
  const siteSettings = [
    { key: 'site_name', value: 'EduPro', type: 'text', group: 'general', label: 'Site Name' },
    { key: 'logo_url', value: '', type: 'text', group: 'general', label: 'Logo URL' },
    { key: 'favicon_url', value: '/favicon.ico', type: 'text', group: 'general', label: 'Favicon' },
    { key: 'contact_email', value: 'support@edupro.com', type: 'text', group: 'contact', label: 'Contact Email' },
    { key: 'phone', value: '+91 98765 43210', type: 'text', group: 'contact', label: 'Phone' },
    { key: 'whatsapp', value: '+91 98765 43210', type: 'text', group: 'contact', label: 'WhatsApp' },
    { key: 'address', value: 'New Delhi, India 110001', type: 'text', group: 'contact', label: 'Address' },
    { key: 'footer_about', value: "India's premier online tuition platform providing quality education to students across the country with expert teachers.", type: 'text', group: 'footer', label: 'Footer About Text' },
    { key: 'social_facebook', value: 'https://facebook.com/edupro', type: 'text', group: 'social', label: 'Facebook URL' },
    { key: 'social_instagram', value: 'https://instagram.com/edupro', type: 'text', group: 'social', label: 'Instagram URL' },
    { key: 'social_youtube', value: 'https://youtube.com/@edupro', type: 'text', group: 'social', label: 'YouTube URL' },
    { key: 'social_twitter', value: 'https://twitter.com/edupro', type: 'text', group: 'social', label: 'Twitter URL' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/edupro', type: 'text', group: 'social', label: 'LinkedIn URL' },
    { key: 'default_seo_title', value: 'EduPro - Premium Online Tuition Platform', type: 'text', group: 'seo', label: 'Default SEO Title' },
    { key: 'default_meta_desc', value: "India's premier online tuition platform for students.", type: 'text', group: 'seo', label: 'Default Meta Description' },
    { key: 'currency', value: 'INR', type: 'text', group: 'general', label: 'Currency' },
    { key: 'timezone', value: 'Asia/Kolkata', type: 'text', group: 'general', label: 'Timezone' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean', group: 'general', label: 'Maintenance Mode' },
    { key: 'copyright_text', value: `© ${new Date().getFullYear()} EduPro. All rights reserved.`, type: 'text', group: 'footer', label: 'Copyright Text' },
    { key: 'header_login_btn', value: 'Login', type: 'text', group: 'header', label: 'Login Button Text' },
    { key: 'header_signup_btn', value: 'Join Free', type: 'text', group: 'header', label: 'Signup Button Text' },
  ];

  await prisma.siteSetting.createMany({ data: siteSettings });
  console.log('✅ Site settings created');

  // ========================
  // HOMEPAGE SECTIONS
  // ========================
  const homepageSections = [
    {
      sectionKey: 'announcement_bar',
      title: 'Announcement Bar',
      content: {
        text: '🎉 New Batch Starting! Class 10 Science - Enroll Now and Get 20% Off',
        link: '/courses',
        bg_color: 'bg-brand-600',
        text_color: 'text-white',
      },
      order: 0,
      isVisible: true,
    },
    {
      sectionKey: 'hero',
      title: 'Hero Section',
      content: {
        headline: "Learn from India's Best Teachers",
        subheadline: "Premium live classes, recorded lectures, tests & more — all in one platform for Classes 6-12",
        cta_text: 'Explore Courses',
        cta_url: '/courses',
        demo_cta: 'Watch Demo',
        demo_url: '/demo',
        highlight_text: 'Trusted by 50,000+ Students',
        bg_image: '',
      },
      order: 1,
      isVisible: true,
    },
    {
      sectionKey: 'statistics',
      title: 'Statistics',
      content: {
        stats: [
          { value: '50,000+', label: 'Active Students', icon: 'users' },
          { value: '200+', label: 'Expert Courses', icon: 'book' },
          { value: '50+', label: 'Expert Teachers', icon: 'award' },
          { value: '1M+', label: 'Hours of Learning', icon: 'clock' },
        ],
      },
      order: 2,
      isVisible: true,
    },
    {
      sectionKey: 'featured_courses',
      title: 'Featured Courses',
      content: {
        heading: 'Featured Courses',
        subheading: 'Handpicked courses from our expert teachers',
      },
      order: 3,
      isVisible: true,
    },
    {
      sectionKey: 'categories',
      title: 'Course Categories',
      content: {
        heading: 'Browse by Category',
        subheading: 'Find courses in your area of interest',
      },
      order: 4,
      isVisible: true,
    },
    {
      sectionKey: 'why_choose_us',
      title: 'Why Choose Us',
      content: {
        heading: 'Why Choose EduPro?',
        subheading: 'We provide the best learning experience for students across India',
        features: [
          { title: 'Expert Teachers', description: 'Learn from experienced educators with proven track records and years of teaching excellence', icon: 'award' },
          { title: 'Live Interactive Classes', description: 'Attend real-time live sessions with doubt-solving and interactive Q&A', icon: 'zap' },
          { title: 'Recorded Lectures', description: 'Watch and rewatch classes anytime, anywhere at your convenience', icon: 'clock' },
          { title: 'Doubt Support', description: '24/7 doubt resolution from dedicated subject experts', icon: 'headphones' },
          { title: 'Regular Tests', description: 'Assess your progress with chapter-wise tests and full mock exams', icon: 'checkCircle' },
          { title: 'Secure Platform', description: 'Your data, payments, and content are always protected with enterprise security', icon: 'shield' },
        ],
      },
      order: 5,
      isVisible: true,
    },
    {
      sectionKey: 'teachers',
      title: 'Teachers Section',
      content: {
        heading: 'Meet Our Expert Teachers',
        subheading: 'Learn from the best educators with years of experience',
      },
      order: 6,
      isVisible: true,
    },
    {
      sectionKey: 'testimonials',
      title: 'Testimonials',
      content: {
        heading: 'What Students Say',
        subheading: 'Real experiences from our students across India',
      },
      order: 7,
      isVisible: true,
    },
    {
      sectionKey: 'faq',
      title: 'FAQ Section',
      content: {
        heading: 'Frequently Asked Questions',
        subheading: "Got questions? We've got answers",
      },
      order: 8,
      isVisible: true,
    },
    {
      sectionKey: 'cta',
      title: 'Call to Action',
      content: {
        heading: 'Ready to Start Learning?',
        subheading: 'Join thousands of students already learning on EduPro. Start your free demo today!',
        cta_text: 'Start Learning Today',
        cta_url: '/register',
        secondary_text: 'Explore Free Resources',
        secondary_url: '/resources',
      },
      order: 9,
      isVisible: true,
    },
  ];

  await prisma.homepageSection.createMany({ data: homepageSections });
  console.log('✅ Homepage sections created');

  // ========================
  // NAVIGATION MENUS
  // ========================
  const headerMenu = await prisma.menu.create({
    data: {
      name: 'Header Navigation',
      location: 'header',
    },
  });

  const headerItems = [
    { menuId: headerMenu.id, label: 'Home', url: '/', order: 1, isActive: true },
    { menuId: headerMenu.id, label: 'Courses', url: '/courses', order: 2, isActive: true },
    { menuId: headerMenu.id, label: 'Free Demo', url: '/demo', order: 3, isActive: true },
    { menuId: headerMenu.id, label: 'Resources', url: '/resources', order: 4, isActive: true },
    { menuId: headerMenu.id, label: 'About', url: '/about', order: 5, isActive: true },
    { menuId: headerMenu.id, label: 'Contact', url: '/contact', order: 6, isActive: true },
  ];

  await prisma.menuItem.createMany({ data: headerItems });

  await prisma.menu.create({
    data: { name: 'Footer Navigation', location: 'footer' },
  });

  console.log('✅ Menus created');

  // ========================
  // FAQ
  // ========================
  const faqs = [
    { question: 'How do I access my courses after purchase?', answer: 'After successful payment, courses are instantly unlocked in your Student Dashboard under "My Courses". You can access them anytime from any device.', order: 1 },
    { question: 'Can I attend live classes if I miss the scheduled time?', answer: 'Yes! All live classes are recorded and made available in the "Recorded Classes" section within 24 hours. You can watch them anytime.', order: 2 },
    { question: 'How long do I have access to a course?', answer: 'Access duration depends on the course. Some have lifetime access, while others have a set validity (e.g., 1 year). The validity period is clearly mentioned on each course page.', order: 3 },
    { question: 'Can parents track their child\'s progress?', answer: 'Yes! Parents can create a linked Parent Account and monitor their child\'s attendance, test scores, assignments, and overall progress.', order: 4 },
    { question: 'How do I submit a doubt to a teacher?', answer: 'Go to your Student Dashboard → Doubts → Submit a Doubt. You can add text, images, or PDF files. Teachers typically respond within 24 hours.', order: 5 },
    { question: 'What payment methods are accepted?', answer: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, BHIM), Net Banking, and Wallets through our secure Razorpay payment gateway.', order: 6 },
    { question: 'Is there a refund policy?', answer: 'Yes, we offer refunds as per our Refund Policy. Generally, refund requests within 7 days of purchase and before 20% course completion are eligible. Please read our Refund Policy for full details.', order: 7 },
    { question: 'Can I download the study materials and PDFs?', answer: 'Study materials, notes, and PDFs are available in your Student Dashboard. Downloading may be restricted on certain materials to protect content.', order: 8 },
  ];

  await prisma.fAQ.createMany({ data: faqs.map(f => ({ ...f, isActive: true })) });
  console.log('✅ FAQs created');

  // ========================
  // TESTIMONIALS
  // ========================
  const testimonials = [
    { name: 'Priya Sharma', designation: 'Class 12 Student, Delhi', content: "EduPro completely transformed how I study! The live classes are incredibly interactive and the teachers are very patient with doubts. I scored 95% in my boards!", rating: 5, order: 1, isActive: true },
    { name: 'Rahul Mehta', designation: 'Class 10 Student, Mumbai', content: "The test series and performance analytics helped me identify my weak areas. My science marks improved from 65% to 88% in just 3 months.", rating: 5, order: 2, isActive: true },
    { name: 'Ananya Patel', designation: 'Class 11 Student, Bangalore', content: "Best online tuition platform! The recorded lectures are very clear and I can pause, rewind and replay as many times as I need. The doubt resolution is super fast.", rating: 5, order: 3, isActive: true },
    { name: 'Vikram Singh', designation: 'Parent, Jaipur', content: "As a parent, I can monitor Vikram's progress, attendance and test scores anytime. Very transparent platform. Highly recommend!", rating: 4, order: 4, isActive: true },
    { name: 'Sneha Reddy', designation: 'Class 9 Student, Hyderabad', content: "The study planner and performance tracking keeps me organized. I love how I can see exactly which chapters I need to focus on based on my test results.", rating: 5, order: 5, isActive: true },
    { name: 'Arun Kumar', designation: 'Class 12 Student, Chennai', content: "The teachers are excellent! They explain concepts clearly and the live doubt sessions are very helpful. Cleared my JEE foundation thanks to EduPro.", rating: 5, order: 6, isActive: true },
  ];

  await prisma.testimonial.createMany({ data: testimonials });
  console.log('✅ Testimonials created');

  // ========================
  // EMAIL TEMPLATES
  // ========================
  const emailTemplates = [
    {
      name: 'Welcome Email',
      slug: 'welcome',
      subject: 'Welcome to {{platform_name}}! 🎉',
      body: `<h2>Welcome to {{platform_name}}, {{student_name}}!</h2>
<p>We are thrilled to have you join India's premier online tuition platform.</p>
<p>Here's what you can do:</p>
<ul>
<li>Browse and purchase courses</li>
<li>Attend live interactive classes</li>
<li>Track your progress and performance</li>
<li>Submit doubts and get expert answers</li>
</ul>
<p><a href="{{login_url}}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Start Learning Now</a></p>
<p>Best wishes,<br>The {{platform_name}} Team</p>`,
      variables: ['student_name', 'platform_name', 'login_url'],
      isActive: true,
    },
    {
      name: 'Password Reset',
      slug: 'password_reset',
      subject: 'Reset Your Password - {{platform_name}}',
      body: `<h2>Reset Your Password</h2>
<p>Hi {{student_name}},</p>
<p>We received a request to reset your password. Click the button below to create a new password:</p>
<p><a href="{{reset_url}}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
<p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
<p>Best wishes,<br>The {{platform_name}} Team</p>`,
      variables: ['student_name', 'platform_name', 'reset_url'],
      isActive: true,
    },
    {
      name: 'Course Enrollment',
      slug: 'course_enrollment',
      subject: 'You are enrolled in {{course_name}}! 🎓',
      body: `<h2>Course Enrollment Confirmed!</h2>
<p>Hi {{student_name}},</p>
<p>Great news! You have been successfully enrolled in <strong>{{course_name}}</strong>.</p>
<p>Start learning now by clicking the button below:</p>
<p><a href="{{course_link}}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Start Learning</a></p>
<p>Happy learning!<br>The {{platform_name}} Team</p>`,
      variables: ['student_name', 'course_name', 'course_link', 'platform_name'],
      isActive: true,
    },
    {
      name: 'Payment Confirmation',
      slug: 'payment_confirmation',
      subject: 'Payment Confirmed - Invoice {{invoice_number}}',
      body: `<h2>Payment Successful! ✅</h2>
<p>Hi {{student_name}},</p>
<p>We have received your payment of <strong>{{amount}}</strong>.</p>
<p><strong>Invoice Number:</strong> {{invoice_number}}</p>
<p>Your courses have been unlocked and are ready to access.</p>
<p>Best wishes,<br>The {{platform_name}} Team</p>`,
      variables: ['student_name', 'invoice_number', 'amount', 'platform_name'],
      isActive: true,
    },
    {
      name: 'Live Class Reminder',
      slug: 'live_class_reminder',
      subject: 'Live Class Reminder: {{class_name}} starts in 30 minutes!',
      body: `<h2>Your Live Class Starts Soon! ⏰</h2>
<p>Hi {{student_name}},</p>
<p>Your live class <strong>{{class_name}}</strong> is starting in 30 minutes at <strong>{{class_time}}</strong>.</p>
<p><a href="{{join_url}}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">Join Class Now</a></p>
<p>Best wishes,<br>The {{platform_name}} Team</p>`,
      variables: ['student_name', 'class_name', 'class_time', 'join_url', 'platform_name'],
      isActive: true,
    },
  ];

  await prisma.emailTemplate.createMany({ data: emailTemplates });
  console.log('✅ Email templates created');

  // ========================
  // CATEGORIES
  // ========================
  const categoryData = [
    { name: 'Mathematics', slug: 'mathematics', icon: '📐', color: '#3B82F6', description: 'From basic arithmetic to advanced calculus', order: 1 },
    { name: 'Science', slug: 'science', icon: '🔬', color: '#10B981', description: 'Physics, Chemistry, Biology and more', order: 2 },
    { name: 'English', slug: 'english', icon: '📚', color: '#8B5CF6', description: 'Language, grammar, literature and writing', order: 3 },
    { name: 'Social Studies', slug: 'social-studies', icon: '🌏', color: '#F59E0B', description: 'History, Geography, Civics and Economics', order: 4 },
    { name: 'Hindi', slug: 'hindi', icon: '🇮🇳', color: '#EF4444', description: 'Hindi language, grammar and literature', order: 5 },
    { name: 'Computer Science', slug: 'computer-science', icon: '💻', color: '#06B6D4', description: 'Coding, programming and digital skills', order: 6 },
    { name: 'JEE Preparation', slug: 'jee-preparation', icon: '🏆', color: '#F97316', description: 'IIT-JEE Main and Advanced preparation', order: 7 },
    { name: 'NEET Preparation', slug: 'neet-preparation', icon: '⚕️', color: '#84CC16', description: 'NEET UG medical entrance preparation', order: 8 },
  ];

  const categories = [];
  for (const cat of categoryData) {
    categories.push(await prisma.category.create({ data: { ...cat, isActive: true } }));
  }
  console.log('✅ Categories created');

  // ========================
  // USERS
  // ========================
  const hashPassword = (pwd: string) => bcrypt.hash(pwd, 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@edupro.com',
      password: await hashPassword('Admin@123'),
      role: 'ADMIN',
      phone: '+91 98765 00001',
      isActive: true,
    },
  });

  // Teachers
  const teacher1 = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Kumar',
      email: 'teacher@edupro.com',
      password: await hashPassword('Teacher@123'),
      role: 'TEACHER',
      phone: '+91 98765 00002',
      isActive: true,
      teacher: {
        create: {
          qualification: 'Ph.D. Mathematics, IIT Delhi',
          specialization: 'Mathematics & JEE',
          experience: 12,
          bio: 'Dr. Rajesh Kumar has 12+ years of teaching experience with a passion for making mathematics accessible to all students. Former IIT faculty member.',
          displayOnSite: true,
        },
      },
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: 'Ms. Priti Sharma',
      email: 'teacher2@edupro.com',
      password: await hashPassword('Teacher@123'),
      role: 'TEACHER',
      phone: '+91 98765 00003',
      isActive: true,
      teacher: {
        create: {
          qualification: 'M.Sc. Physics, Delhi University',
          specialization: 'Physics & Science',
          experience: 8,
          bio: 'Ms. Priti Sharma specializes in making complex physics concepts simple and understandable through real-world examples.',
          displayOnSite: true,
        },
      },
    },
  });

  const teacher3 = await prisma.user.create({
    data: {
      name: 'Mr. Amit Verma',
      email: 'teacher3@edupro.com',
      password: await hashPassword('Teacher@123'),
      role: 'TEACHER',
      phone: '+91 98765 00004',
      isActive: true,
      teacher: {
        create: {
          qualification: 'M.Sc. Chemistry, BHU',
          specialization: 'Chemistry & NEET',
          experience: 10,
          bio: 'Mr. Amit Verma is a passionate chemistry teacher with exceptional results in NEET preparation.',
          displayOnSite: true,
        },
      },
    },
  });

  // Students
  const student1 = await prisma.user.create({
    data: {
      name: 'Arjun Gupta',
      email: 'student@edupro.com',
      password: await hashPassword('Student@123'),
      role: 'STUDENT',
      phone: '+91 98765 00010',
      isActive: true,
      student: {
        create: {
          grade: '10',
          school: 'DPS RK Puram, New Delhi',
          city: 'New Delhi',
          state: 'Delhi',
          referralCode: 'ARJ1234',
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Kavya Nair',
      email: 'student2@edupro.com',
      password: await hashPassword('Student@123'),
      role: 'STUDENT',
      phone: '+91 98765 00011',
      isActive: true,
      student: {
        create: {
          grade: '12',
          school: "St. Mary's School, Mumbai",
          city: 'Mumbai',
          state: 'Maharashtra',
          referralCode: 'KAV5678',
        },
      },
    },
  });

  // Parent
  const parent = await prisma.user.create({
    data: {
      name: 'Sanjay Gupta',
      email: 'parent@edupro.com',
      password: await hashPassword('Parent@123'),
      role: 'PARENT',
      phone: '+91 98765 00020',
      isActive: true,
      parent: {
        create: {
          occupation: 'Business',
          relationship: 'Father',
        },
      },
    },
  });

  // Link parent to student
  const student1Profile = await prisma.studentProfile.findUnique({ where: { userId: student1.id } });
  const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: parent.id } });
  if (student1Profile && parentProfile) {
    await prisma.parentStudentLink.create({
      data: { parentId: parentProfile.id, studentId: student1Profile.id, approved: true },
    });
  }

  console.log('✅ Users created');
  console.log('   Admin: admin@edupro.com / Admin@123');
  console.log('   Teacher: teacher@edupro.com / Teacher@123');
  console.log('   Student: student@edupro.com / Student@123');
  console.log('   Parent: parent@edupro.com / Parent@123');

  // ========================
  // COURSES
  // ========================
  const course1 = await prisma.course.create({
    data: {
      title: 'Class 10 Mathematics - Complete Course',
      slug: 'class-10-mathematics',
      description: 'A comprehensive mathematics course for Class 10 covering all CBSE topics including Algebra, Geometry, Statistics and more. Taught by expert teachers with 10+ years of experience.',
      shortDesc: 'Complete Class 10 Math - CBSE. Live classes, recorded lectures, tests & assignments.',
      grade: '10',
      subject: 'Mathematics',
      price: 3999,
      salePrice: 2499,
      validity: 365,
      status: 'PUBLISHED',
      featured: true,
      popular: true,
      hasDemo: true,
      demoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      categoryId: categories[0].id, // Mathematics
      createdById: admin.id,
      metaTitle: 'Class 10 Mathematics Course | EduPro',
      metaDesc: 'Best online Class 10 Mathematics course with live classes, recorded lectures, and expert teachers.',
      totalLessons: 48,
      totalDuration: 2880, // 48 hours
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Class 12 Physics - JEE Foundation',
      slug: 'class-12-physics-jee',
      description: 'Master Class 12 Physics concepts while building a strong foundation for JEE examination. Covers all chapters with detailed explanations, numerical problems and previous year questions.',
      shortDesc: 'Class 12 Physics + JEE Foundation. Expert faculty, comprehensive coverage.',
      grade: '12',
      subject: 'Physics',
      price: 5999,
      salePrice: 3999,
      validity: 365,
      status: 'PUBLISHED',
      featured: true,
      popular: false,
      hasDemo: true,
      categoryId: categories[1].id, // Science
      createdById: admin.id,
      totalLessons: 62,
      totalDuration: 3720,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'NEET Chemistry - Complete Preparation',
      slug: 'neet-chemistry-complete',
      description: 'Comprehensive Chemistry course designed specifically for NEET aspirants. Covers Physical, Organic and Inorganic Chemistry with extensive practice questions and mock tests.',
      shortDesc: 'NEET Chemistry - Complete preparation with tests, notes and live sessions.',
      grade: '12',
      subject: 'Chemistry',
      price: 6999,
      salePrice: 4999,
      validity: 548,
      status: 'PUBLISHED',
      featured: true,
      popular: true,
      hasDemo: false,
      categoryId: categories[7].id, // NEET
      createdById: admin.id,
      totalLessons: 75,
      totalDuration: 4500,
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: 'Class 9 Science - Complete Course',
      slug: 'class-9-science',
      description: 'Complete Science course for Class 9 covering Physics, Chemistry and Biology. Interactive live classes with expert teachers and comprehensive study material.',
      shortDesc: 'Class 9 Science - Physics, Chemistry & Biology in one comprehensive course.',
      grade: '9',
      subject: 'Science',
      price: 2999,
      salePrice: 1999,
      validity: 365,
      status: 'PUBLISHED',
      featured: false,
      popular: true,
      categoryId: categories[1].id,
      createdById: admin.id,
      totalLessons: 36,
      totalDuration: 2160,
    },
  });

  const course5 = await prisma.course.create({
    data: {
      title: 'Class 6-8 Mathematics Foundation',
      slug: 'class-6-8-mathematics',
      description: 'Build a strong mathematical foundation for Classes 6, 7, and 8. Perfect for students transitioning from primary to middle school.',
      shortDesc: 'Mathematics Foundation for Classes 6-8. Build strong basics for future success.',
      grade: '8',
      subject: 'Mathematics',
      price: 1999,
      salePrice: 999,
      validity: 365,
      status: 'PUBLISHED',
      featured: false,
      popular: false,
      categoryId: categories[0].id,
      createdById: admin.id,
      totalLessons: 28,
      totalDuration: 1680,
    },
  });

  const course6 = await prisma.course.create({
    data: {
      title: 'English Communication & Grammar',
      slug: 'english-communication-grammar',
      description: 'Master English communication, grammar, writing skills, and literature. Suitable for Classes 9-12. Improve your spoken and written English dramatically.',
      shortDesc: 'English Grammar, Communication & Literature for Classes 9-12.',
      grade: '11',
      subject: 'English',
      price: 1499,
      salePrice: null,
      validity: null,
      status: 'PUBLISHED',
      featured: false,
      popular: false,
      categoryId: categories[2].id,
      createdById: admin.id,
      totalLessons: 20,
      totalDuration: 1200,
    },
  });

  const courses = [course1, course2, course3, course4, course5, course6];

  // Assign teachers to courses
  await prisma.courseTeacher.createMany({
    data: [
      { courseId: courses[0].id, teacherId: teacher1.id, isPrimary: true },
      { courseId: courses[1].id, teacherId: teacher2.id, isPrimary: true },
      { courseId: courses[2].id, teacherId: teacher3.id, isPrimary: true },
      { courseId: courses[3].id, teacherId: teacher2.id, isPrimary: true },
      { courseId: courses[4].id, teacherId: teacher1.id, isPrimary: true },
      { courseId: courses[5].id, teacherId: teacher1.id, isPrimary: false },
      { courseId: courses[5].id, teacherId: teacher2.id, isPrimary: true },
    ],
  });

  console.log('✅ Courses created');

  // ========================
  // CHAPTERS & LESSONS for Course 1
  // ========================
  const chapter1 = await prisma.chapter.create({
    data: { courseId: courses[0].id, title: 'Real Numbers', description: 'Euclids division lemma, fundamental theorem of arithmetic, irrational numbers', order: 1, isFree: true },
  });

  const topic1 = await prisma.topic.create({
    data: { chapterId: chapter1.id, title: "Euclid's Division Lemma", order: 1 },
  });

  await prisma.lesson.createMany({
    data: [
      { topicId: topic1.id, title: "Introduction to Real Numbers", type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoDuration: 1800, isFree: true, order: 1, isPublished: true },
      { topicId: topic1.id, title: "Euclid's Division Algorithm", type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoDuration: 2400, isFree: false, order: 2, isPublished: true },
      { topicId: topic1.id, title: "Practice Problems - Chapter 1", type: 'PDF', pdfUrl: '/uploads/sample-notes.pdf', isFree: false, order: 3, isPublished: true },
    ],
  });

  const chapter2 = await prisma.chapter.create({
    data: { courseId: courses[0].id, title: 'Polynomials', description: 'Zeros of polynomial, relationship between zeros and coefficients, division algorithm', order: 2 },
  });

  const topic2 = await prisma.topic.create({
    data: { chapterId: chapter2.id, title: 'Zeros of a Polynomial', order: 1 },
  });

  await prisma.lesson.createMany({
    data: [
      { topicId: topic2.id, title: "Understanding Polynomials", type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoDuration: 2100, isFree: false, order: 1, isPublished: true },
      { topicId: topic2.id, title: "Zeros and Coefficients", type: 'TEXT', content: '<h3>Relationship Between Zeros and Coefficients</h3><p>For a quadratic polynomial ax² + bx + c, if α and β are the zeros...</p>', isFree: false, order: 2, isPublished: true },
    ],
  });

  console.log('✅ Chapters and lessons created');

  // ========================
  // TESTS
  // ========================
  const test1 = await prisma.test.create({
    data: {
      courseId: courses[0].id,
      title: 'Chapter 1 - Real Numbers Test',
      description: 'Test your understanding of Real Numbers concepts',
      instructions: 'This test has 10 multiple choice questions. Each correct answer carries 2 marks. Negative marking: -0.5 for wrong answers.',
      duration: 30,
      totalMarks: 20,
      passingMarks: 10,
      negativeMarking: 0.5,
      maxAttempts: 3,
      randomQuestions: false,
      showResult: true,
      showAnswers: true,
      isPublished: true,
    },
  });

  const testQuestions = [
    { testId: test1.id, question: 'What is the HCF of 12 and 18?', questionType: 'MCQ' as const, options: ['2', '3', '6', '12'], correctAnswer: '6', marks: 2, order: 1, difficulty: 'EASY' as const },
    { testId: test1.id, question: 'Is √2 a rational number?', questionType: 'TRUE_FALSE' as const, options: ['True', 'False'], correctAnswer: 'False', marks: 2, order: 2, difficulty: 'EASY' as const },
    { testId: test1.id, question: 'The product of two irrational numbers is always irrational.', questionType: 'TRUE_FALSE' as const, options: ['True', 'False'], correctAnswer: 'False', marks: 2, order: 3, difficulty: 'MEDIUM' as const },
    { testId: test1.id, question: 'Which of the following is an irrational number?', questionType: 'MCQ' as const, options: ['√4', '√9', '√16', '√3'], correctAnswer: '√3', marks: 2, order: 4, difficulty: 'MEDIUM' as const },
    { testId: test1.id, question: 'What is the LCM of 12, 15, and 21?', questionType: 'MCQ' as const, options: ['180', '420', '210', '360'], correctAnswer: '420', marks: 2, order: 5, difficulty: 'HARD' as const },
  ];

  await prisma.testQuestion.createMany({ data: testQuestions });

  console.log('✅ Tests created');

  // ========================
  // ASSIGNMENTS
  // ========================
  await prisma.assignment.create({
    data: {
      courseId: courses[0].id,
      chapterId: chapter1.id,
      teacherId: teacher1.id,
      title: 'Real Numbers - Practice Assignment',
      description: 'Solve the following 5 problems on Euclids Division Lemma and the Fundamental Theorem of Arithmetic. Show all steps clearly.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalMarks: 50,
      isPublished: true,
    },
  });

  console.log('✅ Assignments created');

  // ========================
  // LIVE CLASSES
  // ========================
  await prisma.liveClass.create({
    data: {
      courseId: courses[0].id,
      chapterId: chapter1.id,
      teacherId: teacher1.id,
      title: 'Live Session - Real Numbers Doubt Clearing',
      description: 'Join Dr. Rajesh Kumar for an interactive doubt-clearing session on Real Numbers.',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      meetingUrl: 'https://meet.google.com/demo-class-123',
      status: 'SCHEDULED',
      maxStudents: 100,
    },
  });

  await prisma.liveClass.create({
    data: {
      courseId: courses[1].id,
      teacherId: teacher2.id,
      title: 'Physics - Newton\'s Laws of Motion',
      description: 'Comprehensive coverage of Newton\'s three laws with numerical problems.',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 120,
      meetingUrl: 'https://meet.google.com/demo-physics-456',
      status: 'SCHEDULED',
    },
  });

  console.log('✅ Live classes created');

  // ========================
  // COUPONS
  // ========================
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME20',
        type: 'PERCENTAGE',
        value: 20,
        minOrderAmount: 999,
        maxDiscount: 500,
        usageLimit: 1000,
        perUserLimit: 1,
        isActive: true,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FLAT500',
        type: 'FIXED',
        value: 500,
        minOrderAmount: 2000,
        usageLimit: 500,
        perUserLimit: 1,
        isActive: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FIRST50',
        type: 'PERCENTAGE',
        value: 50,
        maxDiscount: 1000,
        usageLimit: 100,
        perUserLimit: 1,
        isActive: true,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Coupons created');

  // ========================
  // ENROLLMENTS (Demo)
  // ========================
  await prisma.enrollment.createMany({
    data: [
      {
        userId: student1.id,
        courseId: courses[0].id,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        progress: 35,
      },
      {
        userId: student1.id,
        courseId: courses[3].id,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        progress: 10,
      },
      {
        userId: student2.id,
        courseId: courses[1].id,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        progress: 60,
      },
    ],
  });

  console.log('✅ Enrollments created');

  // ========================
  // ANNOUNCEMENTS
  // ========================
  await prisma.announcement.createMany({
    data: [
      {
        title: '🎉 New Batch Starting - Class 10 Mathematics',
        message: 'We are excited to announce a new batch for Class 10 Mathematics starting next Monday. Early bird discount of 20% available for the first 50 students!',
        priority: 'HIGH',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
      {
        title: 'Platform Maintenance - Sunday 2 AM to 4 AM',
        message: 'We will be performing scheduled maintenance on Sunday night from 2 AM to 4 AM. Live classes will not be affected.',
        priority: 'MEDIUM',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
      },
    ],
  });

  console.log('✅ Announcements created');

  // ========================
  // STUDY PLANS (for demo student)
  // ========================
  await prisma.studyPlan.createMany({
    data: [
      { userId: student1.id, subject: 'Mathematics', task: 'Complete Chapter 1 - Real Numbers exercises', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), startTime: '09:00', endTime: '11:00', priority: 'HIGH', status: 'PENDING' },
      { userId: student1.id, subject: 'Science', task: 'Watch recorded lecture on Chemical Reactions', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), startTime: '14:00', endTime: '15:30', priority: 'MEDIUM', status: 'PENDING' },
      { userId: student1.id, subject: 'Mathematics', task: 'Practice test - Chapter 2 Polynomials', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), startTime: '10:00', endTime: '12:00', priority: 'HIGH', status: 'PENDING' },
    ],
  });

  console.log('✅ Study plans created');

  // ========================
  // QUESTION BANK
  // ========================
  await prisma.questionBank.createMany({
    data: [
      { subject: 'Mathematics', courseId: courses[0].id, question: 'Find the HCF of 24 and 36 using Euclids division algorithm.', questionType: 'LONG_ANSWER', difficulty: 'MEDIUM', marks: 5, isActive: true, createdById: admin.id },
      { subject: 'Mathematics', courseId: courses[0].id, question: 'Prove that 3 + 2√5 is irrational.', questionType: 'LONG_ANSWER', difficulty: 'HARD', marks: 5, isActive: true, createdById: admin.id },
      { subject: 'Physics', courseId: courses[1].id, question: 'State and explain Newton\'s Second Law of Motion.', questionType: 'LONG_ANSWER', difficulty: 'MEDIUM', marks: 5, isActive: true, createdById: admin.id },
      { subject: 'Mathematics', courseId: courses[0].id, question: 'Which of the following is NOT a rational number?', questionType: 'MCQ', options: ['3/4', '√16', '√3', '0.333...'], correctAnswer: '√3', explanation: '√3 is irrational as 3 is not a perfect square.', difficulty: 'EASY', marks: 1, isActive: true, createdById: admin.id },
    ],
  });

  console.log('✅ Question bank created');

  // ========================
  // DOUBTS (Demo)
  // ========================
  await prisma.doubt.create({
    data: {
      courseId: courses[0].id,
      chapterId: chapter1.id,
      studentId: student1.id,
      teacherId: teacher1.id,
      title: 'Question about Euclids Division Lemma',
      question: 'I am confused about when to apply Euclids Division Lemma vs the direct formula for HCF. Can you explain with an example?',
      answer: 'Great question! Euclids Division Lemma (a = bq + r) is used when you want to find HCF step-by-step through repeated division. Use it for larger numbers or proofs. For small numbers, you can directly find HCF by listing factors. Example: HCF(48, 18): 48 = 18×2 + 12, 18 = 12×1 + 6, 12 = 6×2 + 0. So HCF = 6.',
      status: 'ANSWERED',
    },
  });

  await prisma.doubt.create({
    data: {
      courseId: courses[0].id,
      studentId: student2.id,
      title: 'Polynomial zeros confusion',
      question: 'How do I find the zeros of a polynomial ax² + bx + c when the discriminant is negative?',
      status: 'PENDING',
    },
  });

  console.log('✅ Doubts created');

  // ========================
  // REVIEWS
  // ========================
  await prisma.review.createMany({
    data: [
      { userId: student1.id, courseId: courses[0].id, rating: 5, comment: 'Excellent course! Dr. Rajesh explains everything very clearly. The live sessions are very interactive.', isApproved: true },
      { userId: student2.id, courseId: courses[1].id, rating: 5, comment: 'Best Physics course online! Ms. Priti makes even the toughest concepts easy to understand.', isApproved: true },
    ],
  });

  console.log('✅ Reviews created');

  // ========================
  // PAGES (System pages)
  // ========================
  const pages = [
    { title: 'About Us', slug: 'about', status: 'PUBLISHED' as const, isSystem: false },
    { title: 'Contact Us', slug: 'contact', status: 'PUBLISHED' as const, isSystem: false },
    { title: 'Terms & Conditions', slug: 'terms', status: 'PUBLISHED' as const, isSystem: true },
    { title: 'Privacy Policy', slug: 'privacy', status: 'PUBLISHED' as const, isSystem: true },
    { title: 'Refund Policy', slug: 'refund-policy', status: 'PUBLISHED' as const, isSystem: true },
  ];

  for (const p of pages) {
    await prisma.page.create({ data: p });
  }

  console.log('✅ Pages created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin:   admin@edupro.com / Admin@123');
  console.log('   Teacher: teacher@edupro.com / Teacher@123');
  console.log('   Student: student@edupro.com / Student@123');
  console.log('   Parent:  parent@edupro.com / Parent@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
