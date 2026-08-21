import { createClient } from '@/utils/supabase/server'
import SecuritySettingsClient from './SecuritySettingsClient'

export const metadata = {
  title: 'Keamanan Sistem | Admin Kartavia',
  description: 'Pengaturan keamanan dan anti-scraping Kartavia',
}

export default async function AdminSecurityPage() {
  const supabase = await createClient()

  // Ambil pengaturan keamanan dari tabel homepage_settings (yang kita fungsikan sebagai generic settings)
  const { data: securityData } = await supabase
    .from('homepage_settings')
    .select('data')
    .eq('section', 'security')
    .single()

  // Default values jika belum pernah diset
  const initialSettings = securityData?.data || {
    anti_scraping_enabled: true,
    rate_limit_max: 60,
    rate_limit_window: 60
  }

  return <SecuritySettingsClient initialSettings={initialSettings} />
}
