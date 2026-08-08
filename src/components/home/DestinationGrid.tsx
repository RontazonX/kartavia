"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Star, MapPin, Leaf } from "lucide-react";

export default function DestinationGrid({ destinations }: { destinations: any[] }) {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (destinations.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-slate-500">No destinations found. Did you run the Supabase SQL schema?</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Destinations</h2>
          <p className="text-slate-600">Most visited places in Jogja</p>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer"
            onClick={handleScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors cursor-pointer"
            onClick={handleScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            className="ml-2 hidden font-medium text-sm text-primary hover:underline md:block"
            href="/explore"
          >
            View all
          </Link>
        </div>
      </div>

      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 hide-scrollbar -mx-4 px-4"
        ref={scrollContainer}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {destinations.map((item) => (
          <div className="w-[280px] md:w-[320px] flex-none snap-start" key={item.id}>
            <Link href={`/detail/${item.id}`} className="block focus-visible:outline-none">
              <div className="group relative flex h-[360px] w-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {item.image_url ? (
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={item.image_url}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  
                  {/* Floating Buttons/Badges */}
                  <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-primary shadow-sm cursor-pointer" onClick={(e) => e.preventDefault()}>
                    <Heart className="h-4 w-4" />
                  </button>
                  <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded shadow-sm self-start">
                      {item.category}
                    </span>
                    {item.admin_eco_score >= 4 && (
                      <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm self-start flex items-center">
                        <Leaf className="w-3 h-3 mr-1" /> Zero Waste
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 flex items-center text-sm text-slate-500 tracking-tight">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-slate-900">{item.rating}</span>
                      <span className="text-slate-500 ml-1 font-normal">
                        ({item.reviews_count > 0 ? item.reviews_count : 'New'})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-500 font-medium uppercase tracking-wider">Start from</span>
                      <span className="font-bold text-slate-900">
                        {Number(item.price) === 0 ? 'Free' : `Rp ${Number(item.price).toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
