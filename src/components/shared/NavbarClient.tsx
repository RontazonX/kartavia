'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, User, LogOut, Heart, Home, Compass, Map } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavbarClient({ user, t }: { user: any; t: any }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine navbar styles based on route and scroll state
  const isTransparent = isHome && !isScrolled;
  
  const navBgClass = isTransparent 
    ? 'bg-transparent border-transparent' 
    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm';
    
  const textClass = isTransparent ? 'text-white' : 'text-gray-900 dark:text-gray-100';
  const linkHoverClass = isTransparent ? 'hover:text-white/80' : 'hover:text-primary';

  return (
    <>
      <header className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${navBgClass} ${isTransparent ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/kartavia-logo.png"
                  alt="Kartavia Logo"
                  width={140}
                  height={32}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form action="/explore" method="GET" className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isTransparent ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  name="q"
                  className={`block w-full pl-10 pr-3 py-2 border rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all
                    ${isTransparent 
                      ? 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400' 
                      : 'border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                    }`}
                  placeholder={t.navbar.searchPlaceholder}
                />
              </form>
            </div>
            
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`${isTransparent ? 'text-white opacity-80' : ''}`}>
                 <LanguageSwitcher />
              </div>
              {/* Desktop Links */}
              <Link href="/explore" className={`text-sm font-medium transition-colors hidden lg:block ${textClass} ${linkHoverClass}`}>
                {t.navbar.explore}
              </Link>
              <Link href="/planner" className={`text-sm font-medium transition-colors hidden lg:flex items-center gap-1 ${isTransparent ? 'text-white hover:text-white/80' : 'text-brand-500 hover:text-brand-600'}`}>
                {t.navbar.planner} ✨
              </Link>
              <Link href="/guides" className={`text-sm font-medium transition-colors hidden lg:flex items-center gap-1 ${textClass} ${linkHoverClass}`}>
                {t.navbar.tourGuides}
              </Link>
              
              {/* Desktop User Section */}
              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/dashboard" className={`text-sm font-medium transition-colors ${textClass} ${linkHoverClass}`}>
                    {t.navbar.myBookings}
                  </Link>
                  <Link href="/dashboard/wishlist" className={`flex items-center transition-colors ${textClass} ${linkHoverClass}`} title={t.navbar.wishlist}>
                    <Heart className="h-5 w-5" />
                  </Link>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center gap-2 rounded-full border p-1 pr-3 shadow-sm transition-colors
                      ${isTransparent ? 'border-white/20 bg-white/10 text-white' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100'}`}>
                      <Link href="/profile" className={`rounded-full p-2 transition-colors hover:opacity-80 ${isTransparent ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`} title={t.navbar.profile}>
                        <User className={`h-4 w-4 ${isTransparent ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                      </Link>
                      <Link href="/profile" className="text-sm font-medium truncate max-w-[100px] hover:opacity-80">
                        {user.user_metadata?.first_name || user.email?.split('@')[0]}
                      </Link>
                      <form action={logout} className={`flex items-center ml-1 border-l pl-2 ${isTransparent ? 'border-white/20' : 'border-gray-200 dark:border-slate-700'}`}>
                        <button type="submit" className={`transition-colors cursor-pointer ${isTransparent ? 'text-white/70 hover:text-red-300' : 'text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`} title={t.navbar.logOut}>
                          <LogOut className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white px-4 py-2 font-medium transition-colors shadow-sm shadow-primary/20">
                  {t.navbar.signIn}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <Link href="/" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname === '/' ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t.navbar.home}</span>
          </Link>
          <Link href="/explore" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/explore') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
            <Compass className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t.navbar.explore}</span>
          </Link>
          <Link href="/planner" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/planner') ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
            <Map className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t.navbar.planner}</span>
          </Link>
          <Link href="/guides" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/guides') ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t.navbar.tourGuides}</span>
          </Link>
          {user ? (
            <Link href="/profile" className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors ${pathname.startsWith('/profile') || pathname.startsWith('/dashboard') ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.navbar.profile}</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800">
              <User className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.navbar.signIn}</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
