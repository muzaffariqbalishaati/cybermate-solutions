import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  description: string | null;
}

interface CategoriesSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
  categories: Category[];
}

const defaultColors = [
  'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-200 text-blue-700',
  'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-200 text-purple-700',
  'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-200 text-amber-700',
  'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-200 text-emerald-700',
  'from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 border-red-200 text-red-700',
  'from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20 border-indigo-200 text-indigo-700',
  'from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 border-sky-200 text-sky-700',
  'from-fuchsia-500/10 to-pink-500/10 hover:from-fuchsia-500/20 hover:to-pink-500/20 border-fuchsia-200 text-fuchsia-700',
];

export function CategoriesSection({ section, categories }: CategoriesSectionProps) {
  if (section && !section.isVisible) return null;
  if (categories.length === 0) return null;

  const content = (section?.content as Record<string, string>) || {};
  const heading = content.heading || 'Browse by Category';
  const subheading = content.subheading || 'Find courses in your area of interest';

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-3">{heading}</h2>
          <p className="text-muted-foreground">{subheading}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}`}
              className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${defaultColors[index % defaultColors.length]}`}
            >
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white/70 shadow-sm group-hover:scale-110 transition-transform">
                {cat.icon ? (
                  <span className="text-2xl">{cat.icon}</span>
                ) : (
                  <BookOpen className="h-6 w-6" />
                )}
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm leading-tight">{cat.name}</div>
                {cat.description && (
                  <div className="text-xs mt-1 opacity-70 line-clamp-1">{cat.description}</div>
                )}
              </div>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all -mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
