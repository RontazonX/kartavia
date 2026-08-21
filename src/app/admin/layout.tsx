"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .single();

      if (!adminData) {
        router.push('/dashboard');
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900"><div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div></div>;
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white bg-gray-50 text-slate-800 transition-colors">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
