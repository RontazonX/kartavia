'use client'

import React, { useState } from 'react'
import { X, Calendar as CalendarIcon, Clock, MessageCircle } from 'lucide-react'
import { TourGuide, createGuideBooking } from '@/app/actions/guides'

interface GuideBookingModalProps {
  guide: TourGuide
  isOpen: boolean
  onClose: () => void
}

export default function GuideBookingModal({ guide, isOpen, onClose }: GuideBookingModalProps) {
  const [bookingType, setBookingType] = useState<'spot' | 'daily'>('spot')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form states
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState(1)
  const [contactNumber, setContactNumber] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  if (!isOpen) return null

  const totalPrice = bookingType === 'spot' 
    ? guide.spot_rate * duration
    : guide.daily_rate * duration

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!startDate || !contactNumber) {
      setError('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    const result = await createGuideBooking({
      guide_id: guide.id,
      booking_type: bookingType,
      start_date: startDate,
      duration: duration,
      total_price: totalPrice,
      contact_number: contactNumber,
      special_requests: specialRequests
    })

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        // reset form
        setStartDate('')
        setDuration(1)
        setContactNumber('')
        setSpecialRequests('')
      }, 3000)
    }
  }

  const handleContact = () => {
    const message = encodeURIComponent(`Hi ${guide.name}, I'm interested in booking a tour with you via Kartavia.`)
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#1E293B]/90 "
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-[#1E293B]">Book {guide.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#FF5A5F]/10 rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-[#FF5A5F] rounded-full flex items-center justify-center text-white">
                  ✓
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Booking Requested!</h3>
              <p className="text-[#64748B]">
                Your request has been sent. The guide will contact you shortly to confirm details.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 p-1.5 bg-[#F8FAFC] rounded-xl mb-6 border border-gray-100">
                <button
                  type="button"
                  onClick={() => setBookingType('spot')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                    bookingType === 'spot'
                      ? 'bg-white text-[#FF5A5F] shadow-sm'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Spot Scale
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('daily')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                    bookingType === 'daily'
                      ? 'bg-white text-[#FF5A5F] shadow-sm'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  Daily Scale
                </button>
              </div>

              <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">Start Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] outline-none transition-all text-[#1E293B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">
                    {bookingType === 'spot' ? 'Duration (Hours)' : 'Duration (Days)'}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="number"
                      required
                      min="1"
                      max={bookingType === 'spot' ? "12" : "14"}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] outline-none transition-all text-[#1E293B]"
                    />
                  </div>
                  <p className="text-xs text-[#64748B] mt-1.5 font-medium">
                    Rate: Rp {bookingType === 'spot' ? guide.spot_rate.toLocaleString() : guide.daily_rate.toLocaleString()} / {bookingType === 'spot' ? 'hour' : 'day'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">WhatsApp Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+62..."
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] outline-none transition-all text-[#1E293B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">Special Requests (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Specific places to visit, dietary requirements..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] outline-none transition-all resize-none text-[#1E293B]"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {!success && (
          <div className="p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-0 z-10">
            <div className="flex flex-col w-full sm:w-auto">
              <span className="text-sm text-[#64748B] font-medium">Total Price</span>
              <span className="text-2xl font-bold text-[#FF5A5F]">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                type="button"
                onClick={handleContact}
                className="flex items-center justify-center p-3 rounded-xl bg-white border border-gray-200 text-[#1E293B] hover:bg-gray-50 transition-colors shadow-sm"
                title="Ask Question via WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button 
                form="booking-form"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#FF5A5F] hover:bg-[#E0484D] text-white font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Request Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
