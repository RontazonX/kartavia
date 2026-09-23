'use client'

import { useState, useRef } from 'react'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/button/Button'
import { updateProfile } from './actions'
import { useTranslation } from '@/i18n/client'
import { createClient } from '@/utils/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

import ProfileSidebar, { TabId } from './ProfileSidebar'
import ProfileOverview from './ProfileOverview'
import ProfilePersonalInfo from './ProfilePersonalInfo'
import ProfilePreferences from './ProfilePreferences'
import ProfileSecurity from './ProfileSecurity'

export default function ProfileForm({ user }: { user: any }) {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  
  const [avatarUrl, setAvatarUrl] = useState<string>(user.user_metadata?.avatar_url || '')
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()
  const formRef = useRef<HTMLFormElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('destination-images')
        .upload(`avatars/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('destination-images')
        .getPublicUrl(`avatars/${fileName}`);

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    setError(null)
    setSuccess(null)
    
    if (avatarUrl) {
      formData.append('avatarUrl', avatarUrl)
    }
    
    const result = await updateProfile(formData)
    
    if (result.error) {
      setError(result.error)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (result.success) {
      setSuccess(t.profile.success)
      const form = formData.get('newPassword')
      if (form && formRef.current) {
         const pwField = formRef.current.querySelector('input[name="newPassword"]') as HTMLInputElement
         if (pwField) pwField.value = ''
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setIsPending(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto pb-12 mt-4 relative">
      
      <div className="md:sticky md:top-24 w-full md:w-64 z-20">
        <ProfileSidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          avatarUrl={avatarUrl}
          isUploading={isUploading}
          handleFileUpload={handleFileUpload}
          t={t}
        />

        {/* Global Save Button moved to sidebar area for easy access */}
        <div className="mt-6 hidden md:block">
           <Button type="submit" disabled={isPending || isUploading} className="w-full py-4 text-base rounded-[1.25rem] shadow-md shadow-primary/20">
              {isPending ? t.profile.saving : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="h-5 w-5" /> {t.profile.saveChanges}
                </span>
              )}
           </Button>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
        {/* Alerts positioned at the top of content area */}
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 text-red-600 p-4 rounded-[1.25rem] flex items-center gap-3 text-sm font-medium mb-6 border border-red-100"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 text-green-700 p-4 rounded-[1.25rem] flex items-center gap-3 text-sm font-medium mb-6 border border-green-100"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p>{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // smooth cubic-bezier
              className="w-full"
            >
              {activeTab === 'overview' && <ProfileOverview user={user} t={t} />}
              {activeTab === 'personal' && <ProfilePersonalInfo user={user} t={t} />}
              {activeTab === 'preferences' && <ProfilePreferences user={user} t={t} />}
              {activeTab === 'security' && <ProfileSecurity t={t} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Save Button */}
        <div className="mt-8 block md:hidden sticky bottom-24 z-30 px-2">
           <Button type="submit" disabled={isPending || isUploading} className="w-full py-4 text-base rounded-[1.25rem] shadow-xl shadow-primary/30">
              {isPending ? t.profile.saving : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="h-5 w-5" /> {t.profile.saveChanges}
                </span>
              )}
           </Button>
        </div>
      </div>
    </form>
  )
}
