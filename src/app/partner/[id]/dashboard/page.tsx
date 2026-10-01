import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Users, DollarSign, ArrowUp, ArrowDown, Map, Ticket } from 'lucide-react'
import Link from 'next/link'

export default async function PartnerDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  // Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch partner details
  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!partner) {
    redirect('/explore')
  }

  // Check if admin
  const { data: admin } = await supabase.from('admins').select('*').eq('email', user.email).single()
  const isAdmin = !!admin

  // Check authorization
  if (user.email !== partner.owner_email && !isAdmin) {
    redirect(`/partner/${partner.id}`)
  }

  // Fetch bookings for this partner's destinations
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      destinations!inner(
        title,
        partner_id
      )
    `)
    .eq('destinations.partner_id', resolvedParams.id)

  const totalRevenue = bookings?.filter(b => b.status === 'paid').reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0
  
  // Fetch destinations count for this partner
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id')
    .eq('partner_id', resolvedParams.id)

  const destCount = destinations?.length || 0
  const recentBookings = [...(bookings || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen pb-20 transition-colors pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
              Dashboard Pengelola
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {partner.name} - Kelola pemesanan tiket desa wisata Anda.
            </p>
          </div>
          <Link href={`/partner/${partner.id}`} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300">
            Lihat Profil Publik
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mb-8">
          {/* Card 1: Revenue */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 py-6 px-7 shadow-sm transition-colors">
            <div className="flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 h-12 w-12 text-green-600 dark:text-green-400 mb-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-2xl truncate">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </h4>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pendapatan</span>
              </div>
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 py-6 px-7 shadow-sm transition-colors">
            <div className="flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 h-12 w-12 text-blue-600 dark:text-blue-400 mb-4">
              <Ticket className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-2xl">
                  {bookings?.length || 0}
                </h4>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tiket Terjual</span>
              </div>
            </div>
          </div>

          {/* Card 3: Destinations */}
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 py-6 px-7 shadow-sm transition-colors">
            <div className="flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 h-12 w-12 text-orange-600 dark:text-orange-400 mb-4">
              <Map className="h-6 w-6" />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-2xl">
                  {destCount}
                </h4>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Paket Wisata Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Daftar Pemesanan Terbaru</h3>
            <Link href="/admin/scanner" className="text-sm text-primary font-medium hover:underline flex items-center">
              Buka Scanner Gate &rarr;
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="px-6 py-4">ID Booking</th>
                  <th className="px-6 py-4">Paket Wisata</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Tamu</th>
                  <th className="px-6 py-4">Total (Rp)</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{booking.id.substring(0, 8)}...</td>
                      {/* @ts-ignore */}
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{booking.destinations?.title}</td>
                      <td className="px-6 py-4">{new Date(booking.date || booking.booking_date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">{booking.guests} Orang</td>
                      <td className="px-6 py-4 font-medium">Rp {Number(booking.total_price).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        {booking.status === 'paid' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Lunas
                          </span>
                        ) : booking.status === 'used' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            Telah Dipakai
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                            Menunggu Pembayaran
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      Belum ada data pemesanan untuk desa wisata ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
