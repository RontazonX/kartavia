import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Star, Leaf } from 'lucide-react';
import WishlistButton from '@/components/shared/WishlistButton';

interface DestinationCardProps {
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
  isLegendary?: boolean; // Mock property for the "LEGENDARY" badge design
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
}: DestinationCardProps) {
  // Adding logic to determine if it gets the 'LEGENDARY' badge for demonstration, or we can use category.
  const isLegendary = rating >= 4.8;

  return (
    <div className="group relative flex flex-col h-[400px] w-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/detail/${id}`} className="absolute inset-0 z-10" aria-label={`View ${title}`}></Link>
      
      {/* Image Section */}
      <div className="relative h-[200px] w-full overflow-hidden bg-slate-100 flex-shrink-0">
        {image_url ? (
          <img
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image_url}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton destinationId={id} />
        </div>
        
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {isLegendary ? (
            <span className="bg-white text-slate-800 text-xs font-extrabold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm self-start">
              LEGENDARY
            </span>
          ) : (
            <span className="bg-white/90 text-primary text-xs font-bold px-2 py-1 rounded shadow-sm self-start">
              {category}
            </span>
          )}
          {admin_eco_score >= 4 && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm self-start flex items-center">
              <Leaf className="w-3 h-3 mr-1" /> Zero Waste
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 z-0 relative bg-white">
        <div>
          <h3 className="font-bold text-xl text-rose-800 tracking-tight line-clamp-1 group-hover:text-rose-700 transition-colors">
            {title}
          </h3>
          <p className="mt-1.5 flex items-center text-sm text-slate-500 tracking-tight">
            <MapPin className="mr-1.5 h-4 w-4" />
            <span className="truncate">{location}</span>
          </p>
          <p className="mt-2.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1.5" />
            <span className="font-bold text-slate-800 text-base">{rating}</span>
            <span className="text-slate-500 ml-1.5">
              ({reviews_count > 0 ? reviews_count : 'New'})
            </span>
          </div>
          <div className="text-right relative z-20">
            {/* The Link sits above the absolute stretched link via z-index if needed, or we just rely on parent link */}
            <span className="font-semibold text-rose-500 text-sm hover:text-rose-600 transition-colors">
              Lihat Detail
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
