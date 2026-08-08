'use client'

import { useState } from 'react'
import { Sparkles, Map, ArrowRight } from 'lucide-react'
import { generateItinerary } from './actions'
import Button from '@/components/ui/button/Button'
import { useTranslation } from '@/i18n/client'

export default function PlannerClient() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState('')
  const [days, setDays] = useState(3)
  const [tripType, setTripType] = useState('solo')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [itinerary, setItinerary] = useState<any[] | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError('')
    
    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('days', days.toString())
    formData.append('tripType', tripType)
    
    const res = await generateItinerary(formData)
    
    if (res.error) {
      setError(res.error)
    } else if (res.itinerary) {
      setItinerary(res.itinerary)
    }
    
    setIsGenerating(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Input Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500" /> {t.planner.letsPlan}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.planner.promptLabel}</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.planner.promptPlaceholder}
              className="w-full border border-gray-300 rounded-xl p-4 focus:ring-primary focus:border-primary resize-none h-32"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Perjalanan</label>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 type="button" 
                 onClick={() => setTripType('solo')}
                 className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${tripType === 'solo' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 Solo Trip 🎒
               </button>
               <button 
                 type="button" 
                 onClick={() => setTripType('group')}
                 className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${tripType === 'group' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 Group Trip 👨‍👩‍👧‍👦
               </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.planner.durationLabel}</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="7" 
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
              <span className="font-bold text-gray-900 w-16 text-center">{days} {t.planner.days}</span>
            </div>
          </div>
          
          <Button type="submit" disabled={isGenerating || !prompt.trim()} className="w-full py-4 text-lg">
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                 <Sparkles className="h-5 w-5 animate-pulse" /> {t.planner.generating}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {t.planner.generateBtn} <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
      
      {/* Right Column: Results */}
      <div className="lg:col-span-2">
        {!itinerary && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-8 text-center">
            <Map className="h-16 w-16 mb-4 text-gray-300" />
            <h4 className="text-xl font-medium text-gray-900 mb-2">{t.planner.noItinerary}</h4>
            <p className="text-gray-500">{t.planner.noItineraryDesc}</p>
          </div>
        )}
        
        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-brand-500 min-h-[400px] p-8 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
            <Sparkles className="h-12 w-12 mb-4 animate-spin text-brand-500" />
            <p className="text-xl font-medium animate-pulse text-gray-900">{t.planner.aiExploring}</p>
            <p className="text-gray-500 mt-2">{t.planner.connecting}</p>
          </div>
        )}
        
        {itinerary && !isGenerating && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            {itinerary.map((day) => (
              <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-1/3 h-48 sm:h-auto bg-gray-100 relative">
                  {day.destination?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={day.destination.image_url} alt={day.destination.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <Map className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-brand-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    {t.planner.day} {day.day}
                  </div>
                </div>
                
                <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{day.description}</p>
                  
                  {day.destination && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-auto">
                      <p className="text-sm font-semibold text-gray-900">{t.planner.suggestedVisit}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-brand-600 font-medium">{day.destination.title}</span>
                        <span className="text-sm bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-medium">Rp {Number(day.destination.price).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center mt-8 shadow-sm">
              <h4 className="text-brand-800 font-bold mb-2 text-lg">{t.planner.readyToBook}</h4>
              <p className="text-brand-600 text-sm mb-4">{t.planner.readyToBookDesc}</p>
              <a href="/explore" className="inline-block bg-brand-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-brand-700 transition">{t.planner.goToExplore}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
