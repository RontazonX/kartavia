import HomepageSettingsForm from '@/components/admin/HomepageSettingsForm'
import { createClient } from '@/utils/supabase/server'

export default async function AdminHomepageSettings() {
  const supabase = await createClient()

  // Fetch settings
  const { data: heroData } = await supabase.from('homepage_settings').select('data').eq('section', 'hero').single()
  const { data: bannersData } = await supabase.from('homepage_settings').select('data').eq('section', 'banners').single()

  // Fallbacks if table is empty or missing
  const heroImage = heroData?.data?.image_url || "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=2000"
  const bannerImages = bannersData?.data?.images || [
    "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1621574539437-4b726487920f?auto=format&fit=crop&q=80&w=1200"
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">Pengaturan Beranda</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ganti gambar utama dan slider banner beranda di sini.</p>
      </div>
      
      <HomepageSettingsForm initialHero={heroImage} initialBanners={bannerImages} />
    </div>
  )
}
