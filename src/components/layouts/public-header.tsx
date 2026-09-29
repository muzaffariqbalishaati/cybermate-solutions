'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, BookOpen, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks/use-auth';

interface MenuItem {
  id: string;
  label: string;
  url?: string | null;
  children?: MenuItem[];
}

interface Menu {
  items: MenuItem[];
}

interface PublicHeaderProps {
  menu: Menu | null;
  settings: Record<string, string | null | undefined>;
}

export function PublicHeader({ menu, settings }: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading, dashboardUrl, mounted, logout } = useAuth();

  const siteName = settings['site_name'] || 'CyberMate Solutions';
  const logoUrl = settings['logo_url'];
  const phone = settings['phone'] || '+91 9934215013';
  const loginBtnText = settings['header_login_btn'] || 'Login';
  const signupBtnText = settings['header_signup_btn'] || 'Join Free';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default navigation if no menu configured
  const defaultItems: MenuItem[] = [
    { id: 'home', label: 'Home', url: '/' },
    { id: 'courses', label: 'Courses', url: '/courses' },
    { id: 'demo', label: 'Free Demo', url: '/demo' },
    { id: 'resources', label: 'Resources', url: '/resources' },
    { id: 'about', label: 'About', url: '/about' },
    { id: 'contact', label: 'Contact', url: '/contact' },
  ];

  const rawNavItems = (menu?.items && menu.items.length > 0) ? menu.items : defaultItems;

  // Filter out any login or register links from custom nav if the user is already logged in
  const navItems = rawNavItems.filter(item => {
    if (mounted && isLoggedIn) {
      if (item.url === '/login' || item.url === '/register') return false;
    }
    return true;
  });

  const isDarkHeader = pathname === '/' && !isScrolled && !isMobileOpen;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isDarkHeader
          ? 'bg-slate-950/80 backdrop-blur-md border-white/10 text-white'
          : 'bg-background/98 backdrop-blur-md shadow-sm border-border text-foreground'
      )}
    >
      <div className="section-container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-10 w-auto max-h-10 max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-brand-500/20">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className={cn(
                  "text-2xl font-heading font-extrabold tracking-tight",
                  isDarkHeader ? "text-white" : "gradient-text"
                )}>
                  {siteName}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <div key={item.id} className="relative group">
                {item.children && item.children.length > 0 ? (
                  <>
                    <button
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        isDarkHeader
                          ? 'text-slate-200 hover:text-white hover:bg-white/10'
                          : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                      )}
                      onMouseEnter={() => setOpenDropdown(item.id)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    </button>
                    {/* Dropdown */}
                    <div
                      className={cn(
                        'absolute top-full left-0 w-48 bg-card border border-border rounded-xl shadow-lg py-1.5 z-50 transition-all',
                        openDropdown === item.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      )}
                      onMouseEnter={() => setOpenDropdown(item.id)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.children.map(child => (
                        <Link
                          key={child.id}
                          href={child.url || '#'}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.url || '#'}
                    prefetch={true}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname === item.url
                        ? isDarkHeader
                          ? 'text-white bg-white/15 shadow-sm'
                          : 'text-primary bg-primary/10'
                        : isDarkHeader
                        ? 'text-slate-200 hover:text-white hover:bg-white/10'
                        : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                className={cn(
                  "text-sm transition-colors",
                  isDarkHeader ? "text-slate-300 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                📞 {phone}
              </a>
            )}

            {!mounted || isLoading ? (
              /* Loading skeleton - prevents flash of wrong buttons */
              <div className="flex items-center gap-2.5 animate-pulse">
                <div className={cn("h-8 w-24 rounded-xl", isDarkHeader ? "bg-white/10" : "bg-secondary")} />
                <div className={cn("h-8 w-20 rounded-xl", isDarkHeader ? "bg-white/10" : "bg-secondary")} />
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="gradient"
                  size="sm"
                  asChild
                  className="shadow-md shadow-brand-500/20 font-semibold gap-2 app-tap"
                >
                  <Link href={dashboardUrl} prefetch={true}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>

                {/* Profile quick button */}
                <Link
                  href={`${dashboardUrl}/profile`}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all border text-xs font-semibold app-tap",
                    isDarkHeader
                      ? "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                      : "border-border bg-secondary/60 hover:bg-secondary text-foreground"
                  )}
                  title={`${user?.name || 'Account'} (${user?.role})`}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="h-6 w-6 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[110px] truncate hidden xl:inline-block">
                    {user?.name?.split(' ')[0] || 'My Account'}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className={cn(
                    "p-2 rounded-xl transition-colors border text-xs app-tap",
                    isDarkHeader
                      ? "border-white/15 hover:bg-white/10 text-slate-300 hover:text-red-400"
                      : "border-border hover:bg-red-50 hover:text-red-600 text-muted-foreground"
                  )}
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    isDarkHeader && "text-slate-100 hover:text-white hover:bg-white/10"
                  )}
                  asChild
                >
                  <Link href="/login">{loginBtnText}</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild className="shadow-md shadow-brand-500/20 font-semibold app-tap">
                  <Link href="/register">{signupBtnText}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={cn(
              "lg:hidden p-2.5 rounded-xl transition-all relative z-50 cursor-pointer active:scale-95",
              isDarkHeader
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-secondary"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileOpen(!isMobileOpen);
            }}
            aria-expanded={isMobileOpen}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X className="h-6 w-6 text-foreground stroke-[2.5]" />
            ) : (
              <Menu className="h-6 w-6 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-50 lg:hidden border-t border-border bg-background text-foreground shadow-2xl px-4 py-5 animate-in slide-in-from-top-2 duration-200 overflow-y-auto max-h-[calc(100vh-4rem)] pb-10">
          <div className="space-y-1.5">
            {navItems.map(item => (
              <div key={item.id}>
                <Link
                  href={item.url || '#'}
                  prefetch={true}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all app-tap',
                    pathname === item.url
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-foreground/85 hover:text-foreground hover:bg-secondary/70'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-muted-foreground/60">→</span>
                </Link>
                {item.children?.map(child => (
                  <Link
                    key={child.id}
                    href={child.url || '#'}
                    prefetch={true}
                    className="block pl-8 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-colors app-tap"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Direct Support & WhatsApp on Mobile Menu */}
          <div className="mt-4 p-3.5 bg-secondary/50 rounded-2xl border border-border flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">Customer Support</p>
              <a
                href="tel:+919934215013"
                className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <span>📞</span> +91 9934215013
              </a>
            </div>
            <a
              href="https://wa.me/919934215013"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm app-tap"
            >
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="pt-4 mt-2 border-t border-border flex flex-col gap-2.5">
            {!mounted || isLoading ? (
              <div className="animate-pulse h-14 bg-secondary rounded-2xl border border-border" />
            ) : isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-secondary/70 rounded-2xl border border-border">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="h-11 w-11 rounded-xl object-cover border border-border" />
                  ) : (
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-brand-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-foreground">{user?.name || 'Logged In'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role ? `${user.role.toLowerCase()} portal` : 'Active User'}</p>
                  </div>
                </div>

                <Button variant="gradient" className="w-full h-11 text-sm font-bold rounded-xl shadow-md shadow-brand-500/20 app-tap flex items-center justify-center gap-2" asChild>
                  <Link href={dashboardUrl} onClick={() => setIsMobileOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-10 text-xs font-semibold rounded-xl app-tap" asChild>
                    <Link href={`${dashboardUrl}/profile`} onClick={() => setIsMobileOpen(false)}>
                      <User className="h-3.5 w-3.5 mr-1.5" /> My Profile
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-xs font-semibold rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200/50 app-tap"
                    onClick={() => {
                      setIsMobileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full h-11 text-sm font-bold rounded-xl app-tap" asChild>
                  <Link href="/login" onClick={() => setIsMobileOpen(false)}>{loginBtnText}</Link>
                </Button>
                <Button variant="gradient" className="w-full h-11 text-sm font-bold rounded-xl shadow-md shadow-brand-500/20 app-tap" asChild>
                  <Link href="/register" onClick={() => setIsMobileOpen(false)}>{signupBtnText}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </>
    )}
    </header>
  );
}
