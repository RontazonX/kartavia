import Link from 'next/link';
import { MapPin, Star, Leaf } from 'lucide-react';
import { createClient } from "@/utils/supabase/server";
import FilterSidebar from '@/components/explore/FilterSidebar';
import WishlistButton from '@/components/shared/WishlistButton';
import { getTranslation } from '@/i18n/server';

export default async function ExplorePage(props: { searchParams: Promise<{ q?: string; category?: string; min_price?: string; max_price?: string; rating?: string; eco?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';
  const category = searchParams?.category || '';
  const minPrice = searchParams?.min_price || '';
  const maxPrice = searchParams?.max_price || '';
  const rating = searchParams?.rating || '';
  const eco = searchParams?.eco || '';

  const supabase = await createClient();
  const t = await getTranslation();
  
  // Fetch all destinations with filters applied
  let query = supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }
  
  if (category) {
    query = query.eq('category', category);
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    query = query.gte('price', Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    query = query.lte('price', Number(maxPrice));
  }

  if (rating && !isNaN(Number(rating))) {
    query = query.gte('rating', Number(rating));
  }

  if (eco === '1') {
    query = query.gte('admin_eco_score', 4);
  }

  const { data: destinationsResult } = await query;
  const destinations = destinationsResult || [];

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen py-10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-slate-50">
            {q ? `Search results for "${q}"` : t.explore.title}
          </h1>
          {destinations.length > 0 && (
            <span className="text-gray-500 dark:text-gray-400">{destinations.length} found</span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter Component */}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {destinations.length === 0 ? (
               <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center transition-colors">
                 <h2 className="text-xl font-semibold mb-2 dark:text-slate-100">No results found</h2>
                 <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or search term.</p>
                 <Link href="/explore" className="text-primary hover:underline font-medium">Clear all filters</Link>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((item) => (
                  <div key={item.id} className="group relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden -translate-y-0 hover:-translate-y-1 h-full flex flex-col">
                    <Link href={`/detail/${item.id}`} className="absolute inset-0 z-10" aria-label={`View ${item.title}`}></Link>
                    
                    <div className="absolute top-3 right-3 z-20">
                      <WishlistButton destinationId={item.id} />
                    </div>

                    <div className="relative h-48 w-full bg-gray-200 overflow-hidden flex-shrink-0">
                       {item.image_url ? (
                         <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       ) : (
                         <div className="w-full h-full bg-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <span className="text-gray-500 text-sm">No Image</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                       <div className="absolute top-3 left-3 z-0 flex flex-col gap-2">
                         <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded shadow-sm self-start">
                           {item.category}
                         </span>
                         {item.admin_eco_score >= 4 && (
                           <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm self-start flex items-center">
                             <Leaf className="w-3 h-3 mr-1" /> Zero Waste
                           </span>
                         )}
                       </div>
                       <div className="absolute bottom-3 left-3 z-0 flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1">
                         <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                         <span className="text-xs font-semibold text-white">{item.rating}</span>
                       </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow relative z-0">
                      <h3 className="font-semibold text-lg text-foreground dark:text-slate-100 mb-1 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center mt-auto pt-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> <span className="truncate">{item.location}</span>
                      </p>
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-3">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                          <p className="font-bold text-foreground dark:text-slate-100 text-lg">
                            {Number(item.price) === 0 ? 'Free' : `Rp ${Number(item.price).toLocaleString('id-ID')}`}
                          </p>
                        </div>
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
  );
}
