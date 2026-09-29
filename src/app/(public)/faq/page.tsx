'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageCircle,
  Phone,
  Mail,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { fallbackFAQs } from '@/lib/mock-data';

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', 'Admissions', 'Live Classes', 'Payments', 'Certificates'];

  const allFaqs = [
    {
      category: 'Admissions',
      question: 'How do I enroll in a course on CyberMate Solutions?',
      answer:
        'Enrolling is simple: browse our courses catalog, select the course that aligns with your learning goals, click "Enroll Now" or "Buy Now", complete the secure checkout via Razorpay, and access your dashboard immediately with all study materials and upcoming live sessions.',
    },
    {
      category: 'Admissions',
      question: 'Can I take a free demo class before paying?',
      answer:
        'Yes! Every course includes free preview lectures, and you can book a free 1-on-1 live demo session with our academic mentors to experience our interactive live studio classes.',
    },
    {
      category: 'Live Classes',
      question: 'What happens if I miss a live class?',
      answer:
        'Don\'t worry! Every live lecture is automatically recorded in Full HD and uploaded to your student portal within 30 minutes. You can watch and rewatch unlimited times at your own pace with adjustable playback speeds.',
    },
    {
      category: 'Live Classes',
      question: 'How does real-time doubt resolution work?',
      answer:
        'During live classes, you can ask questions directly through audio/video or chat. Outside class hours, you can post screenshots or questions to the 24/7 Doubts Queue, where faculty mentors answer within 15–30 minutes.',
    },
    {
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major Indian and international payment options via Razorpay, including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, MasterCard, RuPay), Net Banking (50+ banks), and EMI options.',
    },
    {
      category: 'Payments',
      question: 'What is your refund policy?',
      answer:
        'We offer an unconditional 7-Day Money Back Guarantee. If you are not satisfied with the course quality within 7 days of enrollment and have completed less than 25% of the syllabus, you can request a 100% refund from your student portal.',
    },
    {
      category: 'Certificates',
      question: 'Do I get an industry-recognized certificate?',
      answer:
        'Yes! Upon successfully completing the course curriculum, assignments, and passing the final assessment test, you will receive a verified Certificate of Completion with a unique QR code and verification URL shareable on LinkedIn and resumes.',
    },
    {
      category: 'Certificates',
      question: 'Are study notes and PDF materials free for enrolled students?',
      answer:
        'Yes, all comprehensive chapter notes, revision formula sheets, and PDF problem sets are 100% free and downloadable for enrolled students via Google Drive cloud storage integration.',
    },
  ];

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      !search ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 sm:py-16">
      <div className="section-container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 text-xs font-semibold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" /> Help & Support Hub
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-black text-foreground tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about our courses, live interactive classes, billing, and certificates.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search questions by keyword, topic, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-card text-base shadow-sm rounded-xl"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={cn(
                'px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all',
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-card text-muted-foreground hover:bg-muted border'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="card p-12 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-heading font-bold text-base">No questions found</h3>
              <p className="text-xs text-muted-foreground">
                Try searching with different terms or contact our live counsellors.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="card border bg-card overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-foreground hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-200',
                        isOpen && 'rotate-180 text-brand-600'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t bg-muted/10 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Contact Card */}
        <div className="card p-8 bg-gradient-to-br from-brand-600 to-indigo-700 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-heading font-extrabold">Still have questions?</h3>
          <p className="text-sm text-white/90 max-w-md mx-auto">
            Our academic counsellors are available 7 days a week to help you choose the right batch and answer all your queries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-white/90 font-bold w-full sm:w-auto" asChild>
              <a href="https://wa.me/919934215013" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2 text-green-600" /> Chat on WhatsApp
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
              <a href="tel:+919934215013">
                <Phone className="w-4 h-4 mr-2" /> Call +91 9934215013
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
