import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AIChatWidget from "@/components/shared/AIChatWidget";
import PublicLayoutWrapper from "@/components/shared/PublicLayoutWrapper";
import { Analytics } from '@vercel/analytics/react';
import { cookies } from 'next/headers';
import { TranslationProvider } from "@/i18n/TranslationContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kartavia.vercel.app'),
  title: "Kartavia - Temukan Destinasi Wisata Terbaik di Yogyakarta",
  description: "Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta. Temukan paket wisata dan rencanakan perjalanan impian Anda.",
  keywords: "wisata jogja, paket wisata yogyakarta, liburan jogja, desa wisata, tour and travel yogyakarta, kartavia",
  authors: [{ name: "Kartavia Team" }],
  creator: "Kartavia",
  publisher: "Kartavia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Kartavia - Temukan Destinasi Wisata Terbaik di Yogyakarta",
    description: "Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta.",
    url: "/",
    siteName: "Kartavia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kartavia - Wisata Yogyakarta",
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartavia - Wisata Terbaik Yogyakarta",
    description: "Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as 'en' | 'id') || 'en';

  return (
    <html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.prod.website-files.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdn.prod.website-files.com" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <TranslationProvider initialLocale={locale}>
            <PublicLayoutWrapper 
              Navbar={<Navbar />} 
              Footer={<Footer />}
              ChatWidget={<AIChatWidget />}
            >
              {children}
              <Analytics />
            </PublicLayoutWrapper>
          </TranslationProvider>
      </body>
    </html>
  );
}
