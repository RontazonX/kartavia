export const revalidate = 60;
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getBulkBookedSlots } from '@/components/booking/actions';
import AdSlider from "@/components/shared/AdSlider";
import ParallaxHero from "@/components/home/ParallaxHero";
import dynamic from 'next/dynamic';

const CinematicLogoCloud = dynamic(() => import("@/components/ui/cinematic-logo-cloud"));
const DestinationGrid = dynamic(() => import("@/components/home/DestinationGrid"), { ssr: true });
const CulinarySpotlight = dynamic(() => import("@/components/home/CulinarySpotlight"), { ssr: true });
const YogyakartaAtAGlance = dynamic(() => import("@/components/home/YogyakartaAtAGlance"), { ssr: true });
const RealtimeDensityMap = dynamic(() => import("@/components/home/RealtimeDensityMap"), { 
  ssr: true,
});

import { getDensityMapData } from "@/app/actions/densityMap";

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

const enhanceWithCondition = (dests: any[], bulkBookings: any, today: string) => {
  return dests.map((dest: any) => {
    const bookedCount = bulkBookings[dest.id]?.[today] || 0;
    const maxCapacity = dest.max_capacity || 100;
    const densityPercentage = maxCapacity > 0 ? (bookedCount / maxCapacity) * 100 : 0;
    let crowdLevel = 'Low';
    if (densityPercentage >= 90) crowdLevel = 'High';
    else if (densityPercentage >= 60) crowdLevel = 'Medium';
    
    const charSum = (dest.title || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
    const weather = ['Sunny', 'Cloudy', 'Rainy'][charSum % 3] as 'Sunny' | 'Cloudy' | 'Rainy';

    return {
      ...dest,
      mockCondition: { crowdLevel, weather, isOpen: true }
    };
  });
};

async function HeroSection() {
  const supabase = await createClient();
  const { data: parallaxData } = await supabase.from('homepage_settings').select('data').eq('section', 'parallax_hero').single();
  const parallaxLayers = parallaxData?.data?.layers || [
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp",
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp",
    "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
  ];
  const mobileBg = parallaxData?.data?.mobileBg || parallaxLayers[1] || "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp";
  
  return <ParallaxHero layers={parallaxLayers} mobileBg={mobileBg} />;
}

async function BannersSection() {
  const supabase = await createClient();
  const { data: bannersData } = await supabase.from('homepage_settings').select('data').eq('section', 'banners').single();
  const bannerImages = bannersData?.data?.images || [
    "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1621574539437-4b726487920f?auto=format&fit=crop&q=80&w=1200"
  ];
  return (
    <section className="relative z-40 mt-4 md:-mt-32 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <AdSlider dynamicImages={bannerImages} />
    </section>
  );
}

async function DensityMapSection() {
  const densityMapData = await getDensityMapData();
  return (
    <section className="py-8 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <RealtimeDensityMap data={densityMapData} />
      </div>
    </section>
  );
}

async function DestinationsSection() {
  const supabase = await createClient();
  const { data: popularDestinations } = await supabase.from('destinations').select('*').neq('category', 'Tour').order('rating', { ascending: false }).limit(12);
  let destinations = popularDestinations || [];
  
  const today = new Date().toLocaleDateString('en-CA');
  const allDestIds = destinations.map(d => d.id);
  const bulkBookings = await getBulkBookedSlots(allDestIds, [today]);
  
  destinations = enhanceWithCondition(destinations, bulkBookings, today);

  return (
    <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DestinationGrid 
          destinations={destinations} 
          title="Ayo Jelajah Yogyakarta" 
          subtitle="Libur hemat tanpa drama" 
          regions={['Sleman', 'Bantul', 'Gunungkidul', 'Kulon Progo', 'Kota Yogyakarta']}
        />
      </div>
    </section>
  );
}

async function ToursSection() {
  const supabase = await createClient();
  const { data: popularTours } = await supabase.from('destinations').select('*').eq('category', 'Tour').order('rating', { ascending: false }).limit(4);
  let tours = popularTours || [];
  if (tours.length === 0) return null;

  const today = new Date().toLocaleDateString('en-CA');
  const allDestIds = tours.map(t => t.id);
  const bulkBookings = await getBulkBookedSlots(allDestIds, [today]);
  
  tours = enhanceWithCondition(tours, bulkBookings, today);

  return (
    <section className="pb-16 bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DestinationGrid 
          destinations={tours} 
          title="Exclusive Tour Packages" 
          subtitle="Curated multi-day experiences by our partners" 
        />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kartavia',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kartavia.vercel.app',
            description: 'Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kartavia.vercel.app'}/explore?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'Kartavia',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kartavia.vercel.app',
            description: 'Platform pariwisata untuk menjelajahi keindahan budaya, alam, dan kuliner di Yogyakarta.',
            areaServed: {
              '@type': 'City',
              name: 'Yogyakarta',
              containedInPlace: { '@type': 'Country', name: 'Indonesia' },
            },
          }),
        }}
      />
      <div className="flex flex-col min-h-screen">
        {/* Parallax Hero Section */}
        <div className="relative z-10">
          <Suspense fallback={<div className="h-[100vh] w-full bg-slate-900 animate-pulse" />}>
            <HeroSection />
          </Suspense>
        </div>

        {/* Promo Banner Section (Moved to Top & Overlapping) */}
        <Suspense fallback={<div className="h-[200px] w-full max-w-7xl mx-auto bg-slate-200 animate-pulse rounded-2xl relative z-40 mt-4 md:-mt-32 pb-8 px-4 sm:px-6 lg:px-8" />}>
          <BannersSection />
        </Suspense>

        {/* Realtime Density Map Section */}
        <Suspense fallback={<div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-3xl max-w-7xl mx-auto my-8 border border-gray-200" />}>
          <DensityMapSection />
        </Suspense>

        {/* Popular Destinations Section */}
        <Suspense fallback={<div className="h-[400px] w-full bg-slate-50 animate-pulse py-12 md:py-16" />}>
          <DestinationsSection />
        </Suspense>

        {/* Popular Tour Packages Section */}
        <Suspense fallback={<div className="h-[400px] w-full bg-white animate-pulse pb-16" />}>
          <ToursSection />
        </Suspense>

        {/* Culinary Recommendations Section */}
        <CulinarySpotlight />

        {/* Yogyakarta at a Glance */}
        <YogyakartaAtAGlance />

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
    </>
  );
}
