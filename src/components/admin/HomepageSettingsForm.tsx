'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ImagePlus, Link as LinkIcon, Save, Loader2 } from 'lucide-react'
import { revalidateHome } from '@/app/actions/revalidate'

export default function HomepageSettingsForm({ 
  initialBanners,
  initialParallaxLayers
}: { 
  initialBanners: string[],
  initialParallaxLayers: string[]
}) {
  const supabase = createClient()
  
  const [parallaxLayers, setParallaxLayers] = useState(initialParallaxLayers)
  const [banners, setBanners] = useState(initialBanners)
  
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleFileUpload = async (file: File, type: 'parallax' | 'banner', index: number) => {
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${type}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('homepage-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homepage-images')
        .getPublicUrl(filePath);

      if (type === 'parallax') {
        const newLayers = [...parallaxLayers];
        newLayers[index] = publicUrl;
        setParallaxLayers(newLayers);
      } else if (type === 'banner') {
        const newBanners = [...banners];
        newBanners[index] = publicUrl;
        setBanners(newBanners);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Upload gagal: ${error.message}` });
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // 1. Save Parallax Layers
      const { error: parallaxErr } = await supabase.from('homepage_settings')
        .upsert({ section: 'parallax_hero', data: { layers: parallaxLayers } }, { onConflict: 'section' })
      
      if (parallaxErr) throw parallaxErr

      // 2. Save Banners
      const { error: bannersErr } = await supabase.from('homepage_settings')
        .upsert({ section: 'banners', data: { images: banners } }, { onConflict: 'section' })
      
      if (bannersErr) throw bannersErr

      await revalidateHome()

      setMessage({ type: 'success', text: 'Perubahan berhasil disimpan!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: `Gagal menyimpan: ${error.message}` })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-error-50 text-error-600 border border-error-200' : 'bg-success-50 text-success-600 border border-success-200'}`}>
          {message.text}
        </div>
      )}

      {/* Parallax Layers Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gambar Parallax Hero (3 Layer 3D)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {parallaxLayers.map((imgUrl, index) => {
            const labels = ["Layer Belakang (Langit/Gunung)", "Layer Tengah (Gunung/Hutan)", "Layer Depan (Objek/Tanah)"];
            return (
              <div key={index} className="space-y-3">
                <span className="text-sm font-semibold text-brand-500">{labels[index]}</span>
                <div className="aspect-[4/5] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 relative group">
                  <img src={imgUrl} alt={`Layer ${index+1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform">
                      <ImagePlus className="w-4 h-4 mr-2" /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'parallax', index)} />
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={imgUrl}
                    onChange={(e) => {
                      const newLayers = [...parallaxLayers];
                      newLayers[index] = e.target.value;
                      setParallaxLayers(newLayers);
                    }}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gambar Slider Banners (3 Slide)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((imgUrl, index) => (
            <div key={index} className="space-y-3">
              <span className="text-sm font-semibold text-brand-500">Slide {index + 1}</span>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 relative group">
                <img src={imgUrl} alt={`Banner ${index+1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform">
                    <ImagePlus className="w-4 h-4 mr-2" /> Upload
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'banner', index)} />
                  </label>
                </div>
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={imgUrl}
                  onChange={(e) => {
                    const newBanners = [...banners];
                    newBanners[index] = e.target.value;
                    setBanners(newBanners);
                  }}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  )
}
