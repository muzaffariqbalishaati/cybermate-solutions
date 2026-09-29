import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, BookOpen, Award, CheckCircle2, Sparkles, Radio } from 'lucide-react';

interface HeroSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
}

export function HeroSection({ section }: HeroSectionProps) {
  if (section && !section.isVisible) return null;

  const content = (section?.content as Record<string, string>) || {};

  const headline = content.headline || 'Learn from India\'s Best Teachers';
  const subheadline = content.subheadline || 'Premium live classes, recorded lectures, chapter tests & 24/7 doubt resolution — all in one platform';
  const ctaText = content.cta_text || 'Explore Courses';
  const ctaUrl = content.cta_url || '/courses';
  const demoCta = content.demo_cta || 'Watch Free Demo';
  const demoUrl = content.demo_url || '/demo';
  const bgImage = content.bg_image;
  const highlightText = content.highlight_text || 'Trusted by 50,000+ Students & Parents';

  return (
    <section
      className="relative min-h-[82vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-slate-950"
      style={{
        background: bgImage
          ? `url(${bgImage}) center/cover no-repeat`
          : 'radial-gradient(circle at 20% 20%, hsl(220 70% 16%) 0%, hsl(240 55% 10%) 50%, hsl(260 50% 6%) 100%)',
      }}
    >
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="section-container relative z-10 py-10 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-brand-200 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold tracking-wide text-white">{highlightText}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white leading-[1.15] sm:leading-[1.1] tracking-tight">
              {headline.includes('Best') ? (
                <>
                  {headline.split('Best')[0]}
                  <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-purple-300 bg-clip-text text-transparent underline decoration-brand-400/40 decoration-wavy decoration-2">
                    Best Teachers
                  </span>
                  {headline.split('Best')[1]?.replace('Teachers', '')}
                </>
              ) : (
                headline
              )}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <Button size="xl" variant="gradient" asChild className="group shadow-xl shadow-brand-500/25 px-8 w-full sm:w-auto justify-center text-center app-tap">
                <Link href={ctaUrl}>
                  {ctaText}
                  <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-white/30 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm group px-6 w-full sm:w-auto justify-center text-center app-tap">
                <Link href={demoUrl}>
                  <Play className="h-4 w-4 mr-1 text-brand-300 fill-brand-300 group-hover:scale-110 transition-transform" />
                  {demoCta}
                </Link>
              </Button>
            </div>

            {/* Social Proof Avatars */}
            <div className="flex items-center gap-4 pt-3">
              <div className="flex -space-x-3 overflow-hidden">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
                ].map((avatar, idx) => (
                  <div key={idx} className="relative inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 overflow-hidden">
                    <Image src={avatar} alt="Student" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                  <span className="font-bold text-white ml-1">4.9/5</span>
                </div>
                <p className="text-xs text-slate-400">from 12,000+ verified student & parent reviews</p>
              </div>
            </div>

            {/* Key Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
              {[
                { icon: Users, value: '50,000+', label: 'Students Taught' },
                { icon: BookOpen, value: '200+', label: 'Live & Video Courses' },
                { icon: Award, value: '98.6%', label: 'Board Pass Rate' },
                { icon: Sparkles, value: '24/7', label: 'Doubt Assistance' },
              ].map(stat => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex items-center gap-2 text-brand-300">
                    <stat.icon className="h-4 w-4" />
                    <span className="text-xl font-bold font-heading text-white">{stat.value}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - EdTech Live Class Glass Card & Badges */}
          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Top Floating Badge */}
            <div className="absolute -top-6 -left-6 z-20 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/20 p-3.5 shadow-2xl flex items-center gap-3 animate-bounce [animation-duration:4s]">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">CBSE 2025 Result</div>
                <div className="text-base font-bold text-white">99.4% Highest Score</div>
              </div>
            </div>

            {/* Main Interactive Live Class Card */}
            <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/20 p-6 shadow-2xl overflow-hidden group hover:border-brand-400/40 transition-all duration-500">
              {/* Glow overlay */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-brand-500/20 rounded-full blur-2xl group-hover:bg-brand-500/30 transition-all" />

              {/* Card Header with Live Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <Radio className="h-3.5 w-3.5" /> LIVE CLASS NOW
                  </span>
                </div>
                <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Class 10 Physics
                </span>
              </div>

              {/* Class Video / Visual Mockup */}
              <div className="relative mt-4 aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                  alt="Live Class"
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Audio waves visualizer */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <div className="flex items-end gap-1 h-5">
                    {[16, 24, 12, 20, 28, 14, 22].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-brand-400 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                    <span className="ml-2 font-medium text-slate-300 text-[11px]">Teacher speaking...</span>
                  </div>
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-400">
                    ● 1,248 attending
                  </span>
                </div>
              </div>

              {/* Class Title & Details */}
              <div className="mt-4 space-y-2">
                <h3 className="font-heading font-bold text-lg text-white leading-snug">
                  Magnetic Effects of Electric Current & Solenoids
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  Topic 4.3: Right-Hand Thumb Rule & Force on a Current Carrying Conductor
                </p>
              </div>

              {/* Teacher Info */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-brand-400/50">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Dr. Rajesh Sharma"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1">
                      Dr. Rajesh Sharma <CheckCircle2 className="h-3.5 w-3.5 text-brand-400 fill-brand-400" />
                    </div>
                    <div className="text-xs text-slate-400">Ex-IIT Roorkee • 16 Yrs Exp</div>
                  </div>
                </div>
                <Button size="sm" variant="gradient" asChild className="text-xs">
                  <Link href="/courses">Join Now</Link>
                </Button>
              </div>
            </div>

            {/* Bottom Floating Badge */}
            <div className="absolute -bottom-6 -right-6 z-20 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/20 p-3.5 shadow-2xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Instant Doubt Help</div>
                <div className="text-base font-bold text-white">Solved in &lt; 60 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom curve transition */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-8 sm:h-12" fill="hsl(var(--background))">
          <path d="M0,60 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,60 Z" />
        </svg>
      </div>
    </section>
  );
}

