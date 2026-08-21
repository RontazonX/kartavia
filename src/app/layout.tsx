import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AIChatWidget from "@/components/shared/AIChatWidget";
import PublicLayoutWrapper from "@/components/shared/PublicLayoutWrapper";
import { Analytics } from '@vercel/analytics/react';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Analytics Placeholder */}
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicLayoutWrapper 
            Navbar={<Navbar />} 
            Footer={<Footer />}
            ChatWidget={<AIChatWidget />}
          >
            {children}
            <Analytics />
          </PublicLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
