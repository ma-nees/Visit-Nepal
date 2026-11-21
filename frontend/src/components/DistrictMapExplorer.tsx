'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Mountain,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  Hotel as HotelIcon,
  Tent,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { DISTRICTS, DistrictItem, PROVINCE_COLORS } from '@/data/nepal-map-data';
import {
  NEPAL_DISTRICTS_REGISTRY,
  DistrictMeta,
  getDistrictPackages,
  hasDistrictPackages,
  getDistrictTotalOfferings,
  findDistrictMeta,
} from '@/data/districtPackages';
import { Destination, Hotel } from '@/data/mockData';

const PROVINCE_TABS = [
  'All Provinces',
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
];

const POPULAR_HUBS = [
  { name: 'Solukhumbu', label: 'Everest (Solukhumbu)' },
  { name: 'Kaski', label: 'Pokhara & ABC (Kaski)' },
  { name: 'Mustang', label: 'Upper Mustang' },
  { name: 'Manang', label: 'Annapurna Circuit (Manang)' },
  { name: 'Rasuwa', label: 'Langtang (Rasuwa)' },
  { name: 'Chitwan', label: 'Chitwan Safari' },
  { name: 'Dolpa', label: 'Shey Phoksundo (Dolpa)' },
  { name: 'Mugu', label: 'Rara Lake (Mugu)' },
];

export default function DistrictMapExplorer({ initialDistrict = 'Solukhumbu' }: { initialDistrict?: string }) {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialDistrict);
  const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('All Provinces');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Current selected district packages & metadata
  const districtData = useMemo(() => {
    return getDistrictPackages(selectedDistrictName);
  }, [selectedDistrictName]);

  const { districtMeta, packages, hotels: districtHotels, hasPackages } = districtData;

  // Filtered districts list for the search dropdown
  const filteredDistricts = useMemo(() => {
    let list = NEPAL_DISTRICTS_REGISTRY;

    if (selectedProvince !== 'All Provinces') {
      list = list.filter((d) => d.province.toLowerCase() === selectedProvince.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.highlight.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, selectedProvince]);

  const handleSelectDistrict = (name: string, scroll = true) => {
    setSelectedDistrictName(name);
    setSearchQuery('');
    setIsSearchOpen(false);

    if (scroll && resultsRef.current) {
      const yOffset = -90;
      const element = resultsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Pre-calculate active package counts per district for fast SVG styling
  const activeDistrictsMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of NEPAL_DISTRICTS_REGISTRY) {
      const count = d.packageIds.length + d.hotelIds.length;
      if (count > 0) {
        map.set(d.mapName, count);
        map.set(d.name, count);
      }
    }
    return map;
  }, []);

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      {/* 1. FILTER & SEARCH CONTROL CONSOLE */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top Controls: Search Input + Active Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar with Autocomplete Dropdown */}
          <div className="relative flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search any of Nepal's 77 districts (e.g., Solukhumbu, Mustang, Kaski)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0552A2] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {isSearchOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsSearchOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl z-40 divide-y divide-slate-100">
                  {filteredDistricts.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500 text-center">
                      No matching district found. Try another spelling or region.
                    </div>
                  ) : (
                    filteredDistricts.map((d) => {
                      const count = d.packageIds.length + d.hotelIds.length;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleSelectDistrict(d.name)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">{d.name}</span>
                            <span className="ml-2 text-[10px] text-slate-400 font-mono">
                              {d.province} Province
                            </span>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{d.highlight}</p>
                          </div>
                          {count > 0 ? (
                            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0552A2] border border-blue-200/80">
                              {count} {count === 1 ? 'Trip' : 'Trips'}
                            </span>
                          ) : (
                            <span className="shrink-0 text-[10px] text-slate-400">Custom</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick Active District Stats Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-slate-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>77 Surveyed Districts</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-[#0552A2]">29 Curated Expeditions</span>
          </div>
        </div>

        {/* Province Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Province:
          </span>
          {PROVINCE_TABS.map((p) => {
            const active = selectedProvince === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedProvince(p)}
                className={`inline-flex shrink-0 items-center px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0552A2] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Popular Expedition Hubs Quick-Pill Shortcuts */}
        <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
            Top Hubs:
          </span>
          {POPULAR_HUBS.map((hub) => {
            const isSelected = selectedDistrictName.toLowerCase() === hub.name.toLowerCase();
            return (
              <button
                key={hub.name}
                type="button"
                onClick={() => handleSelectDistrict(hub.name)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0552A2] text-white font-semibold shadow-xs'
                    : 'bg-blue-50 text-[#0552A2] hover:bg-blue-100/80 border border-blue-200/60'
                }`}
              >
                <Compass className="h-3 w-3" />
                <span>{hub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THE INTERACTIVE NEPAL VECTOR DISTRICT MAP CANVAS */}
      <div className="relative rounded-3xl bg-white border border-slate-200 shadow-sm p-3 sm:p-6 lg:p-8 overflow-hidden">
        {/* Ambient Topographical Background Silhouette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(5,82,162,0.03),transparent_70%)] pointer-events-none" />

        {/* Map Header Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="h-4 w-4 text-[#0552A2]" />
            <span className="font-semibold text-slate-900">
              Interactive Cartographic Map of Nepal
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Click any district to view its trips</span>
          </div>

          {/* Map Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0552A2]" />
              <span>Selected District</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
              <span>Active Expeditions</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span>Custom Expeditions</span>
            </span>
          </div>
        </div>

        {/* SVG Map Container */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] flex items-center justify-center">
          <svg
            viewBox="0 0 1200 800"
            className="w-full h-full select-none"
            aria-label="Interactive District Map of Nepal"
          >
            {/* 77 Districts Vector Paths */}
            <g className="transition-all duration-300">
              {DISTRICTS.map((district: DistrictItem) => {
                const count = activeDistrictsMap.get(district.name) || 0;
                const hasTrips = count > 0;
                const isSelected =
                  selectedDistrictName.toLowerCase() === district.name.toLowerCase() ||
                  districtMeta.mapName.toLowerCase() === district.name.toLowerCase();
                const isHovered = hoveredDistrictName === district.name;
                const belongsToProvince =
                  selectedProvince === 'All Provinces' ||
                  district.province.toLowerCase() === selectedProvince.toLowerCase();

                // Dynamic Fill Color
                let fill = '#F8FAFC';
                if (!belongsToProvince) {
                  fill = '#F1F5F9';
                } else if (isSelected) {
                  fill = '#0552A2';
                } else if (isHovered) {
                  fill = hasTrips ? '#0284C7' : '#94A3B8';
                } else if (hasTrips) {
                  fill = '#BAE6FD';
                }

                // Dynamic Stroke
                let stroke = '#94A3B8';
                let strokeWidth = 0.6;
                if (isSelected) {
                  stroke = '#FDB716';
                  strokeWidth = 2.2;
                } else if (isHovered) {
                  stroke = '#0552A2';
                  strokeWidth = 1.8;
                } else if (hasTrips) {
                  stroke = '#0369A1';
                  strokeWidth = 0.9;
                }

                const opacity = belongsToProvince ? 1 : 0.35;

                return (
                  <path
                    key={district.id}
                    d={district.d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    className="cursor-pointer transition-colors duration-150 outline-none"
                    onMouseEnter={(e) => {
                      setHoveredDistrictName(district.name);
                    }}
                    onMouseLeave={() => setHoveredDistrictName(null)}
                    onClick={() => handleSelectDistrict(district.name, false)}
                  >
                    <title>{`${district.name} (${district.province} Province) - ${count} trips`}</title>
                  </path>
                );
              })}
            </g>

            {/* Radar Pulsing Beacons & Labels on Districts with Active Packages */}
            <g className="pointer-events-none">
              {DISTRICTS.map((district: DistrictItem) => {
                const count = activeDistrictsMap.get(district.name) || 0;
                if (count === 0) return null;

                const isSelected =
                  selectedDistrictName.toLowerCase() === district.name.toLowerCase() ||
                  districtMeta.mapName.toLowerCase() === district.name.toLowerCase();

                return (
                  <g key={`beacon-${district.id}`} transform={`translate(${district.cx}, ${district.cy})`}>
                    {/* Pulsing Radar Ring */}
                    <circle
                      r={isSelected ? 10 : 6}
                      fill={isSelected ? '#FDB716' : '#0284C7'}
                      opacity={0.35}
                      className="animate-ping"
                    />
                    {/* Core Beacon Center Dot */}
                    <circle
                      r={isSelected ? 4.5 : 3}
                      fill={isSelected ? '#FDB716' : '#0552A2'}
                      stroke="#ffffff"
                      strokeWidth={1}
                    />
                    {/* Centroid District Label */}
                    <text
                      y={-8}
                      textAnchor="middle"
                      className={`text-[8.5px] font-sans font-bold select-none ${
                        isSelected ? 'fill-[#0552A2] font-black' : 'fill-slate-700'
                      }`}
                      style={{
                        paintOrder: 'stroke',
                        stroke: '#ffffff',
                        strokeWidth: 2,
                        strokeLinejoin: 'round',
                      }}
                    >
                      {district.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* District Floating Hover Card (Preview) */}
          {hoveredDistrictName && (
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md text-white rounded-xl p-3 shadow-lg pointer-events-none border border-white/20 text-xs space-y-0.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold">
                <Compass className="h-3.5 w-3.5 text-[#FDB716]" />
                <span>{hoveredDistrictName} District</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {findDistrictMeta(hoveredDistrictName)?.province || 'Nepal'} Province ·{' '}
                {getDistrictTotalOfferings(hoveredDistrictName)} Available Expeditions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. SELECTED DISTRICT SPOTLIGHT & PACKAGE RESULTS */}
      <div ref={resultsRef} className="space-y-6 pt-2">
        {/* District Headline Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#031526] via-[#052648] to-[#031526] text-white p-5 sm:p-7 shadow-md border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="rounded-full bg-[#FDB716] text-[#031526] px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                  {districtMeta.province} Province
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-300 font-medium">Headquarter: {districtMeta.headquarter}</span>
              </div>
              <h2 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                {districtMeta.name} District
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 self-start sm:self-auto">
              <Mountain className="h-4 w-4 text-[#FDB716]" />
              <div className="text-xs">
                <p className="font-bold text-white leading-none">
                  {packages.length + districtHotels.length} Active {packages.length + districtHotels.length === 1 ? 'Listing' : 'Listings'}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">{districtMeta.region}</p>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl font-light">
            {districtMeta.description}
          </p>

          <div className="pt-1 flex items-center gap-2 text-xs text-[#FDB716]">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">Highlight:</span>
            <span className="text-slate-200">{districtMeta.highlight}</span>
          </div>
        </div>

        {/* PACKAGE LISTINGS GRID */}
        {hasPackages ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <h3 className="font-poppins text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#0552A2]" />
                <span>Expeditions &amp; Treks in {districtMeta.name} ({packages.length})</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Official TAAN / NTB Certified Routes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                      <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-[#0552A2] shadow-xs">
                        {pkg.category}
                      </span>
                      <span className="rounded-full bg-[#031526]/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-[#FDB716]">
                        {pkg.difficulty}
                      </span>
                    </div>

                    <span className="absolute bottom-3 right-3 rounded-md bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10.5px] font-mono font-medium text-white">
                      {pkg.altitude}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3 bg-white">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{pkg.duration}</span>
                        <span className="font-semibold text-emerald-600">★ {pkg.rating} ({pkg.reviewsCount})</span>
                      </div>

                      <h4 className="font-poppins text-base font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors leading-snug">
                        {pkg.title}
                      </h4>

                      <p className="text-xs text-slate-600 font-inter line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Starting from</span>
                        <span className="text-sm font-bold text-[#0552A2]">
                          ${pkg.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ person</span>
                        </span>
                      </div>

                      <Link
                        href={`/explore/${pkg.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#044182] transition-colors shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Matching Lodges / Stays */}
            {districtHotels.length > 0 && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <h3 className="font-poppins text-base font-bold text-slate-900 flex items-center gap-2">
                    <HotelIcon className="h-4 w-4 text-[#FDB716]" />
                    <span>Heritage Stays &amp; Alpine Lodges in {districtMeta.name} ({districtHotels.length})</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">Verified Partner Teahouses</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {districtHotels.map((htl) => (
                    <div
                      key={htl.id}
                      className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all p-3 sm:p-4 gap-4"
                    >
                      <div className="relative w-full sm:w-2/5 aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={htl.imageUrl}
                          alt={htl.name}
                          className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 space-y-1.5">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-slate-400 text-[10.5px]">{htl.location}</span>
                            <span className="font-semibold text-amber-600">★ {htl.rating}</span>
                          </div>
                          <h5 className="font-poppins font-bold text-slate-900 text-sm group-hover:text-[#0552A2] transition-colors">
                            {htl.name}
                          </h5>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{htl.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-900 text-xs">{htl.price}</span>
                          <Link
                            href={`/hotels/${htl.id}`}
                            className="text-xs font-semibold text-[#0552A2] hover:underline"
                          >
                            Book Stay &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 4. ELEGANT EMPTY STATE FOR DISTRICTS WITHOUT CATALOGED FIXED PACKAGES */
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 text-center shadow-xs space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0552A2]">
              <Compass className="h-7 w-7" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-poppins text-lg sm:text-xl font-bold text-slate-900">
                No trips available in {districtMeta.name} yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                While we don&apos;t have scheduled fixed departures for {districtMeta.name} in this season&apos;s catalog, this remote or off-the-beaten-path sector of {districtMeta.province} Province is open for customized exploration.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/custom-plan?district=${encodeURIComponent(districtMeta.name)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0552A2] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#044182] transition-colors shadow-xs"
              >
                <span>Plan a Custom Expedition to {districtMeta.name}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => handleSelectDistrict('Solukhumbu')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span>View Everest Region</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
