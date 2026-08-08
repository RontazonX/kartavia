"use client"

import React, { ReactNode } from "react"

interface MarqueeProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Marquee({ children, speed = 35, className = "" }: MarqueeProps) {
  return (
    <div className={`flex overflow-hidden w-full ${className}`}>
      <div 
        className="flex min-w-full shrink-0 items-center justify-around gap-4"
        style={{
          animation: `marquee ${speed}s linear infinite`
        }}
      >
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
