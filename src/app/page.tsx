import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch popular destinations
  const { data: popularDestinations } = await supabase
    .from('destinations')
    .select('*')
    .order('rating', { ascending: false })
    .limit(4);

  const destinations = popularDestinations || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {/* Using a placeholder gradient since we don't have an image yet */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-[-50px]">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Discover the Heart of Java
          </h1>
          <p className="text-lg md:text-xl mb-10 text-white/90">
            Book unforgettable tours, activities, and rentals in Yogyakarta.
          </p>
          
          {/* Search Box */}
          <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center max-w-3xl mx-auto w-full">
            <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <input type="text" placeholder="Where to?" className="w-full focus:outline-none text-gray-800 bg-transparent placeholder-gray-400" />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 w-full border-b md:border-b-0 md:border-r border-gray-200">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <input type="text" placeholder="Dates" className="w-full focus:outline-none text-gray-800 bg-transparent placeholder-gray-400" />
            </div>
            <div className="flex-1 flex items-center px-6 py-3 w-full">
              <Users className="h-5 w-5 text-gray-400 mr-3" />
              <input type="text" placeholder="Guests" className="w-full focus:outline-none text-gray-800 bg-transparent placeholder-gray-400" />
            </div>
            <button className="w-full md:w-auto mt-2 md:mt-0 bg-primary text-white rounded-full px-8 py-4 font-semibold hover:bg-primary-dark transition-colors shadow-lg cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">Popular Destinations</h2>
              <p className="text-gray-500 dark:text-gray-400">Most visited places in Jogja</p>
            </div>
            <Link href="/explore" className="text-primary font-medium flex items-center hover:underline">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {destinations.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400">No destinations found. Did you run the Supabase SQL schema?</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((item) => (
                <Link href={`/detail/${item.id}`} key={item.id}>
                  <div className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden -translate-y-0 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                       {item.image_url ? (
                         <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       ) : (
                         <div className="w-full h-full bg-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <span className="text-gray-500 text-sm">No Image</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                       <div className="absolute bottom-3 left-3 z-20 flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1">
                         <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                         <span className="text-xs font-semibold text-white">{item.rating}</span>
                       </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg text-foreground dark:text-white mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> <span className="truncate">{item.location}</span>
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                          <p className="font-bold text-foreground dark:text-white">
                            {Number(item.price) === 0 ? 'Free' : `Rp ${Number(item.price).toLocaleString('id-ID')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Promo Banner Section */}
      <section className="py-12 bg-surface dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-10"></div>
            
            <div className="relative z-10 md:max-w-xl mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get 20% off your first booking!</h2>
              <p className="text-white/80 text-lg mb-6">Use code <span className="font-mono bg-white/20 px-2 py-1 rounded">JOGJA20</span> at checkout for all tour packages and rentals.</p>
              <button className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg cursor-pointer">
                Claim Promo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
