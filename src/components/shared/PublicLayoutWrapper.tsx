'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicLayoutWrapper({ 
  children, 
  Navbar, 
  Footer,
  ChatWidget
}: { 
  children: React.ReactNode;
  Navbar: React.ReactNode;
  Footer: React.ReactNode;
  ChatWidget: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isHome = pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Munculkan navbar begitu ada sedikit scroll (langsung muncul)
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <>
      {!isAdmin && Navbar}
      <main className={`flex-grow pb-16 md:pb-0 ${!isHome && !isAdmin ? 'pt-16' : ''}`}>
        {!isHome && !isAdmin && !pathname?.startsWith('/detail') && !pathname?.startsWith('/login') && !pathname?.startsWith('/register') && !pathname?.startsWith('/explore') && (
          <div className="hidden md:block w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        )}
        {children}
      </main>
      {!isAdmin && Footer}
      {!isAdmin && ChatWidget}
    </>
  );
}
