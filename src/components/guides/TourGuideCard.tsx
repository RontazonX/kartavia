'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Languages } from 'lucide-react'
import { TourGuide } from '@/app/actions/guides'

interface TourGuideCardProps {
  guide: TourGuide
  onBook: (guide: TourGuide) => void
}

export default function TourGuideCard({ guide, onBook }: TourGuideCardProps) {
  return (
    <div className="group relative flex flex-col sm:flex-row gap-6 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      
      {/* Photo Section */}
      <Link href={`/guides/${guide.id}`} className="relative w-full sm:w-56 h-56 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-gray-100 block">
        {guide.image_url ? (
          <Image
            src={guide.image_url}
            alt={guide.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-5xl font-bold">{guide.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-1 bg-white  rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-gray-900">{guide.rating}</span>
          <span className="text-xs text-gray-500">({guide.reviews_count})</span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <Link href={`/guides/${guide.id}`} className="hover:text-[#FF5A5F] transition-colors">
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">{guide.name}</h3>
          </Link>
          <p className="text-sm text-[#64748B] mb-4 line-clamp-2 leading-relaxed">
            {guide.bio}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] rounded-lg text-[#1E293B] text-xs font-medium border border-gray-100">
              <Languages className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{guide.languages.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-[#64748B] font-medium mb-0.5">Rates from</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#FF5A5F]">Rp {guide.spot_rate.toLocaleString('id-ID')}</span>
              <span className="text-xs text-[#64748B]">/ spot</span>
            </div>
          </div>
          
          <button 
            onClick={() => onBook(guide)}
            className="px-6 py-2.5 rounded-xl bg-[#FF5A5F] text-white font-semibold text-sm hover:bg-[#E0484D] active:scale-95 transition-all duration-200 shadow-sm"
          >
            Book Guide
          </button>
        </div>
      </div>
    </div>
  )
}
