'use client'

import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TourPackageForm({ 
  initialData = null, 
  action,
  partners = []
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
  partners?: any[]
}) {
  const supabase = createClient()
  const [title, setTitle] = useState(initialData?.title || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
  const [isUploading, setIsUploading] = useState(false)
  
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('destinations').upload(`public/${fileName}`, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('destinations').getPublicUrl(`public/${fileName}`);
      setImageUrl(publicUrl)
    } catch (error: any) {
      alert(`Upload gagal: ${error.message}`);
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="category" value="Tour" />
      
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tour Package Title</label>
          <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Point / Location</label>
          <input type="text" name="location" defaultValue={initialData?.location} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tour Operator / Partner</label>
          <select name="partner_id" defaultValue={initialData?.partner_id || ""} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary bg-white">
            <option value="" disabled>-- Select Tour Operator --</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
          <input type="number" name="price" defaultValue={initialData?.price} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 3 Days 2 Nights)</label>
          <input type="text" name="duration" defaultValue={initialData?.duration} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tour Description</label>
          <textarea name="description" defaultValue={initialData?.description} rows={4} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (comma separated)</label>
          <textarea name="highlights" defaultValue={initialData?.highlightsString} placeholder="Snorkeling, Island Hopping, BBQ Dinner" rows={2} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Included Benefits (newline separated)</label>
          <textarea name="included_benefits" defaultValue={initialData?.includedString} placeholder="Hotel 4 Stars&#10;Breakfast&#10;Transportation" rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Excluded Benefits (newline separated)</label>
          <textarea name="excluded_benefits" defaultValue={initialData?.excludedString} placeholder="Flight Tickets&#10;Personal Expenses" rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Itinerary (newline separated)</label>
          <textarea name="itinerary" defaultValue={initialData?.itineraryString} placeholder="Day 1: Arrival & Briefing&#10;Day 2: City Tour & Museum" rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>

        <div className="col-span-2 md:col-span-1">
           <label className="block text-sm font-medium text-gray-700 mb-1">Eco-Score (0-5)</label>
           <input type="range" min="0" max="5" name="admin_eco_score" defaultValue={initialData?.admin_eco_score || 0} className="w-full" />
           <p className="text-xs text-gray-500 mt-1">Set to 4 or 5 to give this tour a Zero Waste Badge.</p>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 relative overflow-hidden group">
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="space-y-1 text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span className="relative rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                    <span>Upload a file</span>
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
              </div>
            )}
            
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <span className="font-semibold text-primary">Uploading...</span>
              </div>
            )}
          </div>
          <input type="hidden" name="image_url" value={imageUrl} />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer">
          {initialData ? 'Save Changes' : 'Create Tour Package'}
        </button>
      </div>
    </form>
  )
}
