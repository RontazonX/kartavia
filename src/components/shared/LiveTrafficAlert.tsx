import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function LiveTrafficAlert() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-red-500/50 bg-red-50 shadow-sm ring-1 ring-inset ring-red-500/10 dark:border-red-900/50 dark:bg-red-950/20 dark:ring-red-900/20">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          
          {/* Icon Section with subtle pulse */}
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
            <AlertCircle className="h-5 w-5 animate-[pulse_3s_ease-in-out_infinite]" strokeWidth={2.5} />
          </div>
          
          {/* Content Section */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold tracking-tight text-red-800 dark:text-red-400 sm:text-base">
              Terlalu Padat (Kapasitas 95%)
            </h3>
            
            <p className="mt-1.5 text-sm leading-relaxed text-red-700/90 dark:text-red-300/90">
              Antrean masuk diprediksi mencapai <span className="font-bold">45+ menit</span>. Kenyamanan liburan Anda mungkin terganggu. Kami sangat menyarankan untuk beralih ke destinasi alternatif di bawah.
            </p>

            {/* Progress Bar Section */}
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-red-700/80 dark:text-red-400/80">
                  Status Kapasitas
                </span>
                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                  95%
                </span>
              </div>
              
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-red-200/70 dark:bg-red-950/50">
                {/* Base progress bar with glow */}
                <div 
                  className="absolute left-0 top-0 h-full w-[95%] rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"
                >
                  {/* Slow urgent animation layer inside the progress bar */}
                  <div className="h-full w-full animate-[pulse_2s_ease-in-out_infinite] bg-white/30 dark:bg-white/20" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
