'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Mail, Phone, MapPin, Clock, MessageSquare,
  Send, CheckCircle2, Headphones, HelpCircle, Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    grade: 'Class 10',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast({
        title: 'Incomplete Form',
        description: 'Please complete all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    // Simulate inquiry submission
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);

    toast({
      title: 'Inquiry Sent! 🚀',
      description: 'Our academic counselors will get back to you within 4 hours.',
    });
  };

  return (
    <PublicLayout>
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="section-container">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900">
              We're Here to Help You Succeed
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Have questions about batch timings, syllabus, fees, or scholarship tests? Speak directly with our academic mentors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">
            
            {/* Left Col: Contact Information */}
            <div className="space-y-6 lg:col-span-1">
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b">
                  Contact Information
                </h2>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Call Us Toll-Free</p>
                      <p className="text-base font-bold text-slate-900">+91 98765 43210</p>
                      <p className="text-xs text-slate-500">Mon-Sat, 9:00 AM - 8:00 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">WhatsApp Support</p>
                      <p className="text-base font-bold text-slate-900">+91 98765 43211</p>
                      <p className="text-xs text-slate-500">Fast replies within 15 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Email Inquiries</p>
                      <p className="text-base font-bold text-slate-900">support@cybermatesolutions.com</p>
                      <p className="text-xs text-slate-500">admissions@cybermatesolutions.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Headquarters</p>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        CyberMate Solutions Knowledge Park, Sector 62, Noida, NCR Delhi 201301
                      </p>
                    </div>
                  </div>
                </div>
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
              <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm">
                
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-slate-900">
                      Thank You for Reaching Out!
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto text-sm">
                      We have received your message. One of our senior academic counselors will call you shortly at <span className="font-semibold text-slate-800">{form.phone}</span>.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-slate-900">
                      Send Us a Message
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Student / Parent Name *</label>
                        <Input
                          required
                          placeholder="e.g. Priya Sharma"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Email Address *</label>
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
                        <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                        <Input
                          required
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Target Grade / Standard</label>
                        <select
                          className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
                          value={form.grade}
                          onChange={e => setForm({ ...form, grade: e.target.value })}
                        >
                          <option>Class 6 - 8 Foundation</option>
                          <option>Class 9</option>
                          <option>Class 10 Board</option>
                          <option>Class 11 Science</option>
                          <option>Class 12 Board</option>
                          <option>JEE Main & Advanced</option>
                          <option>NEET Medical</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">How can we help you? *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the subjects you are looking to master, your preferred batch timings, or any questions you have..."
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
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
