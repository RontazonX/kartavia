import { createClient } from '@/utils/supabase/server'
import RealtimeAnalytics from '@/components/admin/RealtimeAnalytics'

export default async function AnalyticsDashboard() {
  const supabase = await createClient()
  
  // Fetch initial Site Statistics
  const { data: stats } = await supabase.from('site_statistics').select('*')

  return (
    <div>
      <RealtimeAnalytics initialStats={stats || []} />
    </div>
  )
}
