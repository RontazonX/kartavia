'use client';

import React from 'react';
import { 
  Download, Globe, Users, 
  ShoppingCart, Settings, Briefcase,
  ExternalLink, Wand2, Leaf, Search, Activity, ArrowRight, MapPin
} from 'lucide-react';

export default function AdminSitemapPage() {
  
  const handleDownloadPDF = () => {
    window.print();
  };

  const domain = "https://kartavia.vercel.app";

  const sitemapData = [
    {
      title: 'DISCOVERY',
      subtitle: 'Public & Search',
      bg: 'bg-[#74d6a6]', // Emerald (Match image col 1)
      icon: <Search className="w-12 h-12 mb-2 stroke-1" />,
      items: [
        { name: 'Home Landing', path: '/' },
        { name: 'Explore Catalog', path: '/explore' },
        { name: 'Destination Detail', path: '/detail/1' },
        { name: 'Tour Guides', path: '/guides' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Info', path: '/contact' },
      ]
    },
    {
      title: 'USER HUB',
      subtitle: 'Accounts & AI',
      bg: 'bg-[#3eb4f0]', // Sky (Match image col 2)
      icon: <Users className="w-12 h-12 mb-2 stroke-1" />,
      items: [
        { name: 'Login & Register', path: '/login' },
        { name: 'AI Trip Planner', path: '/planner' },
        { name: 'Profile & Preferences', path: '/profile' },
        { name: 'My Dashboard', path: '/dashboard' },
        { name: 'Checkout / Payment', path: '/checkout' },
      ]
    },
    {
      title: 'MASTER DATA',
      subtitle: 'Admin Catalog',
      bg: 'bg-[#45d9db]', // Cyan (Match image col 3)
      icon: <Briefcase className="w-12 h-12 mb-2 stroke-1" />,
      items: [
        { name: 'Data Destinasi', path: '/admin/destinations' },
        { name: 'Data Tour Guides', path: '/admin/guides' },
        { name: 'Data Paket Tour', path: '/admin/tours' },
        { name: 'Data Mitra Lokal', path: '/admin/partners' },
      ]
    },
    {
      title: 'OPERATIONS',
      subtitle: 'Admin / Vendors',
      bg: 'bg-[#c45ae2]', // Fuchsia (Match image col 4)
      icon: <Activity className="w-12 h-12 mb-2 stroke-1" />,
      items: [
        { name: 'Pemesanan (Bookings)', path: '/admin/bookings' },
        { name: 'Kontrol Kapasitas', path: '/admin/capacity' },
        { name: 'Laporan Sampah', path: '/admin/waste-reports' },
        { name: 'Kanban Board', path: '/admin/kanban' },
        { name: 'Operational Calendar', path: '/admin/calendar' },
        { name: 'Partner Portal', path: '/partner' },
      ]
    },
    {
      title: 'SYSTEM ADMIN',
      subtitle: 'Settings & Analytics',
      bg: 'bg-[#f9b84a]', // Amber (Match image col 5)
      icon: <Settings className="w-12 h-12 mb-2 stroke-1" />,
      items: [
        { name: 'Admin Dashboard', path: '/admin' },
        { name: 'Tampilan Beranda', path: '/admin/homepage' },
        { name: 'Analitik Trafik', path: '/admin/analytics' },
        { name: 'Sistem & Akun', path: '/admin/settings' },
        { name: 'Keamanan (Security)', path: '/admin/security' },
        { name: 'Visual Sitemap', path: '/admin/sitemap' },
      ]
    }
  ];

  return (
    <div className="w-full mx-auto print:m-0 print:p-0 min-h-screen pb-20">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Visual Sitemap
        </h1>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* SITEMAP CANVAS (Matches provided image exactly but with Kartavia data) */}
      <div className="bg-white p-4 md:p-10 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto print:overflow-visible print:border-none print:shadow-none print:p-0">
        <div className="min-w-[1100px] print:min-w-0">
          
          {/* Top Bar: KARTAVIA VISUAL SITEMAP */}
          <div className="bg-[#38485a] rounded-lg py-12 mb-8 text-center relative shadow-sm overflow-hidden">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
              style={{ backgroundImage: "url('https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#38485a]/80 z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-white text-3xl md:text-4xl font-semibold tracking-[0.2em] uppercase drop-shadow-lg">Kartavia Visual Sitemap</h2>
              <div className="mt-4 flex justify-center">
              <a 
                href={domain} 
                target="_blank" 
                rel="noreferrer"
                className="text-sky-300 hover:text-sky-200 hover:underline flex items-center gap-1.5 text-sm font-medium bg-slate-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {domain}/
              </a>
            </div>
          </div>
        </div>

          {/* Grid of Categories (5 Columns) */}
          <div className="grid grid-cols-5 gap-4">
            {sitemapData.map((col, idx) => (
              <div key={idx} className="flex flex-col">
                
                {/* Main Category Header Block (Flat, matching image) */}
                <div className={`${col.bg} rounded-xl p-6 text-white flex flex-col items-center justify-center text-center shadow-sm mb-6 h-40`}>
                  {col.icon}
                  <h3 className="text-xl font-normal tracking-wide uppercase leading-tight">{col.title}</h3>
                  <p className="text-xs text-white/80 mt-1 font-light">{col.subtitle}</p>
                </div>

                {/* Sub-pages Pills */}
                <div className="flex flex-col gap-4">
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex flex-col print:break-inside-avoid">
                      {/* Colored Pill */}
                      <div className={`${col.bg} rounded-full py-2.5 px-3 flex items-center text-white shadow-sm hover:opacity-90 transition-opacity cursor-default`}>
                        <div className="w-5 h-5 rounded-full bg-white/40 shrink-0 mr-3"></div>
                        <span className="text-sm font-medium truncate">{item.name}</span>
                      </div>
                      
                      {/* Blue Clickable Link */}
                      <a 
                        href={`${domain}${item.path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700 hover:underline text-xs mt-1.5 ml-8 flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.path}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* WORKFLOW / USER JOURNEY (Flat style) */}
          <div className="mt-16 pt-8 border-t-2 border-slate-300 print:break-before-page">
            <h4 className="text-lg text-slate-500 font-medium mb-6">Kartavia Core Workflow</h4>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-sky-100 border border-sky-200 p-4 rounded-lg text-center">
                <Wand2 className="w-6 h-6 text-sky-500 mx-auto mb-2" />
                <h5 className="font-bold text-slate-700 text-sm">1. Generate Itinerary</h5>
                <p className="text-xs text-slate-500 mt-1">RAG-powered AI Planner</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
              
              <div className="flex-1 bg-amber-100 border border-amber-200 p-4 rounded-lg text-center">
                <MapPin className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <h5 className="font-bold text-slate-700 text-sm">2. Smart Alternatives</h5>
                <p className="text-xs text-slate-500 mt-1">Check Live Density Traffic</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
              
              <div className="flex-1 bg-fuchsia-100 border border-fuchsia-200 p-4 rounded-lg text-center">
                <ShoppingCart className="w-6 h-6 text-fuchsia-500 mx-auto mb-2" />
                <h5 className="font-bold text-slate-700 text-sm">3. Checkout</h5>
                <p className="text-xs text-slate-500 mt-1">Book Tickets & Guides</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
              
              <div className="flex-1 bg-emerald-100 border border-emerald-200 p-4 rounded-lg text-center">
                <Leaf className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <h5 className="font-bold text-slate-700 text-sm">4. Zero Waste Hero</h5>
                <p className="text-xs text-slate-500 mt-1">Report Waste, Earn Points</p>
              </div>
            </div>
          </div>

          {/* Footer Navigation Map (Matches image) */}
          <div className="mt-12 pt-8 border-t-2 border-slate-300">
            <h4 className="text-lg text-slate-500 font-medium mb-6">Footer (primary navigation + additional)</h4>
            
            <div className="flex gap-16 text-slate-500 text-sm">
              <div className="flex flex-col gap-1 border-r border-slate-200 pr-16">
                <p className="font-semibold text-slate-700 mb-2">Platform</p>
                <p>Explore</p>
                <p>AI Planner</p>
                <p>Destinations</p>
                <p>Tour Guides</p>
              </div>
              <div className="flex flex-col gap-1 border-r border-slate-200 pr-16">
                <p className="font-semibold text-slate-700 mb-2">Partners</p>
                <p>Join as Partner</p>
                <p>Partner Portal</p>
                <p>API Access</p>
              </div>
              <div className="flex flex-col gap-1 border-r border-slate-200 pr-16">
                <p className="font-semibold text-slate-700 mb-2">Information</p>
                <p>About Kartavia</p>
                <p>Contact Us</p>
                <p>Help Center</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-slate-700 mb-2">Legal & Social</p>
                <p>Newsletter Signup</p>
                <p>Terms of Service</p>
                <p>Privacy Policy</p>
                <p>Social Channels</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Print Specific CSS to enforce good printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 10mm; }
          body, html {
            height: auto !important;
            overflow: visible !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .h-screen { height: auto !important; min-height: 0 !important; }
          .overflow-hidden, .overflow-y-auto, .overflow-x-hidden { overflow: visible !important; }
          main {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}} />
    </div>
  );
}
