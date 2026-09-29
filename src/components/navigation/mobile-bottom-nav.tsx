'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, PlayCircle, HelpCircle, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useEffect, useState } from 'react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not show bottom nav inside live studio/classroom or admin portal fullscreens if desired
  if (pathname.includes('/live-classroom') || pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      exact: true,
    },
    {
      href: '/courses',
      label: 'Courses',
      icon: BookOpen,
      exact: false,
    },
    {
      href: '/demo',
      label: 'Demo',
      icon: PlayCircle,
      exact: true,
      badge: 'Free',
    },
    {
      href: '/contact',
      label: 'Doubts',
      icon: HelpCircle,
      exact: true,
    },
    {
      href: '/login',
      label: 'Account',
      icon: User,
      exact: false,
      altHrefs: ['/student', '/teacher', '/parent', '/register'],
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) || (item.altHrefs && item.altHrefs.some(h => pathname.startsWith(h)));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                'group relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 select-none active:scale-95',
                isActive ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 font-medium'
              )}
            >
              {/* Android Material Pill Active Indicator */}
              <div
                className={cn(
                  'relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200',
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand-600 dark:bg-brand-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
