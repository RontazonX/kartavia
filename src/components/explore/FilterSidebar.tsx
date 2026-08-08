'use client'

import { Filter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentCategory = searchParams.get('category') || ''
  
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

  const handleCategoryChange = (category: string) => {
    router.push('/explore?' + createQueryString('category', category))
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 sticky top-24 transition-colors">
      <div className="flex items-center gap-2 mb-6 text-foreground dark:text-white font-semibold">
        <Filter className="h-5 w-5" />
        <span>Filters</span>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category"
              className="rounded text-primary focus:ring-primary" 
              checked={currentCategory === ''}
              onChange={() => handleCategoryChange('')}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category"
              className="rounded text-primary focus:ring-primary" 
              checked={currentCategory === 'Attraction'}
              onChange={() => handleCategoryChange('Attraction')}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">Attraction Tickets</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category"
              className="rounded text-primary focus:ring-primary" 
              checked={currentCategory === 'Tour'}
              onChange={() => handleCategoryChange('Tour')}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">Tour Packages</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category"
              className="rounded text-primary focus:ring-primary" 
              checked={currentCategory === 'Rental'}
              onChange={() => handleCategoryChange('Rental')}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">Car Rentals</span>
          </label>
        </div>
      </div>
    </div>
  )
}
