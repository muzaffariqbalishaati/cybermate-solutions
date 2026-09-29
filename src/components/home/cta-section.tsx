import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
}

export function CTASection({ section }: CTASectionProps) {
  if (section && !section.isVisible) return null;

  const content = (section?.content as Record<string, string>) || {};
  const heading = content.heading || 'Ready to Start Learning?';
  const subheading = content.subheading || 'Join thousands of students already learning on CyberMate Solutions. Start your free demo today!';
  const ctaText = content.cta_text || 'Start Learning Today';
  const ctaUrl = content.cta_url || '/register';
  const secondaryText = content.secondary_text || 'Explore Free Resources';
  const secondaryUrl = content.secondary_url || '/resources';

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="section-container relative z-10 text-center">
        <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mb-4 max-w-3xl mx-auto leading-tight">
          {heading}
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">{subheading}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="xl" className="bg-white text-brand-600 hover:bg-white/90 font-bold shadow-2xl" asChild>
            <Link href={ctaUrl}>
              {ctaText}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
            <Link href={secondaryUrl}>{secondaryText}</Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
          {['✓ No credit card required', '✓ Free demo available', '✓ Cancel anytime'].map(text => (
            <span key={text} className="flex items-center gap-1">{text}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
