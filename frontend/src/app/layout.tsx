import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Visit Nepal: Himalayan Expeditions, Stays, Guides & Permits',
  description:
    'Explore Nepal’s iconic Himalayan treks, heritage hotels, certified mountain guides, Sherpa butlers, and official trekking permits.',
  icons: {
    icon: [
      { url: '/favicon.webp', type: 'image/webp' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.webp',
    apple: '/favicon.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${poppins.variable} ${inter.variable} h-full antialiased bg-[#031526]`}>
      <head>
        <link rel="preload" as="image" href="/images/hero/hero-slide-1.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body className="min-h-full flex flex-col bg-[#031526] text-slate-900 m-0 p-0 border-none">
        <AppProvider>
          <Suspense
            fallback={<div className="h-11 sm:h-12 lg:h-[48px] w-full bg-transparent border-none" />}
          >
            <Navbar />
          </Suspense>
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
