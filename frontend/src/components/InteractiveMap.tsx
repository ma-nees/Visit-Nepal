'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Mountain,
  Calendar,
  Compass,
  ArrowRight,
  Layers,
  Waves,
  Wind,
  CheckCircle2,
} from 'lucide-react';
import { DISTRICTS, NEPAL_COUNTRY_PATH } from '@/data/nepal-map-data';

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
    svgX: 969,
    svgY: 500,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The sacred throne of Sagarmatha. Towering glaciated ramparts, ancient Buddhist gompas, and the legendary warmth of Sherpa mountain villages.',
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
    id: 'manaslu',
    name: 'Manaslu (Spirit Mountain)',
    shortName: 'Manaslu',
    region: 'Central High Himalaya',
    type: 'Summit & Trek',
    altitude: '1,410m – 8,163m',
    elevationMeters: 8163,
    bestSeason: 'Sep – Nov, Mar – May',
    temp: '-2°C',
    weather: 'Crisp Alpine',
    svgX: 685,
    svgY: 385,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description:
      'The eighth highest peak on Earth. An authentic, remote circuit traversing the high Larkya La Pass along ancient Tibetan salt-trading routes.',
    highlights: ['Larkya La Pass (5,106m)', 'Pungyen Gompa', 'Birendra Tal Lake', 'Untouched Villages'],
    link: '/explore?q=Manaslu',
  },
  {
    id: 'kanchenjunga',
    name: 'Kanchenjunga Base Camp',
    shortName: 'Kanchenjunga',
    region: 'Eastern Frontier',
    type: 'Summit & Trek',
    altitude: '1,800m – 8,586m',
    elevationMeters: 8586,
    bestSeason: 'Mar – May, Oct – Nov',
    temp: '-4°C',
    weather: 'Glacial Winds',
    svgX: 1125,
    svgY: 515,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The Five Treasures of the Snows. Nepal’s easternmost high alpine sanctuary, famous for remote rhododendron valleys and views of the world’s 3rd highest peak.',
    highlights: ['Pangpema North Base Camp', 'Oktang South Viewpoint', 'Sele La Pass (4,290m)', 'Red Panda Habitat'],
    link: '/explore?q=Kanchenjunga',
  },
  {
    id: 'dhaulagiri',
    name: 'Dhaulagiri Massif (White Mountain)',
    shortName: 'Dhaulagiri',
    region: 'Western High Himalaya',
    type: 'Summit & Trek',
    altitude: '1,100m – 8,167m',
    elevationMeters: 8167,
    bestSeason: 'Apr – May, Sep – Oct',
    temp: '0°C',
    weather: 'High Pass Breeze',
    svgX: 515,
    svgY: 375,
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description:
      'The awe-inspiring Seventh Highest Peak. Towering abruptly over the Kali Gandaki Gorge, the deepest river valley in the world, in rugged glaciated grandeur.',
    highlights: ['French Col (5,360m)', 'Dhampus Pass (5,244m)', 'Hidden Valley', 'Kali Gandaki Gorge'],
    link: '/explore?q=Dhaulagiri',
  },
  {
    id: 'langtang',
    name: 'Langtang Valley & Kyanjin Ri',
    shortName: 'Langtang',
    region: 'Central High Himalaya',
    type: 'Summit & Trek',
    altitude: '1,460m – 4,984m',
    elevationMeters: 4984,
    bestSeason: 'Mar – May, Sep – Nov',
    temp: '4°C',
    weather: 'Crisp Valley',
    svgX: 785,
    svgY: 450,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'The valley of alpine glaciers nearest to Kathmandu. Renowned for its Tamang mountain heritage, cheese dairies of Kyanjin Gompa, and views of Langtang Lirung.',
    highlights: ['Kyanjin Gompa', 'Kyanjin Ri (4,773m)', 'Tamang Heritage Trail', 'Yak Pastures'],
    link: '/explore/dest_langtang',
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
    svgX: 575,
    svgY: 310,
    imageUrl:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    description:
      'The ancient Kingdom of Lo. A forbidden rainshadow desert of red ochre cliffs, wind-carved sky caves, and remarkably preserved 14th-century Tibetan Buddhist art.',
    highlights: ['Walled City of Lo Manthang', 'Centuries-old Sky Caves', 'Muktinath Temple', 'Red Cliffs'],
    link: '/explore?q=Mustang',
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu Valley UNESCO',
    shortName: 'Kathmandu',
    region: 'Central Basin',
    type: 'Culture & City',
    altitude: '1,400m',
    elevationMeters: 1400,
    bestSeason: 'Year-Round',
    temp: '20°C',
    weather: 'Mild & Pleasant',
    svgX: 795,
    svgY: 520,
    imageUrl:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s cultural soul. A living open-air museum of seven UNESCO World Heritage monuments, medieval tiered Newar pagodas, and sacred spiritual sanctuaries.',
    highlights: ['Boudhanath Stupa', 'Pashupatinath Temple', 'Bhaktapur Durbar Square', 'Patan Art'],
    link: '/explore?q=Kathmandu',
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
    svgY: 535,
    imageUrl:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    description:
      'The sacred birthplace of Lord Buddha (Siddhartha Gautama). An international spiritual oasis featuring the Maya Devi Temple, ancient Ashoka Pillar, and world monasteries.',
    highlights: ['Maya Devi Temple', 'Ashoka Pillar (249 BCE)', 'Peace Eternal Flame', 'World Monastic Zone'],
    link: '/explore?q=Lumbini',
  },
  {
    id: 'janakpur',
    name: 'Janakpurdham (Mithila Art)',
    shortName: 'Janakpur',
    region: 'Eastern Terai',
    type: 'Culture & City',
    altitude: '70m',
    elevationMeters: 70,
    bestSeason: 'Oct – Mar',
    temp: '26°C',
    weather: 'Sunny & Cultured',
    svgX: 880,
    svgY: 660,
    imageUrl:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=800&q=80',
    description:
      'The historic capital of ancient Mithila and birthplace of Goddess Sita. Famous for the ornate white marble Janaki Mandir and vibrant folk Mithila wall art.',
    highlights: ['Janaki Mandir Pagoda', 'Mithila Folk Painting Centers', 'Sacred Ponds & Ghats', 'Vivaha Mandap'],
    link: '/explore?q=Janakpur',
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
    svgX: 592,
    svgY: 420,
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
    svgX: 375,
    svgY: 220,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s largest and deepest high-altitude alpine lake, encircled by coniferous pine forests and snowy summits in the remote, untouched Karnali wilderness.',
    highlights: ['Deep Azure Mirror Waters', 'Coniferous Pine Trails', 'Murma Top Viewpoint', 'Pristine Isolation'],
    link: '/explore?q=Rara',
  },
  {
    id: 'phoksundo',
    name: 'Shey Phoksundo Lake (Dolpo)',
    shortName: 'Phoksundo',
    region: 'Trans-Himalayan Dolpo',
    type: 'Lakes & Wilderness',
    altitude: '3,611m',
    elevationMeters: 3611,
    bestSeason: 'May – Oct',
    temp: '6°C',
    weather: 'Azure Solitude',
    svgX: 460,
    svgY: 280,
    imageUrl:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
    description:
      'The deepest blue jewel of the trans-Himalaya. An alpine lake of spellbinding turquoise clarity bordered by ancient Tibetan Bon monasteries and snow leopard habitats.',
    highlights: ['Ringmo Bon Monastery', 'Suligad Waterfall (167m)', 'Snow Leopard Territory', 'Yartung Festival'],
    link: '/explore?q=Phoksundo',
  },
  {
    id: 'gosaikunda',
    name: 'Gosaikunda Sacred Lakes',
    shortName: 'Gosaikunda',
    region: 'Central Langtang Range',
    type: 'Lakes & Wilderness',
    altitude: '4,380m',
    elevationMeters: 4380,
    bestSeason: 'Apr – Jun, Sep – Nov',
    temp: '1°C',
    weather: 'Glacial Mist',
    svgX: 810,
    svgY: 470,
    imageUrl:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    description:
      'Holy glacial lakes created, according to legend, by Lord Shiva’s trident. High alpine amphitheater surrounded by rugged mountain peaks and mist-veiled passes.',
    highlights: ['Lauribina Pass (4,610m)', 'Saraswati & Bhairav Kund', 'Shiva Lingam in Water', 'Janai Purnima Pilgrimage'],
    link: '/explore?q=Gosaikunda',
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
    svgY: 540,
    imageUrl:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    description:
      'Dense subtropical sal forests and riverine grasslands sheltering endangered greater one-horned rhinoceros, Royal Bengal tigers, and gharial crocodiles.',
    highlights: ['Jeep Jungle Safari', 'Greater One-Horned Rhinos', 'Canoeing Rapti River', 'Tharu Cultural Village'],
    link: '/explore?q=Chitwan',
  },
  {
    id: 'bardia',
    name: 'Bardia National Park',
    shortName: 'Bardia',
    region: 'Far-Western Terai',
    type: 'Wildlife Safari',
    altitude: '152m',
    elevationMeters: 152,
    bestSeason: 'Oct – Apr',
    temp: '29°C',
    weather: 'Wild Riverbanks',
    svgX: 230,
    svgY: 410,
    imageUrl:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    description:
      'Nepal’s largest untouched wilderness of the lowlands. The ultimate frontier for tracking wild Royal Bengal tigers, wild Asian elephants, and freshwater Gangetic dolphins.',
    highlights: ['Karnali River Rafting', 'Wild Bengal Tiger Tracking', 'Elephant Breeding Center', 'Gangetic River Dolphins'],
    link: '/explore?q=Bardia',
  },
];

interface FilterConfig {
  key: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
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
      label: 'All Regions',
      count: mapDestinations.length,
      icon: Layers,
    },
    {
      key: 'Summit & Trek',
      label: 'Summit & Trek',
      count: mapDestinations.filter((d) => d.type === 'Summit & Trek').length,
      icon: Mountain,
    },
    {
      key: 'Culture & City',
      label: 'Culture & City',
      count: mapDestinations.filter((d) => d.type === 'Culture & City').length,
      icon: Compass,
    },
    {
      key: 'Lakes & Wilderness',
      label: 'Lakes & Wilderness',
      count: mapDestinations.filter((d) => d.type === 'Lakes & Wilderness').length,
      icon: Waves,
    },
    {
      key: 'Wildlife Safari',
      label: 'Wildlife Safari',
      count: mapDestinations.filter((d) => d.type === 'Wildlife Safari').length,
      icon: Compass,
    },
  ];

  const getPinColor = (type: DestinationCategory, isSelected: boolean) => {
    if (isSelected) return '#EC1F27'; // Crimson highlight for active waypoint
    switch (type) {
      case 'Summit & Trek':
        return '#C88E14'; // Himalayan Gold / Brass
      case 'Culture & City':
        return '#0552A2'; // Deep Royal Nepal Navy
      case 'Lakes & Wilderness':
        return '#0284C7'; // Glacier Azure Blue
      case 'Wildlife Safari':
        return '#15803D'; // Subtropical Forest Green
      default:
        return '#0552A2';
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 rounded-xl p-5 sm:p-8 lg:p-10 border border-slate-200/80 font-inter select-none shadow-xs">
      {/* =========================================================================
          1. EDITORIAL HEADER & CARTOGRAPHIC ATLAS IDENTIFIER
          ========================================================================= */}
      <div className="space-y-6 pb-6 border-b border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Title & Description Block */}
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#0552A2] font-semibold flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EC1F27]" />
              Cartographic Atlas · The Nepal Himalaya
            </span>

            <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
              Map of the High Himalayas
            </h2>

            <p className="font-inter font-normal text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              From the 8,000-meter glaciated crests of the Great Himalayan Trail to the subtropical sal forests of the Terai. Select any waypoint to examine elevation, climate telemetry, and regional expeditions.
            </p>
          </div>

          {/* Atlas Geographic Telemetry Index */}
          <div className="hidden lg:flex items-center gap-5 text-xs font-mono text-slate-500 pt-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <Mountain className="h-3.5 w-3.5 text-[#C88E14]" />
              <span>Apex: <strong className="text-slate-900 font-semibold">8,848.86m</strong></span>
            </div>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Datum: <strong className="text-slate-900 font-semibold">WGS84</strong></span>
            </div>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Waypoints: <strong className="text-slate-900 font-semibold">{mapDestinations.length} Surveyed</strong></span>
            </div>
          </div>
        </div>

        {/* Minimalist Architectural Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1">
          {categoryFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key);
                  if (filter.key !== 'All' && selectedDest.type !== filter.key) {
                    const firstMatch = mapDestinations.find((d) => d.type === filter.key);
                    if (firstMatch) setSelectedId(firstMatch.id);
                  }
                }}
                className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-inter transition-colors duration-150 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#0552A2] text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
                }`}
                aria-pressed={isActive}
              >
                <Icon
                  className={`h-3.5 w-3.5 transition-colors ${
                    isActive ? 'text-[#C88E14]' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isActive ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  ({filter.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          2. MAIN STAGE: INTEGRATED CARTOGRAPHIC ATLAS & EDITORIAL MONOGRAPH
          ========================================================================= */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left: Authentic Vector Map Canvas (Col 1 to 7) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-lg bg-white border border-slate-200/90 overflow-hidden flex items-center justify-center select-none shadow-xs flex-1">
            {/* Top Left: Authentic Cartographic Survey Notation */}
            <div className="absolute top-3.5 left-4 z-20 hidden sm:flex items-center gap-2 text-[10px] tracking-wider text-slate-500 font-mono">
              <Compass className="h-3 w-3 text-[#0552A2]" />
              <span>GEODETIC ATLAS · 1:2,500,000 · WGS84</span>
            </div>

            {/* Top Right: Architectural Scale Bar */}
            <div className="absolute top-3.5 right-4 z-20 hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span>0</span>
              <span className="w-12 h-[1px] bg-slate-400 block relative">
                <span className="absolute -top-1 left-0 w-[1px] h-2.5 bg-slate-400" />
                <span className="absolute -top-1 left-1/2 w-[1px] h-2 bg-slate-400" />
                <span className="absolute -top-1 right-0 w-[1px] h-2.5 bg-slate-400" />
              </span>
              <span>150 km</span>
            </div>

            {/* SVG Cartographic Projection of Nepal */}
            <svg
              viewBox="15 30 1185 735"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
            >
              <defs>
                {/* Clean Precision Waypoint Aura */}
                <filter id="cartoPinShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Geographic Graticule Coordinate Lat/Long Grid Lines */}
              <g stroke="rgba(15, 23, 42, 0.05)" strokeWidth="0.75" strokeDasharray="3 4">
                <line x1="200" y1="50" x2="200" y2="700" />
                <line x1="450" y1="50" x2="450" y2="700" />
                <line x1="700" y1="50" x2="700" y2="700" />
                <line x1="950" y1="50" x2="950" y2="700" />
                <line x1="50" y1="200" x2="1150" y2="200" />
                <line x1="50" y1="400" x2="1150" y2="400" />
                <line x1="50" y1="600" x2="1150" y2="600" />
              </g>

              {/* Latitude / Longitude Subtle Monospace Annotations */}
              <g fill="rgba(15, 23, 42, 0.32)" fontFamily="monospace" fontSize="9.5">
                <text x="205" y="65">81°E</text>
                <text x="455" y="65">83°E</text>
                <text x="705" y="65">85°E</text>
                <text x="955" y="65">87°E</text>
                <text x="25" y="205">30°N</text>
                <text x="25" y="405">28°N</text>
                <text x="25" y="605">27°N</text>
              </g>

              {/* 1. INTERNAL ADMINISTRATIVE DISTRICTS: Refined, delicate hairline strokes */}
              <g id="nepal-districts">
                {DISTRICTS.map((district) => (
                  <path
                    key={district.id}
                    d={district.pathD}
                    fill="#E5EFF8"
                    stroke="#8C705A"
                    strokeWidth="0.65"
                    strokeOpacity="0.45"
                    strokeLinejoin="round"
                    className="transition-colors duration-200 hover:fill-[#D4E6F4]"
                  />
                ))}
              </g>

              {/* 2. AUTHENTIC NATIONAL SILHOUETTE OUTLINE */}
              <path
                d={NEPAL_COUNTRY_PATH}
                fill="none"
                stroke="#6E5039"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* 3. Stylized Mountain Ridges in Northern Great Himalayan Arc */}
              <g stroke="rgba(5, 82, 162, 0.22)" strokeWidth="1" fill="none" strokeDasharray="4 3">
                <path d="M 260 300 Q 380 260 560 250 T 800 380 T 1000 450" />
                <path d="M 520 270 Q 640 230 760 330 T 960 440" />
              </g>

              {/* 4. INTERACTIVE DESTINATION WAYPOINT MARKERS */}
              <g id="map-waypoints">
                {mapDestinations.map((dest) => {
                  const isSelected = dest.id === selectedId;
                  const isHovered = hoveredId === dest.id;
                  const isPrimary = isSelected || isHovered;
                  const isMatchingFilter =
                    activeFilter === 'All' || dest.type === activeFilter;

                  const pinColor = getPinColor(dest.type, isSelected);

                  return (
                    <g
                      key={dest.id}
                      transform={`translate(${dest.svgX}, ${dest.svgY})`}
                      onClick={() => setSelectedId(dest.id)}
                      onMouseEnter={() => setHoveredId(dest.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`cursor-pointer transition-all duration-200 ${
                        isMatchingFilter ? 'opacity-100' : 'opacity-20'
                      }`}
                    >
                      {/* 1. Continuous Sonar / Radar Blinking Ping Ring for Active Spots */}
                      {isMatchingFilter && (
                        <circle
                          r="4"
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="1.5"
                          cx="0"
                          cy="0"
                        >
                          <animate
                            attributeName="r"
                            values={isPrimary ? '6;22' : '4;15'}
                            dur={isPrimary ? '1.4s' : `${1.8 + (dest.svgX % 3) * 0.4}s`}
                            begin={`${(dest.svgX % 5) * 0.25}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values={isPrimary ? '0.9;0' : '0.75;0'}
                            dur={isPrimary ? '1.4s' : `${1.8 + (dest.svgX % 3) * 0.4}s`}
                            begin={`${(dest.svgX % 5) * 0.25}s`}
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-width"
                            values={isPrimary ? '2;0.3' : '1.5;0.2'}
                            dur={isPrimary ? '1.4s' : `${1.8 + (dest.svgX % 3) * 0.4}s`}
                            begin={`${(dest.svgX % 5) * 0.25}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* 2. Secondary High-Intensity Radar Echo for Selected Spot */}
                      {isPrimary && (
                        <circle
                          r="10"
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                          cx="0"
                          cy="0"
                        >
                          <animate
                            attributeName="r"
                            values="10;26"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.8;0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* 3. Waypoint Core Pin */}
                      <circle
                        r={isPrimary ? '6.5' : '4.5'}
                        fill={pinColor}
                        stroke="#FFFFFF"
                        strokeWidth={isPrimary ? '2' : '1.5'}
                        filter="url(#cartoPinShadow)"
                        cx="0"
                        cy="0"
                        className="transition-all duration-200"
                      />

                      {/* 4. Center Glowing Core Point with Synchronized Twinkle */}
                      <circle
                        r={isPrimary ? '2.5' : '1.8'}
                        fill="#FFFFFF"
                        cx="0"
                        cy="0"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0.4;1"
                          dur={`${1.6 + (dest.svgY % 3) * 0.3}s`}
                          begin={`${(dest.svgY % 4) * 0.3}s`}
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Authentic Editorial Geographic Label */}
                      <g
                        transform={`translate(0, ${isPrimary ? -18 : -14})`}
                        className="transition-all duration-200 pointer-events-none"
                      >
                        <rect
                          x={-dest.shortName.length * 3.6 - 7}
                          y="-9"
                          width={dest.shortName.length * 7.2 + 14}
                          height="18"
                          rx="3"
                          fill={isPrimary ? '#0F172A' : '#FFFFFF'}
                          fillOpacity={isPrimary ? 0.95 : 0.92}
                          stroke={isPrimary ? pinColor : 'rgba(15, 23, 42, 0.15)'}
                          strokeWidth={isPrimary ? '1.2' : '0.8'}
                          className="transition-all duration-200"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill={isPrimary ? '#FFFFFF' : '#1E293B'}
                          fontFamily="var(--font-inter), system-ui, sans-serif"
                          fontSize="9.5"
                          fontWeight={isPrimary ? '700' : '500'}
                          letterSpacing="0.01em"
                        >
                          {dest.shortName}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom Integrated Cartographic Key & Status */}
            <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600 font-mono bg-white/95 border border-slate-200/80 px-3 py-1.5 rounded-md backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#C88E14]" /> Summits
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0552A2]" /> Culture
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7]" /> Lakes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#15803D]" /> Wildlife
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Waypoint:</span>
                <span className="text-slate-900 font-semibold">{selectedDest.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rich Editorial Waypoint Monograph (Col 8 to 12) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-xl bg-white border border-slate-200/90 p-5 sm:p-6 transition-all duration-300 space-y-4 flex flex-col justify-between h-full shadow-2xs">
            {/* Top Region Kicker & Destination Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0552A2] font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#0552A2]" />
                  {selectedDest.region}
                </span>
                <span className="text-[11px] font-medium font-inter text-slate-500">
                  {selectedDest.type}
                </span>
              </div>

              <h3 className="font-poppins text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">
                {selectedDest.name}
              </h3>
            </div>

            {/* High-Resolution Landscape Photography Showcase */}
            <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden group shadow-2xs border border-slate-200/80">
              <img
                src={selectedDest.imageUrl}
                alt={selectedDest.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />

              {/* Climate Telemetry Indicator */}
              <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md text-[10.5px] font-mono text-white border border-white/15">
                <Wind className="h-3 w-3 text-cyan-300" />
                <span>{selectedDest.temp}</span>
                <span className="text-white/40">·</span>
                <span className="text-slate-200">{selectedDest.weather}</span>
              </div>
            </div>

            {/* Editorial Narrative Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
              {selectedDest.description}
            </p>

            {/* Architectural Specifications Grid (Clean Typographic Key-Values) */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Mountain className="h-3 w-3 text-[#C88E14]" />
                  Elevation Profile
                </span>
                <p className="font-semibold text-slate-900 font-inter text-xs sm:text-sm">
                  {selectedDest.altitude}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#0552A2]" />
                  Optimal Window
                </span>
                <p className="font-semibold text-slate-900 font-inter text-xs sm:text-sm">
                  {selectedDest.bestSeason}
                </p>
              </div>
            </div>

            {/* Key Field Highlights: Editorial List */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-medium">
                Key Waypoints &amp; Expeditions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                {selectedDest.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-[#0552A2] shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bespoke Editorial Call to Action */}
            <div className="pt-2">
              <Link
                href={selectedDest.link}
                prefetch={true}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0552A2] hover:bg-[#044182] text-white font-semibold font-inter text-xs sm:text-sm py-2.5 transition-all active:scale-[0.99] shadow-xs cursor-pointer"
              >
                <span>Discover {selectedDest.shortName} Expeditions</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
