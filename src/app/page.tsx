import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import AdSlider from "@/components/shared/AdSlider";
import ParallaxHero from "@/components/home/ParallaxHero";
import CinematicLogoCloud from "@/components/ui/cinematic-logo-cloud";
import DestinationGrid from "@/components/home/DestinationGrid";

const partners = [
  { name: "Airbnb", slug: "airbnb", text: false },
  { name: "Booking.com", slug: "bookingdotcom", text: false },
  { name: "Tripadvisor", slug: "tripadvisor", text: false },
  { name: "Agoda", slug: "agoda", text: false },
  { name: "Expedia", slug: "expedia", text: false },
  { name: "Garuda Indonesia", text: true, className: "text-lg font-bold tracking-wide text-blue-600 dark:text-blue-400" },
  { name: "Traveloka", text: true, className: "text-xl font-bold text-cyan-500" },
  { name: "Tiket.com", text: true, className: "text-lg font-bold text-yellow-500" },
  { name: "Gojek", slug: "gojek", text: false, invertDark: true },
  { name: "Grab", slug: "grab", text: false, invertDark: true },
];

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch popular destinations
  const { data: popularDestinations } = await supabase
    .from('destinations')
    .select('*')
    .order('rating', { ascending: false })
    .limit(4);

  const destinations = popularDestinations || [];

  // Fetch dynamic images
  const { data: heroData } = await supabase.from('homepage_settings').select('data').eq('section', 'hero').single()
  const { data: bannersData } = await supabase.from('homepage_settings').select('data').eq('section', 'banners').single()
  
  const heroImage = heroData?.data?.image_url || "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=2000"
  const bannerImages = bannersData?.data?.images || [
    "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1621574539437-4b726487920f?auto=format&fit=crop&q=80&w=1200"
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Parallax Hero Section */}
      <ParallaxHero />

      {/* Promo Banner Section (Moved to Top & Overlapping) */}
      <section className="relative z-20 -mt-24 md:-mt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AdSlider dynamicImages={bannerImages} />
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
          
          <DestinationGrid destinations={destinations} />
        </div>
      </section>
      {/* Mitra / Partners Section */}
      <section className="border-t border-gray-100 dark:border-slate-800">
        <CinematicLogoCloud 
          clients={partners} 
          variant="grid"
          eyebrow="Mitra Resmi & Partner Perjalanan Kami"
          description="Bekerja sama dengan platform travel terbaik dunia"
        />
      </section>

      {/* Footer will go here via layout */}
    </div>
  );
}
