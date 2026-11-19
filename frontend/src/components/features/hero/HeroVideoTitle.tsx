"use client";

import React, { useEffect, useRef, useState } from "react";

interface HeroVideoTitleProps {
  className?: string;
}

export default function HeroVideoTitle({ className = "" }: HeroVideoTitleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Respect accessibility reduced-motion preference
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => setIsVideoLoaded(true);

    if (video.readyState >= 3) {
      setIsVideoLoaded(true);
    } else {
      video.addEventListener("canplay", handleReady);
      video.addEventListener("playing", handleReady);
      video.addEventListener("loadeddata", handleReady);
    }

    // Safely attempt autoplay
    video.play().catch(() => {
      // Graceful fallback for mobile low-power mode
    });

    return () => {
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("playing", handleReady);
      video.removeEventListener("loadeddata", handleReady);
    };
  }, [isReducedMotion]);

  return (
    <div className={`relative w-full max-w-3xl lg:max-w-4xl select-none group cursor-default ${className}`}>
      {/* Semantic Accessible Heading for Screen Readers & Search Crawlers */}
      <h1 className="sr-only">Discover Nepal</h1>

      {/* Visual Video-Masked Letterforms SVG with Large Cinematic Glyphs */}
      <svg
        viewBox="0 0 760 330"
        className="w-full h-auto overflow-visible block drop-shadow-[0_12px_36px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_16px_48px_rgba(146,196,234,0.45)] transition-all duration-700"
        aria-hidden="true"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* Typography Styling: Heavy, bold, expansive geometric letterforms for maximum video aperture */}
          <style>{`
            .hero-text-glyph {
              font-family: var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 900;
              font-size: 154px;
              letter-spacing: -0.04em;
              text-rendering: geometricPrecision;
            }
          `}</style>

          {/* Linear Gradient for Instant Fallback & Low-Power Mode */}
          <linearGradient id="hero-fallback-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F8FAFC" />
            <stop offset="75%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Deep Ambient Shadow under the text */}
          <filter id="hero-letter-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000000" floodOpacity="0.9" />
          </filter>

          {/* SVG ClipPath defining the large letter outlines */}
          <clipPath id="discover-nepal-text-mask">
            <text x="4" y="140" className="hero-text-glyph">
              Discover
            </text>
            <text x="4" y="285" className="hero-text-glyph">
              Nepal
            </text>
          </clipPath>
        </defs>

        {/* Layer 1: Instant High-Contrast Silver-White Fallback Text */}
        <text
          x="4"
          y="140"
          className={`hero-text-glyph transition-opacity duration-1000 ease-out ${
            isVideoLoaded && !isReducedMotion ? "opacity-0" : "opacity-100"
          }`}
          fill="url(#hero-fallback-grad)"
          filter="url(#hero-letter-glow)"
        >
          Discover
        </text>
        <text
          x="4"
          y="285"
          className={`hero-text-glyph transition-opacity duration-1000 ease-out ${
            isVideoLoaded && !isReducedMotion ? "opacity-0" : "opacity-100"
          }`}
          fill="url(#hero-fallback-grad)"
          filter="url(#hero-letter-glow)"
        >
          Nepal
        </text>

        {/* Layer 2: Live Video Playing Inside Letterforms with Enhanced Vividness */}
        {!isReducedMotion && (
          <foreignObject
            x="0"
            y="0"
            width="760"
            height="330"
            clipPath="url(#discover-nepal-text-mask)"
            className={`transition-opacity duration-1000 ease-out ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-full h-full relative overflow-hidden bg-slate-950">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                poster="/hero-himalayas.webp"
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-115 transition-transform duration-1000 ease-out brightness-120 contrast-125 saturate-120"
                src="/videos/nepal-hero.mp4"
              />
            </div>
          </foreignObject>
        )}

        {/* Layer 3: Ultra-Crisp Crystalline Outer Rim Stroke for Razor-Sharp Legibility */}
        <text
          x="4"
          y="140"
          className="hero-text-glyph pointer-events-none transition-all duration-500"
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.8"
        >
          Discover
        </text>
        <text
          x="4"
          y="285"
          className="hero-text-glyph pointer-events-none transition-all duration-500"
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.8"
        >
          Nepal
        </text>
      </svg>
    </div>
  );
}
