import Link from 'next/link'
import { LayoutDashboard, MapPin, CalendarCheck, Search, Bell, MessageSquare, ChevronDown, Calendar, Settings } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: adminData } = await supabase
    .from('admins')
    .select('email')
    .eq('email', user.email)
    .single()

  if (!adminData) {
    redirect('/dashboard') // Redirect non-admins to their dashboard
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Sidebar */}
      <aside className="absolute left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-hidden bg-[#1c2434] dark:bg-slate-950 duration-300 ease-linear lg:static lg:translate-x-0 text-[#dee4ee]">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-brand-500 p-1.5 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Kartavia Admin</span>
          </Link>
        </div>

        {/* Sidebar Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-400">MENU</h3>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <Link href="/admin" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/destinations" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white">
                    <MapPin className="h-5 w-5" />
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/admin/bookings" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white">
                    <CalendarCheck className="h-5 w-5" />
                    All Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/admin/kanban" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    Kanban Board
                  </Link>
                </li>
                <li>
                  <Link href="/admin/calendar" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white">
                    <Calendar className="h-5 w-5" />
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings" className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:bg-[#333A48] hover:text-white">
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-slate-900 shadow-sm transition-colors border-b border-gray-100 dark:border-slate-800">
          <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
              {/* Mobile menu toggle would go here */}
            </div>

            <div className="hidden sm:block">
              <form action="#" method="POST">
                <div className="relative">
                  <button className="absolute left-0 top-1/2 -translate-y-1/2 pl-2">
                    <Search className="h-5 w-5 text-gray-400 hover:text-brand-500" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="w-full bg-transparent pl-9 pr-4 text-black dark:text-white focus:outline-none xl:w-125 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3 2xsm:gap-7">
              <ul className="flex items-center gap-2 2xsm:gap-4">
                <li>
                  <ThemeSwitcher />
                </li>
                <li className="relative">
                  <button className="relative flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 hover:text-brand-500 cursor-pointer">
                    <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                    <Bell className="h-4.5 w-4.5 text-gray-600 dark:text-gray-300" />
                  </button>
                </li>
                <li className="relative">
                  <button className="relative flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 hover:text-brand-500 cursor-pointer">
                    <span className="absolute -top-0.5 -right-0.5 z-1 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                    <MessageSquare className="h-4.5 w-4.5 text-gray-600 dark:text-gray-300" />
                  </button>
                </li>
              </ul>

              {/* User Area */}
              <div className="relative border-l border-gray-200 dark:border-slate-700 pl-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 p-2 rounded-lg transition">
                <span className="hidden text-right lg:block">
                  <span className="block text-sm font-medium text-black dark:text-white">
                    {user.user_metadata?.first_name || 'Admin'} {user.user_metadata?.last_name || ''}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">Super Admin</span>
                </span>
                
                <span className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shrink-0">
                  {user.user_metadata?.first_name?.charAt(0) || 'A'}
                </span>

                <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
              </div>
            </div>
          </div>
        </header>
        
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
