'use client';

import React from 'react';
import { NEPAL_COUNTRY_PATH } from '@/data/nepal-map-data';

export function SimpleNepalMap() {
  return (
    <svg
      viewBox="15 30 1185 735"
      className="w-full h-auto filter drop-shadow-[0_12px_32px_rgba(5,82,162,0.4)] select-none"
    >
      <defs>
        {/* Soft Royal Blue Fill */}
        <linearGradient id="simpleNepalFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#083B75" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#0552A2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#92C4EA" stopOpacity="0.8" />
        </linearGradient>

        {/* Brown Outline Highlight */}
        <linearGradient id="simpleBrownRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B37840" />
          <stop offset="50%" stopColor="#8E5224" />
          <stop offset="100%" stopColor="#BF854B" />
        </linearGradient>

        {/* Clip path to constrain the wavy shine */}
        <clipPath id="simpleSilhouetteClip">
          <path d={NEPAL_COUNTRY_PATH} />
        </clipPath>

        {/* Wavy Sheen Gradient - Top to Bottom */}
        <linearGradient id="simpleWavyShineRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#92C4EA" stopOpacity="0" />
          <stop offset="30%" stopColor="#92C4EA" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#FDB716" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0552A2" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Clean Unified Silhouette of Nepal */}
      <path
        d={NEPAL_COUNTRY_PATH}
        fill="url(#simpleNepalFill)"
        stroke="url(#simpleBrownRim)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Continuous Wavy Shine from Top to Bottom */}
      <g clipPath="url(#simpleSilhouetteClip)" className="pointer-events-none">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,-260; 0,840"
            keyTimes="0; 1"
            dur="4.5s"
            repeatCount="indefinite"
          />
          <path
            d="M -100 0 Q 200 90, 500 20 T 900 70 T 1350 10 L 1350 150 Q 1050 210, 750 140 T 350 200 T -100 130 Z"
            fill="url(#simpleWavyShineRibbon)"
          />
          <path
            d="M -100 55 Q 220 135, 540 60 T 950 115 T 1350 50"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity="0.85"
          />
        </g>
      </g>
    </svg>
  );
}

export default SimpleNepalMap;
