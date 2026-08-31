'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Map, User } from 'lucide-react';

export default function MobileBottomNav({ user, t }: { user: any; t: any }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-[110] pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <Link href="/" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname === '/' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/explore" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/explore') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </Link>
        <Link href="/planner" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/planner') ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
          <Map className="h-5 w-5" />
          <span className="text-[10px] font-medium">Planner</span>
        </Link>
        {user ? (
          <Link href="/profile" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/profile') || pathname.startsWith('/dashboard') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        ) : (
          <Link href="/login" className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800">
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
