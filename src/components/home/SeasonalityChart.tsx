'use client';

import React from 'react';

const data = [
  { month: 'Jan', value: -28 },
  { month: 'Feb', value: -47 },
  { month: 'Mar', value: -58 },
  { month: 'Apr', value: -57 },
  { month: 'May', value: -39 },
  { month: 'Jun', value: -8 },
  { month: 'Jul', value: 2 },
  { month: 'Aug', value: 135 },
  { month: 'Sep', value: 109 },
  { month: 'Oct', value: 67 },
  { month: 'Nov', value: -33 },
  { month: 'Dec', value: -40 },
];

export default function SeasonalityChart() {
  return (
    <div className="w-full h-full flex flex-col p-5 md:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#1E293B] mb-1">When is the busiest time for Yogyakarta activities?</h2>
        <p className="text-[#64748B] text-sm md:text-base">Book earlier for peak months</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 md:gap-6 mb-6 text-xs md:text-sm font-medium text-[#64748B]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5A5F]"></div>
          <span>Busier than usual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00a651]"></div>
          <span>Quieter than usual</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-[200px] w-full mt-6 mb-8">
        {/* Grid Lines & Y-Axis Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {/* +200% */}
          <div className="relative h-0 w-full border-t border-gray-100">
            <span className="absolute -top-3 -left-2 md:-left-8 text-xs text-[#64748B] font-medium bg-white pr-2">+200%</span>
          </div>
          {/* +100% */}
          <div className="relative h-0 w-full border-t border-gray-100" style={{ marginTop: 'auto', marginBottom: 'auto', top: '33.33%', position: 'absolute' }}>
            <span className="absolute -top-3 -left-2 md:-left-8 text-xs text-[#64748B] font-medium bg-white pr-2">+100%</span>
          </div>
          {/* Typical (0%) */}
          <div className="relative h-0 w-full border-t border-gray-300" style={{ top: '66.66%', position: 'absolute' }}>
            <span className="absolute -top-3 -left-2 md:-left-8 text-xs text-[#64748B] font-semibold bg-white pr-2">Typical</span>
          </div>
          {/* -100% */}
          <div className="relative h-0 w-full border-t border-gray-100" style={{ top: '100%', position: 'absolute' }}>
            <span className="absolute -top-3 -left-2 md:-left-8 text-xs text-[#64748B] font-medium bg-white pr-2">-100%</span>
          </div>
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 flex justify-between items-end ml-4 md:ml-0 px-1 md:px-6">
          {data.map((item, index) => {
            const isPositive = item.value >= 0;
            const isBusiest = item.value === 135;
            const isQuietest = item.value === -58;

            return (
              <div key={index} className="relative flex flex-col items-center flex-1 h-full">
                
                {/* Positive Bar container (Bottom is at 33.33% from bottom) */}
                <div className="absolute bottom-[33.33%] w-full flex justify-center items-end" style={{ height: '66.66%' }}>
                  {isPositive && (
                    <div 
                      className="relative w-3 sm:w-4 md:w-5 bg-[#FF5A5F] rounded-t-sm"
                      style={{ height: `${(Math.abs(item.value) / 200) * 100}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
                        {isBusiest && <span className="text-[#FF5A5F] text-[9px] sm:text-[10px] font-bold leading-none mb-0.5">Busiest</span>}
                        <span className={`text-[9px] sm:text-[10px] font-semibold leading-none ${isBusiest ? 'text-[#FF5A5F]' : 'text-[#64748B]'}`}>
                          +{item.value}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Negative Bar container (Top is at 66.66% from top) */}
                <div className="absolute top-[66.66%] w-full flex justify-center items-start" style={{ height: '33.33%' }}>
                  {!isPositive && (
                    <div 
                      className="relative w-3 sm:w-4 md:w-5 bg-[#00a651] rounded-b-sm"
                      style={{ height: `${(Math.abs(item.value) / 100) * 100}%` }}
                    >
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
                        <span className={`text-[9px] sm:text-[10px] font-semibold leading-none ${isQuietest ? 'text-[#00a651]' : 'text-[#64748B]'}`}>
                          {item.value}%
                        </span>
                        {isQuietest && <span className="text-[#00a651] text-[9px] sm:text-[10px] font-bold leading-none mt-0.5">Quietest</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* X-Axis Label */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-medium text-[#64748B]">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description Footer */}
      <div className="mt-auto pt-8">
        <div className="bg-[#F8FAFC] rounded-r-lg p-4 md:p-5 border-l-4 border-[#FF5A5F]">
          <p className="text-[#1E293B] leading-relaxed text-[13px] md:text-sm">
            Yogyakarta sees peak demand in August (about 135% above a typical month) and the quietest bookings in March (roughly 58% below a typical month), so expect to book early for August and enjoy easier availability and fewer crowds in March. Based on Klook historical booking data.
          </p>
        </div>
      </div>
    </div>
  );
}
