import { createClient } from '@/utils/supabase/server'
import KanbanBoard from '@/components/admin/KanbanBoard'

export default async function KanbanPage() {
  const supabase = await createClient()
  
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      guests,
      total_price,
      booking_date,
      user_id,
      destinations (title)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black">
          Booking Kanban Board
        </h2>
        <p className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
          Drag and drop cards to update status
        </p>
      </div>
      
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <KanbanBoard initialBookings={bookings as any || []} />
    </div>
  )
}
