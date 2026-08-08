'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, MapPin } from 'lucide-react';

const culinaryData = [
  {
    id: 1,
    name: 'Gudeg Yu Djum',
    location: 'Wijilan, Yogyakarta',
    description: 'The legendary sweet jackfruit stew, slowly cooked for hours in traditional clay pots.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
    tags: ['Legendary', 'Sweet']
  },
  {
    id: 2,
    name: 'Sate Klatak Pak Pong',
    location: 'Bantul, Yogyakarta',
    description: 'Unique mutton satay grilled on bicycle spokes for perfectly even cooking.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    tags: ['Savory', 'Mutton']
  },
  {
    id: 3,
    name: 'Kopi Jos Lik Man',
    location: 'Malioboro Street',
    description: 'Hot black coffee served with a piece of burning charcoal dunked right into the glass.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    tags: ['Coffee', 'Unique']
  },
  {
    id: 4,
    name: 'Bakpia Pathok 25',
    location: 'Pathok, Yogyakarta',
    description: 'Warm, freshly baked sweet rolls filled with mung bean paste. A must-buy souvenir.',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800',
    tags: ['Dessert', 'Souvenir']
  },
  {
    id: 5,
    name: 'Oseng Mercon Bu Narti',
    location: 'Ngampilan, Yogyakarta',
    description: 'Explosively spicy beef stir-fry that will challenge your taste buds.',
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800',
    tags: ['Spicy', 'Dinner']
  }
];

export default function CulinarySpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Rekomendasi Kuliner</h2>
              <p className="text-slate-600">Sempurnakan perjalanan Anda dengan cita rasa lokal terbaik.</p>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <button 
                onClick={scrollLeft}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollRight}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 hide-scrollbar -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {culinaryData.map((item) => (
              <div
                key={item.id}
                className="w-[280px] md:w-[320px] flex-none snap-start"
              >
                <div className="group relative flex h-[360px] w-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Floating Buttons/Badges */}
                    <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-primary shadow-sm cursor-pointer" onClick={(e) => e.preventDefault()}>
                      <Heart className="h-4 w-4" />
                    </button>
                    {item.tags[0] && (
                      <div className="absolute top-3 left-3 z-10 rounded-md bg-white/95 px-2 py-1 font-semibold text-slate-900 text-[10px] uppercase tracking-wider shadow-sm">
                        {item.tags[0]}
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-1 flex items-center text-sm text-slate-500 tracking-tight">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        <span className="truncate">{item.location}</span>
                      </p>
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center text-sm font-medium">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-slate-900">4.9</span>
                        <span className="text-slate-500 ml-1 font-normal">(120)</span>
                      </div>
                      <div className="text-right flex items-center text-primary font-medium text-sm hover:underline">
                        Lihat Detail
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
