import { createClient } from '@/utils/supabase/server'
import { Users, DollarSign, ArrowUp, ArrowDown, Map } from 'lucide-react'
import RevenueChart from '@/components/admin/RevenueChart'
import AnalyticsChart from '@/components/admin/AnalyticsChart'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Fetch Destinations
  const { data: destinations } = await supabase.from('destinations').select('*')
  const destCount = destinations?.length || 0
  
  // 2. Fetch Bookings
  const { data: bookings } = await supabase.from('bookings').select('*, destinations(title)')
  const totalRevenue = bookings?.filter(b => b.status === 'paid').reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0
  
  // --- CALCULATION OF MONTH-OVER-MONTH (MoM) CHANGES ---
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // Booking Stats
  let currentMonthBookings = 0
  let prevMonthBookings = 0
  let currentMonthRevenue = 0
  let prevMonthRevenue = 0

  bookings?.forEach(b => {
    const d = new Date(b.created_at)
    if (d >= currentMonthStart) {
      currentMonthBookings++
      if (b.status === 'paid') currentMonthRevenue += Number(b.total_price)
    } else if (d >= prevMonthStart && d <= prevMonthEnd) {
      prevMonthBookings++
      if (b.status === 'paid') prevMonthRevenue += Number(b.total_price)
    }
  })

  // Helper function to calculate percentage
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const revenueChange = calculateChange(currentMonthRevenue, prevMonthRevenue)
  const bookingsChange = calculateChange(currentMonthBookings, prevMonthBookings)

  // Render Indicator
  const renderIndicator = (change: number) => {
    if (change === 0) return <span className="text-sm font-medium text-gray-500">0%</span>
    if (change > 0) {
      return (
        <span className="flex items-center gap-1 text-sm font-medium text-success-500">
          {change.toFixed(1)}% <ArrowUp className="h-4 w-4" />
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-error-500">
        {Math.abs(change).toFixed(1)}% <ArrowDown className="h-4 w-4" />
      </span>
    )
  }

  // Sort bookings by date descending for recent bookings table
  const recentBookings = [...(bookings || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Business Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-8">
        
        {/* Card 1: Revenue */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl truncate max-w-[200px]">
                Rp {totalRevenue >= 1000000 ? (totalRevenue / 1000000).toFixed(1) + 'M' : totalRevenue.toLocaleString('id-ID')}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Profit</span>
            </div>
            {renderIndicator(revenueChange)}
          </div>
        </div>

        {/* Card 2: Bookings */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                {bookings?.length || 0}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</span>
            </div>
            {renderIndicator(bookingsChange)}
          </div>
        </div>

        {/* Card 3: Destinations */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <Map className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                {destCount}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Destinations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 mb-8">
        <div className="col-span-12 xl:col-span-8">
          <RevenueChart data={bookings || []} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AnalyticsChart data={bookings || []} />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1 transition-colors">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Recent Bookings
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-t-lg bg-gray-50 dark:bg-slate-800 sm:grid-cols-5 border-b border-gray-200 dark:border-slate-700">
            <div className="p-4">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Destination</h5>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Date</h5>
            </div>
            <div className="p-4 text-center">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Guests</h5>
            </div>
            <div className="hidden p-4 text-center sm:block">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Price</h5>
            </div>
            <div className="hidden p-4 text-center sm:block">
              <h5 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">Status</h5>
            </div>
          </div>

          {recentBookings.length > 0 ? (
            recentBookings.map((booking, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === recentBookings.length - 1 ? '' : 'border-b border-gray-100 dark:border-slate-800'
                }`}
                key={booking.id}
              >
                <div className="flex items-center gap-3 p-4">
                  <p className="hidden text-black dark:text-white font-medium sm:block truncate">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(booking.destinations as any)?.title}
                  </p>
                </div>

                <div className="flex items-center justify-center p-4">
                  <p className="text-black dark:text-white">{new Date(booking.date).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-center p-4">
                  <p className="text-gray-600 dark:text-gray-400">{booking.guests}</p>
                </div>

                <div className="hidden items-center justify-center p-4 sm:flex">
                  <p className="text-black dark:text-white font-medium">Rp {Number(booking.total_price).toLocaleString('id-ID')}</p>
                </div>

                <div className="hidden items-center justify-center p-4 sm:flex">
                  {booking.status === 'paid' ? (
                    <p className="text-success-600 bg-success-50 rounded-full px-3 py-1 text-sm font-medium">Paid</p>
                  ) : booking.status === 'cancelled' ? (
                    <p className="text-error-600 bg-error-50 rounded-full px-3 py-1 text-sm font-medium">Cancelled</p>
                  ) : (
                    <p className="text-warning-600 bg-warning-50 rounded-full px-3 py-1 text-sm font-medium capitalize">{booking.status}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No recent bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
