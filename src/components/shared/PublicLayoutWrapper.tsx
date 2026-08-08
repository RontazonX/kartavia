'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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
      {!isAdmin && (
        <div 
          className={`
            ${isHome ? 'fixed' : 'sticky'} 
            top-0 left-0 w-full z-[100] 
            transition-transform duration-300 ease-in-out
            ${isHome && !isScrolled ? '-translate-y-full' : 'translate-y-0'}
          `}
        >
          {Navbar}
        </div>
      )}
      <main className="flex-grow">{children}</main>
      {!isAdmin && Footer}
      {!isAdmin && ChatWidget}
    </>
  );
}
