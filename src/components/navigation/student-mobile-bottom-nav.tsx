'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PlayCircle, HelpCircle, User } from 'lucide-react';
import { cn } from '@/lib/cn';

export function StudentMobileBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: '/student',
      label: 'Home',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/student/courses',
      label: 'Courses',
      icon: BookOpen,
      exact: false,
    },
    {
      href: '/student/live-classes',
      label: 'Live',
      icon: PlayCircle,
      exact: false,
      badge: 'Live',
    },
    {
      href: '/student/doubts',
      label: 'Doubts',
      icon: HelpCircle,
      exact: false,
    },
    {
      href: '/student/profile',
      label: 'Profile',
      icon: User,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Student Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'group relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 select-none active:scale-95',
                isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground font-medium'
              )}
            >
              <div
                className={cn(
                  'relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'group-hover:bg-muted/50'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
