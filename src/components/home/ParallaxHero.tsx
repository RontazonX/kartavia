"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import HeroSearchBar from '@/components/explore/HeroSearchBar';

export default function ParallaxHero({ layers }: { layers?: string[] }) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Fallback if no layers are passed
  const layer1 = layers?.[0] || "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp";
  const layer2 = layers?.[1] || "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp";
  const layer3 = layers?.[2] || "https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0
        }
      });

      const speeds = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      speeds.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none",
            force3D: true,
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-[100vh] bg-gray-900 overflow-hidden" ref={parallaxRef}>
      <div data-parallax-layers className="absolute inset-0 w-full h-[120vh] -top-[10vh]">
        {/* Layer 1 - Background */}
        <img
          src={layer1}
          loading="eager"
          decoding="async"
          data-parallax-layer="1"
          alt="Layer 1"
          className="absolute top-0 left-0 w-full h-[130vh] object-cover pointer-events-none z-0 will-change-transform"
        />

        {/* Layer 3A - TITLE (Behind Layer 2) */}
        <div data-parallax-layer="3" className="absolute top-[30vh] left-0 w-full flex flex-col items-center justify-center text-center z-10 px-4 will-change-transform">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter mix-blend-overlay drop-shadow-2xl">
            Kartavia
          </h1>
        </div>

        {/* Layer 2 - Middle (Mountain covering the text) */}
        <img
          src={layer2}
          loading="eager"
          decoding="async"
          data-parallax-layer="2"
          alt="Layer 2"
          className="absolute top-0 left-0 w-full h-[130vh] object-cover pointer-events-none z-0 will-change-transform"
        />

        {/* Layer 3B - SUBTITLE & SEARCH BAR (In front of everything) */}
        <div data-parallax-layer="3" className="absolute top-[30vh] left-0 w-full flex flex-col items-center justify-center text-center z-40 px-4 pointer-events-none will-change-transform">
          {/* Invisible H1 to maintain exact same spacing as Layer 3A */}
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter opacity-0 select-none">
            Kartavia
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-10 max-w-2xl drop-shadow-md">
            Discover the Heart of Yogyakarta
          </p>
          <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative pointer-events-auto">
            <HeroSearchBar />
          </div>
        </div>
      </div>

      {/* Gradient Fade to blend with page body */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-slate-900 to-transparent z-30 pointer-events-none"></div>
    </div>
  );
}
