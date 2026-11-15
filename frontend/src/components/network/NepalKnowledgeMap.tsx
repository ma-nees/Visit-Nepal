'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NEPAL_COUNTRY_PATH } from '@/data/nepal-map-data';
import { MapPin, Wind } from 'lucide-react';

export interface Landmark {
  id: string;
  name: string;
  shortName: string;
  elevation: string;
  region: string;
  tag: string;
  x: number;
  y: number;
  labelOffsetY: number;
  color: string;
  temp: string;
  weather: string;
  description: string;
}

export const NEPAL_LANDMARKS: Landmark[] = [
  {
    id: 'everest',
    name: 'Mt. Everest (Sagarmatha)',
    shortName: 'Mt. Everest',
    elevation: '8,848.86m',
    region: 'Eastern Himalaya',
    tag: 'Highest Peak on Earth',
    x: 815,
    y: 430,
    labelOffsetY: -18,
    color: '#EC1F27', // Crimson
    temp: '-6°C',
    weather: 'Clear Skies',
    description: 'The roof of the world. Ancient Sherpa high monasteries and glacial passes.',
  },
  {
    id: 'annapurna',
    name: 'Annapurna Massif',
    shortName: 'Annapurna',
    elevation: '8,091m',
    region: 'Central Himalaya',
    tag: 'Alpine Sanctuary',
    x: 520,
    y: 375,
    labelOffsetY: -18,
    color: '#FDB716', // Gold
    temp: '2°C',
    weather: 'Sunny',
    description: 'Towering glaciated amphitheater ringed by Machapuchare and high alpine trails.',
  },
  {
    id: 'pokhara',
    name: 'Pokhara Valley & Phewa Lake',
    shortName: 'Pokhara',
    elevation: '822m',
    region: 'Western Lakes',
    tag: 'Adventure Capital',
    x: 505,
    y: 440,
    labelOffsetY: 18,
    color: '#92C4EA', // Sky Blue
    temp: '22°C',
    weather: 'Pleasant',
    description: 'Tranquil subtropical lakes mirroring the snow peaks of the Annapurna range.',
  },
  {
    id: 'mustang',
    name: 'Upper Mustang (Lo Manthang)',
    shortName: 'Upper Mustang',
    elevation: '3,840m',
    region: 'Trans-Himalaya',
    tag: 'Forbidden Kingdom',
    x: 475,
    y: 250,
    labelOffsetY: -18,
    color: '#FDB716', // Gold
    temp: '5°C',
    weather: 'Breezy',
    description: 'Walled medieval capital amidst ochre desert canyons and sky caves.',
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu Valley',
    shortName: 'Kathmandu',
    elevation: '1,400m',
    region: 'Central Basin',
    tag: 'UNESCO Cultural Hub',
    x: 655,
    y: 460,
    labelOffsetY: -18,
    color: '#92C4EA', // Sky Blue
    temp: '20°C',
    weather: 'Mild',
    description: 'Living heritage of seven UNESCO monuments, historic courtyards, and ancient stupas.',
  },
  {
    id: 'chitwan',
    name: 'Chitwan National Park',
    shortName: 'Chitwan',
    elevation: '150m',
    region: 'Southern Terai',
    tag: 'Subtropical Wilderness',
    x: 585,
    y: 535,
    labelOffsetY: 18,
    color: '#FDB716', // Gold
    temp: '27°C',
    weather: 'Warm',
    description: 'Dense sal forests shelter one-horned rhinos, Bengal tigers, and peaceful riverways.',
  },
  {
    id: 'lumbini',
    name: 'Lumbini Sacred Garden',
    shortName: 'Lumbini',
    elevation: '150m',
    region: 'Southwestern Plains',
    tag: 'Birthplace of Buddha',
    x: 430,
    y: 565,
    labelOffsetY: 18,
    color: '#FDB716', // Gold
    temp: '28°C',
    weather: 'Sunny',
    description: 'Sanctuary of peace, ancient Ashoka Pillar, and serene monasteries from across nations.',
  },
];

export interface NepalKnowledgeMapProps {
  embedded?: boolean;
  onSelectLandmark?: (landmark: Landmark) => void;
}

export function NepalKnowledgeMap({
  embedded = false,
  onSelectLandmark,
}: NepalKnowledgeMapProps) {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(NEPAL_LANDMARKS[0]);
  const [hoveredLandmark, setHoveredLandmark] = useState<Landmark | null>(null);

  const handleLandmarkClick = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    if (onSelectLandmark) onSelectLandmark(landmark);
  };

  const active = hoveredLandmark || selectedLandmark;

  return (
    <div className="w-full relative select-none flex flex-col items-center justify-center">
      
      {/* 1. Pure Aesthetic SVG Map Canvas - Single Solid Silhouette of Nepal */}
      <div className="relative w-full max-h-[50vh] aspect-[16/10] flex items-center justify-center">
        <svg
          viewBox="15 30 1185 735"
          className="w-full h-full max-h-[50vh] object-contain filter drop-shadow-[0_16px_40px_rgba(5,82,162,0.45)]"
        >
          <defs>
            {/* Soft Royal Himalayan Blue Gradient Fill */}
            <linearGradient id="nepalAestheticFill" x1="0%" y1="15%" x2="100%" y2="85%">
              <stop offset="0%" stopColor="#062F59" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#0552A2" stopOpacity="0.92" />
              <stop offset="80%" stopColor="#0B417D" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#125196" stopOpacity="0.88" />
            </linearGradient>

            {/* Earthy Warm Brown / Bronze Outline Highlight as requested */}
            <linearGradient id="nepalBrownRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B37840" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#8E5224" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#9C5D29" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#BF854B" stopOpacity="0.9" />
            </linearGradient>

            {/* Soft Ambient Atmosphere Underneath */}
            <radialGradient id="mountainAtmosphere" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#92C4EA" stopOpacity="0.18" />
              <stop offset="55%" stopColor="#0552A2" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0552A2" stopOpacity="0" />
            </radialGradient>

            {/* Pin Glow Filter */}
            <filter id="hotspotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FDB716" floodOpacity="0.8" />
            </filter>

            {/* Clip path to constrain the wavy shine strictly within Nepal's silhouette */}
            <clipPath id="nepalSilhouetteClip">
              <path d={NEPAL_COUNTRY_PATH} />
            </clipPath>

            {/* Wavy Sheen Gradient - Top to Bottom */}
            <linearGradient id="wavyShineRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#92C4EA" stopOpacity="0" />
              <stop offset="25%" stopColor="#92C4EA" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#FDB716" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0552A2" stopOpacity="0" />
            </linearGradient>

            {/* Radiant golden-sky blue crest shimmer */}
            <linearGradient id="wavyShineCrest" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92C4EA" stopOpacity="0.1" />
              <stop offset="20%" stopColor="#92C4EA" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="80%" stopColor="#FDB716" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#92C4EA" stopOpacity="0.1" />
            </linearGradient>

            {/* Soft luminous blur for the wave core */}
            <filter id="wavyWaveGlow" x="-20%" y="-100%" width="140%" height="300%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Soft Atmospheric Ambient Backlight */}
          <ellipse cx="600" cy="385" rx="550" ry="280" fill="url(#mountainAtmosphere)" />

          {/* 2. THE SINGLE UNIFIED SILHOUETTE OF NEPAL */}
          <path
            d={NEPAL_COUNTRY_PATH}
            fill="url(#nepalAestheticFill)"
            stroke="url(#nepalBrownRim)"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* 2b. WAVY SHINE SWEEPING CONTINUOUSLY FROM TOP TO BOTTOM */}
          <g clipPath="url(#nepalSilhouetteClip)" className="pointer-events-none">
            <motion.g
              animate={{
                y: [-260, 840],
              }}
              transition={{
                duration: 4.6,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 0.9,
              }}
            >
              {/* Broad luminous wave body */}
              <path
                d="M -100 0 Q 200 90, 500 20 T 900 70 T 1350 10 L 1350 150 Q 1050 210, 750 140 T 350 200 T -100 130 Z"
                fill="url(#wavyShineRibbon)"
              />

              {/* Radiant glowing wave crest */}
              <path
                d="M -100 55 Q 220 135, 540 60 T 950 115 T 1350 50"
                fill="none"
                stroke="url(#wavyShineCrest)"
                strokeWidth="5"
                filter="url(#wavyWaveGlow)"
                opacity="0.95"
              />

              {/* Crisp inner diamond light filament */}
              <path
                d="M -100 55 Q 220 135, 540 60 T 950 115 T 1350 50"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                opacity="0.9"
              />
            </motion.g>
          </g>

          {/* 3. Subtle Artistic High-Himalayan Crest Line */}
          <g opacity="0.3" className="pointer-events-none">
            <path
              d="M 120 380 Q 280 260 480 290 T 780 230 T 960 320 T 1120 420"
              fill="none"
              stroke="#92C4EA"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
            {/* Small summit triangles */}
            <polygon points="520,360 527,344 534,360" fill="#FFFFFF" opacity="0.7" />
            <polygon points="815,415 823,395 831,415" fill="#FFFFFF" opacity="0.9" />
            <polygon points="475,238 482,222 489,238" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* 4. High-Altitude Landmark Waypoints */}
          <g id="nepal-landmarks">
            {NEPAL_LANDMARKS.map((spot) => {
              const isSelected = selectedLandmark.id === spot.id;
              const isHovered = hoveredLandmark?.id === spot.id;
              const isPrimary = isSelected || isHovered;

              return (
                <g
                  key={spot.id}
                  transform={`translate(${spot.x}, ${spot.y})`}
                  onClick={() => handleLandmarkClick(spot)}
                  onMouseEnter={() => setHoveredLandmark(spot)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                  className="cursor-pointer transition-transform duration-200"
                >
                  {/* Subtle Pulse Animation for Active Landmark */}
                  {isPrimary && (
                    <circle
                      r="14"
                      fill={spot.color}
                      fillOpacity="0.3"
                      className="animate-ping pointer-events-none"
                      cx="0"
                      cy="0"
                    />
                  )}

                  {/* Marker Pin Outer Ring */}
                  <circle
                    r={isPrimary ? '7.5' : '5.5'}
                    fill={spot.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    filter="url(#hotspotGlow)"
                    cx="0"
                    cy="0"
                    className="transition-all duration-200"
                  />

                  {/* Center Dot */}
                  <circle
                    r="2.2"
                    fill="#FFFFFF"
                    cx="0"
                    cy="0"
                  />

                  {/* Floating Clean Pill Badge */}
                  <g transform={`translate(0, ${spot.labelOffsetY})`}>
                    <rect
                      x="-42"
                      y="-10"
                      width="84"
                      height="19"
                      rx="9.5"
                      fill="#031224"
                      fillOpacity="0.94"
                      stroke={isPrimary ? '#FDB716' : '#92C4EA'}
                      strokeOpacity={isPrimary ? 1 : 0.45}
                      strokeWidth={isPrimary ? '1.5' : '0.8'}
                      className="transition-all duration-200"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontSize="9"
                      fontWeight="600"
                      letterSpacing="0.01em"
                    >
                      {spot.shortName}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 5. Sleek Landmark Spotlight (Refined, Compact, No Overflow) */}
      <div className="w-full pt-3 mt-2 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0552A2] to-[#92C4EA] text-white shadow-sm">
            <MapPin className="h-4 w-4 text-[#FDB716]" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-white text-xs sm:text-sm truncate">
                {active.name}
              </h4>
              <span className="text-[10px] font-mono text-[#92C4EA] bg-[#92C4EA]/15 border border-[#92C4EA]/30 px-2 py-0.2 rounded-full shrink-0">
                {active.elevation}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-light truncate mt-0.5">
              {active.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            <Wind className="h-2.5 w-2.5" />
            {active.temp}
          </span>
        </div>
      </div>

    </div>
  );
}

export default NepalKnowledgeMap;
