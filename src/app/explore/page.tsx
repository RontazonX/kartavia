import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";
import FilterSidebar from '@/components/explore/FilterSidebar';
import DestinationCard from '@/components/shared/DestinationCard';
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
                  <div key={item.id} className="h-full">
                    <DestinationCard 
                      id={item.id}
                      title={item.title}
                      category={item.category}
                      location={item.location}
                      price={item.price}
                      image_url={item.image_url}
                      rating={item.rating}
                      reviews_count={item.reviews_count}
                      admin_eco_score={item.admin_eco_score}
                      description={item.description}
                    />
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
