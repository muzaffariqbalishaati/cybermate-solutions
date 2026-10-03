import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberMate Solutions | Business & Pricing Control Panel",
  description: "CyberMate Solutions - Mobile & Computer Repairing, Website Development, Mobile Accessories. J.J Market, Sanhaula, Bhagalpur, Bihar 813205. Owner: Muzaffar Iqbal Ishaati.",
  keywords: ["CyberMate Solutions", "Mobile Repairing Sanhaula", "Laptop Repair Bhagalpur", "Website Development Bihar", "Muzaffar Iqbal Ishaati"],
  authors: [{ name: "Muzaffar Iqbal Ishaati" }],
};

export const viewport: Viewport = {
  themeColor: "#080b11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
