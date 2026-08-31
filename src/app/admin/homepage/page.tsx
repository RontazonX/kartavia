import HomepageSettingsForm from '@/components/admin/HomepageSettingsForm'
import { createClient } from '@/utils/supabase/server'

export default async function AdminHomepageSettings() {
  const supabase = await createClient()

  // Fetch settings
  const { data: parallaxData } = await supabase.from('homepage_settings').select('data').eq('section', 'parallax_hero').single()
  const { data: bannersData } = await supabase.from('homepage_settings').select('data').eq('section', 'banners').single()

  // Fallbacks if table is empty or missing
  const parallaxLayers = parallaxData?.data?.layers || [
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp",
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp",
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
  ]
  const mobileBg = parallaxData?.data?.mobileBg || "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
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
      
      <HomepageSettingsForm initialParallaxLayers={parallaxLayers} initialMobileBg={mobileBg} initialBanners={bannerImages} />
    </div>
  )
}
