import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Python Reboot',
  description: 'A progressive, AI-guided Python course built around useful projects.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Python Reboot',
    description: 'Learn Python by building things that help.',
    images: [{ url: '/og.png', width: 1672, height: 941, alt: 'Python Reboot — Learn Python by building things that help.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Python Reboot',
    description: 'Learn Python by building things that help.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
