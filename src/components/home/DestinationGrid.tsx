"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DestinationCard from "@/components/shared/DestinationCard";
import { useTranslation } from "@/i18n/client";

export default function DestinationGrid({ 
  destinations, 
  title, 
  subtitle,
  regions
}: { 
  destinations: any[],
  title?: string,
  subtitle?: string,
  regions?: string[]
}) {
  const { t } = useTranslation();
  const displayTitle = title || t.home.destinationsTitle;
  const displaySubtitle = subtitle || t.home.destinationsSubtitle;

  const scrollContainer = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const allRegions = regions && regions.length > 0 ? [t.explore.all, ...regions] : [];

  const filteredDestinations = activeRegion 
    ? destinations.filter(d => d.location?.toLowerCase().includes(activeRegion.toLowerCase()))
    : destinations;

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
        <p className="text-slate-500">{t.explore.noDestinations}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-6 flex items-end justify-between">
        <div>
          <Link href="/explore" className="group flex items-center mb-1">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">{displayTitle}</h2>
            <ChevronRight className="h-5 w-5 md:h-7 md:w-7 ml-1 text-primary md:text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          {displaySubtitle && <p className="text-sm md:text-base text-slate-500">{displaySubtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 mb-1">
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
        </div>
      </div>

      {allRegions.length > 0 && (
        <div className="flex gap-2.5 md:gap-3 overflow-x-auto hide-scrollbar mb-4 pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {allRegions.map((region) => {
            const isActive = (region === t.explore.all && !activeRegion) || region === activeRegion;
            return (
              <button 
                key={region} 
                onClick={() => setActiveRegion(region === t.explore.all ? null : region)}
                className={`whitespace-nowrap px-4 py-1.5 md:py-2 border rounded-full text-sm font-medium transition-colors cursor-pointer ${isActive ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'}`}
              >
                {region}
              </button>
            );
          })}
        </div>
      )}

      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2 hide-scrollbar -mx-4 px-4"
        ref={scrollContainer}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((item) => (
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
                mockCondition={item.mockCondition}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-slate-500">
            {t.explore.noDestinationsIn} {activeRegion}.
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
