'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, BookOpen, Bell, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

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

  const siteName = settings['site_name'] || 'EduPro';
  const logoUrl = settings['logo_url'];
  const phone = settings['phone'];
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

  const navItems = menu?.items || defaultItems;

  const isDarkHero = pathname === '/' && !isScrolled;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-border'
          : isDarkHero
          ? 'bg-slate-950/80 backdrop-blur-md border-white/10 text-white'
          : 'bg-background/90 backdrop-blur-md border-border'
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
                  isDarkHero ? "text-white" : "gradient-text"
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
                        isDarkHero
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
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname === item.url
                        ? isDarkHero
                          ? 'text-white bg-white/15 shadow-sm'
                          : 'text-primary bg-primary/10'
                        : isDarkHero
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
                  isDarkHero ? "text-slate-300 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                📞 {phone}
              </a>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                isDarkHero && "text-slate-100 hover:text-white hover:bg-white/10"
              )}
              asChild
            >
              <Link href="/login">{loginBtnText}</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild className="shadow-md shadow-brand-500/20 font-semibold">
              <Link href="/register">{signupBtnText}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isDarkHero ? "text-white hover:bg-white/10" : "hover:bg-secondary text-foreground"
            )}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden border-t bg-background shadow-lg">
          <div className="section-container py-4 space-y-1">
            {navItems.map(item => (
              <div key={item.id}>
                <Link
                  href={item.url || '#'}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.url
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map(child => (
                  <Link
                    key={child.id}
                    href={child.url || '#'}
                    className="block pl-8 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-3 border-t flex flex-col gap-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login" onClick={() => setIsMobileOpen(false)}>{loginBtnText}</Link>
              </Button>
              <Button variant="gradient" className="w-full" asChild>
                <Link href="/register" onClick={() => setIsMobileOpen(false)}>{signupBtnText}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
