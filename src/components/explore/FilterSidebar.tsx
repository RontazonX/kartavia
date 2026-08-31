'use client'

import { Filter, Star } from 'lucide-react'
import { useCallback, useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useTranslation } from '@/i18n/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  
  const currentCategory = searchParams.get('category') || ''
  const currentMinPrice = searchParams.get('min_price') || ''
  const currentMaxPrice = searchParams.get('max_price') || ''
  const currentRating = searchParams.get('rating') || ''

  const [minPrice, setMinPrice] = useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice)

  // Use the highly efficient debounce hook to delay URL updates until typing stops
  const debouncedMinPrice = useDebounce(minPrice, 500)
  const debouncedMaxPrice = useDebounce(maxPrice, 500)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const updateUrl = useCallback((name: string, value: string) => {
    router.push('/explore?' + createQueryString(name, value))
  }, [router, createQueryString])

  // Effect to sync debounced prices to URL
  useEffect(() => {
    if (debouncedMinPrice !== currentMinPrice) updateUrl('min_price', debouncedMinPrice)
  }, [debouncedMinPrice, currentMinPrice, updateUrl])

  useEffect(() => {
    if (debouncedMaxPrice !== currentMaxPrice) updateUrl('max_price', debouncedMaxPrice)
  }, [debouncedMaxPrice, currentMaxPrice, updateUrl])


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 sticky top-24 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-foreground dark:text-white font-semibold">
          <Filter className="h-5 w-5" />
          <span>{t.explore.sidebar.filters}</span>
        </div>
        {(currentCategory || currentMinPrice || currentMaxPrice || currentRating || searchParams.get('eco') || searchParams.get('region')) && (
           <button 
             onClick={() => router.push('/explore')}
             className="text-xs text-primary hover:underline font-medium"
           >
             {t.explore.sidebar.clearAll}
           </button>
        )}
      </div>

      {/* Eco Filter */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
          <input 
            type="checkbox" 
            checked={searchParams.get('eco') === '1'}
            onChange={(e) => updateUrl('eco', e.target.checked ? '1' : '')}
            className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 bg-white"
          />
          <span className="text-emerald-800 dark:text-emerald-300 font-semibold text-sm">{t.explore.sidebar.ecoFriendly}</span>
        </label>
      </div>
      
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">{t.explore.sidebar.categories}</h3>
        <div className="space-y-3">
          {[{val: '', label: t.explore.sidebar.allDestinations}, {val: 'Attraction', label: t.explore.sidebar.attraction}, {val: 'Tour', label: t.explore.sidebar.tour}, {val: 'Rental', label: t.explore.sidebar.rental}].map((cat) => (
            <label key={cat.val} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                className="w-4 h-4 rounded-full text-primary focus:ring-primary border-gray-300" 
                checked={currentCategory === cat.val}
                onChange={() => updateUrl('category', cat.val)}
              />
              <span className={`text-sm ${currentCategory === cat.val ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'}`}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">{t.explore.sidebar.region}</h3>
        <div className="space-y-3">
          {['', 'Bantul', 'Sleman', 'Kota Yogyakarta', 'Gunungkidul', 'Kulon Progo'].map((region) => (
            <label key={region} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="region"
                className="w-4 h-4 rounded-full text-primary focus:ring-primary border-gray-300" 
                checked={(searchParams.get('region') || '') === region}
                onChange={() => updateUrl('region', region)}
              />
              <span className={`text-sm ${(searchParams.get('region') || '') === region ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors'}`}>
                {region === '' ? t.explore.sidebar.allRegions : region}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">{t.explore.sidebar.priceRange}</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={t.explore.sidebar.min}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={t.explore.sidebar.max}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">{t.explore.sidebar.minRating}</h3>
        <div className="space-y-3">
          {[4.5, 4.0, 3.0].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="rating"
                className="w-4 h-4 rounded-full text-primary focus:ring-primary border-gray-300" 
                checked={currentRating === rating.toString()}
                onChange={() => updateUrl('rating', rating.toString())}
              />
              <span className="flex items-center text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {rating}+ <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
