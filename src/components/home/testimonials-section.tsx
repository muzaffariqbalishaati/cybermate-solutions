import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  avatar: string | null;
  designation: string | null;
  content: string;
  rating: number;
}

interface TestimonialsSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
  testimonials: Testimonial[];
}

export function TestimonialsSection({ section, testimonials }: TestimonialsSectionProps) {
  if (section && !section.isVisible) return null;
  if (testimonials.length === 0) return null;

  const content = (section?.content as Record<string, string>) || {};
  const heading = content.heading || 'What Students Say';
  const subheading = content.subheading || 'Real experiences from our students across India';

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-3">{heading}</h2>
          <p className="text-muted-foreground">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="group card-hover p-6 relative overflow-hidden">
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-brand-100 fill-current" />

              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-foreground/80 leading-relaxed mb-5 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-200 to-purple-200 flex items-center justify-center text-sm font-bold text-brand-700">
                    {testimonial.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  {testimonial.designation && (
                    <div className="text-xs text-muted-foreground">{testimonial.designation}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
