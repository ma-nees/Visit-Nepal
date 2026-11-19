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

    // Attempt video playback safely
    video.play().catch(() => {
      // If mobile browser blocks autoplay (e.g. low-power mode), keep fallback visible
    });

    return () => {
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("playing", handleReady);
      video.removeEventListener("loadeddata", handleReady);
    };
  }, [isReducedMotion]);

  return (
    <div className={`relative w-full max-w-4xl select-none group cursor-default ${className}`}>
      {/* Semantic Accessible Heading for Screen Readers & Search Crawlers */}
      <h1 className="sr-only">Discover Nepal</h1>

      {/* Visual Video-Masked Letterforms SVG */}
      <svg
        viewBox="0 0 1020 145"
        className="w-full h-auto overflow-visible block drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_12px_36px_rgba(146,196,234,0.35)] transition-all duration-700"
        aria-hidden="true"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* Typography Styling applied to all text layers */}
          <style>{`
            .hero-text-glyph {
              font-family: var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 900;
              font-size: 122px;
              letter-spacing: -0.035em;
              text-rendering: geometricPrecision;
            }
          `}</style>

          {/* Linear Gradient for Instant Fallback & Low-Power Mode */}
          <linearGradient id="hero-fallback-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F8FAFC" />
            <stop offset="80%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Deep Ambient Shadow under the text */}
          <filter id="hero-letter-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
          </filter>

          {/* SVG ClipPath defining the letter outlines */}
          <clipPath id="discover-nepal-text-mask">
            <text x="2" y="114" className="hero-text-glyph">
              Discover Nepal
            </text>
          </clipPath>
        </defs>

        {/* Layer 1: Instant High-Contrast Silver-White Fallback Text */}
        <text
          x="2"
          y="114"
          className={`hero-text-glyph transition-opacity duration-1000 ease-out ${
            isVideoLoaded && !isReducedMotion ? "opacity-0" : "opacity-100"
          }`}
          fill="url(#hero-fallback-grad)"
          filter="url(#hero-letter-glow)"
        >
          Discover Nepal
        </text>

        {/* Layer 2: Live Video Playing Inside Letterforms */}
        {!isReducedMotion && (
          <foreignObject
            x="0"
            y="0"
            width="1020"
            height="145"
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
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-115 transition-transform duration-1000 ease-out brightness-110 contrast-115 saturate-110"
                src="/videos/nepal-hero.mp4"
              />
            </div>
          </foreignObject>
        )}

        {/* Layer 3: Ultra-Crisp Crystalline Outer Rim Stroke for Maximum Readability */}
        <text
          x="2"
          y="114"
          className="hero-text-glyph pointer-events-none transition-all duration-500"
          fill="none"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
        >
          Discover Nepal
        </text>
      </svg>
    </div>
  );
}
