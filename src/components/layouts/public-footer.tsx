import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { FooterAccountLink } from '@/components/navigation/footer-account-link';

interface PublicFooterProps {
  menu: {
    items: Array<{ id: string; label: string; url?: string | null; parentId?: string | null }>;
  } | null;
  settings: Record<string, string | null | undefined>;
}

export function PublicFooter({ menu, settings }: PublicFooterProps) {
  const siteName = settings['site_name'] || 'CyberMate Solutions';
  const logoUrl = settings['logo_url'];
  const aboutText = settings['footer_about'] || 'India\'s premier online tuition platform providing quality education to students across the country.';
  const email = settings['contact_email'] || 'support@cybermatesolutions.com';
  const phone = settings['phone'] || '+91 9934215013';
  const address = settings['address'] || 'New Delhi, India';
  const copyright = settings['copyright_text'] || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const whatsapp = settings['whatsapp'] || '9934215013';

  const socialLinks = {
    facebook: settings['social_facebook'],
    twitter: settings['social_twitter'],
    instagram: settings['social_instagram'],
    youtube: settings['social_youtube'],
    linkedin: settings['social_linkedin'],
  };

  // Default footer links
  const defaultQuickLinks = [
    { label: 'Home', url: '/' },
    { label: 'Courses', url: '/courses' },
    { label: 'Free Demo', url: '/demo' },
    { label: 'Free Resources', url: '/resources' },
    { label: 'About Us', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ];

  const defaultLegalLinks = [
    { label: 'Terms & Conditions', url: '/terms' },
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Refund Policy', url: '/refund-policy' },
    { label: 'FAQ', url: '/faq' },
  ];

  let quickLinks = defaultQuickLinks;
  let legalLinks = defaultLegalLinks;

  // Use database menu items if configured by admin
  if (menu?.items && menu.items.length > 0) {
    const qItems = menu.items.filter((i) => (i as any).target !== 'legal' && (i as any).target !== '_legal');
    const lItems = menu.items.filter((i) => (i as any).target === 'legal' || (i as any).target === '_legal');
    if (qItems.length > 0) {
      quickLinks = qItems.map((i) => ({ label: i.label, url: i.url || '/' }));
    }
    if (lItems.length > 0) {
      legalLinks = lItems.map((i) => ({ label: i.label, url: i.url || '/' }));
    }
  }

  // Also support settings override
  if (settings['footer_quick_links']) {
    try {
      const parsed = JSON.parse(settings['footer_quick_links']!);
      if (Array.isArray(parsed) && parsed.length > 0) quickLinks = parsed;
    } catch {}
  }
  if (settings['footer_legal_links']) {
    try {
      const parsed = JSON.parse(settings['footer_legal_links']!);
      if (Array.isArray(parsed) && parsed.length > 0) legalLinks = parsed;
    } catch {}
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-9 w-auto max-h-9 max-w-[180px] object-contain brightness-110 transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xl font-heading font-bold text-white">{siteName}</span>
                </div>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-5">{aboutText}</p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all" aria-label="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.url}
                    className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-brand-400 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-5">Legal</h3>
            <ul className="space-y-2.5">
              {legalLinks.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.url}
                    className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-brand-400 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5">Contact Us</h3>
            <div className="space-y-4">
              {email && (
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-400" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="flex items-start gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-400" />
                  <span>{phone}</span>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-slate-400 hover:text-green-400 transition-colors">
                  <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp Us</span>
                </a>
              )}
              {address && (
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-400" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="section-container py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>{copyright}</p>
            <div className="flex items-center gap-4">
              <FooterAccountLink />
              <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
