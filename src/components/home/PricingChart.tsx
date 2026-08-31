'use client';

import React from 'react';

const data = [
  { month: 'Jul', value: 37 },
  { month: 'Aug', value: 23 },
  { month: 'Sep', value: 38 },
  { month: 'Oct', value: 34 },
  { month: 'Nov', value: 36 },
  { month: 'Dec', value: 22 },
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 23 },
  { month: 'Mar', value: 29 },
  { month: 'Apr', value: 22 },
  { month: 'May', value: 28 },
  { month: 'Jun', value: 28 },
];

export default function PricingChart() {
  const minVal = 20;
  const maxVal = 40;
  const range = maxVal - minVal;

  const svgWidth = 1000;
  const svgHeight = 200;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * svgWidth;
    const y = svgHeight - ((d.value - minVal) / range) * svgHeight;
    return { x, y, ...d };
  });

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="w-full h-full flex flex-col p-5 md:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#1E293B] mb-1">When is Yogyakarta cheapest?</h2>
        <p className="text-[#64748B] text-sm md:text-base">Find months that fit your budget. Prices in USD.</p>
      </div>

      {/* Chart Area */}
      <div className="relative w-full mt-[68px] mb-8">
        
        {/* Y-Axis Labels & Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ height: '200px' }}>
          {[40, 35, 30, 25, 20].map((val, i) => (
            <div key={val} className={`relative w-full ${val === 30 ? 'border-t border-dashed border-gray-300' : 'border-t border-gray-100'}`} style={{ top: `${(i * 25)}%`, position: 'absolute' }}>
              <span className="absolute -top-3 -left-2 md:-left-8 text-[9px] sm:text-[10px] text-[#64748B] font-medium bg-white pr-2">${val}</span>
              {val === 30 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] text-[#64748B] font-medium bg-white px-2">Avg $30</span>
              )}
            </div>
          ))}
        </div>

        {/* SVG Line and Points */}
        <div className="relative w-full" style={{ height: '200px', marginLeft: '0' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* The Line */}
            <path d={pathD} fill="none" stroke="#FF5A5F" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            
            {/* The Points */}
            {points.map((p, i) => {
              const isPriciest = p.value === 40;
              const isCheapest = p.value === 22 && p.month === 'Dec';
              
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#FF5A5F" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  
                  {isPriciest && (
                    <text x={p.x} y={p.y - 12} textAnchor="middle" className="font-bold" fill="#1E293B" style={{ fontSize: '11px' }}>
                      Priciest ${p.value}
                    </text>
                  )}
                  {isCheapest && (
                    <text x={p.x} y={p.y + 18} textAnchor="middle" className="font-bold" fill="#1E293B" style={{ fontSize: '11px' }}>
                      Cheapest ${p.value}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="relative w-full mt-3 flex justify-between px-0">
          {data.map((d, i) => (
            <div key={i} className="text-[9px] sm:text-[10px] font-medium text-[#64748B]" style={{ width: '0', textAlign: 'center' }}>
              <span className="relative -left-1/2">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description Footer */}
      <div className="mt-auto pt-8">
        <div className="bg-[#F8FAFC] rounded-r-lg p-4 md:p-5 border-l-4 border-[#FF5A5F]">
          <p className="text-[#1E293B] leading-relaxed text-[13px] md:text-sm">
            Activities are typically cheapest in December (around USD 22), about 45% below the priciest month in January (around USD 40); this December low also lines up with the quieter March-to-December window, so December can offer better value and less competition. Based on Klook booking data, July 2025 - June 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
