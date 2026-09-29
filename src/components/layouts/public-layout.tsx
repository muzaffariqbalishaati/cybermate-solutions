import { PublicHeader } from '@/components/layouts/public-header';
import { PublicFooter } from '@/components/layouts/public-footer';
import { MobileBottomNav } from '@/components/navigation/mobile-bottom-nav';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

const getLayoutData = unstable_cache(
  async () => {
    try {
      const [headerMenu, footerMenu, settings] = await Promise.all([
        prisma.menu.findUnique({
          where: { location: 'header' },
          include: {
            items: {
              where: { parentId: null, isActive: true },
              orderBy: { order: 'asc' },
              include: {
                children: {
                  where: { isActive: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        }),
        prisma.menu.findUnique({
          where: { location: 'footer' },
          include: {
            items: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        }),
        prisma.siteSetting.findMany(),
      ]);

      const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
      return { headerMenu, footerMenu, settingsMap };
    } catch {
      return {
        headerMenu: null,
        footerMenu: null,
        settingsMap: { site_name: 'CyberMate Solutions' },
      };
    }
  },
  ['public-layout-data-v2'],
  { revalidate: 300, tags: ['site-settings', 'menus'] }
);

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { headerMenu, footerMenu, settingsMap } = await getLayoutData();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-brand-500 selection:text-white">
      <PublicHeader menu={headerMenu} settings={settingsMap} />
      {/* Mobile bottom nav safe padding pb-16 md:pb-0 */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <PublicFooter menu={footerMenu} settings={settingsMap} />
      <MobileBottomNav />
    </div>
  );
}
