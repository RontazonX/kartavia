import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AIChatWidget from "@/components/shared/AIChatWidget";
import PublicLayoutWrapper from "@/components/shared/PublicLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kartavia - Temukan Destinasi Wisata Terbaik di Yogyakarta",
  description: "Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta. Temukan paket wisata dan rencanakan perjalanan impian Anda.",
  keywords: "wisata jogja, paket wisata yogyakarta, liburan jogja, desa wisata, tour and travel yogyakarta",
  openGraph: {
    title: "Kartavia - Temukan Destinasi Wisata Terbaik di Yogyakarta",
    description: "Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta.",
    url: "https://kartavia.com",
    siteName: "Kartavia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      }
    ],
    locale: "id_ID",
    type: "website",
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
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
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
          </PublicLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
