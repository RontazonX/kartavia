'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AlertTriangle, MapPin, ArrowRight, X, ShieldAlert, Clock, TrendingDown } from 'lucide-react';

export interface InterceptAlternative {
  id: string;
  title: string;
  image_url?: string;
  price: number;
  location?: string;
}

interface OvertourismInterceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway: () => void;
  alternative: InterceptAlternative | null;
  currentTitle: string;
}

export default function OvertourismInterceptModal({
  isOpen,
  onClose,
  onProceedAnyway,
  alternative,
  currentTitle
}: OvertourismInterceptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const discountPercent = 20;
  const discountedPrice = alternative ? Math.round(alternative.price * (1 - discountPercent / 100)) : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-[modalIn_0.3s_ease-out]">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Tutup modal"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Warning header with gradient */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-6 py-5 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <ShieldAlert className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight sm:text-2xl">
              Tunggu! Yakin mau macet-macetan?
            </h2>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 text-center">
              <span className="font-bold text-slate-900 dark:text-white">{currentTitle}</span> sedang sangat padat. Daripada habis waktu{' '}
              <span className="font-bold text-red-600 dark:text-red-400">45+ menit di antrean</span>, kami punya{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">1 opsi destinasi serupa</span> yang sedang sepi — 
              dan kami kasih <span className="font-extrabold text-orange-600">diskon instan {discountPercent}%</span> kalau kamu pindah sekarang.
            </p>

            {/* Alternative mini-card */}
            {alternative && (
              <div className="mt-5 overflow-hidden rounded-xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800/40 transition-all hover:border-emerald-500/50">
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {alternative.image_url ? (
                      <Image
                        src={alternative.image_url}
                        alt={alternative.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <MapPin className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                      <TrendingDown className="h-3 w-3" />
                      Sedang Sepi
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {alternative.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        ~5 km dari sini
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        Tanpa antrean
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xs text-slate-400 line-through font-medium">
                        Rp {Number(alternative.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        Rp {discountedPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        -{discountPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-6 space-y-3">
              {/* Primary CTA: Switch destination */}
              {alternative && (
                <button
                  onClick={() => router.push(`/detail/${alternative.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
                >
                  Pindah ke {alternative.title.length > 20 ? alternative.title.substring(0, 20) + '...' : alternative.title} (+Diskon)
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}

              {/* Secondary CTA: Proceed anyway (deliberately less attractive) */}
              <button
                onClick={onProceedAnyway}
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-transparent px-6 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-500 dark:border-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-400"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Abaikan, Tetap Beli Tiket Macet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal entry animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </>
  );
}
