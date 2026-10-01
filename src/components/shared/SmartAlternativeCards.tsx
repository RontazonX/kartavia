'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, MapPin, TrendingDown, Zap, ArrowRight } from 'lucide-react';

export interface AlternativeDestination {
  id: string;
  title: string;
  location?: string;
  image_url?: string;
  rating?: number;
  price: number;
}

interface SmartAlternativeCardsProps {
  alternatives: AlternativeDestination[];
  currentTitle: string;
}

const MOCK_EXTRAS = [
  { distance: '10 menit', tagline: 'Pemandangan Serupa, Tanpa Macet', fillPercent: 12 },
  { distance: '15 menit', tagline: 'Lebih Tenang, Sama Indahnya', fillPercent: 18 },
  { distance: '8 menit',  tagline: 'Hidden Gem Favorit Lokal', fillPercent: 8 },
];

export default function SmartAlternativeCards({ alternatives, currentTitle }: SmartAlternativeCardsProps) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50 p-6 sm:p-8 shadow-lg dark:border-emerald-800/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
            <Zap className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-100">
            Alternatif Cerdas untuk Anda
          </h2>
        </div>
        <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70">
          Destinasi serupa dengan <span className="font-bold">{currentTitle}</span> yang sedang sepi — plus diskon pengalihan arus.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {alternatives.slice(0, 3).map((alt, index) => {
          const extra = MOCK_EXTRAS[index] || MOCK_EXTRAS[0];
          const discountPercent = 25;
          const originalPrice = Math.round(alt.price * (100 / (100 - discountPercent)));

          return (
            <div
              key={alt.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-emerald-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-400/60 dark:border-emerald-800/50 dark:bg-slate-900 dark:hover:border-emerald-600/60"
            >
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                {alt.image_url ? (
                  <Image
                    src={alt.image_url}
                    alt={alt.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-400">
                    <MapPin className="h-8 w-8" />
                  </div>
                )}

                {/* Badge: Sepi & Bebas Antre */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/50">
                  <CheckCircle className="h-3 w-3" />
                  Sepi &amp; Bebas Antre
                </div>

                {/* Distance tag */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
                  📍 Hanya {extra.distance} dari lokasimu
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {alt.title} — {extra.tagline}
                </h3>

                {/* Price section */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 line-through font-medium">
                    Rp {originalPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    Rp {Number(alt.price).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="mt-1 inline-flex items-center gap-1 self-start rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-600 border border-orange-200/50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30">
                  🔥 Diskon Pengalihan Arus {discountPercent}%
                </div>

                {/* Mini capacity bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/60 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Kapasitas
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{extra.fillPercent}% terisi</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${extra.fillPercent}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/detail/${alt.id}`}
                  prefetch={false}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
                >
                  Klaim Diskon &amp; Pindah Kesini
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
