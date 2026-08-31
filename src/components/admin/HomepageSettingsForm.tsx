'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ImagePlus, Link as LinkIcon, Save, Loader2, Trash2 } from 'lucide-react'
import { revalidateHome } from '@/app/actions/revalidate'

// Helper for client-side image compression
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_SIZE = 1920;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob failed'));
        }, 'image/webp', 0.8);
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};

export default function HomepageSettingsForm({ 
  initialBanners,
  initialParallaxLayers,
  initialMobileBg
}: { 
  initialBanners: string[],
  initialParallaxLayers: string[],
  initialMobileBg?: string
}) {
  const supabase = createClient()
  
  const [parallaxLayers, setParallaxLayers] = useState(initialParallaxLayers)
  const [mobileBg, setMobileBg] = useState(initialMobileBg || "")
  const [banners, setBanners] = useState(initialBanners)
  
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [uploadingItems, setUploadingItems] = useState<Record<string, boolean>>({})

  const handleFileUpload = async (file: File, type: 'parallax' | 'banner' | 'mobile', index: number = 0) => {
    if (!file) return;
    const uploadKey = `${type}-${index}`;
    setUploadingItems(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      // Compress image before upload
      const compressedBlob = await compressImage(file);
      const fileName = `${Math.random()}.webp`;
      const filePath = `${type}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('homepage-images')
        .upload(filePath, compressedBlob, { contentType: 'image/webp' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homepage-images')
        .getPublicUrl(filePath);

      if (type === 'parallax') {
        const newLayers = [...parallaxLayers];
        newLayers[index] = publicUrl;
        setParallaxLayers(newLayers);
      } else if (type === 'mobile') {
        setMobileBg(publicUrl);
      } else if (type === 'banner') {
        const newBanners = [...banners];
        newBanners[index] = publicUrl;
        setBanners(newBanners);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Upload gagal: ${error.message}` });
    } finally {
      setUploadingItems(prev => ({ ...prev, [uploadKey]: false }));
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // 1. Save Parallax Layers & Mobile Bg
      const { error: parallaxErr } = await supabase.from('homepage_settings')
        .upsert({ section: 'parallax_hero', data: { layers: parallaxLayers, mobileBg: mobileBg } }, { onConflict: 'section' })
      
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gambar Hero (Parallax Desktop & Background Mobile)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {parallaxLayers.map((imgUrl, index) => {
            const labels = ["Layer Belakang (Langit/Gunung)", "Layer Tengah (Gunung/Hutan)", "Layer Depan (Objek/Tanah)"];
            const isUploading = uploadingItems[`parallax-${index}`];
            return (
              <div key={index} className="space-y-3">
                <span className="text-sm font-semibold text-brand-500">{labels[index]}</span>
                <div className="aspect-[4/5] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 relative group">
                  {imgUrl ? (
                    <img src={imgUrl} alt={`Layer ${index+1}`} className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50 blur-sm' : ''}`} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 dark:bg-slate-800">
                      <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Kosong</span>
                    </div>
                  )}
                  
                  {isUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center">
                      <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform">
                        <ImagePlus className="w-4 h-4 mr-2" /> Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'parallax', index)} disabled={isUploading} />
                      </label>
                      {imgUrl && (
                        <button 
                          onClick={() => {
                            const newLayers = [...parallaxLayers];
                            newLayers[index] = '';
                            setParallaxLayers(newLayers);
                          }}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus
                        </button>
                      )}
                    </div>
                  )}
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
          
          {/* Mobile Background Field */}
          <div className="space-y-3">
            <span className="text-sm font-semibold text-brand-500">Background Khusus Mobile</span>
            <div className="aspect-[4/5] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 relative group">
              {mobileBg ? (
                <img src={mobileBg} alt="Mobile Background" className={`w-full h-full object-cover transition-opacity ${uploadingItems['mobile-0'] ? 'opacity-50 blur-sm' : ''}`} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 dark:bg-slate-800">
                  <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium">Kosong</span>
                </div>
              )}
              
              {uploadingItems['mobile-0'] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center">
                  <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform">
                    <ImagePlus className="w-4 h-4 mr-2" /> Upload
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'mobile', 0)} />
                  </label>
                  {mobileBg && (
                    <button 
                      onClick={() => setMobileBg('')}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Hapus
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={mobileBg}
                onChange={(e) => setMobileBg(e.target.value)}
                placeholder="URL Gambar Statis (Rasio 3:4)"
                className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gambar Slider Banners (3 Slide)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((imgUrl, index) => {
            const isUploading = uploadingItems[`banner-${index}`];
            return (
            <div key={index} className="space-y-3">
              <span className="text-sm font-semibold text-brand-500">Slide {index + 1}</span>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 relative group">
                {imgUrl ? (
                  <img src={imgUrl} alt={`Banner ${index+1}`} className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50 blur-sm' : ''}`} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 dark:bg-slate-800">
                    <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-medium">Kosong</span>
                  </div>
                )}
                
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-900 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform">
                      <ImagePlus className="w-4 h-4 mr-2" /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'banner', index)} disabled={isUploading} />
                    </label>
                    {imgUrl && (
                      <button 
                        onClick={() => {
                          const newBanners = [...banners];
                          newBanners[index] = '';
                          setBanners(newBanners);
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium text-sm flex items-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus
                      </button>
                    )}
                  </div>
                )}
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
            )
          })}
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

