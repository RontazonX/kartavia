'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const promos = [
  {
    id: 1,
    title: "Special Summer Sale!",
    description: "Get up to 30% off on all Merapi Jeep Tours.",
    image: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?q=80&w=800&auto=format&fit=crop",
    code: "MERAPI30",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    title: "Cultural Heritage Tour",
    description: "Free guide for Prambanan & Borobudur combo.",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=800&auto=format&fit=crop",
    code: "CULTUREFREE",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    title: "Weekend Getaway",
    description: "Extra 15% discount for weekend car rentals.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    code: "WKND15",
    color: "from-emerald-500 to-teal-600"
  }
];

export default function PromoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-[-40px] z-20 px-4 mb-16">
      <div className="relative overflow-hidden rounded-2xl shadow-xl h-[180px] sm:h-[220px] bg-white group">
        
        {promos.map((promo, index) => (
          <div 
            key={promo.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out flex items-center justify-between
              ${index === currentIndex ? 'translate-x-0' : index < currentIndex ? '-translate-x-full' : 'translate-x-full'}
            `}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} opacity-90 z-10`}></div>
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
               <Image src={promo.image} alt={promo.title} fill className="object-cover opacity-40 mix-blend-overlay" />
            </div>

            <div className="relative z-20 p-6 sm:p-10 text-white flex flex-col justify-center h-full w-full">
              <h3 className="text-xl sm:text-3xl font-bold mb-2">{promo.title}</h3>
              <p className="text-sm sm:text-lg text-white/90 mb-4 max-w-lg">{promo.description}</p>
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-mono font-bold tracking-wider">
                  Code: {promo.code}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
