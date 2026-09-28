'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
  faqs: FAQ[];
}

export function FAQSection({ section, faqs }: FAQSectionProps) {
  if (section && !section.isVisible) return null;
  if (faqs.length === 0) return null;

  const content = (section?.content as Record<string, string>) || {};
  const heading = content.heading || 'Frequently Asked Questions';
  const subheading = content.subheading || 'Got questions? We\'ve got answers';

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-3">{heading}</h2>
          <p className="text-muted-foreground">{subheading}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={cn(
                'rounded-xl border bg-card overflow-hidden transition-all duration-200',
                openIndex === index && 'border-primary/30 shadow-md'
              )}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-sm sm:text-base pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300',
                    openIndex === index && 'rotate-180 text-primary'
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
