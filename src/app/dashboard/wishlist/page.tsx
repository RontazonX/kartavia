import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Heart } from 'lucide-react'
import WishlistButton from '@/components/shared/WishlistButton'
import Image from 'next/image'

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch wishlists with related destination
  const { data: wishlists } = await supabase
    .from('wishlists')
    .select(`
      id,
      destinations (
        id,
        title,
        location,
        image_url,
        price,
        category,
        rating
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center">
          <Heart className="h-8 w-8 text-red-500 fill-red-500 mr-3" /> My Wishlist
        </h1>
        
        {!wishlists || wishlists.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite destinations to help you plan your next trip.</p>
            <Link href="/explore" className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary-dark transition-colors">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {wishlists.map((item: any) => {
              const dest = item.destinations
              if (!dest) return null
              
              return (
                <div key={item.id} className="group relative rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden -translate-y-0 hover:-translate-y-1 h-full flex flex-col">
                  <Link href={`/detail/${dest.id}`} className="absolute inset-0 z-10" aria-label={`View ${dest.title}`}></Link>
                  
                  <div className="absolute top-3 right-3 z-20">
                    <WishlistButton destinationId={dest.id} />
                  </div>

                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden flex-shrink-0">
                     {dest.image_url ? (
                       /* eslint-disable-next-line @next/next/no-img-element */
                       <Image width={800} height={600} src={dest.image_url} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                       <div className="w-full h-full bg-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                          <span className="text-gray-500 text-sm">No Image</span>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                     <div className="absolute top-3 left-3 z-0">
                       <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded shadow-sm">
                         {dest.category}
                       </span>
                     </div>
                     <div className="absolute bottom-3 left-3 z-0 flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1">
                       <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                       <span className="text-xs font-semibold text-white">{dest.rating}</span>
                     </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow relative z-0">
                    <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">{dest.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex items-center mt-auto pt-2">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> <span className="truncate">{dest.location}</span>
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <p className="font-bold text-foreground text-lg">
                          {Number(dest.price) === 0 ? 'Free' : `Rp ${Number(dest.price).toLocaleString('id-ID')}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
