'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getBookedSlots } from './actions'
import { useTranslation } from '@/i18n/client'

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
  const [bookedCount, setBookedCount] = useState<number>(0)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (date) {
      setIsLoadingSlots(true)
      getBookedSlots(destinationId, date).then(count => {
        setBookedCount(count as number)
        setIsLoadingSlots(false)
      })
    }
  }, [date, destinationId])

  const totalPrice = guests * pricePerPerson

  function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return
    router.push(`/checkout?destination_id=${destinationId}&date=${date}&guests=${guests}&total_price=${totalPrice}`)
  }

  return (
    <form onSubmit={handleBooking}>
      <div className="mb-6 border-b border-gray-100 pb-6">
        <span className="text-sm text-gray-500 block mb-1">{t.booking.startingFrom}</span>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-foreground">
            Rp {Number(pricePerPerson).toLocaleString('id-ID')}
          </span>
          <span className="text-gray-500 text-sm mb-1">{t.booking.perPerson}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.selectDate}</label>
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
          <div className="text-sm">
            {isLoadingSlots ? (
              <span className="text-gray-500">{t.booking.checkingAvailability}</span>
            ) : (
              <span className={maxCapacity - bookedCount < guests ? 'text-red-500 font-medium' : 'text-green-600 font-medium'}>
                {maxCapacity - bookedCount} {t.booking.quotaLeft}
              </span>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.guests}</label>
          <select 
            value={guests}
            onChange={(e) => {
              const newGuests = Number(e.target.value)
              setGuests(newGuests)
            }}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num} disabled={date && !isLoadingSlots ? (maxCapacity - bookedCount < num) : false}>
                {num} {num === 1 ? t.booking.guest : t.booking.guests}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <span className="text-foreground font-medium">{t.booking.total}</span>
        <span className="text-xl font-bold text-foreground">Rp {totalPrice.toLocaleString('id-ID')}</span>
      </div>

      <button 
        type="submit" 
        className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 cursor-pointer"
      >
        {t.booking.bookNow}
      </button>
      <p className="text-center text-xs text-gray-400 mt-4">{t.booking.wontBeCharged}</p>
    </form>
  )
}
