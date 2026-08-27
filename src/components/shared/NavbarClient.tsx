'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavbarClient({ user, t }: { user: any; t: any }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine navbar styles based on route and scroll state
  const isTransparent = isHome && !isScrolled;
  
  const navBgClass = isTransparent 
    ? 'bg-transparent border-transparent' 
    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm';
    
  const textClass = isTransparent 
    ? 'text-white' 
    : 'text-gray-900 dark:text-gray-100';
    
  const linkHoverClass = isTransparent
    ? 'hover:text-white/80'
    : 'hover:text-primary';

  return (
    <header className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${navBgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className={`text-2xl font-bold tracking-tight transition-colors ${isTransparent ? 'text-white' : 'text-primary'}`}>
                Kartavia
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form action="/explore" method="GET" className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isTransparent ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`} />
              </div>
              <input
                type="text"
                name="q"
                className={`block w-full pl-10 pr-3 py-2 border rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all
                  ${isTransparent 
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400' 
                    : 'border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                  }`}
                placeholder="Search destinations, tours, or activities..."
              />
            </form>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={isTransparent ? 'opacity-80' : ''}>
               <ThemeSwitcher />
            </div>
            <div className={isTransparent ? 'text-white opacity-80' : ''}>
               <LanguageSwitcher />
            </div>
            
            <Link href="/explore" className={`text-sm font-medium transition-colors hidden sm:block ${textClass} ${linkHoverClass}`}>
              {t.navbar.explore}
            </Link>
            <Link href="/planner" className={`text-sm font-medium transition-colors hidden sm:flex items-center gap-1 ${isTransparent ? 'text-white hover:text-white/80' : 'text-brand-500 hover:text-brand-600'}`}>
              {t.navbar.planner} ✨
            </Link>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className={`text-sm font-medium transition-colors ${textClass} ${linkHoverClass}`}>
                  {t.navbar.myBookings}
                </Link>
                <Link href="/dashboard/wishlist" className={`text-sm font-medium transition-colors ${textClass} ${linkHoverClass}`}>
                  {t.navbar.wishlist}
                </Link>
                <Link href="/profile" className={`text-sm font-medium transition-colors ${textClass} ${linkHoverClass}`}>
                  {t.navbar.profile}
                </Link>
                <form action={logout} className="flex items-center">
                  <div className={`flex items-center justify-center gap-2 rounded-full border p-1 pr-3 shadow-sm transition-colors
                    ${isTransparent ? 'border-white/20 bg-white/10 text-white' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100'}`}>
                    <div className={`rounded-full p-2 transition-colors ${isTransparent ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`}>
                      <User className={`h-4 w-4 ${isTransparent ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px]">{user.user_metadata?.first_name || user.email?.split('@')[0]}</span>
                    <button type="submit" className={`ml-2 transition-colors cursor-pointer ${isTransparent ? 'text-white/70 hover:text-red-300' : 'text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`} title="Log out">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white px-4 py-2 font-medium transition-colors shadow-sm shadow-primary/20">
                {t.navbar.signIn}
              </Link>
            )}
            
            <button className={`md:hidden p-2 rounded-md ${isTransparent ? 'text-white bg-white/10' : 'text-gray-600 bg-gray-100'}`}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
