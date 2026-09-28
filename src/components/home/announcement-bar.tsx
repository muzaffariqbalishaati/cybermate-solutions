import { X } from 'lucide-react';

interface AnnouncementBarProps {
  section?: {
    content: Record<string, unknown> | null;
    isVisible: boolean;
  } | null;
}

export function AnnouncementBar({ section }: AnnouncementBarProps) {
  if (!section || !section.isVisible) return null;

  const content = (section.content as Record<string, string>) || {};
  const text = content.text;
  const link = content.link;
  const bgColor = content.bg_color || 'bg-brand-600';
  const textColor = content.text_color || 'text-white';

  if (!text) return null;

  return (
    <div className={`${bgColor} ${textColor} text-sm py-2.5 px-4 text-center relative`}>
      <p>
        {text}
        {link && (
          <a href={link} className="ml-2 underline font-semibold hover:no-underline">
            Learn more →
          </a>
        )}
      </p>
    </div>
  );
}
