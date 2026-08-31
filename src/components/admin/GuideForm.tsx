'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { upsertTourGuide, AdminTourGuideInput } from '@/app/actions/guides'

interface GuideFormProps {
  guide?: AdminTourGuideInput | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  destinations: any[]
  guideDestinationIds: string[]
}

export default function GuideForm({ guide, destinations, guideDestinationIds }: GuideFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: guide?.name || '',
    bio: guide?.bio || '',
    image_url: guide?.image_url || '',
    daily_rate: guide?.daily_rate?.toString() || '0',
    spot_rate: guide?.spot_rate?.toString() || '0',
    languages: guide?.languages?.join(', ') || 'English, Indonesian',
    rating: guide?.rating?.toString() || '5.0',
    reviews_count: guide?.reviews_count?.toString() || '0'
  })

  const [selectedDestinations, setSelectedDestinations] = useState<Set<string>>(new Set(guideDestinationIds))

  const handleDestinationToggle = (id: string) => {
    const newSet = new Set(selectedDestinations)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedDestinations(newSet)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const guideInput: AdminTourGuideInput = {
      id: guide?.id,
      name: formData.name,
      bio: formData.bio,
      image_url: formData.image_url || null,
      daily_rate: Number(formData.daily_rate),
      spot_rate: Number(formData.spot_rate),
      languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
      rating: Number(formData.rating),
      reviews_count: Number(formData.reviews_count)
    }

    const result = await upsertTourGuide(guideInput, Array.from(selectedDestinations))

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/admin/guides')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input 
              type="url" 
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Languages (Comma separated)</label>
            <input 
              required
              type="text" 
              value={formData.languages}
              onChange={e => setFormData({...formData, languages: e.target.value})}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
              placeholder="English, Indonesian, Japanese"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate (Rp)</label>
              <input 
                required
                type="number" 
                value={formData.daily_rate}
                onChange={e => setFormData({...formData, daily_rate: e.target.value})}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spot Rate (Rp)</label>
              <input 
                required
                type="number" 
                value={formData.spot_rate}
                onChange={e => setFormData({...formData, spot_rate: e.target.value})}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
              <input 
                required
                type="number"
                step="0.1"
                min="1" max="5" 
                value={formData.rating}
                onChange={e => setFormData({...formData, rating: e.target.value})}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reviews Count</label>
              <input 
                required
                type="number" 
                value={formData.reviews_count}
                onChange={e => setFormData({...formData, reviews_count: e.target.value})}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea 
              required
              rows={4}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-slate-800 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Destinations</label>
            <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-4 h-64 overflow-y-auto space-y-2">
              {destinations.length === 0 ? (
                <p className="text-sm text-gray-500">No destinations available.</p>
              ) : (
                destinations.map(dest => (
                  <label key={dest.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedDestinations.has(dest.id)}
                      onChange={() => handleDestinationToggle(dest.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                      {dest.title}
                    </span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Select the places where this guide operates.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {guide ? 'Save Changes' : 'Create Guide'}
        </button>
      </div>
    </form>
  )
}
