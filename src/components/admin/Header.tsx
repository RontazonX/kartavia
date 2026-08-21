"use client";

import Link from "next/link";
import DropdownUser from "@/components/admin/DropdownUser";
import { Search, Bell, MessageSquare, Menu } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

interface HeaderProps {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}

const Header = (props: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-slate-900 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] transition-colors">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        
        {/* Hamburger Toggle Button for Mobile */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:hidden cursor-pointer"
          >
            <Menu className="h-5.5 w-5.5 text-slate-600 dark:text-white" />
          </button>
          
          <Link className="block flex-shrink-0 lg:hidden" href="/admin">
             <div className="bg-primary p-1 rounded">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
               </svg>
             </div>
          </Link>
        </div>

        {/* Search Input */}
        <div className="hidden sm:block">
          <form action="#" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer pl-1">
                <Search className="h-5 w-5 fill-body hover:fill-primary text-slate-400" />
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125 dark:text-white dark:placeholder-slate-400"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Theme Toggle */}
            <li>
               <ThemeSwitcher />
            </li>
            
            {/* Notifications */}
            <li className="relative">
               <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer transition">
                  <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                  <Bell className="h-4.5 w-4.5" />
               </button>
            </li>
            
            {/* Messages */}
            <li className="relative">
               <button className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer transition">
                  <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                  <MessageSquare className="h-4.5 w-4.5" />
               </button>
            </li>
          </ul>

          {/* User Profile Area */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
