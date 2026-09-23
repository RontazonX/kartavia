'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { DestinationDensity } from '@/app/actions/densityMap'
import { MapPin, Calendar, Clock, Search } from 'lucide-react'

// Import MapCanvas dynamically to avoid SSR issues with Leaflet
const MapCanvas = dynamic(() => import('./MapCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center border border-gray-200">
      <div className="text-gray-400 flex flex-col items-center gap-2">
        <MapPin className="w-8 h-8" />
        <span>Memuat peta...</span>
      </div>
    </div>
  )
})

interface RealtimeDensityMapProps {
  data: DestinationDensity[];
}

export default function RealtimeDensityMap({ data }: RealtimeDensityMapProps) {
  const [mode, setMode] = useState<'today' | 'tomorrow'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedDest, setSearchedDest] = useState<DestinationDensity | null>(null);

  // Take top 15, and if there is a searched dest, make sure it's included
  const top15 = data.slice(0, 15);
  let mapData = [...top15];
  if (searchedDest && !mapData.find(d => d.id === searchedDest.id)) {
    mapData.push(searchedDest);
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pantau Kepadatan Wisata</h2>
          <p className="text-gray-600 max-w-2xl">
            Lihat area mana saja yang sedang ramai hari ini, atau rencanakan perjalanan besok 
            dengan melihat prediksi kepadatan berdasarkan pemesanan tiket.
          </p>
        </div>
        
        {/* Search & Toggle Area */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari wisata lain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
            {/* Search Dropdown Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50">
                {data.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  data.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase())).map(dest => (
                    <button
                      key={`search-${dest.id}`}
                      onClick={() => {
                        setSearchedDest(dest);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{dest.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Kepadatan: {mode === 'today' ? Math.round(dest.todayPercentage) : Math.round(dest.tomorrowPercentage)}%</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">Tidak ditemukan</div>
                )}
              </div>
            )}
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setMode('today')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'today' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              Hari Ini
            </button>
            <button
              onClick={() => setMode('tomorrow')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'tomorrow' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Besok
            </button>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 flex-wrap">
        <span className="font-medium">Indikator Kepadatan:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
          <span>Aman/Sepi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
          <span>Mulai Ramai</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5A5F]"></span>
          <span>Sangat Ramai</span>
        </div>
      </div>

      {/* The Map itself */}
      <MapCanvas data={mapData} mode={mode} searchedDest={searchedDest} />
      
    </div>
  )
}
