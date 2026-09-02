'use client'

import { useState } from 'react'
import { Shield, Save, Loader2, AlertCircle } from 'lucide-react'
import { updateSecuritySettings } from './actions'

export default function SecuritySettings({ 
  initialSettings
}: { 
  initialSettings: any 
}) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [antiScraping, setAntiScraping] = useState(initialSettings?.anti_scraping_enabled ?? true)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setMessage('')
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await updateSecuritySettings(formData)
    
    if (result.success) {
      setMessage('Pengaturan keamanan berhasil diperbarui! Perubahan akan aktif dalam waktu maksimal 5 menit karena efek caching.')
    } else {
      setError(result.error || 'Gagal menyimpan pengaturan.')
    }
    setIsPending(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <Shield className="w-6 h-6 mr-2 text-primary" />
          Keamanan Sistem
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola fitur Anti-Scraping dan pembatasan request (Rate Limiter) untuk melindungi sistem dari serangan bot.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100 flex items-start">
          <Shield className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl border border-rose-100 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Anti Scraping Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Anti-Scraping Bot Protection</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Blokir otomatis alat scraping (Python, Curl, Puppeteer).</p>
            </div>
            
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="anti_scraping" 
                className="sr-only peer"
                checked={antiScraping}
                onChange={() => setAntiScraping(!antiScraping)}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Rate Limiter Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rate Limiter</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Batasi frekuensi pengunjung untuk mencegah DDoS.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Maksimal Request
              </label>
              <input 
                type="number" 
                name="rate_limit_max" 
                defaultValue={initialSettings?.rate_limit_max || 500} 
                required 
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl p-3 bg-transparent dark:text-white focus:ring-primary focus:border-primary transition-colors" 
              />
              <p className="text-xs text-slate-500 mt-2">Jumlah akses (klik/halaman) yang diizinkan.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Jendela Waktu (Detik)
              </label>
              <input 
                type="number" 
                name="rate_limit_window" 
                defaultValue={initialSettings?.rate_limit_window || 60} 
                required 
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl p-3 bg-transparent dark:text-white focus:ring-primary focus:border-primary transition-colors" 
              />
              <p className="text-xs text-slate-500 mt-2">Dalam rentang waktu berapa detik batasan di atas berlaku.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg"
          >
            {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}
