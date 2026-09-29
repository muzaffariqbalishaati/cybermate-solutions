// High quality mock data for public demo and fallback when DB is not yet seeded

export interface MockCourse {
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
  category: { name: string; slug?: string } | null;
  teachers: Array<{
    teacher: { name: string; avatar: string | null };
    isPrimary: boolean;
  }>;
  _count: { enrollments: number };
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  description: string | null;
}

export interface MockTeacher {
  id: string;
  name: string;
  avatar: string | null;
  teacher: {
    specialization: string | null;
    experience: number | null;
    bio: string | null;
  } | null;
}

export interface MockTestimonial {
  id: string;
  name: string;
  avatar: string | null;
  designation: string | null;
  content: string;
  rating: number;
}

export interface MockFAQ {
  id: string;
  question: string;
  answer: string;
}

export const fallbackCategories: MockCategory[] = [
  {
    id: 'cat-1',
    name: 'Class 9 & 10 CBSE',
    slug: 'class-9-10-cbse',
    icon: '📐',
    color: 'from-blue-500/10 to-indigo-500/10',
    description: 'Complete syllabus with NCERT exemplar & board pyqs',
  },
  {
    id: 'cat-2',
    name: 'Class 11 & 12 Science',
    slug: 'class-11-12-science',
    icon: '🔬',
    color: 'from-purple-500/10 to-pink-500/10',
    description: 'Physics, Chemistry, Maths & Biology for board toppers',
  },
  {
    id: 'cat-3',
    name: 'IIT-JEE Preparation',
    slug: 'iit-jee',
    icon: '🚀',
    color: 'from-amber-500/10 to-orange-500/10',
    description: 'Mains & Advanced conceptual mastery & problem drills',
  },
  {
    id: 'cat-4',
    name: 'NEET Medical',
    slug: 'neet-medical',
    icon: '🩺',
    color: 'from-emerald-500/10 to-teal-500/10',
    description: 'NCERT line-by-line decoding and 5,000+ MCQ question bank',
  },
  {
    id: 'cat-5',
    name: 'ICSE & ISC Board',
    slug: 'icse-isc',
    icon: '📚',
    color: 'from-rose-500/10 to-red-500/10',
    description: 'In-depth literature, sciences, and council question bank',
  },
  {
    id: 'cat-6',
    name: 'Junior Champions (6-8)',
    slug: 'junior-champions',
    icon: '🌟',
    color: 'from-violet-500/10 to-purple-500/10',
    description: 'Strong mathematical & scientific foundation for young minds',
  },
  {
    id: 'cat-7',
    name: 'English & Soft Skills',
    slug: 'english-soft-skills',
    icon: '🗣️',
    color: 'from-sky-500/10 to-cyan-500/10',
    description: 'Grammar, creative writing, debating & interview polish',
  },
  {
    id: 'cat-8',
    name: '1-on-1 Personalized Tuition',
    slug: '1-on-1-tuition',
    icon: '🎯',
    color: 'from-fuchsia-500/10 to-pink-500/10',
    description: 'Custom learning pace with personal dedicated mentor',
  },
];

export const fallbackCourses: MockCourse[] = [
  {
    id: 'course-1',
    title: 'Class 10 CBSE Board Excellence: Complete Science & Maths 2026',
    slug: 'class-10-cbse-board-excellence',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Master Physics, Chemistry, Biology and Class 10 Mathematics with animated explanations, NCERT line-by-line and 10-year solved papers.',
    price: 6999,
    salePrice: 3499,
    subject: 'Science & Mathematics',
    grade: '10',
    totalLessons: 142,
    totalDuration: 2800,
    category: { name: 'Class 9 & 10 CBSE', slug: 'class-9-10-cbse' },
    teachers: [
      {
        teacher: {
          name: 'Dr. Rajesh Sharma',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        },
        isPrimary: true,
      },
    ],
    _count: { enrollments: 4890 },
  },
  {
    id: 'course-2',
    title: 'Class 12 Physics Masterclass: Board 95+ & JEE/NEET Foundations',
    slug: 'class-12-physics-masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Comprehensive coverage of Electrostatics, Magnetism, Optics, and Modern Physics with numerical problem solving shortcuts.',
    price: 7999,
    salePrice: 3999,
    subject: 'Physics',
    grade: '12',
    totalLessons: 128,
    totalDuration: 3400,
    category: { name: 'Class 11 & 12 Science', slug: 'class-11-12-science' },
    teachers: [
      {
        teacher: {
          name: 'Priya Venkataraman',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
        },
        isPrimary: true,
      },
    ],
    _count: { enrollments: 3620 },
  },
  {
    id: 'course-3',
    title: 'NEET 2026 Biology Booster: 360/360 Target Course',
    slug: 'neet-2026-biology-booster',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Every single line of NCERT Botany and Zoology broken down with mind-maps, assertion-reason practice and 5,000+ chapter test series.',
    price: 8999,
    salePrice: 4499,
    subject: 'Biology',
    grade: '11 & 12',
    totalLessons: 165,
    totalDuration: 4200,
    category: { name: 'NEET Medical', slug: 'neet-medical' },
    teachers: [
      {
        teacher: {
          name: 'Dr. Ananya Mukherjee',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        },
        isPrimary: true,
      },
    ],
    _count: { enrollments: 6410 },
  },
  {
    id: 'course-4',
    title: 'IIT-JEE Mathematics Rank Accelerator: Algebra & Calculus',
    slug: 'iit-jee-maths-rank-accelerator',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'From standard fundamentals to JEE Advanced multi-concept brainteasers. Includes 40 full-length mock tests with video solutions.',
    price: 9999,
    salePrice: 4999,
    subject: 'Mathematics',
    grade: '11 & 12',
    totalLessons: 190,
    totalDuration: 5100,
    category: { name: 'IIT-JEE Preparation', slug: 'iit-jee' },
    teachers: [
      {
        teacher: {
          name: 'Vikramaditya Rathore',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        },
        isPrimary: true,
      },
    ],
    _count: { enrollments: 5180 },
  },
  {
    id: 'course-5',
    title: 'Class 9 Science & Mathematics: Strong Foundation Batch',
    slug: 'class-9-foundation-batch',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Build rock-solid clarity in Motion, Force, Matter, Atoms, Geometry and Polynomials. The perfect bridge to Class 10 success.',
    price: 5999,
    salePrice: 2999,
    subject: 'Science & Maths',
    grade: '9',
    totalLessons: 110,
    totalDuration: 2400,
    category: { name: 'Class 9 & 10 CBSE', slug: 'class-9-10-cbse' },
    teachers: [
      {
        teacher: {
          name: 'Shweta Kulkarni',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        },
        isPrimary: true,
      },
    ],
    _count: { enrollments: 3120 },
  },
  {
    id: 'course-6',
    title: 'Organic Chemistry Decoded: Mechanisms, Reactions & Name Tests',
    slug: 'organic-chemistry-decoded',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    shortDesc: 'Eliminate all fear of reaction mechanisms with visual flowcharts, 3D molecular pathways and instant shortcut cheat-sheets.',
    price: 4999,
    salePrice: 2499,
    subject: 'Chemistry',
    grade: '11 & 12',
    totalLessons: 95,
    totalDuration: 2100,
    category: { name: 'Class 11 & 12 Science', slug: 'class-11-12-science' },
    teachers: [
      {
        teacher: {
          name: 'Amitava Sen',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        },
        isPrimary: true,
      },
    ],
    _count: { enrollments: 4230 },
  },
];

export const fallbackTeachers: MockTeacher[] = [
  {
    id: 'teacher-1',
    name: 'Dr. Rajesh Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    teacher: {
      specialization: 'Senior Physics Expert (IIT Roorkee Alum)',
      experience: 16,
      bio: 'Mentored over 15,000 students with 400+ selections in top IITs and AIIMS. Renowned for intuitive visual physics teaching.',
    },
  },
  {
    id: 'teacher-2',
    name: 'Priya Venkataraman',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    teacher: {
      specialization: 'Mathematics Head (Ex-DPS Senior Faculty)',
      experience: 14,
      bio: 'Known for demystifying Calculus and Coordinate Geometry with simple step-by-step logic. 100/100 board mentor.',
    },
  },
  {
    id: 'teacher-3',
    name: 'Dr. Ananya Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    teacher: {
      specialization: 'NEET Botany & Zoology Specialist',
      experience: 12,
      bio: 'Gold medalist in Life Sciences. Pioneer of memory-palace techniques for memorizing NCERT biology classifications effortlessly.',
    },
  },
  {
    id: 'teacher-4',
    name: 'Vikramaditya Rathore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    teacher: {
      specialization: 'Physical & Inorganic Chemistry Master',
      experience: 11,
      bio: 'Former senior faculty at Kota’s top institute. Expert in reaction kinetics, thermodynamics, and coordination compounds.',
    },
  },
  {
    id: 'teacher-5',
    name: 'Shweta Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    teacher: {
      specialization: 'Class 9 & 10 Science & Olympiad Lead',
      experience: 9,
      bio: 'Passionate educator focused on building curiosity and experimental intuition. National Science Olympiad trainer.',
    },
  },
  {
    id: 'teacher-6',
    name: 'Amitava Sen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    teacher: {
      specialization: 'Organic Chemistry & Problem Analysis',
      experience: 10,
      bio: 'Simplifies complex organic reaction mechanisms with easy-to-remember patterns and real-life analogies.',
    },
  },
];

export const fallbackTestimonials: MockTestimonial[] = [
  {
    id: 'test-1',
    name: 'Aarav Patel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    designation: 'Class 12 Topper (Scored 98.2% CBSE)',
    content: 'CyberMate Solutions completely changed my preparation. Dr. Rajesh sir made rotational motion and electromagnetism feel effortless. The mock tests were identical to the actual board exam format!',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Sneha Reddy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    designation: 'NEET 2025 Qualifier (AIR 1,420)',
    content: 'The 24/7 doubt resolution forum was a lifesaver. Whenever I got stuck at midnight, an expert answered within minutes. Dr. Ananya’s biology mind-maps are golden.',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Rajesh & Sunita Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    designation: 'Parents of Rohan (Class 10)',
    content: 'As working parents, we loved the Parent Portal! We could check his live attendance, test score percentiles, and homework completion every Sunday without nagging him.',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Divya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    designation: 'Class 10 CBSE (Scored 99/100 in Maths)',
    content: 'I used to get panic attacks before Math exams. Priya ma’am gave us custom shortcuts and chapter summaries that made everything click. I never thought I would score 99!',
    rating: 5,
  },
  {
    id: 'test-5',
    name: 'Kavya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    designation: 'Class 11 Science Student',
    content: 'The quality of teachers here is way better than the offline tuition centers in my city, at less than half the fee. High definition live classes and interactive quizzes keep us glued.',
    rating: 5,
  },
  {
    id: 'test-6',
    name: 'Manish Chawla',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    designation: 'Class 12 ISC Board (96.4%)',
    content: 'The study planner and chapter-wise test analytics showed me exactly which subtopics I was weak at. It saved me hundreds of hours of directionless study.',
    rating: 5,
  },
];

export const fallbackFAQs: MockFAQ[] = [
  {
    id: 'faq-1',
    question: 'How do live online classes work on CyberMate Solutions?',
    answer: 'Classes are streamed live in high-definition with two-way audio, interactive whiteboard presentations, live polls, and instant doubt-clearing. You can attend on any laptop, tablet, or smartphone.',
  },
  {
    id: 'faq-2',
    question: 'What if I miss a scheduled live class?',
    answer: 'Don’t worry! Every live lecture is automatically recorded and uploaded to your student portal within 30 minutes in full HD. You can watch and rewatch unlimited times with adjustable speeds.',
  },
  {
    id: 'faq-3',
    question: 'How are doubts solved outside class hours?',
    answer: 'CyberMate Solutions features a 24/7 dedicated Doubt Forum. Simply snap a photo of your problem or type your query, and our subject experts provide verified step-by-step solutions, often with audio explanations.',
  },
  {
    id: 'faq-4',
    question: 'How do parents monitor their child’s progress?',
    answer: 'Parents get dedicated access to the Parent Portal. You receive automatic weekly WhatsApp/SMS summaries of class attendance, test scores, homework submissions, and teacher feedback notes.',
  },
  {
    id: 'faq-5',
    question: 'Are study notes and test series included in the fee?',
    answer: 'Yes! Every course includes comprehensive chapter-wise PDF theory notes, mind maps, formula sheets, NCERT solutions, and access to all weekly and monthly mock test series at no extra cost.',
  },
  {
    id: 'faq-6',
    question: 'Is there a free demo or trial class available?',
    answer: 'Absolutely! You can watch free demo lectures for every course before enrolling, or attend our upcoming free live orientation masterclass with our senior faculty.',
  },
];
