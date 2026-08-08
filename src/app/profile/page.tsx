import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import { getTranslation } from '@/i18n/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslation()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.profile.title}</h1>
        <p className="text-gray-500">{t.profile.subtitle}</p>
      </div>
      <ProfileForm user={user} />
    </div>
  )
}
