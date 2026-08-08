"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import HeroSearchBar from '@/components/explore/HeroSearchBar';

export default function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

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

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
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
      gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-[150vh] bg-[#a7b5b7] overflow-hidden" ref={parallaxRef}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div data-parallax-layers className="relative w-full h-[120vh] -top-[10vh]">
          {/* Layer 1 - Background sky/mountains */}
          <img 
            src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp" 
            loading="eager" 
            data-parallax-layer="1" 
            alt="Sky" 
            className="absolute top-0 left-0 w-full h-[130vh] object-cover pointer-events-none" 
          />
          
          {/* Layer 2 - Middle mountains */}
          <img 
            src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp" 
            loading="eager" 
            data-parallax-layer="2" 
            alt="Mountains" 
            className="absolute top-[10vh] left-0 w-full h-[120vh] object-cover pointer-events-none" 
          />
          
          {/* Layer 3 - Title & Content */}
          <div data-parallax-layer="3" className="absolute top-[30vh] left-0 w-full flex flex-col items-center justify-center text-center z-10 px-4">
             <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter mix-blend-overlay drop-shadow-2xl">
               Kartavia
             </h1>
             <p className="text-xl md:text-2xl text-white font-medium mb-10 max-w-2xl drop-shadow-md">
               Discover the Heart of Java
             </p>
             <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative z-50">
               <HeroSearchBar />
             </div>
          </div>
          
          {/* Layer 4 - Foreground mountains */}
          <img 
            src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp" 
            loading="eager" 
            data-parallax-layer="4" 
            alt="Foreground" 
            className="absolute bottom-[-10vh] left-0 w-full h-[100vh] object-cover pointer-events-none z-20" 
          />
        </div>
        
        {/* Gradient Fade to blend with page body */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-30 pointer-events-none"></div>
      </div>
    </div>
  );
}
