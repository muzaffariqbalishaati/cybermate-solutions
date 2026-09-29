import { PublicLayout } from '@/components/layouts/public-layout';
import Link from 'next/link';
import {
  Award, Users, BookOpen, GraduationCap, CheckCircle2,
  Sparkles, Target, Compass, HeartHandshake, ShieldCheck,
  TrendingUp, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | CyberMate Solutions',
  description: "Learn about CyberMate Solutions' mission, expert faculty, and proven methodology for academic excellence.",
};

export const revalidate = 60;

const stats = [
  { value: '50,000+', label: 'Active Students', icon: Users },
  { value: '98.4%', label: 'Board Exam Pass Rate', icon: TrendingUp },
  { value: '120+', label: 'IITian & Doctor Mentors', icon: GraduationCap },
  { value: '4.9 ★', label: 'Average Student Rating', icon: Award },
];

const values = [
  {
    title: 'Concept-First Pedagogy',
    desc: 'We replace rote memorization with intuitive conceptual clarity, real-world analogies, and interactive visualizations.',
    icon: Sparkles,
  },
  {
    title: 'Personalized 1-on-1 Mentorship',
    desc: 'Every student learns differently. Our dedicated doubt-solvers ensure no question goes unanswered for more than 2 hours.',
    icon: Target,
  },
  {
    title: 'Accessible & Affordable Excellence',
    desc: 'World-class tuition that rival top metropolitan coaching institutes, delivered at a fraction of the cost directly to your home.',
    icon: HeartHandshake,
  },
  {
    title: 'Parent Partnership & Transparency',
    desc: 'Real-time attendance logs, automated weekly performance analytics, and regular parent-teacher virtual interactions.',
    icon: ShieldCheck,
  },
];

const faculty = [
  {
    name: 'Dr. Rajesh Verma',
    role: 'Head of Physics & Engineering Sciences',
    exp: 'Ex-IIT Roorkee, 15+ Yrs Exp',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Mentored over 35 AIR top 100 rankers in JEE Advanced and CBSE 12th board toppers.',
  },
  {
    name: 'Dr. Ananya Sen',
    role: 'Lead Faculty - Biology & NEET Medical',
    exp: 'AIIMS Gold Medalist, 12+ Yrs Exp',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    bio: 'Specialist in human physiology and genetics with high-yield memory retention techniques.',
  },
  {
    name: 'Prof. Vikram Malhotra',
    role: 'Senior Faculty - Mathematics',
    exp: 'ISI Kolkata Alum, 18+ Yrs Exp',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Author of bestselling calculus and coordinate geometry guides for board and competitive exams.',
  },
  {
    name: 'Meenakshi Iyer',
    role: 'Senior Faculty - Chemistry & Sciences',
    exp: 'M.Sc. Delhi University, 10+ Yrs Exp',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'Specialist in organic reaction mechanisms and board examination question pattern analysis.',
  },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 to-purple-900/30 backdrop-blur-3xl" />
        <div className="section-container relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" />
            Transforming Online Education
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
            Empowering Every Student to Reach Their Peak Potential
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            CyberMate Solutions is India's leading interactive tuition ecosystem. We combine India’s top educators, live interactive pedagogy, and adaptive testing to deliver consistent top ranks.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/courses">
              <Button className="py-6 px-8 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg">
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="py-6 px-8 text-base font-bold border-white/20 text-white hover:bg-white/10">
                Contact Admissions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission & Story */}
      <section className="py-20 bg-slate-50">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Our Mission & Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 leading-snug">
                Democratizing Quality Mentorship for Classes 6 to 12 & Competitive Exams
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Founded by educators from premier institutions, CyberMate Solutions was born out of a simple observation: geographic distance and exorbitant coaching fees shouldn't dictate a child's academic destiny.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We engineered a platform where live two-way audio/video sessions, instantaneous doubt clearing, and continuous performance tracking give every student the same unfair advantage that previously only elite coaching hubs provided.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  'Daily interactive live lectures with instant poll questions',
                  'Dedicated subject mentors resolving doubts 7 days a week',
                  'Comprehensive printed and digital study materials',
                  'AI-powered performance analytics for focused weakness improvement',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Students studying collaboratively"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden sm:block">
                <p className="text-3xl font-heading font-bold text-brand-600">98.4%</p>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  of our enrolled students scored 90%+ in their 2025 Board Exams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
              The Pillars of the CyberMate Solutions Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Showcase */}
      <section className="py-20 bg-slate-50">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              World-Class Educators
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
              Learn from India's Finest Academic Minds
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Our teachers are IITians, doctors, PhDs, and seasoned educators with decades of classroom experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-4 pb-6">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg">{t.name}</h3>
                  <p className="text-xs font-semibold text-brand-600">{t.role}</p>
                  <p className="text-xs text-slate-400">{t.exp}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t">
                    {t.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
