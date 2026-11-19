'use client';

import { useState, useEffect, useRef } from 'react';

export interface HeroSlide {
  id: string;
  src: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { id: 'river-valley', src: '/images/hero/hero-slide-1.webp' },
  { id: 'phewa-lake', src: '/images/hero/hero-slide-2.webp' },
  { id: 'himalayan-flags', src: '/images/hero/hero-slide-3.webp' },
  { id: 'nepal-flag', src: '/images/hero/hero-slide-4.webp' },
  { id: 'golden-pass', src: '/images/hero/hero-slide-5.webp' },
  { id: 'rhododendron-peaks', src: '/images/hero/hero-slide-6.webp' },
];

interface HeroBackgroundSliderProps {
  scrollY?: number;
  intervalMs?: number;
  showControls?: boolean;
}

/**
 * Pure Background Slideshow Layer:
 * - Operates completely independently from the foreground content layer.
 * - Contains ZERO text, ZERO captions, and ZERO UI widgets to guarantee that the hero text remains 100% static.
 * - Smoothly crossfades between the 6 background images with zero layout shift.
 * - Fixed multi-layered atmospheric gradient ensures permanent, crystal-clear text contrast at all times.
 */
export default function HeroBackgroundSlider({
  scrollY = 0,
  intervalMs = 5500,
}: HeroBackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Priority preloading: load Slide 1 immediately, then preload remaining slides during idle time
  useEffect(() => {
    // 1. Immediate priority for the first slide
    const firstImg = new Image();
    firstImg.src = HERO_SLIDES[0].src;

    // 2. Preload subsequent slides during idle time to conserve initial network bandwidth
    const preloadRest = () => {
      HERO_SLIDES.slice(1).forEach((slide) => {
        const img = new Image();
        img.src = slide.src;
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadRest);
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timeoutId = setTimeout(preloadRest, 200);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Automatic cyclical slide transitions (pure background image rotation)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-slate-950"
      aria-hidden="true"
    >
      {/* Layered Crossfading Image Slides with Subtle Cinematic Ken Burns & Scroll Parallax */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out will-change-transform ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url('${slide.src}')`,
                transform: `translate3d(0, ${Math.min(scrollY * 0.16, 90)}px, 0)`,
              }}
            />
          </div>
        );
      })}

      {/* 1. Atmospheric Contrast Overlays (Deeper on mobile to ensure crisp text legibility over vivid photography) */}
      <div className="absolute inset-0 z-20 bg-slate-950/40 sm:bg-slate-950/25 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/75 via-slate-950/40 to-transparent sm:bg-gradient-to-r sm:from-slate-950/85 sm:via-slate-950/45 sm:to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-28 sm:h-36 z-20 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />

      {/* 2. Cinematic Atmospheric Mist & Cloud Fade-Out (Seamlessly dissolves bottom of hero into white section below) */}
      <div
        className="absolute -bottom-1 inset-x-0 h-40 sm:h-52 md:h-60 lg:h-72 z-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 100%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 80%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.04) 20%, rgba(255, 255, 255, 0.16) 40%, rgba(255, 255, 255, 0.42) 60%, rgba(255, 255, 255, 0.76) 78%, rgba(255, 255, 255, 0.94) 86%, #FFFFFF 93%, #FFFFFF 100%)
          `,
        }}
      />
      {/* 3. Subpixel Anti-Seam Cap: Guarantees zero dark hairline leaks on mobile fractional pixel scaling */}
      <div className="absolute -bottom-1 inset-x-0 h-3 bg-white z-20 pointer-events-none" />
    </div>
  );
}
