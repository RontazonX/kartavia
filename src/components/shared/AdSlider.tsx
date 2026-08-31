"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Ad {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  bgColor: string;
  actionType: 'claim' | 'link';
  actionPayload: string;
}

const ads: Ad[] = [
  {
    id: "1",
    title: "Get 20% off your first booking!",
    description: "Use code JOGJA20 at checkout for all tour packages and rentals.",
    image: "https://images.unsplash.com/photo-1584395630827-860fee695e9c?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Claim Promo",
    bgColor: "bg-primary",
    actionType: 'claim',
    actionPayload: 'JOGJA20',
  },
  {
    id: "2",
    title: "Special Borobudur Sunrise Package",
    description: "Experience the magic with breakfast included. Limited time offer.",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Book Now",
    bgColor: "bg-orange-600",
    actionType: 'link',
    actionPayload: '/explore?q=Borobudur',
  },
  {
    id: "3",
    title: "Explore Hidden Beaches",
    description: "Private tour to Gunung Kidul's most pristine and untouched shores.",
    image: "https://images.unsplash.com/photo-1621574539437-4b726487920f?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Discover",
    bgColor: "bg-teal-600",
    actionType: 'link',
    actionPayload: '/explore?region=Gunungkidul',
  }
];

export default function AdSlider({ dynamicImages = [] }: { dynamicImages?: string[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [isHovered, setIsHovered] = useState(false);

  // Inject dynamic images into the ads array if available
  const displayAds = ads.map((ad, i) => ({
    ...ad,
    image: dynamicImages[i] || ad.image
  }));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === displayAds.length - 1 ? 0 : prevIndex + 1));
  }, [displayAds.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? displayAds.length - 1 : prevIndex - 1));
  }, [displayAds.length]);

  // Auto-play logic
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isHovered, nextSlide]);

  const handleAction = (ad: Ad) => {
    if (ad.actionType === 'link') {
      router.push(ad.actionPayload);
    } else if (ad.actionType === 'claim') {
      // Auto-copy to clipboard
      navigator.clipboard.writeText(ad.actionPayload).catch(() => { });

      setClaimedIds(prev => {
        const newSet = new Set(prev);
        newSet.add(ad.id);
        return newSet;
      });
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl shadow-2xl group h-[300px] md:h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Container */}
      <div
        className="flex h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible transition-transform duration-700 ease-in-out max-md:!transform-none"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayAds.map((ad, index) => {
          const isClaimed = ad.actionType === 'claim' && claimedIds.has(ad.id);

          return (
            <div key={ad.id} className="w-full min-w-full h-full relative flex items-center shrink-0 rounded-3xl overflow-hidden snap-center">
              {/* Background Image with Overlay */}
              <div className={`absolute inset-0 ${ad.bgColor}`}>
                <Image
                  src={ad.image}
                  alt={ad.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105"
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-16 w-full flex flex-col justify-center items-start h-full max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-md transition-all transform translate-y-0 opacity-100 duration-500 delay-100">
                  {ad.title}
                </h2>
                <p className="text-white/90 text-lg md:text-xl mb-8 drop-shadow max-w-xl">
                  {ad.description}
                </p>
                <button
                  onClick={() => handleAction(ad)}
                  disabled={isClaimed}
                  className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg duration-300 flex items-center justify-center gap-2 ${isClaimed
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-white text-slate-900 hover:bg-slate-100 cursor-pointer transform hover:scale-105"
                    }`}
                >
                  {isClaimed ? (
                    <>Code Copied! 🎉</>
                  ) : (
                    <>
                      {ad.ctaText}
                      {ad.actionType === 'claim' && <Copy className="w-4 h-4 ml-1 opacity-70" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white  p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white  p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {displayAds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
