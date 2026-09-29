import { CheckCircle2, Zap, Shield, Headphones, Award, Clock } from 'lucide-react';

interface WhyChooseUsSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
}

export function WhyChooseUsSection({ section }: WhyChooseUsSectionProps) {
  if (section && !section.isVisible) return null;

  const content = (section?.content as Record<string, unknown>) || {};
  const heading = (content.heading as string) || 'Why Choose CyberMate Solutions?';
  const subheading = (content.subheading as string) || 'We provide the best learning experience for students across India';
  const features = (content.features as Array<{ title: string; description: string; icon: string }>) || [
    { title: 'Expert Teachers', description: 'Learn from experienced educators with proven track records', icon: 'award' },
    { title: 'Live Interactive Classes', description: 'Attend real-time live sessions with doubt-solving', icon: 'zap' },
    { title: 'Recorded Lectures', description: 'Watch and rewatch classes anytime, anywhere', icon: 'clock' },
    { title: 'Doubt Support', description: '24/7 doubt resolution from dedicated subject experts', icon: 'headphones' },
    { title: 'Regular Tests', description: 'Assess your progress with chapter-wise and full tests', icon: 'checkCircle' },
    { title: 'Secure Platform', description: 'Your data and content is always protected', icon: 'shield' },
  ];

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    award: Award,
    zap: Zap,
    clock: Clock,
    headphones: Headphones,
    checkCircle: CheckCircle2,
    shield: Shield,
  };

  const gradients = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-red-500',
    'bg-indigo-500',
  ];

  return (
    <section className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-heading font-bold mb-3">{heading}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || CheckCircle2;
            const bg = gradients[index % gradients.length];
            return (
              <div key={feature.title} className="group p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                <div className={`inline-flex h-12 w-12 rounded-xl ${bg} items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
