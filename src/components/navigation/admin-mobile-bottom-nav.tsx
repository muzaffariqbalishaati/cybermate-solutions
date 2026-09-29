'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, GraduationCap, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/cn';

export function AdminMobileBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: '/admin',
      label: 'Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/courses',
      label: 'Courses',
      icon: BookOpen,
      exact: false,
    },
    {
      href: '/admin/students',
      label: 'Students',
      icon: GraduationCap,
      exact: false,
    },
    {
      href: '/admin/teachers',
      label: 'Faculty',
      icon: Users,
      exact: false,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Admin Mobile Navigation"
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
                'relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 app-tap select-none group',
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              <div
                className={cn(
                  'relative p-1.5 rounded-xl transition-all duration-200',
                  isActive && 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-sm'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  )}
                />
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
