'use client'

import React, { useEffect, useState } from 'react'
import { getTourGuideById, getGuideDestinations, TourGuide } from '@/app/actions/guides'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Star, Languages, MapPin, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import GuideBookingModal from '@/components/guides/GuideBookingModal'
import { notFound, useParams } from 'next/navigation'

export default function GuideDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [guide, setGuide] = useState<TourGuide | null>(null)
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    async function loadGuide() {
      try {
        const guideData = await getTourGuideById(id)
        if (!guideData) {
          setIsLoading(false)
          return
        }
        setGuide(guideData)

        // Load destinations
        const destIds = await getGuideDestinations(id)
        if (destIds.length > 0) {
          const supabase = createClient()
          const { data } = await supabase
            .from('destinations')
            .select('id, title, image_url')
            .in('id', destIds)
          
          if (data) setDestinations(data)
        }
      } catch (error) {
        console.error('Failed to load guide details', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadGuide()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5A5F]"></div>
      </div>
    )
  }

  if (!guide) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link prefetch={false} href="/guides" className="inline-flex items-center text-[#64748B] hover:text-[#FF5A5F] mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column - Image */}
          <div className="w-full md:w-2/5 h-80 md:h-auto relative bg-gray-100 shrink-0">
            {guide.image_url ? (
              <Image src={guide.image_url} alt={guide.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-8xl font-bold">{guide.name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-[#1E293B]">{guide.rating}</span>
              <span className="text-sm text-[#64748B]">({guide.reviews_count} reviews)</span>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-2">{guide.name}</h1>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] rounded-lg text-[#1E293B] text-sm font-medium border border-gray-100">
                <Languages className="w-4 h-4 text-[#64748B]" />
                <span>{guide.languages.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] rounded-lg text-[#1E293B] text-sm font-medium border border-gray-100">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Verified Local Guide</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1E293B] mb-3">About Me</h3>
              <p className="text-[#64748B] leading-relaxed whitespace-pre-line">
                {guide.bio}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1E293B] mb-3">Operates In</h3>
              {destinations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {destinations.map(dest => (
                    <Link prefetch={false} key={dest.id} href={`/detail/${dest.id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-[#1E293B] border border-gray-200 transition-colors">
                      <MapPin className="w-4 h-4 text-[#FF5A5F]" /> {dest.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Flexible across Jogja region.</p>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-[#64748B] font-medium mb-1">Pricing</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#FF5A5F]">Rp {guide.spot_rate.toLocaleString('id-ID')}</span>
                  <span className="text-sm text-[#64748B]">/ spot</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  or Rp {guide.daily_rate.toLocaleString('id-ID')} / day
                </div>
              </div>
              
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF5A5F] text-white font-bold hover:bg-[#E0484D] active:scale-95 transition-all shadow-sm"
              >
                Book {guide.name.split(' ')[0]}
              </button>
            </div>

          </div>
        </div>
      </div>

      <GuideBookingModal
        guide={guide}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  )
}
