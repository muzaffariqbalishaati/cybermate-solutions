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
import { AdminMobileBottomNav } from '@/components/navigation/admin-mobile-bottom-nav';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics & Revenue', icon: BarChart3 },
    ],
  },
  {
    label: 'Academic Management',
    items: [
      { href: '/admin/courses', label: 'Courses & Curriculum', icon: BookOpen },
      { href: '/admin/notes', label: 'Study Notes & Materials', icon: FileText },
      { href: '/admin/live-classes', label: 'Live Classes & Studios', icon: Video },
    ],
  },
  {
    label: 'User Directory',
    items: [
      { href: '/admin/students', label: 'Enrolled Students', icon: GraduationCap },
      { href: '/admin/teachers', label: 'Faculty & Mentors', icon: Users },
    ],
  },
  {
    label: 'Sales & Revenue',
    items: [
      { href: '/admin/orders', label: 'Orders & Ledger', icon: ShoppingCart },
      { href: '/admin/coupons', label: 'Discount Coupons', icon: Tag },
    ],
  },
  {
    label: 'System & Branding',
    items: [
      { href: '/admin/menus', label: 'Menus & Navigation Links', icon: Menu },
      { href: '/admin/homepage', label: 'Homepage Customizer', icon: Globe },
      { href: '/admin/announcements', label: 'Broadcast Notices', icon: Megaphone },
      { href: '/admin/settings', label: 'Site & Gateway Settings', icon: Settings },
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
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    try {
      localStorage.removeItem('auth_user');
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    } catch {}
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
        <header className="flex items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 h-16 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-secondary text-foreground transition-colors app-tap"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm tracking-tight gradient-text">
                {branding.siteName}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/admin/notifications" className="relative p-2 rounded-xl hover:bg-secondary transition-colors app-tap">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-border text-foreground hover:bg-secondary transition-colors app-tap"
            >
              Live Site ↗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
        </main>

        {/* Native Android Mobile Bottom Bar */}
        <AdminMobileBottomNav />
      </div>
    </div>
  );
}
