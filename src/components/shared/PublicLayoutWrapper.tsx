'use client';

import { usePathname } from 'next/navigation';

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

  return (
    <>
      {!isAdmin && Navbar}
      <main className="flex-grow">{children}</main>
      {!isAdmin && Footer}
      {!isAdmin && ChatWidget}
    </>
  );
}
