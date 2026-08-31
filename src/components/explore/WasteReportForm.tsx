'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { submitWasteReport } from '@/app/actions/waste'
import { useTranslation } from '@/i18n/client'

export default function WasteReportForm({ destinationId, isLoggedIn }: { destinationId: string, isLoggedIn: boolean }) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 text-center mt-12">
        <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
          <Camera className="w-5 h-5 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.explore.wasteReport.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
          {t.explore.wasteReport.loginPrompt}
        </p>
        <a href={`/login?redirect=/detail/${destinationId}`} className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
          {t.explore.wasteReport.loginBtn}
        </a>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-100 dark:border-green-900/30 text-center mt-12 transition-all">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">{t.explore.wasteReport.successTitle}</h3>
        <p className="text-green-700 dark:text-green-400 text-sm max-w-md mx-auto">
          {t.explore.wasteReport.successDesc}
        </p>
        <button 
          onClick={() => { setSuccess(false); setPreview(null); }}
          className="mt-6 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
        >
          {t.explore.wasteReport.sendAnother}
        </button>
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(t.explore.wasteReport.errorSize)
        return
      }
      const url = URL.createObjectURL(file)
      setPreview(url)
      setErrorMsg('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('destination_id', destinationId)
      
      const res = await submitWasteReport(formData)
      
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setErrorMsg(err.message || t.explore.wasteReport.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-800 mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl">
          <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.explore.wasteReport.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.explore.wasteReport.subtitle}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.explore.wasteReport.photoLabel}</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-video md:aspect-[21/9] rounded-xl border-2 border-dashed ${preview ? 'border-transparent' : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'} relative overflow-hidden group cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-colors flex flex-col items-center justify-center`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium text-sm flex items-center bg-black/60 px-4 py-2 rounded-full ">
                    <Camera className="w-4 h-4 mr-2" /> {t.explore.wasteReport.changePhoto}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.explore.wasteReport.uploadPrompt}</p>
                <p className="text-xs text-slate-500 mt-1">{t.explore.wasteReport.uploadSize}</p>
              </div>
            )}
            <input 
              type="file" 
              name="image"
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.explore.wasteReport.descLabel}</label>
          <textarea 
            name="description" 
            rows={3} 
            placeholder={t.explore.wasteReport.descPlaceholder}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-800 dark:text-white transition-all resize-none"
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || !preview}
          className="w-full bg-slate-900 dark:bg-primary hover:bg-slate-800 dark:hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.explore.wasteReport.submitting}</>
          ) : (
            t.explore.wasteReport.submitBtn
          )}
        </button>
      </form>
    </div>
  )
}
