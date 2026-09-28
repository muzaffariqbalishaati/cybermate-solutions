import { Users, BookOpen, Award, Clock } from 'lucide-react';

interface StatsSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
}

export function StatsSection({ section }: StatsSectionProps) {
  if (section && !section.isVisible) return null;

  const content = (section?.content as Record<string, string | Record<string, string>[]>) || {};
  const stats = (content.stats as Record<string, string>[]) || [
    { value: '50,000+', label: 'Active Students', icon: 'users' },
    { value: '200+', label: 'Expert Courses', icon: 'book' },
    { value: '50+', label: 'Expert Teachers', icon: 'award' },
    { value: '1M+', label: 'Hours of Learning', icon: 'clock' },
  ];

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    users: Users,
    book: BookOpen,
    award: Award,
    clock: Clock,
  };

  const colorMap = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-teal-500',
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Users;
            const gradient = colorMap[index % colorMap.length];
            return (
              <div
                key={stat.label}
                className="group text-center p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-heading font-extrabold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
