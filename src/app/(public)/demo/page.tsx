'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Users,
  MessageCircle,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function DemoPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('Full Stack Web Development');
  const [grade, setGrade] = useState('College / Graduate');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: 'Demo Class Booked! 🎉',
        description: 'Our counsellor will call you shortly to confirm your preferred time slot.',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="section-container max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 text-xs font-semibold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 100% Free • No Payment Required
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-foreground tracking-tight leading-tight">
            Book Your Free 1-on-1 Live Class Demo
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Experience our interactive live video classrooms, digital smartboards, and personalized doubt resolution before making any payment.
          </p>
        </div>

        {/* Main Grid: Video Preview & Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sample Video & Features */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Video Showcase */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border shadow-xl flex items-center justify-center group">
              <iframe
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                title="CyberMate Solutions Demo Class"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* What you will experience */}
            <div className="card p-6 space-y-4">
              <h3 className="font-heading font-bold text-lg text-foreground">
                What You Get in the Free Demo Session:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">45-Minute Live Interactive Class</p>
                    <p className="text-xs text-muted-foreground">Taught live by a senior mentor</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Full HD Recorded Copy</p>
                    <p className="text-xs text-muted-foreground">Lifetime revision access</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Free Study Notes & Cheatsheet</p>
                    <p className="text-xs text-muted-foreground">Google Drive downloadable PDFs</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Personal Career Counselling</p>
                    <p className="text-xs text-muted-foreground">Custom study plan for your goal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Demo Form */}
          <div className="lg:col-span-5">
            <div className="card p-6 sm:p-8 bg-card shadow-xl border-2 border-brand-500/20 space-y-6">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-foreground">
                    Demo Slot Reserved!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Thank you <b>{name}</b>! Our academic coordinator will call you at <b>{phone}</b> within 15 minutes to confirm your scheduled time slot.
                  </p>
                  <div className="pt-4 space-y-2">
                    <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold" asChild>
                      <a href={`https://wa.me/919934215013?text=Hi%2C%20I%20have%20booked%20a%20free%20demo%20for%20${encodeURIComponent(course)}.%20My%20name%20is%20${encodeURIComponent(name)}.`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp Now
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="w-full text-xs">
                      Book Another Slot
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      Book Your Free Demo
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Fill this form to schedule your demo with our mentors.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Student Name *</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Phone Number (WhatsApp) *</label>
                    <Input
                      type="tel"
                      placeholder="e.g. 9934215013"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Select Course / Topic</label>
                    <select
                      className="form-input text-sm w-full"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    >
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Python Programming Mastery">Python Programming Mastery</option>
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Digital Marketing & SEO">Digital Marketing & SEO</option>
                      <option value="School & College Tuition">School & College Academics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Target / Standard</label>
                    <select
                      className="form-input text-sm w-full"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      <option value="Class 9-10">Class 9-10</option>
                      <option value="Class 11-12">Class 11-12</option>
                      <option value="College / Graduate">College / Graduate</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>

                  <Button type="submit" variant="gradient" size="lg" className="w-full font-bold shadow-lg" loading={loading}>
                    Book Free Demo Class <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    No credit card or payment needed. Instant confirmation.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
