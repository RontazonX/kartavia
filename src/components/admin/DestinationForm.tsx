'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { findWikipediaImage } from '@/app/admin/destinations/ai-actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DestinationForm({ 
  initialData = null, 
  action 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any
}) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
  const [isFindingImage, setIsFindingImage] = useState(false)
  const [imageError, setImageError] = useState('')

  const handleAutoFind = async () => {
    if (!title) {
      setImageError('Please enter a title first')
      return
    }
    setIsFindingImage(true)
    setImageError('')
    
    const res = await findWikipediaImage(title)
    if (res.success) {
      setImageUrl(res.url)
    } else {
      setImageError(res.error || 'Image not found')
    }
    setIsFindingImage(false)
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            type="text" 
            name="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" name="location" defaultValue={initialData?.location} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" defaultValue={initialData?.category || "Attraction"} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary">
            <option value="Attraction">Attraction Tickets</option>
            <option value="Tour">Tour Packages</option>
            <option value="Rental">Car Rentals</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
          <input type="number" name="price" defaultValue={initialData?.price} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input type="text" name="duration" defaultValue={initialData?.duration} placeholder="e.g. 2-3 hours" required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>
        
        <div className="col-span-2 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
             <label className="block text-sm font-semibold text-gray-700">Destination Image</label>
             <button 
                type="button" 
                onClick={handleAutoFind}
                disabled={isFindingImage}
                className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
             >
                <Sparkles className="h-3 w-3" />
                {isFindingImage ? 'Searching AI...' : 'Auto-Find Image'}
             </button>
          </div>
          
          {imageError && <p className="text-red-500 text-xs mb-3">{imageError}</p>}
          
          <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Image URL (Auto-filled by AI)</label>
                <input 
                  type="text" 
                  name="image_url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                />
            </div>
            
            <div className="flex items-center gap-4">
               <div className="h-[1px] flex-1 bg-gray-200"></div>
               <span className="text-xs font-medium text-gray-400 uppercase">OR Upload Manual</span>
               <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div>
              <input type="file" name="image" accept="image/*" className="w-full border border-gray-300 rounded-lg p-2 bg-white text-sm" />
            </div>
          </div>
          
          {imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 w-32 h-32 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" defaultValue={initialData?.description} rows={4} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (comma separated)</label>
          <input type="text" name="highlights" defaultValue={initialData?.highlightsString} placeholder="Highlight 1, Highlight 2" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer">
          {initialData ? 'Save Changes' : 'Create Destination'}
        </button>
      </div>
    </form>
  )
}
