import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PlannerClient from './PlannerClient'
import { getTranslation } from '@/i18n/server'

export default async function PlannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslation()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.planner.title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t.planner.subtitle}
        </p>
      </div>
      
      <PlannerClient />
    </div>
  )
}
