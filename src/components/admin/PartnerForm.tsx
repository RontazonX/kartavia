'use client'

import { useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function PartnerForm({ initialData = null, action }: { initialData?: any, action: any }) {
  const supabase = createClient()
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '')
  const [bannerUrl, setBannerUrl] = useState(initialData?.banner_url || '')
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  
  const handleFileUpload = async (file: File, type: 'logo' | 'banner') => {
    if (!file) return;
    
    if (type === 'logo') setIsUploadingLogo(true)
    else setIsUploadingBanner(true)
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('partner-images')
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('partner-images')
        .getPublicUrl(`public/${fileName}`);

      if (type === 'logo') setLogoUrl(publicUrl)
      else setBannerUrl(publicUrl)
    } catch (error: any) {
      alert(`Upload gagal: ${error.message}`);
    } finally {
      if (type === 'logo') setIsUploadingLogo(false)
      else setIsUploadingBanner(false)
    }
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={initialData?.name}
            required 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" 
          />
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" name="location" defaultValue={initialData?.location} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle</label>
          <input type="text" name="instagram_handle" placeholder="@tour_operator" defaultValue={initialData?.instagram_handle} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description / About</label>
          <textarea name="description" defaultValue={initialData?.description} rows={4} required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"></textarea>
        </div>

        {/* Logo Upload */}
        <div className="col-span-2 md:col-span-1 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-4">Partner Logo (Square)</label>
          <div className="aspect-square w-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-white relative group flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                 <ImagePlus className="w-6 h-6 mb-1" />
                 <span className="text-xs">No Logo</span>
              </div>
            )}
            <div className={`absolute inset-0 bg-black/40 ${logoUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity flex items-center justify-center`}>
              <label className="cursor-pointer text-white font-medium text-xs">
                {isUploadingLogo ? 'Uploading...' : 'Upload'}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'logo')} />
              </label>
            </div>
          </div>
          <input type="hidden" name="logo_url" value={logoUrl} />
        </div>

        {/* Banner Upload */}
        <div className="col-span-2 md:col-span-1 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-4">Banner Image (Wide)</label>
          <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-white relative group flex items-center justify-center">
            {bannerUrl ? (
              <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                 <ImagePlus className="w-6 h-6 mb-1" />
                 <span className="text-xs">No Banner</span>
              </div>
            )}
            <div className={`absolute inset-0 bg-black/40 ${bannerUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity flex items-center justify-center`}>
              <label className="cursor-pointer text-white font-medium text-xs">
                {isUploadingBanner ? 'Uploading...' : 'Upload Banner'}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'banner')} />
              </label>
            </div>
          </div>
          <input type="hidden" name="banner_url" value={bannerUrl} />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer">
          {initialData ? 'Save Changes' : 'Create Partner'}
        </button>
      </div>
    </form>
  )
}
