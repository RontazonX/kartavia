import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, CheckCircle, ChevronLeft, User, Check, X, Map } from 'lucide-react';
import { createClient } from "@/utils/supabase/server";
import BookingForm from '@/components/booking/BookingForm';
import ReviewForm from '@/components/reviews/ReviewForm';
import WishlistButton from '@/components/shared/WishlistButton';
import { getBookedSlots } from '@/components/booking/actions';
import WasteReportForm from '@/components/explore/WasteReportForm';
import { Leaf } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: detail } = await supabase.from('destinations').select('title, description, image_url').eq('id', id).single();
  
  if (!detail) {
    return { title: 'Destination Not Found - Kartavia' };
  }

  return {
    title: `${detail.title} - Kartavia`,
    description: detail.description.substring(0, 160),
    openGraph: {
      title: `${detail.title} - Wisata Yogyakarta`,
      description: detail.description.substring(0, 160),
      images: detail.image_url ? [{ url: detail.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: detail.title,
      description: detail.description.substring(0, 160),
      images: detail.image_url ? [detail.image_url] : [],
    }
  };
}

export async function generateStaticParams() {
  const { createClient: createJSClient } = await import('@supabase/supabase-js');
  const supabase = createJSClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  // Fetch top 10 destinations for static generation
  const { data: destinations } = await supabase.from('destinations').select('id').limit(10);
  
  if (!destinations) return [];

  return destinations.map((destination) => ({
    id: destination.id,
  }));
}
export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: detail } = await supabase
    .from('destinations')
    .select(`
      *,
      partners (*)
    `)
    .eq('id', id)
    .single();

  if (!detail) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles:user_id (email)
    `)
    .eq('destination_id', id)
    .order('created_at', { ascending: false });

  // Ensure highlights is an array
  let highlights = [];
  try {
    highlights = typeof detail.highlights === 'string' ? JSON.parse(detail.highlights) : detail.highlights;
    if (!Array.isArray(highlights)) highlights = [];
  } catch (e) {
    highlights = [];
  }

  // Ensure culinary_spots is an array
  let culinarySpots = [];
  try {
    culinarySpots = typeof detail.culinary_spots === 'string' ? JSON.parse(detail.culinary_spots) : detail.culinary_spots;
    if (!Array.isArray(culinarySpots)) culinarySpots = [];
  } catch (e) {
    culinarySpots = [];
  }

  // Ensure available_slots is an array
  let availableSlots = [];
  try {
    availableSlots = typeof detail.available_slots === 'string' ? JSON.parse(detail.available_slots) : detail.available_slots;
    if (!Array.isArray(availableSlots)) availableSlots = [];
  } catch (e) {
    availableSlots = [];
  }

  // Parse tour details
  let includedBenefits = [];
  let excludedBenefits = [];
  let itinerary = [];
  try { includedBenefits = typeof detail.included_benefits === 'string' ? JSON.parse(detail.included_benefits) : detail.included_benefits || []; } catch(e){}
  try { excludedBenefits = typeof detail.excluded_benefits === 'string' ? JSON.parse(detail.excluded_benefits) : detail.excluded_benefits || []; } catch(e){}
  try { itinerary = typeof detail.itinerary === 'string' ? JSON.parse(detail.itinerary) : detail.itinerary || []; } catch(e){}

  // Calculate Density Status
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const bookedCounts = await getBookedSlots(id, today);
  
  // Find current active slot or next upcoming slot
  const currentHour = new Date().getHours();
  let activeSlot = availableSlots[0]; // fallback
  for (const slot of availableSlots) {
    // slot format "08:00 - 10:00"
    const startHour = parseInt(slot.split(':')[0]);
    if (currentHour >= startHour - 1 && currentHour <= startHour + 2) {
      activeSlot = slot;
      break;
    }
  }

  const currentVisitors = bookedCounts[activeSlot] || 0;
  const maxCapacity = detail.max_capacity || 100;
  const densityPercentage = maxCapacity > 0 ? (currentVisitors / maxCapacity) * 100 : 0;
  
  let densityColor = 'bg-green-100 text-green-700 border-green-200';
  let densityLabel = 'Lancar / Aman';
  let isDense = false;

  if (densityPercentage >= 90) {
    densityColor = 'bg-red-100 text-red-700 border-red-200';
    densityLabel = 'Padat / Penuh';
    isDense = true;
  } else if (densityPercentage >= 60) {
    densityColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
    densityLabel = 'Ramai Ramah';
  }

  // Fetch alternatives if dense
  let alternatives: any[] = [];
  if (isDense) {
    const { data: altData } = await supabase
      .from('destinations')
      .select('id, title, location, image_url, rating, price')
      .eq('category', detail.category)
      .neq('id', id)
      .limit(3);
    alternatives = altData || [];
  }

  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-4 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/explore" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Explore
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Banner */}
            <div className="h-[400px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm">
               {detail.image_url ? (
                 <img src={detail.image_url} alt={detail.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
               ) : (
                 <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                   <div className="text-center">
                      <MapPin className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                      <span className="font-medium">No Image Available</span>
                   </div>
                 </div>
               )}
            </div>

            {/* Header Info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">{detail.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${densityColor}`}>
                      Status Live: {densityLabel} ({currentVisitors}/{maxCapacity})
                    </div>
                    {detail.admin_eco_score >= 4 && (
                      <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <Leaf className="w-3 h-3 mr-1" /> Zero Waste Hero
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                    {detail.category}
                  </span>
                  <WishlistButton destinationId={detail.id} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="font-bold text-gray-900 dark:text-white mr-1">{detail.rating}</span>
                  <span className="underline">({detail.reviews_count} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{detail.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-xl font-bold text-foreground dark:text-white mb-4">About this destination</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                {detail.description}
              </p>
              
              {highlights.length > 0 && detail.category !== 'Tour' && (
                <>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" /> Highlights
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {highlights.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Tour Specific Details */}
              {detail.category === 'Tour' && (
                <div className="space-y-6 mt-6 border-t border-gray-100 dark:border-slate-700 pt-6">
                  {includedBenefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                        <Check className="h-5 w-5 mr-2 text-emerald-500" /> Fasilitas yang Didapat
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {includedBenefits.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {excludedBenefits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                        <X className="h-5 w-5 mr-2 text-rose-500" /> Tidak Termasuk
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {excludedBenefits.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                            <X className="h-4 w-4 mr-2 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {itinerary.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                        <Map className="h-5 w-5 mr-2 text-blue-500" /> Rencana Perjalanan (Itinerary)
                      </h3>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                        {itinerary.map((item: string, idx: number) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[-9px] md:ml-0 z-10">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            </div>
                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm text-sm text-gray-600 dark:text-gray-300">
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              
              <h3 className="font-semibold text-foreground mb-3 flex items-center mt-6">
                <Clock className="h-5 w-5 mr-2 text-primary" /> Info Kunjungan
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li><span className="font-medium text-gray-800 dark:text-gray-200">Durasi:</span> {detail.duration}</li>
                <li><span className="font-medium text-gray-800 dark:text-gray-200">Jam Operasional:</span> {detail.operating_hours || '08:00 - 17:00'}</li>
                <li><span className="font-medium text-gray-800 dark:text-gray-200">Kapasitas per Slot:</span> {maxCapacity} pengunjung</li>
              </ul>
            </div>

            {/* Interactive Map */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-xl font-bold text-foreground dark:text-white mb-4 flex items-center">
                <MapPin className="h-6 w-6 text-brand-500 mr-2" /> 
                Location Map
              </h2>
              <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(detail.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {detail.location}
              </p>
            </div>

            {/* Citizen Waste Reporting */}
            <WasteReportForm destinationId={detail.id} isLoggedIn={!!user} />

            {/* Smart Redirection (Alternatives) */}
            {isDense && alternatives.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-6 md:p-8 border border-rose-100 dark:border-rose-900/20">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Destinasi Sedang Padat
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Untuk kenyamanan Anda, destinasi ini sudah mencapai kapasitas maksimal pada jam ini. Silakan pilih slot waktu lain, atau jelajahi alternatif menarik di sekitar yang saat ini lebih lengang:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alternatives.map((alt: any) => (
                    <Link href={`/detail/${alt.id}`} key={alt.id} className="block group">
                      <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                          {alt.image_url ? (
                            <img src={alt.image_url} alt={alt.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                          )}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-sm">
                            Kapasitas Tersedia
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:underline">{alt.title}</h3>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-slate-500 flex items-center"><Star className="h-3 w-3 text-slate-700 dark:text-slate-300 fill-slate-700 dark:fill-slate-300 mr-1"/> {alt.rating}</span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">Rp {Number(alt.price).toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Culinary Spots Section */}
            {culinarySpots.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Kuliner Terdekat
                </h2>
                
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {culinarySpots.map((spot: any, idx: number) => (
                    <div key={idx} className="min-w-[280px] sm:min-w-[320px] flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300 snap-start bg-surface dark:bg-slate-900 group cursor-pointer">
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                        {spot.image ? (
                          <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{spot.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{spot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}} />
              </div>
            )}

            {/* Tentang Mitra (Tour Operator) */}
            {detail.partners && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Tentang Mitra
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center">
                    {detail.partners.logo_url ? (
                      <img src={detail.partners.logo_url} alt={detail.partners.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">{detail.partners.name.substring(0,2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                        {detail.partners.name}
                        <CheckCircle className="w-4 h-4 ml-1 text-blue-500 fill-blue-500/20" />
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center gap-4">
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {detail.partners.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
                      {detail.partners.description}
                    </p>
                    
                    <Link href={`/partner/${detail.partners.id}`} className="text-sm font-semibold text-primary hover:underline">
                      Lihat Profil Lengkap
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-xl font-bold text-foreground dark:text-white mb-6 flex items-center">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mr-2" /> 
                Reviews ({reviews?.length || 0})
              </h2>

              <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.profiles?.email?.split('@')[0] || 'Anonymous'}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`h-3 w-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </span>
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>

              {user ? (
                <ReviewForm destinationId={detail.id} />
              ) : (
                <div className="mt-8 bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                  <p className="text-gray-600 mb-2">Want to leave a review?</p>
                  <Link href="/login" className="text-primary font-bold hover:underline">Log in to review</Link>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 sticky top-24 transition-colors">
              <BookingForm 
                destinationId={detail.id} 
                pricePerPerson={Number(detail.price)} 
                availableSlots={availableSlots}
                maxCapacity={maxCapacity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
