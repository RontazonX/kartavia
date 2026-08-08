'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBookedSlots } from './actions'

export default function BookingForm({ 
  destinationId, 
  pricePerPerson,
  availableSlots = [],
  maxCapacity = 100
}: { 
  destinationId: string; 
  pricePerPerson: number;
  availableSlots?: string[];
  maxCapacity?: number;
}) {
  const [guests, setGuests] = useState(1)
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [bookedCounts, setBookedCounts] = useState<Record<string, number>>({})
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    if (date) {
      setIsLoadingSlots(true)
      getBookedSlots(destinationId, date).then(counts => {
        setBookedCounts(counts)
        setIsLoadingSlots(false)
        // Reset selected slot if it's full now
        if (timeSlot && (counts[timeSlot] || 0) + guests > maxCapacity) {
          setTimeSlot('')
        }
      })
    }
  }, [date, destinationId])

  const totalPrice = guests * pricePerPerson

  function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !timeSlot) return
    router.push(`/checkout?destination_id=${destinationId}&date=${date}&time_slot=${encodeURIComponent(timeSlot)}&guests=${guests}&total_price=${totalPrice}`)
  }

  return (
    <form onSubmit={handleBooking}>
      <div className="mb-6 border-b border-gray-100 pb-6">
        <span className="text-sm text-gray-500 block mb-1">Starting from</span>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-foreground">
            Rp {Number(pricePerPerson).toLocaleString('id-ID')}
          </span>
          <span className="text-gray-500 text-sm mb-1">/ person</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
          />
        </div>
        
        {date && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
            <select 
              required
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              disabled={isLoadingSlots || availableSlots.length === 0}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:opacity-70"
            >
              <option value="">{isLoadingSlots ? 'Loading slots...' : 'Choose a time slot'}</option>
              {availableSlots.map(slot => {
                const currentBooked = bookedCounts[slot] || 0
                const available = maxCapacity - currentBooked
                const isFull = available < guests
                
                return (
                  <option key={slot} value={slot} disabled={isFull}>
                    {slot} {isFull ? '(Full)' : `(${available} spots left)`}
                  </option>
                )
              })}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <select 
            value={guests}
            onChange={(e) => {
              const newGuests = Number(e.target.value)
              setGuests(newGuests)
              // If current slot becomes invalid due to guest increase
              if (timeSlot && (bookedCounts[timeSlot] || 0) + newGuests > maxCapacity) {
                setTimeSlot('')
              }
            }}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-foreground font-medium">Total</span>
        <span className="text-xl font-bold text-foreground">Rp {totalPrice.toLocaleString('id-ID')}</span>
      </div>

      <button 
        type="submit" 
        className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 cursor-pointer"
      >
        Book Now
      </button>
      <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
    </form>
  )
}
