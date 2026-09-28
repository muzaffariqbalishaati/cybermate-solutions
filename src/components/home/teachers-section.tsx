import Image from 'next/image';
import Link from 'next/link';

interface Teacher {
  id: string;
  name: string;
  avatar: string | null;
  teacher: {
    specialization: string | null;
    experience: number | null;
    bio: string | null;
  } | null;
}

interface TeachersSectionProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
  teachers: Teacher[];
}

export function TeachersSection({ section, teachers }: TeachersSectionProps) {
  if (section && !section.isVisible) return null;
  if (teachers.length === 0) return null;

  const content = (section?.content as Record<string, string>) || {};
  const heading = content.heading || 'Meet Our Expert Teachers';
  const subheading = content.subheading || 'Learn from the best educators with years of experience';

  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold mb-3">{heading}</h2>
          <p className="text-muted-foreground">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map(teacher => (
            <div key={teacher.id} className="group card-hover p-6 text-center">
              <div className="relative mx-auto h-24 w-24 mb-4">
                {teacher.avatar ? (
                  <Image
                    src={teacher.avatar}
                    alt={teacher.name}
                    fill
                    className="rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-brand-200 to-purple-200 flex items-center justify-center text-2xl font-bold text-brand-700">
                    {teacher.name[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">{teacher.name}</h3>
              {teacher.teacher?.specialization && (
                <p className="text-sm text-primary font-medium mb-2">{teacher.teacher.specialization}</p>
              )}
              {teacher.teacher?.experience && (
                <p className="text-xs text-muted-foreground mb-3">
                  {teacher.teacher.experience}+ years experience
                </p>
              )}
              {teacher.teacher?.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2">{teacher.teacher.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
