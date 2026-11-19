"use client";

import React, { useEffect, useRef, useState } from "react";

interface HeroVideoTitleProps {
  className?: string;
}

export default function HeroVideoTitle({ className = "" }: HeroVideoTitleProps) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  // Stacking & opacity states for continuous, zero-gap crossfading:
  // activeBase: which player is currently the base layer ("A" or "B")
  // isOverlayFadingIn: whether the top overlay player is currently crossfaded in
  const [activeBase, setActiveBase] = useState<"A" | "B">("A");
  const [isOverlayFadingIn, setIsOverlayFadingIn] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isTransitioningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const activeBaseRef = useRef<"A" | "B">("A");
  activeBaseRef.current = activeBase;

  // Crossfade transition window (1.2 second seamless overlap)
  const CROSSFADE_DURATION = 1.2;

  useEffect(() => {
    // Respect accessibility reduced-motion preference & handle responsive viewport sizing
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);

      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => {
        mediaQuery.removeEventListener("change", listener);
        window.removeEventListener("resize", checkMobile);
      };
    }
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    const vA = videoRefA.current;
    const vB = videoRefB.current;
    if (!vA || !vB) return;

    // Ensure pristine video playback configuration
    vA.muted = true;
    vB.muted = true;
    vA.playbackRate = 1.0;
    vB.playbackRate = 1.0;

    const handleReady = () => {
      setIsVideoLoaded(true);
    };

    vA.addEventListener("canplay", handleReady);
    vA.addEventListener("playing", handleReady);
    vA.addEventListener("loadeddata", handleReady);
    vA.addEventListener("timeupdate", handleReady, { once: true });

    if (vA.readyState >= 2 || !vA.paused) {
      setIsVideoLoaded(true);
    }

    // Start Player A
    vA.play()
      .then(() => setIsVideoLoaded(true))
      .catch(() => { });

    // High-precision RAF loop monitoring playback progress at 60fps
    const checkPlayback = () => {
      const currentBase = activeBaseRef.current;
      const currentVideo = currentBase === "A" ? vA : vB;
      const nextVideo = currentBase === "A" ? vB : vA;

      if (currentVideo && currentVideo.duration && !currentVideo.paused) {
        const timeLeft = currentVideo.duration - currentVideo.currentTime;

        // Trigger seamless crossfade when remaining time reaches the fade threshold
        if (timeLeft <= CROSSFADE_DURATION && !isTransitioningRef.current) {
          isTransitioningRef.current = true;

          // Prime and start the next player from 0.0s
          nextVideo.currentTime = 0;
          nextVideo
            .play()
            .then(() => {
              // Bring overlay into 100% opacity over the base player
              setIsOverlayFadingIn(true);

              // After crossfade completes (CROSSFADE_DURATION), swap base roles
              setTimeout(() => {
                // Pause and reset the old base player
                currentVideo.pause();
                currentVideo.currentTime = 0;

                // Swap base player without visual interruption
                const newBase = currentBase === "A" ? "B" : "A";
                activeBaseRef.current = newBase;
                setActiveBase(newBase);
                setIsOverlayFadingIn(false);
                isTransitioningRef.current = false;
              }, CROSSFADE_DURATION * 1000);
            })
            .catch(() => {
              isTransitioningRef.current = false;
            });
        }
      }

      rafIdRef.current = requestAnimationFrame(checkPlayback);
    };

    rafIdRef.current = requestAnimationFrame(checkPlayback);

    // Safeguard on tab visibility change (prevent desync when switching tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const currentVideo = activeBaseRef.current === "A" ? vA : vB;
        if (currentVideo && currentVideo.paused) {
          currentVideo.play().catch(() => { });
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      vA.removeEventListener("canplay", handleReady);
      vA.removeEventListener("playing", handleReady);
      vA.pause();
      vB.pause();
    };
  }, [isReducedMotion]);

  // Dynamic class assignment to ensure 100% continuous opacity with zero dimming or black frames
  const isPlayerABase = activeBase === "A";
  const playerAClass = isPlayerABase
    ? "z-10 opacity-100"
    : `z-20 ${isOverlayFadingIn
      ? "opacity-100 transition-opacity duration-1000 ease-linear"
      : "opacity-0 transition-none pointer-events-none"
    }`;

  const isPlayerBBase = activeBase === "B";
  const playerBClass = isPlayerBBase
    ? "z-10 opacity-100"
    : `z-20 ${isOverlayFadingIn
      ? "opacity-100 transition-opacity duration-1000 ease-linear"
      : "opacity-0 transition-none pointer-events-none"
    }`;

  const viewBox = isMobile ? "0 0 540 215" : "0 0 1000 142";
  const foreignWidth = isMobile ? 540 : 1000;
  const foreignHeight = isMobile ? 215 : 142;

  const renderGlyphs = (extraClass = "", extraProps: React.SVGProps<SVGTextElement> = {}) => {
    if (isMobile) {
      return (
        <>
          <text x="2" y="96" className={`hero-text-glyph-mobile ${extraClass}`} {...extraProps}>
            Discover
          </text>
          <text x="2" y="196" className={`hero-text-glyph-mobile ${extraClass}`} {...extraProps}>
            Nepal
          </text>
        </>
      );
    }
    return (
      <text x="2" y="112" className={`hero-text-glyph ${extraClass}`} {...extraProps}>
        Discover Nepal
      </text>
    );
  };

  return (
    <div className={`relative w-full ${isMobile ? "max-w-xs sm:max-w-none" : "max-w-2xl sm:max-w-3xl lg:max-w-4xl"} select-none group cursor-default ${className}`}>
      {/* Semantic Accessible Heading for Screen Readers & Search Crawlers */}
      <h1 className="sr-only">Discover Nepal</h1>

      {/* Ambient Dark Aura for Ultra-Sharp Contrast against bright snow, rocks & sky */}
      <div className="absolute -inset-2 sm:-inset-6 bg-slate-950/45 blur-2xl rounded-3xl pointer-events-none -z-10" />

      {/* Visual Video-Masked Letterforms SVG with Proportional Cinematic Glyphs */}
      <svg
        viewBox={viewBox}
        className="w-full h-auto overflow-visible block drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_12px_40px_rgba(146,196,234,0.4)] transition-all duration-700"
        aria-hidden="true"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* Typography Styling: Heavy, bold geometric letterforms scaled for ideal balance */}
          <style>{`
            .hero-text-glyph {
              font-family: var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 900;
              font-size: 120px;
              letter-spacing: -0.035em;
              text-rendering: geometricPrecision;
            }
            .hero-text-glyph-mobile {
              font-family: var(--font-poppins), Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 900;
              font-size: 106px;
              letter-spacing: -0.035em;
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
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.85" />
          </filter>

          {/* SVG ClipPath defining the letter outlines */}
          <clipPath id="discover-nepal-text-mask">
            {renderGlyphs()}
          </clipPath>
        </defs>

        {/* Layer 1: Instant High-Contrast Silver-White Fallback Text */}
        <g
          className={`transition-opacity duration-1000 ease-out ${isVideoLoaded && !isReducedMotion ? "opacity-0" : "opacity-100"
            }`}
          fill="url(#hero-fallback-grad)"
          filter="url(#hero-letter-glow)"
        >
          {renderGlyphs()}
        </g>

        {/* Layer 2: Live Video Playing Inside Letterforms with Dual-Player Seamless Crossfade */}
        {!isReducedMotion && (
          <foreignObject
            x="0"
            y="0"
            width={foreignWidth}
            height={foreignHeight}
            clipPath="url(#discover-nepal-text-mask)"
            className={`transition-opacity duration-1000 ease-out ${isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="w-full h-full relative overflow-hidden bg-slate-950">
              {/* Primary Video Player A */}
              <video
                ref={videoRefA}
                autoPlay
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                poster="/hero-himalayas.webp"
                className={`absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-115 transition-transform duration-1000 ease-out brightness-110 contrast-120 saturate-125 ${playerAClass}`}
                src="/videos/nepal-hero.mp4"
              />

              {/* Seamless Loop Video Player B */}
              <video
                ref={videoRefB}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                className={`absolute inset-0 w-full h-full object-cover object-center scale-105 group-hover:scale-115 transition-transform duration-1000 ease-out brightness-110 contrast-120 saturate-125 ${playerBClass}`}
                src="/videos/nepal-hero.mp4"
              />
            </div>
          </foreignObject>
        )}

        {/* Layer 3: Ultra-Crisp Crystalline Outer Rim Stroke for Razor-Sharp Legibility */}
        {renderGlyphs("pointer-events-none transition-all duration-500", {
          fill: "none",
          stroke: "rgba(255, 255, 255, 0.95)",
          strokeWidth: isMobile ? 2.2 : 1.8,
        })}
      </svg>
    </div>
  );
}
