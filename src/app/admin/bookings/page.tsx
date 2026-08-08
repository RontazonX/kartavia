import { createClient } from '@/utils/supabase/server'
import ExportButtons from '@/components/admin/ExportButtons'

export default async function AdminBookings() {
  const supabase = await createClient()
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      destinations (title)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">All Bookings</h1>
        <ExportButtons data={bookings || []} />
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
              <th className="p-4">Customer ID</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Date</th>
              <th className="p-4">Guests</th>
              <th className="p-4">Total Price</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings?.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600 text-sm font-mono truncate max-w-[120px]">{booking.user_id}</td>
                <td className="p-4 font-medium text-gray-900">{booking.destinations?.title}</td>
                <td className="p-4 text-gray-600">
                  {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4 text-gray-600">{booking.guests}</td>
                <td className="p-4 font-semibold text-gray-900">Rp {Number(booking.total_price).toLocaleString('id-ID')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                    booking.status === 'paid' ? 'bg-success-100 text-success-700' :
                    booking.status === 'cancelled' ? 'bg-error-100 text-error-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
