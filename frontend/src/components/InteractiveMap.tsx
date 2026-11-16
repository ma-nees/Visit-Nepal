'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Mountain,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Waves,
  Wind,
  CheckCircle2,
} from 'lucide-react';
import { NEPAL_COUNTRY_PATH } from '@/data/nepal-map-data';

export type DestinationCategory =
  | 'Summit & Trek'
  | 'Culture & City'
  | 'Lakes & Wilderness'
  | 'Wildlife Safari';

export interface MapDestination {
  id: string;
  name: string;
  shortName: string;
  region: string;
  type: DestinationCategory;
  altitude: string;
  elevationMeters: number;
  bestSeason: string;
  temp: string;
  weather: string;
  svgX: number; // precise X coordinate in SVG viewBox (0-1185)
  svgY: number; // precise Y coordinate in SVG viewBox (0-735)
  imageUrl: string;
  description: string;
  highlights: string[];
  link: string;
}

export const mapDestinations: MapDestination[] = [
  {
    id: 'everest',
    name: 'Everest Region (Khumbu)',
    shortName: 'Everest',
    region: 'Eastern High Himalaya',
    type: 'Summit & Trek',
    altitude: '5,364m – 8,848m',
    elevationMeters: 8848,
    bestSeason: 'Mar – May, Oct – Dec',
    temp: '-6°C',
    weather: 'Alpine Clear',
    svgX: 960,
    svgY: 480,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The crown of the world. Home to Sagarmatha (Mt. Everest), legendary Sherpa monasteries, rhododendron forests, and the dramatic Khumbu icefall.',
    highlights: ['Everest Base Camp', 'Kala Patthar (5,644m)', 'Tengboche Monastery', 'Gokyo Lakes'],
    link: '/explore/dest_ebc',
  },
  {
    id: 'annapurna',
    name: 'Annapurna Massif',
    shortName: 'Annapurna',
    region: 'Central High Himalaya',
    type: 'Summit & Trek',
    altitude: '1,400m – 8,091m',
    elevationMeters: 8091,
    bestSeason: 'Sep – Nov, Mar – May',
    temp: '2°C',
    weather: 'Mountain Sunny',
    svgX: 580,
    svgY: 380,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description:
      'A majestic mountain amphitheater featuring the world’s most celebrated circuit trekking, Thorong La Pass, and dramatic views of Machapuchare (Fishtail).',
    highlights: ['Annapurna Circuit', 'Thorong La Pass (5,416m)', 'Annapurna Base Camp', 'Mardi Himal'],
    link: '/explore/dest_annapurna',
  },
  {
    id: 'langtang',
    name: 'Langtang Valley',
    shortName: 'Langtang',
    region: 'Central High Himalaya',
    type: 'Summit & Trek',
    altitude: '1,460m – 4,984m',
    elevationMeters: 4984,
    bestSeason: 'Mar – May, Sep – Nov',
    temp: '4°C',
    weather: 'Crisp Valley',
    svgX: 770,
    svgY: 460,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The valley of alpine glaciers nearest to Kathmandu. Renowned for its Tamang mountain heritage, cheese dairies of Kyanjin Gompa, and views of Langtang Lirung.',
    highlights: ['Kyanjin Gompa', 'Kyanjin Ri (4,773m)', 'Tamang Heritage Trail', 'Yak Pastures'],
    link: '/explore/dest_langtang',
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu Valley',
    shortName: 'Kathmandu',
    region: 'Central Basin',
    type: 'Culture & City',
    altitude: '1,400m',
    elevationMeters: 1400,
    bestSeason: 'Year-Round',
    temp: '20°C',
    weather: 'Mild & Pleasant',
    svgX: 780,
    svgY: 520,
    imageUrl:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s cultural soul. A living open-air museum of seven UNESCO World Heritage monuments, medieval tiered Newar pagodas, and sacred spiritual sanctuaries.',
    highlights: ['Boudhanath Stupa', 'Pashupatinath Temple', 'Bhaktapur Durbar Square', 'Patan Art'],
    link: '/explore?q=Kathmandu',
  },
  {
    id: 'mustang',
    name: 'Upper Mustang (Lo Manthang)',
    shortName: 'Upper Mustang',
    region: 'Northern Trans-Himalaya',
    type: 'Culture & City',
    altitude: '3,840m',
    elevationMeters: 3840,
    bestSeason: 'May – Oct (Rainshadow)',
    temp: '5°C',
    weather: 'High Desert Breeze',
    svgX: 570,
    svgY: 280,
    imageUrl:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    description:
      'The ancient Kingdom of Lo. A forbidden rainshadow desert of red ochre cliffs, wind-carved sky caves, and remarkably preserved 14th-century Tibetan Buddhist art.',
    highlights: ['Walled City of Lo Manthang', 'Centuries-old Sky Caves', 'Muktinath Temple', 'Red Cliffs'],
    link: '/explore?q=Mustang',
  },
  {
    id: 'lumbini',
    name: 'Lumbini (Sacred Garden)',
    shortName: 'Lumbini',
    region: 'Southwestern Plains',
    type: 'Culture & City',
    altitude: '150m',
    elevationMeters: 150,
    bestSeason: 'Oct – Mar',
    temp: '28°C',
    weather: 'Warm & Sunny',
    svgX: 510,
    svgY: 525,
    imageUrl:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    description:
      'The sacred birthplace of Lord Buddha (Siddhartha Gautama). An international spiritual oasis featuring the Maya Devi Temple, ancient Ashoka Pillar, and world monasteries.',
    highlights: ['Maya Devi Temple', 'Ashoka Pillar (249 BCE)', 'Peace Eternal Flame', 'World Monastic Zone'],
    link: '/explore?q=Lumbini',
  },
  {
    id: 'pokhara',
    name: 'Pokhara & Phewa Lake',
    shortName: 'Pokhara',
    region: 'Western Valley',
    type: 'Lakes & Wilderness',
    altitude: '822m',
    elevationMeters: 822,
    bestSeason: 'Oct – Apr',
    temp: '22°C',
    weather: 'Serene & Warm',
    svgX: 590,
    svgY: 430,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description:
      'The serene lake capital where reflection of Machapuchare mirrors on calm waters. The ultimate adventure launchpad for paragliding, ultralights, and trailheads.',
    highlights: ['Phewa Lake Wooden Boats', 'Sarangkot Sunrise', 'World Peace Pagoda', 'Begnas Lake'],
    link: '/explore?q=Pokhara',
  },
  {
    id: 'rara',
    name: 'Rara Lake & Karnali',
    shortName: 'Rara Lake',
    region: 'Far-Western Highlands',
    type: 'Lakes & Wilderness',
    altitude: '2,990m',
    elevationMeters: 2990,
    bestSeason: 'Apr – Jun, Sep – Nov',
    temp: '8°C',
    weather: 'Crisp Mountain',
    svgX: 290,
    svgY: 310,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s largest and deepest high-altitude alpine lake, encircled by coniferous pine forests and snowy summits in the remote, untouched Karnali wilderness.',
    highlights: ['Deep Azure Mirror Waters', 'Coniferous Pine Trails', 'Murma Top Viewpoint', 'Pristine Isolation'],
    link: '/explore?q=Rara',
  },
  {
    id: 'chitwan',
    name: 'Chitwan National Park',
    shortName: 'Chitwan',
    region: 'Southern Terai',
    type: 'Wildlife Safari',
    altitude: '150m',
    elevationMeters: 150,
    bestSeason: 'Oct – Mar',
    temp: '27°C',
    weather: 'Subtropical Warm',
    svgX: 640,
    svgY: 530,
    imageUrl:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    description:
      'Dense subtropical sal forests and riverine grasslands sheltering endangered greater one-horned rhinoceros, Royal Bengal tigers, and gharial crocodiles.',
    highlights: ['Jeep Jungle Safari', 'Greater One-Horned Rhinos', 'Canoeing Rapti River', 'Tharu Cultural Village'],
    link: '/explore?q=Chitwan',
  },
];

interface FilterConfig {
  key: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function InteractiveMap() {
  const [selectedId, setSelectedId] = useState<string>('everest');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedDest =
    mapDestinations.find((d) => d.id === selectedId) || mapDestinations[0];

  const categoryFilters: FilterConfig[] = [
    {
      key: 'All',
      label: 'All',
      count: mapDestinations.length,
      icon: Layers,
      color: '#92C4EA',
    },
    {
      key: 'Summit & Trek',
      label: 'Summit & Trek',
      count: mapDestinations.filter((d) => d.type === 'Summit & Trek').length,
      icon: Mountain,
      color: '#FDB716',
    },
    {
      key: 'Culture & City',
      label: 'Culture & City',
      count: mapDestinations.filter((d) => d.type === 'Culture & City').length,
      icon: Compass,
      color: '#92C4EA',
    },
    {
      key: 'Lakes & Wilderness',
      label: 'Lakes & Wilderness',
      count: mapDestinations.filter((d) => d.type === 'Lakes & Wilderness').length,
      icon: Waves,
      color: '#38BDF8',
    },
    {
      key: 'Wildlife Safari',
      label: 'Wildlife Safari',
      count: mapDestinations.filter((d) => d.type === 'Wildlife Safari').length,
      icon: Sparkles,
      color: '#EC1F27',
    },
  ];

  const getPinColor = (type: DestinationCategory, isSelected: boolean) => {
    if (isSelected) return '#FDB716'; // Gold for selected
    switch (type) {
      case 'Summit & Trek':
        return '#FDB716';
      case 'Culture & City':
        return '#92C4EA';
      case 'Lakes & Wilderness':
        return '#38BDF8';
      case 'Wildlife Safari':
        return '#EC1F27';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div className="w-full bg-[#031526] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 relative overflow-hidden border border-white/10 shadow-2xl font-inter">
      {/* Topographic subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#92C4EA_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Atmospheric Soft Lighting Glares */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0552A2]/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#92C4EA]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* =========================================================================
          1. HEADER & INTERACTIVE FILTER PILLS (IMPROVED)
          ========================================================================= */}
      <div className="relative z-10 space-y-6 pb-6 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Title & Description Block */}
          <div className="space-y-3 max-w-2xl">
            {/* Elegant HUD Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-[11px] font-medium font-inter text-[#92C4EA] tracking-wider uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FDB716] animate-pulse" />
              <span>Cartographic Discovery</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300 font-mono text-[10px]">27°N – 30°N · 80°E – 88°E</span>
            </div>

            {/* Main Section Heading: Poppins Medium */}
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
              Map of the High Himalayas
            </h2>

            {/* Body Text / Description: Inter Regular */}
            <p className="font-inter font-normal text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              From the 8,000-meter glaciated crests of the Great Himalayan Trail to subtropical southern plains. Select any destination pin to explore elevation and seasonal field notes.
            </p>
          </div>

          {/* Quick Elevation Telemetry Counters */}
          <div className="hidden sm:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 px-4 shrink-0 backdrop-blur-md">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Apex Summit</span>
              <span className="text-sm font-semibold text-white font-inter flex items-center gap-1.5">
                <Mountain className="h-3.5 w-3.5 text-[#FDB716]" />
                8,848.86m
              </span>
            </div>
            <div className="h-7 w-[1px] bg-white/15" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Surveyed Hotspots</span>
              <span className="text-sm font-semibold text-white font-inter flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                9 Waypoints
              </span>
            </div>
          </div>
        </div>

        {/* 5 Distinct Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
          {categoryFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key);
                  // If current selected dest does not match new filter, select first matching dest
                  if (filter.key !== 'All' && selectedDest.type !== filter.key) {
                    const firstMatch = mapDestinations.find((d) => d.type === filter.key);
                    if (firstMatch) setSelectedId(firstMatch.id);
                  }
                }}
                className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium font-inter transition-all duration-200 shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-white text-[#0552A2] border-white shadow-md shadow-white/10 font-medium scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border-white/10'
                }`}
                aria-pressed={isActive}
              >
                <Icon
                  className={`h-3.5 w-3.5 transition-colors ${
                    isActive ? 'text-[#0552A2]' : 'text-slate-300 group-hover:text-white'
                  }`}
                />
                <span>{filter.label}</span>
                <span
                  className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#0552A2] font-semibold'
                      : 'bg-white/10 text-slate-300 group-hover:text-white'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. MAIN STAGE: AUTHENTIC NEPAL CARTOGRAPHIC MAP CANVAS & INSPECTOR
          ========================================================================= */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left: Authentic Vector Map Canvas (Col 1 to 7) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-2xl bg-[#020D18] border border-white/15 overflow-hidden p-2 sm:p-4 flex items-center justify-center select-none shadow-inner flex-1">
            {/* Top Compass Coordinates HUD */}
            <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 text-[10px] tracking-wider text-slate-400 font-mono bg-slate-950/70 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
              <Compass className="h-3.5 w-3.5 text-[#FDB716] animate-spin-slow" />
              <span>Himalayan Geo-Datum · WGS84</span>
            </div>

            {/* Scale Bar HUD */}
            <div className="absolute top-3.5 right-4 z-20 hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-950/70 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
              <span>0</span>
              <span className="w-10 h-[2px] bg-white/40 block" />
              <span>150 km</span>
            </div>

            {/* SVG Cartographic Projection of Nepal */}
            <svg
              viewBox="15 30 1185 735"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(5,82,162,0.3)]"
            >
              <defs>
                {/* Elevation Gradient Fill matching High Himalayas to Southern Plains */}
                <linearGradient id="nepalTerrainFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#0B2745" stopOpacity="0.95" />
                  <stop offset="70%" stopColor="#082038" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#031628" stopOpacity="0.95" />
                </linearGradient>

                {/* Golden & Blue Rim Outline */}
                <linearGradient id="nepalRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#92C4EA" />
                  <stop offset="45%" stopColor="#FDB716" />
                  <stop offset="75%" stopColor="#92C4EA" />
                  <stop offset="100%" stopColor="#0552A2" />
                </linearGradient>

                {/* High Altitude Glow Filter */}
                <filter id="himalayaPinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FDB716" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Topographic Coordinate Lat/Long Grid Lines */}
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray="3 4">
                <line x1="200" y1="50" x2="200" y2="700" />
                <line x1="450" y1="50" x2="450" y2="700" />
                <line x1="700" y1="50" x2="700" y2="700" />
                <line x1="950" y1="50" x2="950" y2="700" />
                <line x1="50" y1="200" x2="1150" y2="200" />
                <line x1="50" y1="400" x2="1150" y2="400" />
                <line x1="50" y1="600" x2="1150" y2="600" />
              </g>

              {/* Latitude / Longitude Subtle Labels */}
              <g fill="rgba(255,255,255,0.22)" fontFamily="monospace" fontSize="10">
                <text x="205" y="70">81°E</text>
                <text x="455" y="70">83°E</text>
                <text x="705" y="70">85°E</text>
                <text x="955" y="70">87°E</text>
                <text x="30" y="205">30°N</text>
                <text x="30" y="405">28°N</text>
                <text x="30" y="605">27°N</text>
              </g>

              {/* 1. AUTHENTIC VECTOR SILHOUETTE OF NEPAL */}
              <path
                d={NEPAL_COUNTRY_PATH}
                fill="url(#nepalTerrainFill)"
                stroke="url(#nepalRimStroke)"
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* 2. Stylized Mountain Ridges in Northern Great Himalayan Arc */}
              <g stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none" strokeDasharray="4 3">
                <path d="M 260 300 Q 380 260 560 250 T 800 380 T 1000 450" />
                <path d="M 520 270 Q 640 230 760 330 T 960 440" />
              </g>

              {/* 3. INTERACTIVE DESTINATION WAYPOINT PINS */}
              <g id="map-pins">
                {mapDestinations.map((dest) => {
                  const isSelected = dest.id === selectedId;
                  const isHovered = hoveredId === dest.id;
                  const isPrimary = isSelected || isHovered;
                  const isMatchingFilter =
                    activeFilter === 'All' || dest.type === activeFilter;

                  const pinColor = getPinColor(dest.type, isPrimary);

                  return (
                    <g
                      key={dest.id}
                      transform={`translate(${dest.svgX}, ${dest.svgY})`}
                      onClick={() => setSelectedId(dest.id)}
                      onMouseEnter={() => setHoveredId(dest.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`cursor-pointer transition-all duration-300 ${
                        isMatchingFilter ? 'opacity-100' : 'opacity-20'
                      }`}
                    >
                      {/* Outer Pulse Wave for Selected/Active Waypoint */}
                      {isPrimary && (
                        <circle
                          r="22"
                          fill={pinColor}
                          fillOpacity="0.28"
                          className="animate-ping pointer-events-none"
                          cx="0"
                          cy="0"
                        />
                      )}

                      {/* Radar Glow Ring */}
                      <circle
                        r={isPrimary ? '16' : '10'}
                        fill={pinColor}
                        fillOpacity={isPrimary ? 0.35 : 0.15}
                        cx="0"
                        cy="0"
                        className="transition-all duration-200"
                      />

                      {/* Inner Pin Disc */}
                      <circle
                        r={isPrimary ? '8.5' : '6'}
                        fill={pinColor}
                        stroke="#031526"
                        strokeWidth="2.2"
                        filter="url(#himalayaPinGlow)"
                        cx="0"
                        cy="0"
                        className="transition-all duration-200"
                      />

                      {/* Center Core Light */}
                      <circle
                        r="2.5"
                        fill="#FFFFFF"
                        cx="0"
                        cy="0"
                      />

                      {/* Interactive Floating Waypoint Label Pill */}
                      <g
                        transform={`translate(0, ${isPrimary ? -24 : -18})`}
                        className="transition-all duration-200 pointer-events-none"
                      >
                        <rect
                          x="-50"
                          y="-11"
                          width="100"
                          height="22"
                          rx="11"
                          fill={isPrimary ? '#FFFFFF' : '#031526'}
                          fillOpacity={isPrimary ? 0.98 : 0.85}
                          stroke={isPrimary ? pinColor : 'rgba(255,255,255,0.2)'}
                          strokeWidth={isPrimary ? '1.8' : '0.8'}
                          className="transition-all duration-200"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fill={isPrimary ? '#031526' : '#FFFFFF'}
                          fontFamily="var(--font-inter), system-ui, sans-serif"
                          fontSize="9.5"
                          fontWeight={isPrimary ? '700' : '500'}
                          letterSpacing="0.02em"
                        >
                          {dest.shortName}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom Telemetry Legend */}
            <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-300 font-mono bg-slate-950/80 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FDB716]" /> Summit &amp; Trek
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#92C4EA]" /> Culture
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#38BDF8]" /> Lakes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#EC1F27]" /> Wildlife
                </span>
              </div>
              <span className="text-[#92C4EA] font-semibold">
                Active: {selectedDest.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rich Editorial Waypoint Card (Col 8 to 12) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-2xl bg-white/5 border border-white/15 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 space-y-4 flex flex-col justify-between h-full shadow-xl">
            {/* Top Region & Category Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#92C4EA] inline-flex items-center gap-1.5 font-inter">
                <Sparkles className="h-3.5 w-3.5 text-[#FDB716]" />
                {selectedDest.region}
              </span>
              <span className="text-[11px] font-medium font-inter rounded-full bg-white/10 border border-white/15 px-3 py-0.5 text-slate-200">
                {selectedDest.type}
              </span>
            </div>

            {/* High-Resolution Landscape Photography Preview */}
            <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden group shadow-md">
              <img
                src={selectedDest.imageUrl}
                alt={selectedDest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Weather & Temp Pill */}
              <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-white border border-white/15">
                <Wind className="h-3 w-3 text-cyan-300" />
                <span>{selectedDest.temp}</span>
                <span className="text-white/40">•</span>
                <span className="text-slate-300">{selectedDest.weather}</span>
              </div>

              {/* Product Name: Inter SemiBold */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-inter text-xl sm:text-2xl font-semibold leading-tight text-white drop-shadow-md">
                  {selectedDest.name}
                </h3>
              </div>
            </div>

            {/* Description: Inter Regular */}
            <p className="text-xs sm:text-sm text-slate-200/90 font-normal font-inter leading-relaxed">
              {selectedDest.description}
            </p>

            {/* Elevation & Season Specs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Mountain className="h-3 w-3 text-[#FDB716]" />
                  Elevation
                </span>
                <span className="text-xs font-semibold text-white mt-1 block font-inter">
                  {selectedDest.altitude}
                </span>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#92C4EA]" />
                  Optimal Season
                </span>
                <span className="text-xs font-semibold text-white mt-1 block font-inter">
                  {selectedDest.bestSeason}
                </span>
              </div>
            </div>

            {/* Field Waypoint Highlights */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Field Highlights
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDest.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-medium font-inter bg-white/10 text-white/90 rounded-md px-2.5 py-0.5 border border-white/10"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA: Inter Medium */}
            <div className="pt-2">
              <Link
                href={selectedDest.link}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0552A2] hover:bg-slate-100 font-medium font-inter text-xs sm:text-sm py-3 transition-all active:scale-[0.98] shadow-md shadow-black/20"
              >
                <span>Discover {selectedDest.shortName} Itineraries</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

