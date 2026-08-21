"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "@/components/shared/DestinationCard";

export default function DestinationGrid({ 
  destinations, 
  title = "Popular Destinations", 
  subtitle = "Most visited places in Jogja" 
}: { 
  destinations: any[],
  title?: string,
  subtitle?: string
}) {
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
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
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
            <DestinationCard 
              id={item.id}
              title={item.title}
              category={item.category}
              location={item.location}
              price={item.price}
              image_url={item.image_url}
              rating={item.rating}
              reviews_count={item.reviews_count}
              admin_eco_score={item.admin_eco_score}
              description={item.description}
            />
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
