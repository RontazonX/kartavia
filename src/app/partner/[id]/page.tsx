import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, AtSign, Map, Briefcase, Star, ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import WishlistButton from '@/components/shared/WishlistButton'
import Image from 'next/image'

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: partner } = await supabase
    .from('partners')
    .select(`
      *,
      destinations (*)
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (!partner) {
    notFound()
  }

  const destinations = partner.destinations || []

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Banner */}
      <div className="h-48 md:h-72 w-full bg-slate-200 dark:bg-slate-800 relative">
        {partner.banner_url ? (
          <Image width={1920} height={1080} src={partner.banner_url} alt={partner.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-500 to-primary flex items-center justify-center">
            <span className="text-white/30 text-4xl font-bold uppercase tracking-widest">{partner.name}</span>
          </div>
        )}
        
        <div className="absolute top-6 left-6 z-10">
          <Link href="/explore" className="bg-white/80 dark:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold flex items-center text-slate-900 dark:text-white hover:bg-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="lg:col-span-1 -mt-16 lg:-mt-24 relative z-10">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md mb-4 bg-white">
                {partner.logo_url ? (
                  <Image width={400} height={400} src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold">
                    {partner.name.substring(0,2).toUpperCase()}
                  </div>
                )}
              </div>
              
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{partner.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-center">
                <MapPin className="w-3 h-3 mr-1" /> {partner.location}
              </p>

              <div className="w-full border-t border-gray-100 dark:border-slate-700 pt-4 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-left">
                  {partner.description}
                </p>
              </div>

              {partner.instagram_handle && (
                <a 
                  href={`https://instagram.com/${partner.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 py-2.5 rounded-xl font-medium text-sm hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors"
                >
                  <AtSign className="w-4 h-4" /> {partner.instagram_handle}
                </a>
              )}
            </div>
          </div>

          {/* Main Content (Tour Packages) */}
          <div className="lg:col-span-3 pt-8 lg:pt-12">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-4 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Paket Tur</h2>
              <span className="text-sm font-semibold bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
                {destinations.length} Tersedia
              </span>
            </div>

            {destinations.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Belum Ada Paket</h3>
                <p className="text-gray-500 text-sm">Mitra ini belum memiliki paket tur yang aktif.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((item: any) => (
                  <div key={item.id} className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
                    <Link href={`/detail/${item.id}`} className="absolute inset-0 z-10"></Link>
                    
                    <div className="absolute top-3 right-3 z-20">
                      <WishlistButton destinationId={item.id} />
                    </div>

                    <div className="relative h-48 w-full bg-gray-200 overflow-hidden flex-shrink-0">
                       {item.image_url ? (
                         <div className="w-full h-48 sm:h-56 overflow-hidden">
                           <Image width={800} height={600} src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         </div>
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                       )}
                       <div className="absolute top-3 left-3 z-0">
                         <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded shadow-sm">
                           {item.category}
                         </span>
                       </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow z-0">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white text-lg">
                          Rp {Number(item.price).toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
