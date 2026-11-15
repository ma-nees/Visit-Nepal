'use client';

import React from 'react';
import { NEPAL_COUNTRY_PATH } from '@/data/nepal-map-data';

export function SimpleNepalMap() {
  return (
    <svg
      viewBox="15 30 1185 735"
      className="w-full h-auto filter drop-shadow-[0_12px_28px_rgba(5,82,162,0.12)] select-none"
    >
      <defs>
        {/* Soft Sky Blue Fill */}
        <linearGradient id="simpleNepalFill" x1="0%" y1="10%" x2="100%" y2="90%">
          <stop offset="0%" stopColor="#A8D4F2" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#92C4EA" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#7EBAE3" stopOpacity="0.9" />
        </linearGradient>

        {/* Brown Outline Highlight */}
        <linearGradient id="simpleBrownRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A66732" />
          <stop offset="35%" stopColor="#874C1E" />
          <stop offset="70%" stopColor="#9C5C26" />
          <stop offset="100%" stopColor="#B87B40" />
        </linearGradient>

        {/* Mask that captures ONLY the outline of Nepal */}
        <mask id="simpleOutlineOnlyMask" maskUnits="userSpaceOnUse">
          <rect x="-200" y="-200" width="1600" height="1200" fill="#000000" />
          <path
            d={NEPAL_COUNTRY_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </mask>

        {/* Wavy Sheen Gradient - Top to Bottom */}
        <linearGradient id="simpleWavyShineRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="25%" stopColor="#FDB716" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="75%" stopColor="#FDB716" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Clean Unified Silhouette of Nepal */}
      <path
        d={NEPAL_COUNTRY_PATH}
        fill="url(#simpleNepalFill)"
        stroke="url(#simpleBrownRim)"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Continuous Wavy Shine ONLY on the Outline of Nepal */}
      <g mask="url(#simpleOutlineOnlyMask)" className="pointer-events-none">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,-260; 0,840"
            keyTimes="0; 1"
            dur="4.2s"
            repeatCount="indefinite"
          />
          <path
            d="M -100 0 Q 200 90, 500 20 T 900 70 T 1350 10 L 1350 160 Q 1050 220, 750 150 T 350 210 T -100 140 Z"
            fill="url(#simpleWavyShineRibbon)"
          />
        </g>
      </g>
    </svg>
  );
}

export default SimpleNepalMap;
