'use client';

import React from 'react';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface LiveTrafficAlertProps {
  capacityPercent?: number;
  waitMinutes?: number;
}

export default function LiveTrafficAlert({ 
  capacityPercent = 95,
  waitMinutes = 45
}: LiveTrafficAlertProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-red-500/60 bg-red-50 shadow-lg shadow-red-500/5 dark:border-red-800/60 dark:bg-red-950/30">
      {/* Animated urgency stripe at top */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">

          {/* Pulsing icon */}
          <div className="relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/30">
            <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-red-50 dark:border-red-950" />
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold tracking-tight text-red-900 dark:text-red-300 sm:text-lg">
                🚨 AWAS: Kepadatan Ekstrem!
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider animate-pulse">
                <TrendingUp className="h-3 w-3" />
                Kapasitas {capacityPercent}%
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-red-800/90 dark:text-red-300/90">
              Antrean masuk diprediksi mencapai <span className="font-extrabold text-red-900 dark:text-red-200">{waitMinutes}+ menit</span>. 
              Kenyamanan liburan Anda mungkin terganggu. Kami <span className="font-bold underline decoration-red-400 decoration-2 underline-offset-2">sangat menyarankan</span> untuk beralih ke destinasi alternatif di bawah.
            </p>

            {/* Stats row */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
                <Clock className="h-3.5 w-3.5" />
                Est. antre: {waitMinutes}+ mnt
              </div>
              <div className="h-4 w-px bg-red-300 dark:bg-red-700" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
                <TrendingUp className="h-3.5 w-3.5" />
                Terpadat hari ini
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-red-700/70 dark:text-red-400/70">
                  Kapasitas Area
                </span>
                <span className="text-xs font-black tabular-nums text-red-700 dark:text-red-400">
                  {capacityPercent}%
                </span>
              </div>

              <div className="relative h-3 w-full overflow-hidden rounded-full bg-red-200/80 dark:bg-red-950/60">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_16px_rgba(239,68,68,0.6)] transition-all duration-1000"
                  style={{ width: `${capacityPercent}%` }}
                >
                  <div className="h-full w-full animate-[pulse_2.5s_ease-in-out_infinite] rounded-full bg-white/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}} />
    </div>
  );
}
