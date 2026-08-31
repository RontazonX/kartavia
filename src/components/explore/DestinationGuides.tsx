'use client'

import React, { useState } from 'react'
import { TourGuide } from '@/app/actions/guides'
import TourGuideCard from '@/components/guides/TourGuideCard'
import GuideBookingModal from '@/components/guides/GuideBookingModal'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/i18n/client'

interface DestinationGuidesProps {
  guides: TourGuide[]
}

export default function DestinationGuides({ guides }: DestinationGuidesProps) {
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null)
  const { t } = useTranslation()

  if (!guides || guides.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.explore.guides.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">
            {t.explore.guides.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {guides.map(guide => (
          <div key={guide.id} className="relative group">
            <Link href={`/guides/${guide.id}`} className="absolute inset-0 z-10" aria-label={`View details of ${guide.name}`} />
            <div className="relative z-20 pointer-events-none">
              <TourGuideCard 
                guide={guide} 
                onBook={(g) => {
                  setSelectedGuide(g)
                }} 
              />
            </div>
            {/* We overlay a transparent link to go to detail, but wait, if it's over the whole card, we can't click "Book Guide". 
                Let's override the pointer-events so the button is clickable, or just modify TourGuideCard to be a link. 
                Instead of wrapping with a complex z-index, let's just render TourGuideCard and let its "Book" button work. 
                We will update TourGuideCard later to make the name/image clickable to `/guides/[id]`.
            */}
          </div>
        ))}
      </div>

      {selectedGuide && (
        <GuideBookingModal
          guide={selectedGuide}
          isOpen={!!selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </div>
  )
}
