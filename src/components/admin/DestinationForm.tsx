'use client'

import { useState } from 'react'
import { Sparkles, ImagePlus, Loader2 } from 'lucide-react'
import { findWikipediaImage } from '@/app/admin/destinations/ai-actions'
import { createClient } from '@/utils/supabase/client'

export default function DestinationForm({ 
  initialData = null, 
  action
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any
}) {
  const supabase = createClient()
  const [title, setTitle] = useState(initialData?.title || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
  const [isFindingImage, setIsFindingImage] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setImageError('');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('destination-images')
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('destination-images')
        .getPublicUrl(`public/${fileName}`);

      setImageUrl(publicUrl);
    } catch (error: any) {
      setImageError(`Upload gagal: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="category" value="Attraction" />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
          <input type="number" name="price" defaultValue={initialData?.price} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Eco-Score (0-5)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              name="admin_eco_score" 
              min="0" 
              max="5" 
              defaultValue={initialData?.admin_eco_score || 0} 
              className="w-full accent-green-500" 
              onChange={(e) => document.getElementById('eco-score-display')!.innerText = e.target.value}
            />
            <span id="eco-score-display" className="font-bold text-lg text-green-600 w-8">{initialData?.admin_eco_score || 0}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Set to 4 or 5 to show the "Zero Waste Hero" badge on the public listing.</p>
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
            <div className="aspect-video w-full md:w-2/3 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-slate-700 bg-gray-50 relative group mx-auto flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                     <ImagePlus className="w-8 h-8 mb-2" />
                     <span className="text-sm">Belum ada gambar</span>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-black/40 ${imageUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity flex items-center justify-center gap-4`}>
                  <label className={`cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />} 
                    {isUploading ? 'Mengunggah...' : (imageUrl ? 'Ganti Gambar' : 'Upload File')}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                  </label>
                </div>
            </div>

            <div className="flex items-center gap-4 py-2">
               <div className="h-[1px] flex-1 bg-gray-200"></div>
               <span className="text-xs font-medium text-gray-400 uppercase">ATAU GUNAKAN URL Link / AI</span>
               <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div>
                <input 
                  type="text" 
                  name="image_url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
                />
            </div>
          </div>
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
