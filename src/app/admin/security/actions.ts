'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSecuritySettings(formData: FormData) {
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const antiScraping = formData.get('anti_scraping') === 'on'
  const rateLimitMax = parseInt(formData.get('rate_limit_max') as string) || 500
  const rateLimitWindow = parseInt(formData.get('rate_limit_window') as string) || 60

  const data = {
    anti_scraping_enabled: antiScraping,
    rate_limit_max: rateLimitMax,
    rate_limit_window: rateLimitWindow
  }

  const { error } = await supabase
    .from('homepage_settings')
    .upsert({
      section: 'security',
      data: data
    }, { onConflict: 'section' })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/security')
  return { success: true }
}
