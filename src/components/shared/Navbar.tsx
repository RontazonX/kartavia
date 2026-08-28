import Link from 'next/link';
import { Search, User, Menu, LogOut, Heart } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/actions/auth';
import { getTranslation } from '@/i18n/server';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary tracking-tight">Kartavia</span>
            </Link>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form action="/explore" method="GET" className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                name="q"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-full leading-5 bg-surface dark:bg-slate-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all text-gray-900 dark:text-gray-100"
                placeholder="Search destinations, tours, or activities..."
              />
            </form>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            
            <Link href="/explore" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">
              {t.navbar.explore}
            </Link>
            <Link href="/planner" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors hidden sm:flex items-center gap-1">
              {t.navbar.planner} ✨
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">
              {t.navbar.about || 'About'}
            </Link>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t.navbar.myBookings}
                </Link>
                <Link href="/dashboard/wishlist" className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors" title="Wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
                <div className="flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-slate-700 p-1 pr-3 shadow-sm bg-white dark:bg-slate-800 transition-colors">
                  <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-gray-100 dark:bg-slate-700 rounded-full p-2 transition-colors">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px] text-gray-900 dark:text-gray-100">{user.user_metadata?.first_name || user.email?.split('@')[0]}</span>
                  </Link>
                  <form action={logout} className="flex items-center ml-1 border-l border-gray-200 dark:border-slate-700 pl-2">
                    <button type="submit" className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer" title="Log out">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white px-4 py-2 font-medium transition-colors shadow-sm shadow-primary/20">
                {t.navbar.signIn}
              </Link>
            )}
            
            <button className="md:hidden p-2 text-gray-600 bg-white rounded-md">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
