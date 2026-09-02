import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getTranslation } from '@/i18n/server';

export default async function Footer() {
  const t = await getTranslation();
  return (
    <footer className="bg-surface dark:bg-slate-950 pt-16 pb-8 border-t border-gray-100 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link prefetch={false} href="/" className="mb-6 block">
              <Image
                src="/kartavia-logo.png"
                alt="Kartavia Logo"
                width={140}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-sm font-medium">FB</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-sm font-medium">TW</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-sm font-medium">IG</a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-sm font-medium">YT</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white uppercase tracking-wider mb-4">{t.footer.explore}</h3>
            <ul className="space-y-3">
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.destinations}</Link></li>
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.tourPackages}</Link></li>
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.attractionTickets}</Link></li>
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.carRentals}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white uppercase tracking-wider mb-4">{t.footer.contactUs}</h3>
            <ul className="space-y-3">
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.helpCenter}</Link></li>
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.privacyPolicy}</Link></li>
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.termsOfService}</Link></li>
              <li><Link prefetch={false} href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">{t.footer.contactUs}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground dark:text-white uppercase tracking-wider mb-4">{t.footer.newsletter}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.footer.subscribeDesc}</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder={t.footer.emailPlaceholder}
                className="min-w-0 flex-1 appearance-none rounded-l-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
              <button 
                type="submit" 
                className="flex w-auto flex-shrink-0 items-center justify-center rounded-r-lg border border-transparent bg-primary px-4 py-2 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:text-sm transition-colors cursor-pointer"
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Kartavia. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
