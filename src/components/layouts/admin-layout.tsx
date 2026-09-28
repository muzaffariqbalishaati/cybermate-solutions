'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, ShoppingCart,
  Tag, FileText, Settings, Menu, X, ChevronRight, Bell,
  BarChart3, HelpCircle, Megaphone, Mail, LogOut, Video,
  Layers, Globe, Package, Star, Award, MessageSquare,
  Calculator, CalendarDays, Layout, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { toast } from '@/hooks/use-toast';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      { href: '/admin/categories', label: 'Categories', icon: Layers },
      { href: '/admin/bundles', label: 'Bundles', icon: Package },
      { href: '/admin/live-classes', label: 'Live Classes', icon: Video },
      { href: '/admin/tests', label: 'Tests & Quizzes', icon: Calculator },
      { href: '/admin/assignments', label: 'Assignments', icon: FileText },
      { href: '/admin/question-bank', label: 'Question Bank', icon: HelpCircle },
    ],
  },
  {
    label: 'Users',
    items: [
      { href: '/admin/students', label: 'Students', icon: GraduationCap },
      { href: '/admin/teachers', label: 'Teachers', icon: Users },
      { href: '/admin/parents', label: 'Parents', icon: Users },
    ],
  },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { href: '/admin/coupons', label: 'Coupons', icon: Tag },
      { href: '/admin/refunds', label: 'Refunds', icon: Calculator },
      { href: '/admin/scholarships', label: 'Scholarships', icon: Award },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { href: '/admin/doubts', label: 'Doubts', icon: MessageSquare },
      { href: '/admin/email-templates', label: 'Email Templates', icon: Mail },
    ],
  },
  {
    label: 'Website',
    items: [
      { href: '/admin/homepage', label: 'Homepage', icon: Globe },
      { href: '/admin/pages', label: 'Pages', icon: Layout },
      { href: '/admin/menus', label: 'Navigation', icon: Menu },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', label: 'Site Settings', icon: Settings },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
    ],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [branding, setBranding] = useState<{ siteName: string; logoUrl: string | null; adminLogoUrl: string | null }>({
    siteName: 'CyberMate Solutions',
    logoUrl: null,
    adminLogoUrl: null,
  });
  const pathname = usePathname();
  const router = useRouter();

  const fetchBranding = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setBranding({
          siteName: data.data.site_name || 'CyberMate Solutions',
          logoUrl: data.data.logo_url || null,
          adminLogoUrl: data.data.admin_logo_url || null,
        });
      }
    } catch {
      // Fallback to default
    }
  };

  useEffect(() => {
    fetchBranding();
    const handleUpdate = () => fetchBranding();
    window.addEventListener('site-settings-updated', handleUpdate);
    return () => window.removeEventListener('site-settings-updated', handleUpdate);
  }, []);

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast({ title: 'Logged out', description: 'See you soon!' });
    router.push('/login');
  };

  const displayLogo = branding.adminLogoUrl || branding.logoUrl;

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-slate-800">
        {displayLogo ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={displayLogo}
              alt={branding.siteName}
              className="h-8 max-h-8 w-auto max-w-[120px] object-contain rounded"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-bold text-sm truncate">{branding.siteName}</div>
              <div className="text-[11px] text-slate-400 font-medium">Admin Panel</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm truncate max-w-[150px]">{branding.siteName}</div>
              <div className="text-xs text-slate-500">Admin Panel</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        {navGroups.map(group => {
          const isCollapsed = collapsedGroups.includes(group.label);
          return (
            <div key={group.label} className="mb-4">
              <button
                className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors mb-1"
                onClick={() => toggleGroup(group.label)}
              >
                {group.label}
                <ChevronDown className={cn('h-3 w-3 transition-transform', isCollapsed && '-rotate-90')} />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                          isActive
                            ? 'bg-brand-600 text-white font-medium'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {item.label}
                        {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3">
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 border-b bg-background px-6 h-16 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <Link href="/admin/notifications" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-5 w-5" />
            </Link>
            <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
