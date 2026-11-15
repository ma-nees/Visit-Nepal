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
    x: 960,
    y: 480,
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
    x: 580,
    y: 380,
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
    x: 590,
    y: 430,
    labelOffsetY: 18,
    color: '#0552A2', // Royal Navy
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
    x: 570,
    y: 280,
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
    x: 780,
    y: 520,
    labelOffsetY: -18,
    color: '#0552A2', // Royal Navy
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
    x: 640,
    y: 530,
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
    x: 510,
    y: 525,
    labelOffsetY: -18,
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
      
      {/* 1. Pure Aesthetic SVG Map Canvas - Clean Light Editorial Style */}
      <div className="relative w-full max-h-[34vh] sm:max-h-[44vh] lg:max-h-[50vh] aspect-[16/10] flex items-center justify-center">
        <svg
          viewBox="15 30 1185 735"
          className="w-full h-full max-h-[34vh] sm:max-h-[44vh] lg:max-h-[50vh] object-contain filter drop-shadow-[0_12px_32px_rgba(5,82,162,0.12)]"
        >
          <defs>
            {/* Soft Himalayan Sky Blue Gradient Fill from User Brand Palette (#92C4EA) */}
            <linearGradient id="nepalAestheticFill" x1="0%" y1="10%" x2="100%" y2="90%">
              <stop offset="0%" stopColor="#A8D4F2" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#92C4EA" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#7EBAE3" stopOpacity="0.9" />
            </linearGradient>

            {/* Earthy Warm Brown / Bronze Outline Highlight */}
            <linearGradient id="nepalBrownRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A66732" />
              <stop offset="35%" stopColor="#874C1E" />
              <stop offset="70%" stopColor="#9C5C26" />
              <stop offset="100%" stopColor="#B87B40" />
            </linearGradient>

            {/* Pin Glow Filter */}
            <filter id="hotspotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#0552A2" floodOpacity="0.35" />
            </filter>

            {/* MASK THAT CONSTRAINS SHINE STRICTLY TO THE OUTLINE OF NEPAL */}
            <mask id="nepalOutlineOnlyMask" maskUnits="userSpaceOnUse">
              <rect x="-200" y="-200" width="1600" height="1200" fill="#000000" />
              <path
                d={NEPAL_COUNTRY_PATH}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </mask>

            {/* Radiant golden-diamond shine beam for the outline */}
            <linearGradient id="outlineShineBeam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="25%" stopColor="#FDB716" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="75%" stopColor="#FDB716" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Glowing filter for the outline shine */}
            <filter id="outlineGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 2. THE SINGLE UNIFIED SILHOUETTE OF NEPAL (Solid soft sky blue + warm brown rim) */}
          <path
            d={NEPAL_COUNTRY_PATH}
            fill="url(#nepalAestheticFill)"
            stroke="url(#nepalBrownRim)"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* 2b. SHINE STRICTLY ON THE OUTLINE OF NEPAL - SWEEPING FROM TOP TO BOTTOM */}
          <g mask="url(#nepalOutlineOnlyMask)" filter="url(#outlineGlowFilter)" className="pointer-events-none">
            <motion.g
              animate={{
                y: [-240, 840],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 0.8,
              }}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,-240; 0,840"
                keyTimes="0; 1"
                dur="4.2s"
                repeatCount="indefinite"
              />
              {/* Luminous wavy ribbon that passes over and illuminates the border */}
              <path
                d="M -100 0 Q 200 90, 500 20 T 900 70 T 1350 10 L 1350 160 Q 1050 220, 750 150 T 350 210 T -100 140 Z"
                fill="url(#outlineShineBeam)"
              />
            </motion.g>
          </g>

          {/* 3. High-Altitude Landmark Waypoints */}
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
                      fillOpacity="0.25"
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

                  {/* Floating Clean Pill Badge (White Glass with Deep Navy Text) */}
                  <g transform={`translate(0, ${spot.labelOffsetY})`}>
                    <rect
                      x="-44"
                      y="-10"
                      width="88"
                      height="20"
                      rx="10"
                      fill="#FFFFFF"
                      fillOpacity="0.96"
                      stroke={isPrimary ? '#0552A2' : '#874C1E'}
                      strokeOpacity={isPrimary ? 0.9 : 0.4}
                      strokeWidth={isPrimary ? '1.5' : '0.9'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                      className="transition-all duration-200"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#0B2745"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontSize="9"
                      fontWeight="700"
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

      {/* 4. Sleek Landmark Spotlight (Clean Light Editorial Card) */}
      <div className="w-full pt-2.5 sm:pt-3 mt-1.5 sm:mt-2 border-t border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0552A2] to-[#92C4EA] text-white shadow-xs">
            <MapPin className="h-4 w-4 text-[#FDB716]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {active.name}
              </h4>
              <span className="text-[10px] font-mono text-[#0552A2] bg-[#92C4EA]/25 border border-[#92C4EA]/60 px-2 py-0.2 rounded-full shrink-0 font-semibold">
                {active.elevation}
              </span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-normal truncate mt-0.5">
              {active.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center self-end sm:self-auto">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 sm:py-1 rounded-full shadow-2xs">
            <Wind className="h-2.5 w-2.5 text-emerald-600" />
            {active.temp}
          </span>
        </div>
      </div>

    </div>
  );
}

export default NepalKnowledgeMap;
