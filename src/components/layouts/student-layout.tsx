'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, BookOpen, PlayCircle, FileText, HelpCircle,
  ClipboardList, Calendar, BarChart3, Bell, Award, Heart,
  ShoppingBag, User, Settings, LogOut, Menu, X, MessageSquare,
  BookMarked, CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { toast } from '@/hooks/use-toast';
import { StudentMobileBottomNav } from '@/components/navigation/student-mobile-bottom-nav';

const navItems = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/student/courses', label: 'My Courses', icon: BookOpen },
  { href: '/student/live-classes', label: 'Live Classes', icon: PlayCircle },
  { href: '/student/tests', label: 'Tests & Quizzes', icon: ClipboardList },
  { href: '/student/assignments', label: 'Assignments', icon: FileText },
  { href: '/student/doubts', label: 'Doubts', icon: HelpCircle },
  { href: '/student/planner', label: 'Study Planner', icon: CalendarDays },
  { href: '/student/performance', label: 'Performance', icon: BarChart3 },
  { href: '/student/attendance', label: 'Attendance', icon: Calendar },
  { href: '/student/certificates', label: 'Certificates', icon: Award },
  { href: '/student/notes', label: 'Notes & PDFs', icon: BookMarked },
  { href: '/student/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/student/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/student/notifications', label: 'Notifications', icon: Bell },
  { href: '/student/profile', label: 'Profile', icon: User },
  { href: '/student/settings', label: 'Settings', icon: Settings },
];

import { useBranding } from '@/hooks/use-branding';

interface StudentLayoutProps {
  children: React.ReactNode;
  unreadNotifications?: number;
}

export function StudentLayout({ children, unreadNotifications = 0 }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { siteName, logoUrl } = useBranding();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    try {
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    } catch {}
    toast({ title: 'Logged out', description: 'See you soon!' });
    router.push('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center gap-2 p-5 border-b">
        <Link href="/student" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-8 w-auto max-w-[130px] object-contain" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading font-bold text-sm truncate max-w-[140px]">{siteName}</span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-hide">
        <div className="space-y-0.5">
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {item.href === '/student/notifications' && unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all mb-1"
        >
          <BookOpen className="h-4 w-4" />
          Back to Website
        </Link>
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 flex flex-col">
            <NavContent />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-4 border-b bg-background px-4 h-14 flex-shrink-0">
          <button
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/student" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-7 w-auto max-w-[120px] object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-heading font-bold text-sm truncate max-w-[140px]">{siteName}</span>
              </div>
            )}
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-muted/20 pb-16 lg:pb-0">
          {children}
        </main>
        {/* Android style bottom navigation bar for students */}
        <StudentMobileBottomNav />
      </div>
    </div>
  );
}
