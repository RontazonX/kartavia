'use client';

import React from 'react';
import SeasonalityChart from './SeasonalityChart';
import PricingChart from './PricingChart';

export default function YogyakartaAtAGlance() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">
            Yogyakarta at a glance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <SeasonalityChart />
            <PricingChart />
          </div>
        </div>
      </div>
    </section>
  );
}
