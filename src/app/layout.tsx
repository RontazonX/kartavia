import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AIChatWidget from "@/components/shared/AIChatWidget";
import PublicLayoutWrapper from "@/components/shared/PublicLayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kartavia | Jogja Premium Tourism",
  description: "Explore the beauty, culture, and nature of Jogja.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased text-foreground bg-background dark:bg-slate-900 dark:text-slate-50">
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
