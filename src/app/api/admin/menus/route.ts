import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

const DEFAULT_HEADER_ITEMS = [
  { label: 'Home', url: '/', order: 0, target: '_self' },
  { label: 'Courses', url: '/courses', order: 1, target: '_self' },
  { label: 'Free Demo', url: '/demo', order: 2, target: '_self' },
  { label: 'Resources', url: '/resources', order: 3, target: '_self' },
  { label: 'About', url: '/about', order: 4, target: '_self' },
  { label: 'Contact', url: '/contact', order: 5, target: '_self' },
];

const DEFAULT_FOOTER_QUICK_ITEMS = [
  { label: 'Home', url: '/', order: 0, target: '_self' },
  { label: 'Courses', url: '/courses', order: 1, target: '_self' },
  { label: 'Free Demo', url: '/demo', order: 2, target: '_self' },
  { label: 'Free Resources', url: '/resources', order: 3, target: '_self' },
  { label: 'About Us', url: '/about', order: 4, target: '_self' },
  { label: 'Contact', url: '/contact', order: 5, target: '_self' },
];

const DEFAULT_FOOTER_LEGAL_ITEMS = [
  { label: 'Terms & Conditions', url: '/terms', order: 0, target: 'legal' },
  { label: 'Privacy Policy', url: '/privacy', order: 1, target: 'legal' },
  { label: 'Refund Policy', url: '/refund-policy', order: 2, target: 'legal' },
  { label: 'FAQ', url: '/faq', order: 3, target: 'legal' },
];

// GET /api/admin/menus - get all menus and ensure defaults exist
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    // Ensure Header Menu exists
    let headerMenu = await prisma.menu.findUnique({
      where: { location: 'header' },
      include: {
        items: {
          orderBy: { order: 'asc' },
          include: { children: { orderBy: { order: 'asc' } } },
        },
      },
    });

    if (!headerMenu) {
      headerMenu = await prisma.menu.create({
        data: {
          name: 'Main Header Navigation',
          location: 'header',
          items: {
            create: DEFAULT_HEADER_ITEMS.map((item) => ({
              label: item.label,
              url: item.url,
              order: item.order,
              target: item.target,
              isActive: true,
            })),
          },
        },
        include: {
          items: {
            orderBy: { order: 'asc' },
            include: { children: { orderBy: { order: 'asc' } } },
          },
        },
      });
    }

    // Ensure Footer Menu exists
    let footerMenu = await prisma.menu.findUnique({
      where: { location: 'footer' },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!footerMenu) {
      footerMenu = await prisma.menu.create({
        data: {
          name: 'Footer Navigation',
          location: 'footer',
          items: {
            create: [
              ...DEFAULT_FOOTER_QUICK_ITEMS.map((item) => ({
                label: item.label,
                url: item.url,
                order: item.order,
                target: item.target,
                isActive: true,
              })),
              ...DEFAULT_FOOTER_LEGAL_ITEMS.map((item) => ({
                label: item.label,
                url: item.url,
                order: item.order + 10,
                target: item.target,
                isActive: true,
              })),
            ],
          },
        },
        include: {
          items: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    // Fetch footer and homepage link settings
    const settingKeys = [
      'site_name',
      'footer_about',
      'contact_email',
      'phone',
      'whatsapp',
      'address',
      'copyright_text',
      'social_facebook',
      'social_twitter',
      'social_instagram',
      'social_youtube',
      'social_linkedin',
    ];

    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: settingKeys } },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      if (s.value) settingsMap[s.key] = s.value;
    });

    // Also get Homepage Sections for CTA URLs
    const homepageSections = await prisma.homepageSection.findMany({
      where: { sectionKey: { in: ['hero', 'cta'] } },
    });

    const heroSection = homepageSections.find((s) => s.sectionKey === 'hero');
    const ctaSection = homepageSections.find((s) => s.sectionKey === 'cta');

    return successResponse({
      headerMenu,
      footerMenu,
      settings: settingsMap,
      homepageLinks: {
        heroCtaText: (heroSection?.content as any)?.cta_text || 'Explore Courses',
        heroCtaUrl: (heroSection?.content as any)?.cta_url || '/courses',
        heroDemoText: (heroSection?.content as any)?.demo_cta || 'Watch Free Demo',
        heroDemoUrl: (heroSection?.content as any)?.demo_url || '/demo',
        bottomCtaText: (ctaSection?.content as any)?.cta_text || 'Start Learning Today',
        bottomCtaUrl: (ctaSection?.content as any)?.cta_url || '/register',
        bottomSecondaryText: (ctaSection?.content as any)?.secondary_text || 'Explore Free Resources',
        bottomSecondaryUrl: (ctaSection?.content as any)?.secondary_url || '/resources',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/admin/menus - save changes to header menu, footer menu, or homepage links
export async function PUT(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    const body = await req.json();
    const { headerItems, footerItems, settings, homepageLinks, resetLocation } = body;

    // Reset menu to defaults if requested
    if (resetLocation === 'header') {
      const headerMenu = await prisma.menu.findUnique({ where: { location: 'header' } });
      if (headerMenu) {
        await prisma.menuItem.deleteMany({ where: { menuId: headerMenu.id } });
        for (const item of DEFAULT_HEADER_ITEMS) {
          await prisma.menuItem.create({
            data: {
              menuId: headerMenu.id,
              label: item.label,
              url: item.url,
              order: item.order,
              target: item.target,
              isActive: true,
            },
          });
        }
      }
    } else if (resetLocation === 'footer') {
      const footerMenu = await prisma.menu.findUnique({ where: { location: 'footer' } });
      if (footerMenu) {
        await prisma.menuItem.deleteMany({ where: { menuId: footerMenu.id } });
        for (const item of [...DEFAULT_FOOTER_QUICK_ITEMS, ...DEFAULT_FOOTER_LEGAL_ITEMS]) {
          await prisma.menuItem.create({
            data: {
              menuId: footerMenu.id,
              label: item.label,
              url: item.url,
              order: item.order,
              target: item.target,
              isActive: true,
            },
          });
        }
      }
    }

    // Save header items if provided
    if (Array.isArray(headerItems)) {
      const headerMenu = await prisma.menu.upsert({
        where: { location: 'header' },
        create: { name: 'Main Header Navigation', location: 'header' },
        update: {},
      });

      // Clear existing and replace with new ordered items
      await prisma.menuItem.deleteMany({ where: { menuId: headerMenu.id } });

      for (let i = 0; i < headerItems.length; i++) {
        const item = headerItems[i];
        if (!item.label) continue;
        await prisma.menuItem.create({
          data: {
            menuId: headerMenu.id,
            label: item.label,
            url: item.url || '/',
            order: i,
            target: item.target || '_self',
            isActive: item.isActive !== false,
          },
        });
      }
    }

    // Save footer items if provided
    if (Array.isArray(footerItems)) {
      const footerMenu = await prisma.menu.upsert({
        where: { location: 'footer' },
        create: { name: 'Footer Navigation', location: 'footer' },
        update: {},
      });

      await prisma.menuItem.deleteMany({ where: { menuId: footerMenu.id } });

      for (let i = 0; i < footerItems.length; i++) {
        const item = footerItems[i];
        if (!item.label) continue;
        await prisma.menuItem.create({
          data: {
            menuId: footerMenu.id,
            label: item.label,
            url: item.url || '/',
            order: i,
            target: item.target || (item.isLegal ? 'legal' : '_self'),
            isActive: item.isActive !== false,
          },
        });
      }
    }

    // Save settings (about, phone, email, whatsapp, social links)
    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.siteSetting.upsert({
          where: { key },
          create: { key, value: String(value), group: 'footer' },
          update: { value: String(value) },
        });
      }
    }

    // Save Homepage CTA links if provided
    if (homepageLinks) {
      if (homepageLinks.heroCtaText || homepageLinks.heroCtaUrl || homepageLinks.heroDemoText || homepageLinks.heroDemoUrl) {
        const heroSection = await prisma.homepageSection.findUnique({ where: { sectionKey: 'hero' } });
        const heroContent = (heroSection?.content as any) || {};

        if (homepageLinks.heroCtaText) heroContent.cta_text = homepageLinks.heroCtaText;
        if (homepageLinks.heroCtaUrl) heroContent.cta_url = homepageLinks.heroCtaUrl;
        if (homepageLinks.heroDemoText) heroContent.demo_cta = homepageLinks.heroDemoText;
        if (homepageLinks.heroDemoUrl) heroContent.demo_url = homepageLinks.heroDemoUrl;

        await prisma.homepageSection.upsert({
          where: { sectionKey: 'hero' },
          create: { sectionKey: 'hero', title: 'Hero Section', content: heroContent, order: 1 },
          update: { content: heroContent },
        });
      }

      if (homepageLinks.bottomCtaText || homepageLinks.bottomCtaUrl || homepageLinks.bottomSecondaryText || homepageLinks.bottomSecondaryUrl) {
        const ctaSection = await prisma.homepageSection.findUnique({ where: { sectionKey: 'cta' } });
        const ctaContent = (ctaSection?.content as any) || {};

        if (homepageLinks.bottomCtaText) ctaContent.cta_text = homepageLinks.bottomCtaText;
        if (homepageLinks.bottomCtaUrl) ctaContent.cta_url = homepageLinks.bottomCtaUrl;
        if (homepageLinks.bottomSecondaryText) ctaContent.secondary_text = homepageLinks.bottomSecondaryText;
        if (homepageLinks.bottomSecondaryUrl) ctaContent.secondary_url = homepageLinks.bottomSecondaryUrl;

        await prisma.homepageSection.upsert({
          where: { sectionKey: 'cta' },
          create: { sectionKey: 'cta', title: 'Call To Action', content: ctaContent, order: 10 },
          update: { content: ctaContent },
        });
      }
    }

    // Invalidate caches
    try {
      revalidateTag('menus');
      revalidateTag('site-settings');
    } catch {}

    return successResponse(null, 'Navigation menus and links updated successfully!');
  } catch (error) {
    return handleApiError(error);
  }
}
