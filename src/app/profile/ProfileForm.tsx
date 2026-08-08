'use client'

import { useState } from 'react'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { User, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/button/Button'
import { updateProfile } from './actions'
import { useTranslation } from '@/i18n/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileForm({ user }: { user: any }) {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    setError(null)
    setSuccess(null)
    
    const result = await updateProfile(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(t.profile.success)
      const form = formData.get('newPassword')
      if (form) {
         const pwField = document.querySelector('input[name="newPassword"]') as HTMLInputElement
         if (pwField) pwField.value = ''
      }
    }
    setIsPending(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl">
      <form action={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}
        
        {/* Personal Info */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> {t.profile.personalInfo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>{t.profile.firstName}</Label>
              <Input type="text" name="fname" defaultValue={user.user_metadata?.first_name || ''} placeholder="First name" />
            </div>
            <div>
              <Label>{t.profile.lastName}</Label>
              <Input type="text" name="lname" defaultValue={user.user_metadata?.last_name || ''} placeholder="Last name" />
            </div>
            <div className="md:col-span-2">
              <Label>{t.profile.email}</Label>
              <Input type="email" value={user.email} disabled className="bg-gray-50 text-gray-500 border-gray-200" />
              <p className="text-xs text-gray-400 mt-1">{t.profile.emailDisabled}</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100"></div>

        {/* Security */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> {t.profile.security}
          </h3>
          <div>
            <Label>{t.profile.newPassword}</Label>
            <Input 
              type="password" 
              name="newPassword" 
              placeholder={t.profile.newPasswordPlaceholder} 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending} className="px-8">
            {isPending ? t.profile.saving : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> {t.profile.saveChanges}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
