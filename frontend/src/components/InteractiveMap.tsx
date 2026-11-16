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
} from 'lucide-react';

export interface MapDestination {
  id: string;
  name: string;
  region: string;
  type: 'Summit & Trek' | 'Culture & City' | 'Lakes & Wilderness' | 'Wildlife Safari';
  altitude: string;
  bestSeason: string;
  xPercent: number; // percentage from left on map
  yPercent: number; // percentage from top on map
  imageUrl: string;
  description: string;
  highlights: string[];
  link: string;
}

export const mapDestinations: MapDestination[] = [
  {
    id: 'everest',
    name: 'Everest Region (Khumbu)',
    region: 'Eastern Himalaya',
    type: 'Summit & Trek',
    altitude: '5,364m – 8,848m',
    bestSeason: 'Mar – May, Oct – Dec',
    xPercent: 74,
    yPercent: 44,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The crown of the world. Home to Sagarmatha (Everest), legendary Sherpa monasteries, ancient rhododendron forests, and dramatic glaciated ridges.',
    highlights: ['Everest Base Camp', 'Kala Patthar', 'Tengboche Monastery', 'Gokyo Lakes'],
    link: '/explore/dest_ebc',
  },
  {
    id: 'annapurna',
    name: 'Annapurna Range',
    region: 'Central Himalaya',
    type: 'Summit & Trek',
    altitude: '1,400m – 5,416m',
    bestSeason: 'Sep – Nov, Mar – May',
    xPercent: 48,
    yPercent: 46,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description:
      'A majestic mountain amphitheater featuring the world’s most diverse trekking routes, glaciated passes, and deep river gorges.',
    highlights: ['Annapurna Circuit', 'Thorong La Pass', 'Annapurna Base Camp', 'Mardi Himal'],
    link: '/explore/dest_annapurna',
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu Valley',
    region: 'Central Basin',
    type: 'Culture & City',
    altitude: '1,400m',
    bestSeason: 'Year-Round',
    xPercent: 62,
    yPercent: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s cultural soul. A living museum of seven UNESCO World Heritage monuments, tiered Newar pagodas, medieval squares, and vibrant street markets.',
    highlights: ['Boudhanath Stupa', 'Pashupatinath', 'Bhaktapur Durbar', 'Patan Art'],
    link: '/explore?q=Kathmandu',
  },
  {
    id: 'pokhara',
    name: 'Pokhara & Phewa Lake',
    region: 'Western Valley',
    type: 'Lakes & Wilderness',
    altitude: '822m',
    bestSeason: 'Oct – Apr',
    xPercent: 44,
    yPercent: 54,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description:
      'The serene lake capital where reflection of the fishtail peak Machapuchare mirrors on calm waters. The ultimate adventure launchpad.',
    highlights: ['Phewa Lake Boats', 'Sarangkot Sunrise', 'World Peace Pagoda', 'Paragliding'],
    link: '/explore?q=Pokhara',
  },
  {
    id: 'mustang',
    name: 'Upper Mustang',
    region: 'Northern Trans-Himalaya',
    type: 'Culture & City',
    altitude: '3,840m',
    bestSeason: 'May – Oct (Rainshadow)',
    xPercent: 42,
    yPercent: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    description:
      'The ancient Kingdom of Lo. A forbidden rainshadow desert of red ochre cliffs, wind-carved sky caves, and preserved 14th-century Tibetan Buddhist art.',
    highlights: ['Walled City of Lo Manthang', 'Sky Caves', 'Muktinath Temple', 'Red Cliffs'],
    link: '/explore?q=Mustang',
  },
  {
    id: 'chitwan',
    name: 'Chitwan National Park',
    region: 'Southern Terai',
    type: 'Wildlife Safari',
    altitude: '150m',
    bestSeason: 'Oct – Mar',
    xPercent: 55,
    yPercent: 76,
    imageUrl:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    description:
      'Dense subtropical sal forests and elephant grass savannahs teeming with endangered greater one-horned rhinoceros, Royal Bengal tigers, and gharial crocodiles.',
    highlights: ['Jeep Safari', 'Rhino Sanctuary', 'Canoeing Rapti River', 'Tharu Culture'],
    link: '/explore?q=Chitwan',
  },
  {
    id: 'lumbini',
    name: 'Lumbini (Sacred Garden)',
    region: 'Southwestern Plains',
    type: 'Culture & City',
    altitude: '150m',
    bestSeason: 'Oct – Mar',
    xPercent: 38,
    yPercent: 78,
    imageUrl:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    description:
      'The sacred birthplace of Lord Buddha (Siddhartha Gautama). An oasis of tranquility with ancient archaeological ruins, Maya Devi Temple, and international monasteries.',
    highlights: ['Maya Devi Temple', 'Ashoka Pillar', 'Monastic Zone', 'Peace Flame'],
    link: '/explore?q=Lumbini',
  },
  {
    id: 'rara',
    name: 'Rara Lake & Karnali',
    region: 'Far-Western Highlands',
    type: 'Lakes & Wilderness',
    altitude: '2,990m',
    bestSeason: 'Apr – Jun, Sep – Nov',
    xPercent: 20,
    yPercent: 38,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s largest and deepest high-altitude alpine lake, encircled by coniferous pine forests and snowy summits in remote Karnali wilderness.',
    highlights: ['Mirror Waters', 'Pine Forest Trails', 'Murma Top Viewpoint', 'Pristine Isolation'],
    link: '/explore?q=Rara',
  },
  {
    id: 'langtang',
    name: 'Langtang Valley',
    region: 'Central High Himalaya',
    type: 'Summit & Trek',
    altitude: '3,870m',
    bestSeason: 'Mar – May, Sep – Nov',
    xPercent: 64,
    yPercent: 48,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The valley of glaciers closest to Kathmandu. Renowned for its Tamang mountain heritage, cheese factories of Kyanjin Gompa, and dramatic views of Langtang Lirung.',
    highlights: ['Kyanjin Gompa', 'Kyanjin Ri (4,773m)', 'Tamang Heritage Trail', 'Yak Pastures'],
    link: '/explore/dest_langtang',
  },
];

const categoryFilters = [
  'All',
  'Summit & Trek',
  'Culture & City',
  'Lakes & Wilderness',
  'Wildlife Safari',
];

export default function InteractiveMap() {
  const [selectedId, setSelectedId] = useState<string>('everest');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const selectedDest =
    mapDestinations.find((d) => d.id === selectedId) || mapDestinations[0];

  const filteredDestinations =
    activeFilter === 'All'
      ? mapDestinations
      : mapDestinations.filter((d) => d.type === activeFilter);

  return (
    <div className="w-full bg-[#031526] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Subtle topographic atmospheric backdrop */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#92C4EA_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#92C4EA] block mb-2">
            Cartographic Discovery
          </span>
          <h3 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">
            Map of the High Himalayas
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-normal font-inter max-w-xl mt-2 leading-relaxed">
            From the 8,000-meter glaciated crests of the Great Himalayan Trail to subtropical southern plains. Select any destination pin to explore elevation and seasonal field notes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categoryFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-[#0552A2] shadow-sm font-bold'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: The Stylized Topographic Map Canvas (Col 1-7) */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-[#020D18] border border-white/15 overflow-hidden p-4 sm:p-6 flex items-center justify-center select-none shadow-inner">
            {/* Compass Rose Accent */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] tracking-widest text-white/40 font-mono">
              <Compass className="h-3.5 w-3.5" />
              <span>N 27°–30° / E 80°–88°</span>
            </div>

            {/* Stylized Himalayan Mountain Silhouette Vector Overlay */}
            <svg
              viewBox="0 0 1000 550"
              className="absolute inset-0 w-full h-full object-fill opacity-25 pointer-events-none"
              preserveAspectRatio="none"
            >
              {/* Himalayan Ridge Contours */}
              <path
                d="M 50 340 Q 150 240 280 280 T 480 200 T 680 180 T 820 220 T 960 300 L 960 480 Q 750 490 520 500 T 50 480 Z"
                fill="none"
                stroke="#92C4EA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 80 320 Q 220 180 350 230 T 540 150 T 740 130 T 880 190 T 940 280"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                opacity="0.6"
              />
              {/* Crest Peaks */}
              <polygon points="460,160 480,120 500,160" fill="#FFFFFF" opacity="0.3" />
              <polygon points="720,140 740,95 760,140" fill="#FFFFFF" opacity="0.4" />
              <polygon points="200,280 220,240 240,280" fill="#FFFFFF" opacity="0.2" />
            </svg>

            {/* Visual Nepal Country Silhouette Backdrop */}
            <div className="relative w-full h-full">
              {/* Map Pins */}
              {mapDestinations.map((dest) => {
                const isSelected = dest.id === selectedId;
                const isMatchingFilter =
                  activeFilter === 'All' || dest.type === activeFilter;

                return (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedId(dest.id)}
                    style={{
                      left: `${dest.xPercent}%`,
                      top: `${dest.yPercent}%`,
                    }}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus:outline-none cursor-pointer ${
                      isMatchingFilter ? 'opacity-100 scale-100' : 'opacity-25 scale-75'
                    }`}
                    aria-label={`Select ${dest.name}`}
                  >
                    {/* Glowing Pulse Ring for selected */}
                    {isSelected && (
                      <span className="absolute -inset-2.5 rounded-full bg-[#FDB716]/30 animate-ping pointer-events-none" />
                    )}

                    {/* Pin Circle */}
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-125 ${
                        isSelected
                          ? 'h-8 w-8 bg-[#FDB716] text-slate-950 shadow-lg shadow-[#FDB716]/50'
                          : 'h-6 w-6 bg-white/20 hover:bg-white text-white hover:text-[#0552A2] backdrop-blur-md border border-white/40'
                      }`}
                    >
                      <MapPin
                        className={isSelected ? 'h-4 w-4' : 'h-3 w-3'}
                        strokeWidth={2.5}
                      />
                    </div>

                    {/* Subtle Location Label */}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap text-[10px] font-semibold tracking-wide transition-all rounded px-1.5 py-0.5 pointer-events-none ${
                        isSelected
                          ? 'bg-[#FDB716] text-slate-950 font-bold shadow-xs'
                          : 'bg-black/60 text-slate-200 group-hover:text-white backdrop-blur-sm'
                      }`}
                    >
                      {dest.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-3 right-4 flex items-center gap-3 text-[10px] text-white/50 font-mono">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#FDB716]" /> Active Selection
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white/40" /> Key Waypoint
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rich Editorial Destination Card (Col 8-12) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-white/5 border border-white/15 p-5 sm:p-7 backdrop-blur-md transition-all duration-300 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#92C4EA] inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#FDB716]" />
                {selectedDest.region}
              </span>
              <span className="text-[11px] font-semibold rounded-full bg-white/10 px-2.5 py-0.5 text-slate-200">
                {selectedDest.type}
              </span>
            </div>

            {/* Photography Preview */}
            <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden group">
              <img
                src={selectedDest.imageUrl}
                alt={selectedDest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="font-inter text-xl sm:text-2xl font-semibold leading-tight text-white drop-shadow-md">
                  {selectedDest.name}
                </h4>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-200/90 font-light leading-relaxed">
              {selectedDest.description}
            </p>

            {/* Altitude & Season Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Mountain className="h-3 w-3 text-[#FDB716]" />
                  Elevation
                </span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  {selectedDest.altitude}
                </span>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#92C4EA]" />
                  Optimal Season
                </span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  {selectedDest.bestSeason}
                </span>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Field Highlights
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDest.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-medium bg-white/10 text-white/90 rounded-md px-2 py-0.5 border border-white/10"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <Link
                href={selectedDest.link}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0552A2] hover:bg-slate-100 font-bold text-xs sm:text-sm py-3 transition-all active:scale-[0.98] shadow-md shadow-black/20"
              >
                <span>Discover {selectedDest.name.split(' ')[0]} Itineraries</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
