'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Video, HelpCircle, User } from 'lucide-react';
import { cn } from '@/lib/cn';

export function TeacherMobileBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: '/teacher',
      label: 'Home',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/teacher/courses',
      label: 'Courses',
      icon: BookOpen,
      exact: false,
    },
    {
      href: '/teacher/live-classes',
      label: 'Live Class',
      icon: Video,
      exact: false,
      badge: 'Studio',
    },
    {
      href: '/teacher/doubts',
      label: 'Doubts',
      icon: HelpCircle,
      exact: false,
    },
    {
      href: '/teacher/profile',
      label: 'Profile',
      icon: User,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Teacher Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 text-white backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.3)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
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
                'relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 app-tap select-none group',
                isActive
                  ? 'text-brand-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <div
                className={cn(
                  'relative p-1.5 rounded-xl transition-all duration-200',
                  isActive && 'bg-brand-500/20 text-brand-400 shadow-sm'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-bold bg-rose-500 text-white rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[58px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
