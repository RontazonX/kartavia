import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import AdSlider from "@/components/shared/AdSlider";
import ParallaxHero from "@/components/home/ParallaxHero";
import CinematicLogoCloud from "@/components/ui/cinematic-logo-cloud";
import DestinationGrid from "@/components/home/DestinationGrid";
import CulinarySpotlight from "@/components/home/CulinarySpotlight";

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
  
  // Fetch popular destinations (excluding tours)
  const { data: popularDestinations } = await supabase
    .from('destinations')
    .select('*')
    .neq('category', 'Tour')
    .order('rating', { ascending: false })
    .limit(4);

  // Fetch popular tours
  const { data: popularTours } = await supabase
    .from('destinations')
    .select('*')
    .eq('category', 'Tour')
    .order('rating', { ascending: false })
    .limit(4);

  const destinations = popularDestinations || [];
  const tours = popularTours || [];

  // Fetch Homepage Data
  const { data: bannersData } = await supabase.from('homepage_settings').select('data').eq('section', 'banners').single();
  const { data: parallaxData } = await supabase.from('homepage_settings').select('data').eq('section', 'parallax_hero').single();
  
  const parallaxLayers = parallaxData?.data?.layers || [
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp",
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp",
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
  ];
  const bannerImages = bannersData?.data?.images || [
    "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1621574539437-4b726487920f?auto=format&fit=crop&q=80&w=1200"
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Parallax Hero Section */}
      <div className="relative z-10">
        <ParallaxHero layers={parallaxLayers} />
      </div>

      {/* Promo Banner Section (Moved to Top & Overlapping) */}
      <section className="relative z-40 -mt-24 md:-mt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AdSlider dynamicImages={bannerImages} />
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DestinationGrid 
            destinations={destinations} 
            title="Popular Attractions" 
            subtitle="Top places to visit around you" 
          />
        </div>
      </section>

      {/* Popular Tour Packages Section */}
      {tours.length > 0 && (
        <section className="pb-16 bg-white dark:bg-slate-900 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <DestinationGrid 
              destinations={tours} 
              title="Exclusive Tour Packages" 
              subtitle="Curated multi-day experiences by our partners" 
            />
          </div>
        </section>
      )}

      {/* Culinary Recommendations Section */}
      <CulinarySpotlight />

      {/* Mitra / Partners Section */}
      <section className="border-t border-gray-100 dark:border-slate-800">
        <CinematicLogoCloud 
          clients={partners} 
          variant="grid"
          eyebrow="Mitra Resmi & Partner Perjalanan Kami"
          description="Bekerja sama dengan platform travel terbaik dunia"
        />
      </section>
    </div>
  );
}
