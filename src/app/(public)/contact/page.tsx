'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mail, Phone, MapPin, MessageSquare,
  Send, CheckCircle2, Headphones, Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    grade: 'Class 10 Board',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Submission Failed',
          description: data.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setSubmitted(true);
      toast({
        title: 'Inquiry Sent! 🚀',
        description: 'Our academic counselors will get back to you within 4 hours.',
      });
    } catch {
      toast({
        title: 'Network Error',
        description: 'Unable to send your message. Please call us directly at +91 9934215013.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 min-h-screen py-16">
        <div className="section-container">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full dark:bg-brand-950/40 dark:border-brand-800 dark:text-brand-400">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white">
              We're Here to Help You Succeed
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Have questions about batch timings, syllabus, fees, or scholarship tests? Speak directly with our academic mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start max-w-6xl mx-auto">

            {/* Left Col: Contact Information */}
            <div className="space-y-6 lg:col-span-1">

              <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-700">
                  Contact Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Call Us</p>
                      <a href="tel:+919934215013" className="text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 transition-colors">+91 9934215013</a>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mon–Sat, 9:00 AM – 8:00 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">WhatsApp Support</p>
                      <a href="https://wa.me/919934215013" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors">+91 9934215013</a>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Fast replies within 15 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Email</p>
                      <a href="mailto:muzaffariqbalishaati@gmail.com" className="text-sm font-bold text-slate-900 dark:text-white hover:text-purple-600 transition-colors">muzaffariqbalishaati@gmail.com</a>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">support@cybermatesolutions.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Headquarters</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                        CyberMate Solutions Knowledge Park,<br />Sector 62, Noida, NCR Delhi 201301
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+919934215013"
                  className="flex flex-col items-center gap-1.5 p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-md shadow-brand-500/20 transition-colors app-tap"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-xs font-bold">Call Now</span>
                </a>
                <a
                  href="https://wa.me/919934215013?text=Hi, I have a query about CyberMate Solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-500/20 transition-colors app-tap"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs font-bold">WhatsApp</span>
                </a>
              </div>

              {/* Student Helpdesk banner */}
              <div className="bg-gradient-to-br from-brand-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-brand-200 text-xs font-semibold uppercase tracking-wider">
                  <Headphones className="w-4 h-4" />
                  Live Student Helpdesk
                </div>
                <h3 className="text-lg font-bold">Already enrolled with us?</h3>
                <p className="text-xs text-brand-100 leading-relaxed">
                  Log in to your student dashboard to submit instant doubts directly to your dedicated subject teachers.
                </p>
              </div>

            </div>

            {/* Right 2 Cols: Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">

                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
                      Thank You for Reaching Out!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm">
                      We have received your message. One of our senior academic counselors will call you shortly at{' '}
                      <span className="font-semibold text-slate-800 dark:text-white">{form.phone}</span>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <Button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ name: '', email: '', phone: '', grade: 'Class 10 Board', subject: 'General Inquiry', message: '' });
                        }}
                        variant="outline"
                      >
                        Send Another Message
                      </Button>
                      <a
                        href="https://wa.me/919934215013"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
                      Send Us a Message
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student / Parent Name *</label>
                        <Input
                          required
                          placeholder="e.g. Priya Sharma"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                        <Input
                          type="email"
                          required
                          placeholder="priya@example.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number *</label>
                        <Input
                          required
                          placeholder="+91 9934215013"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Grade / Standard</label>
                        <select
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          value={form.grade}
                          onChange={e => setForm({ ...form, grade: e.target.value })}
                        >
                          <option>Class 6 – 8 Foundation</option>
                          <option>Class 9</option>
                          <option>Class 10 Board</option>
                          <option>Class 11 Science</option>
                          <option>Class 12 Board</option>
                          <option>JEE Main &amp; Advanced</option>
                          <option>NEET Medical</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Type of Inquiry</label>
                      <select
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                      >
                        <option>General Inquiry</option>
                        <option>Admission &amp; Enrollment</option>
                        <option>Course Fees &amp; Scholarship</option>
                        <option>Batch Timings</option>
                        <option>Technical Support</option>
                        <option>Refund Request</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">How can we help you? *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the subjects you are looking to master, your preferred batch timings, or any questions you have..."
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 gap-2"
                      id="contact-submit-btn"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-slate-400 text-center">
                      By submitting this form, you agree to be contacted by our team regarding your inquiry.
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
