import { PublicHeader } from '@/components/layouts/public-header';
import { PublicFooter } from '@/components/layouts/public-footer';
import prisma from '@/lib/prisma';

async function getLayoutData() {
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
    return { headerMenu: null, footerMenu: null, settingsMap: {} };
  }
}

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { headerMenu, footerMenu, settingsMap } = await getLayoutData();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader menu={headerMenu} settings={settingsMap} />
      <main className="flex-1">{children}</main>
      <PublicFooter menu={footerMenu} settings={settingsMap} />
    </div>
  );
}
