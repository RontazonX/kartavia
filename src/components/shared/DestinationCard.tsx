'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star, Sun, CloudRain, Cloud, Users, CheckCircle } from 'lucide-react';
import WishlistButton from '@/components/shared/WishlistButton';
import { useTranslation } from '@/i18n/client';

export interface DestinationCardProps {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  image_url?: string;
  rating: number;
  reviews_count?: number;
  admin_eco_score?: number;
  description?: string;
  isLegendary?: boolean;
  crowd_level?: 'Low' | 'Medium' | 'Crowded';
  mockCondition?: {
    weather?: 'Sunny' | 'Rainy' | 'Cloudy';
    isOpen?: boolean;
  };
  personalBadge?: string;
}

export default function DestinationCard({
  id,
  title,
  category,
  location,
  price,
  image_url,
  rating,
  reviews_count = 0,
  admin_eco_score = 0,
  description = "A wonderful destination to visit.",
  crowd_level,
  mockCondition,
  personalBadge,
}: DestinationCardProps) {
  const { t } = useTranslation();

  // Determine badge colors based on crowd level
  let crowdBadgeClass = "";
  let crowdLabel = "";
  let CrowdIcon = Users;
  
  if (crowd_level === 'Crowded') {
    crowdBadgeClass = "bg-white text-rose-600 shadow-[0_2px_8px_rgba(0,0,0,0.12)]";
    crowdLabel = t.explore.card.crowded;
    CrowdIcon = Users;
  } else if (crowd_level === 'Medium') {
    crowdBadgeClass = "bg-white text-amber-600 shadow-[0_2px_8px_rgba(0,0,0,0.12)]";
    crowdLabel = t.explore.card.medium;
    CrowdIcon = Users;
  } else if (crowd_level === 'Low') {
    crowdBadgeClass = "bg-white text-emerald-600 shadow-[0_2px_8px_rgba(0,0,0,0.12)]";
    crowdLabel = t.explore.card.low;
    CrowdIcon = CheckCircle;
  }

  const renderWeatherIcon = (weather?: string) => {
    if (weather === 'Sunny') return <Sun className="w-3 h-3 text-amber-500" />;
    if (weather === 'Rainy') return <CloudRain className="w-3 h-3 text-blue-500" />;
    if (weather === 'Cloudy') return <Cloud className="w-3 h-3 text-slate-400" />;
    return null;
  };

  return (
    <div className="group relative flex flex-col h-full min-h-[380px] w-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link prefetch={false} href={`/detail/${id}`} className="absolute inset-0 z-10" aria-label={`View ${title}`}></Link>
      
      {/* Image Section */}
      <div className="relative h-[160px] md:h-[200px] w-full overflow-hidden bg-slate-100 flex-shrink-0">
        {image_url ? (
          <Image
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image_url}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
            <span className="text-sm">{t.explore.card.noImage}</span>
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-2 right-2 z-20">
          <WishlistButton destinationId={id} />
        </div>
        
        {/* Real-time Condition Overlays (Top Left) */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5 items-start">
          {crowd_level && (
            <span className={`text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider ${crowdBadgeClass}`}>
              <CrowdIcon className="w-3.5 h-3.5" /> <span className="mt-[1px]">{crowdLabel}</span>
            </span>
          )}
          
          {personalBadge && (
            <span className="bg-white text-violet-600 text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center gap-1">
              ✨ <span className="mt-[1px]">{personalBadge}</span>
            </span>
          )}
        </div>

        {/* Real-time Condition Overlays (Bottom of Image) */}
        {(mockCondition) && (
          <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-wrap gap-1.5">
            {mockCondition?.weather && (
              <span className="bg-white text-slate-700 text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center gap-1.5">
                {renderWeatherIcon(mockCondition?.weather)} <span className="mt-[1px]">{mockCondition?.weather}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-3 md:p-4 z-0 relative bg-white">
        <div>
          <h3 className="font-bold text-base md:text-lg text-slate-900 tracking-tight line-clamp-1 group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          
          <div className="mt-1 md:mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-0.5" />
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-0.5" />
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-0.5" />
              <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
            </div>
            <span className="font-bold text-blue-600">{rating.toFixed(1)}/5</span>
            <span>•</span>
            <span>{reviews_count > 0 ? `${reviews_count} ${t.explore.card.reviews}` : t.explore.card.new}</span>
          </div>

          {(rating >= 4.5 && reviews_count > 5) && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
              <span>✨</span> 
              <span className="mt-[1px]">{t.explore.card.popularDesc}</span>
            </div>
          )}

          <p className="mt-2.5 text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Urgency Footer */}
        <div className="mt-auto pt-3 flex flex-col">
          <span className="text-[11px] md:text-xs text-slate-400 line-through">
            Rp {(price * 1.15).toLocaleString('id-ID')}
          </span>
          <span className="font-bold text-orange-500 text-base md:text-xl leading-none mt-0.5">
            Rp {price.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}

