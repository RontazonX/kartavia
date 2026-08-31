'use client'

import React, { useEffect, useState } from 'react'
import { getTourGuides, TourGuide } from '@/app/actions/guides'
import TourGuideCard from '@/components/guides/TourGuideCard'
import GuideBookingModal from '@/components/guides/GuideBookingModal'

export default function GuidesPage() {
  const [guides, setGuides] = useState<TourGuide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null)

  useEffect(() => {
    async function loadGuides() {
      try {
        const data = await getTourGuides()
        setGuides(data)
      } catch (error) {
        console.error('Failed to load guides', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadGuides()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 mb-8 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1E293B] mb-4 tracking-tight">
            Meet Our <span className="text-[#FF5A5F]">Local Experts</span>
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl">
            Book a professional tour guide for your next adventure in Jogja. Choose between a dedicated spot guide or a full-day companion.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 h-[280px] sm:h-64 rounded-2xl w-full" />
            ))}
          </div>
        ) : guides.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <TourGuideCard 
                key={guide.id} 
                guide={guide} 
                onBook={(g) => setSelectedGuide(g)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">No Guides Available</h3>
            <p className="text-[#64748B]">Check back later for available local experts.</p>
          </div>
        )}

        {selectedGuide && (
          <GuideBookingModal
            guide={selectedGuide}
            isOpen={!!selectedGuide}
            onClose={() => setSelectedGuide(null)}
          />
        )}
      </div>
    </div>
  )
}
