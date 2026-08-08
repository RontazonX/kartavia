import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, CheckCircle, ChevronLeft, User } from 'lucide-react';
import { createClient } from "@/utils/supabase/server";
import BookingForm from '@/components/booking/BookingForm';
import ReviewForm from '@/components/reviews/ReviewForm';
import WishlistButton from '@/components/shared/WishlistButton';

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: detail } = await supabase
    .from('destinations')
    .select('*')
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
                <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">{detail.title}</h1>
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
              
              {highlights.length > 0 && (
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
              
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" /> Duration
              </h3>
              <p className="text-gray-600">{detail.duration}</p>
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
              <BookingForm destinationId={detail.id} pricePerPerson={Number(detail.price)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
