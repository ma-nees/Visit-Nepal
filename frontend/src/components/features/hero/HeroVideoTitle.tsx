"use client";

import React, { useEffect, useRef, useState } from "react";

interface HeroVideoTitleProps {
  className?: string;
}

export default function HeroVideoTitle({ className = "" }: HeroVideoTitleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
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

    // Enforce strict DOM properties to satisfy mobile & desktop browser autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.playbackRate = 1.0;

    const onPlaySuccess = () => {
      setIsVideoReady(true);
    };

    video.addEventListener("playing", onPlaySuccess);
    video.addEventListener("canplay", onPlaySuccess);
    video.addEventListener("loadeddata", onPlaySuccess);

    if (video.readyState >= 2 || !video.paused) {
      setIsVideoReady(true);
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoReady(true);
        })
        .catch(() => {
          // Autoplay was restricted by browser: unlock on first gesture
          const unlock = () => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play()
                .then(() => setIsVideoReady(true))
                .catch(() => {});
            }
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("scroll", unlock);
            window.removeEventListener("keydown", unlock);
          };
          window.addEventListener("pointerdown", unlock, { once: true });
          window.addEventListener("touchstart", unlock, { once: true });
          window.addEventListener("scroll", unlock, { once: true });
          window.addEventListener("keydown", unlock, { once: true });
        });
    }

    // Safety check on visibility change (wake up video when returning from another tab)
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && video.paused) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      video.removeEventListener("playing", onPlaySuccess);
      video.removeEventListener("canplay", onPlaySuccess);
      video.removeEventListener("loadeddata", onPlaySuccess);
    };
  }, [isReducedMotion]);

  const renderGlyphs = (extraClass = "", extraProps: React.SVGProps<SVGTextElement> = {}) => (
    <text
      x="4"
      y="86"
      className={`hero-title-glyph ${extraClass}`}
      {...extraProps}
    >
      Discover Nepal
    </text>
  );

  return (
    <div className={`relative w-full max-w-3xl lg:max-w-4xl select-none group cursor-default ${className}`}>
      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <h1 className="sr-only">Discover Nepal</h1>

      {/* Ambient Dark Aura: Guarantees razor-sharp contrast against bright snow & sky */}
      <div
        className="absolute -inset-4 sm:-inset-6 bg-slate-950/50 blur-2xl rounded-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Cinematic Video-Masked Letterforms SVG */}
      <svg
        viewBox="0 0 820 110"
        className="w-full h-auto overflow-visible block filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_12px_36px_rgba(0,0,0,0.85)]"
        aria-hidden="true"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* Typography: Bold, majestic, geometric display styling */}
          <style>{`
            .hero-title-glyph {
              font-family: var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 900;
              font-size: 92px;
              letter-spacing: -0.035em;
              text-rendering: geometricPrecision;
            }
          `}</style>

          {/* Deep Multi-Layer Ambient Shadow for maximum 3D separation */}
          <filter id="hero-letter-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.95" />
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.80" />
          </filter>

          {/* High-Contrast Silver/Platinum Gradient for Instant Fallback */}
          <linearGradient id="hero-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F8FAFC" />
            <stop offset="75%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Vector ClipPath defining the letter outlines */}
          <clipPath id="hero-letter-mask">
            {renderGlyphs()}
          </clipPath>
        </defs>

        {/* Layer 0: Multi-Stop Shadow Glyphs directly underneath */}
        <g fill="#000000" filter="url(#hero-letter-shadow)">
          {renderGlyphs()}
        </g>

        {/* Layer 1: Instant High-Contrast Silver-White Fallback Glyphs */}
        <g
          className={`transition-opacity duration-700 ease-out ${
            isVideoReady && !isReducedMotion ? "opacity-0" : "opacity-100"
          }`}
          fill="url(#hero-silver-grad)"
        >
          {renderGlyphs()}
        </g>

        {/* Layer 2: Live Cinematic Video Playing Inside Letterforms */}
        {!isReducedMotion && (
          <foreignObject
            x="0"
            y="0"
            width="820"
            height="110"
            clipPath="url(#hero-letter-mask)"
            className="overflow-visible"
          >
            <div
              className={`w-full h-full relative overflow-hidden bg-slate-950 transition-opacity duration-700 ease-out ${
                isVideoReady ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                poster="/hero-himalayas.webp"
                src="/videos/nepal-hero.mp4"
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out brightness-115 contrast-120 saturate-125"
              />
            </div>
          </foreignObject>
        )}

        {/* Layer 3: Razor-Sharp Crystalline Diamond-Cut Rim Highlight */}
        {renderGlyphs("pointer-events-none select-none", {
          fill: "none",
          stroke: "rgba(255, 255, 255, 0.90)",
          strokeWidth: 1.5,
        })}
      </svg>
    </div>
  );
}
