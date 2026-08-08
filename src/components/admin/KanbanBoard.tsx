'use client'

import { useState } from 'react'
import { create } from 'zustand'
import { updateBookingStatus } from '@/app/admin/kanban/actions'

interface Booking {
  id: string
  status: string
  guests: number
  total_price: number
  booking_date: string
  destinations: { title: string }
  user_id: string
}

interface KanbanStore {
  bookings: Booking[]
  setBookings: (bookings: Booking[]) => void
  updateStatus: (id: string, status: string) => void
}

const useKanbanStore = create<KanbanStore>((set) => ({
  bookings: [],
  setBookings: (bookings: Booking[]) => set({ bookings }),
  updateStatus: (id: string, status: string) => set((state: KanbanStore) => ({
    bookings: state.bookings.map((b: Booking) => b.id === id ? { ...b, status } : b)
  }))
}))

export default function KanbanBoard({ initialBookings }: { initialBookings: Booking[] }) {
  const { bookings, setBookings, updateStatus } = useKanbanStore()
  const [isInitialized, setIsInitialized] = useState(false)
  
  if (!isInitialized) {
    setBookings(initialBookings)
    setIsInitialized(true)
  }

  const columns = [
    { id: 'pending', title: 'Pending', bgColor: 'bg-orange-50', headerColor: 'text-orange-600 border-orange-200' },
    { id: 'paid', title: 'Paid', bgColor: 'bg-green-50', headerColor: 'text-green-600 border-green-200' },
    { id: 'cancelled', title: 'Cancelled', bgColor: 'bg-red-50', headerColor: 'text-red-600 border-red-200' }
  ]

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('bookingId', id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Required to allow dropping
  }

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const bookingId = e.dataTransfer.getData('bookingId')
    if (!bookingId) return

    const booking = bookings.find(b => b.id === bookingId)
    if (!booking || booking.status === columnId) return

    // Optimistic update
    updateStatus(bookingId, columnId)
    
    // Server action
    const res = await updateBookingStatus(bookingId, columnId)
    if (res?.error) {
      // Revert if error
      updateStatus(bookingId, booking.status)
      alert(res.error)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
      {columns.map(col => (
        <div 
          key={col.id} 
          className={`flex-1 flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className={`p-4 border-b bg-gray-50 flex items-center justify-between`}>
            <h3 className={`font-bold uppercase tracking-wider text-sm ${col.headerColor}`}>{col.title}</h3>
            <span className="bg-white text-gray-600 text-xs font-bold px-2 py-1 rounded-full border border-gray-200">
              {bookings.filter((b: Booking) => b.status === col.id).length}
            </span>
          </div>
          
          <div className={`flex-1 p-4 overflow-y-auto ${col.bgColor} space-y-4`}>
            {bookings.filter((b: Booking) => b.status === col.id).map((booking: Booking) => (
              <div 
                key={booking.id}
                draggable
                onDragStart={(e) => handleDragStart(e, booking.id)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab hover:shadow-md transition-shadow hover:-translate-y-0.5 active:cursor-grabbing"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(booking.destinations as any)?.title || 'Unknown Destination'}
                  </h4>
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    {booking.id.split('-')[0]}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium text-gray-900">{new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium text-gray-900">{booking.guests}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span>Total:</span>
                    <span className="font-bold text-brand-600">Rp {Number(booking.total_price).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {bookings.filter((b: Booking) => b.status === col.id).length === 0 && (
              <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl">
                <span className="text-gray-400 text-sm font-medium">Drop items here</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
