"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  Search, 
  Camera, 
  Settings, 
  Users, 
  Briefcase,
  Calendar,
  ArrowLeft,
  ChevronDown,
  Shield,
  FolderOpen,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  
  const [expandedMenu, setExpandedMenu] = useState<string | null>("wisata");

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Kartavia</span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-6 py-4 px-4 lg:px-6">
          
          {/* MENU UTAMA */}
          <div className="mb-8">
            <h3 className="mb-4 ml-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              MENU UTAMA
            </h3>
            
            <ul className="mb-6 flex flex-col gap-2">
              <li>
                <Link
                  href="/admin"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out ${
                    pathname === "/admin" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/kanban"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out ${
                    pathname.includes("kanban") 
                      ? "bg-primary/10 text-primary" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Kanban Board
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/calendar"
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out ${
                    pathname.includes("calendar") 
                      ? "bg-primary/10 text-primary" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* MANAJEMEN WISATA */}
          <div className="mb-8">
            <h3 className="mb-4 ml-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              MANAJEMEN WISATA
            </h3>
            
            <ul className="flex flex-col gap-2">
              {/* Data Master Accordion */}
              <li>
                <button
                  onClick={() => toggleMenu("master")}
                  className={`group relative flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out ${
                    expandedMenu === "master" || pathname.includes("destinations") || pathname.includes("guides") || pathname.includes("tours") || pathname.includes("partners")
                      ? "bg-primary/10 text-primary" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5" />
                    Data Master
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMenu === "master" ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${expandedMenu === "master" ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                  <ul className="flex flex-col gap-1 pl-12 pr-4">
                    <li>
                      <Link href="/admin/destinations" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("destinations") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Destinasi Wisata
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/guides" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("guides") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Tour Guides
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/tours" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("tours") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Paket Tour
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/partners" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("partners") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Mitra Lokal
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/* Operasional Accordion */}
              <li>
                <button
                  onClick={() => toggleMenu("operasional")}
                  className={`group relative flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out ${
                    expandedMenu === "operasional" || pathname.includes("bookings") || pathname.includes("capacity") || pathname.includes("waste-reports")
                      ? "bg-primary/10 text-primary" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="h-5 w-5" />
                    Operasional
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMenu === "operasional" ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${expandedMenu === "operasional" ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                  <ul className="flex flex-col gap-1 pl-12 pr-4">
                    <li>
                      <Link href="/admin/bookings" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("bookings") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Pemesanan (Bookings)
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/capacity" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("capacity") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Kontrol Kapasitas
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/waste-reports" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("waste-reports") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Laporan Sampah
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          {/* ADMINISTRATOR */}
          <div>
            <h3 className="mb-4 ml-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              ADMINISTRATOR
            </h3>
            
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  onClick={() => toggleMenu("admin")}
                  className={`group relative flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 font-medium duration-300 ease-in-out ${
                    expandedMenu === "admin" || pathname.includes("settings") || pathname.includes("homepage")
                      ? "bg-primary/10 text-primary" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    Pengaturan
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMenu === "admin" ? "rotate-180" : ""}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${expandedMenu === "admin" ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                  <ul className="flex flex-col gap-1 pl-12 pr-4">
                    <li>
                      <Link href="/admin/homepage" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("homepage") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Tampilan Beranda
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/settings" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("settings") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Sistem & Akun
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/security" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("security") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Keamanan
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/analytics" className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname.includes("analytics") ? "text-primary" : "text-slate-500 hover:text-primary dark:text-slate-400"}`}>
                        Analitik Trafik
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
