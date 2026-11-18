'use client';

import Link from 'next/link';
import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Clock,
  Star,
  Mountain,
  SlidersHorizontal,
  Compass,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { categories, destinations, CategoryLabel } from '@/data/mockData';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryLabel>('All');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  const filtered = useMemo(() => {
    return destinations
      .filter((d) => {
        const matchCat = category === 'All' || d.category === category;
        const matchDiff = difficulty === 'All' || d.difficulty === difficulty;
        const matchQ =
          !query.trim() ||
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.location.toLowerCase().includes(query.toLowerCase()) ||
          d.description.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchDiff && matchQ;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return b.rating - a.rating;
      });
  }, [category, difficulty, query, sortBy]);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Optimized & Clean Editorial Header */}
      <div className="relative pb-5 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0552A2] tracking-wider uppercase">
              <Compass className="h-3.5 w-3.5 shrink-0" />
              <span>Official 2026 Route Registry</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-poppins">
              Explore Iconic <span className="text-[#0552A2]">Mountain Treks</span> &amp; Circuits
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Choose from UNESCO World Heritage valleys, high-altitude passes, and remote forbidden kingdoms with certified local IFMGA guides.
            </p>
          </div>

          {/* Compact Inline Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-800 text-xs font-semibold">
              <Mountain className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
              <span>{destinations.length} Routes</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>TIMS &amp; ACAP Approved</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.98] ${category === cat
                  ? 'bg-[#0552A2] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls: Search, Difficulty & Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search trek or region..."
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none text-xs"
              >
                <option value="All">All Grades</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Difficult">Difficult</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'popular' | 'price-low' | 'price-high')
              }
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
            >
              <option value="popular">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Expeditions Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Mountain className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-2 text-sm font-bold text-slate-800">
            No expeditions matched your criteria
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Try resetting your difficulty filters or search keywords
          </p>
          <button
            onClick={() => {
              setQuery('');
              setCategory('All');
              setDifficulty('All');
            }}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#0552A2] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#044182] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="animate-subtle-fade-up grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dest) => (
            <Link
              key={dest.id}
              href={`/explore/${dest.id}`}
              prefetch={true}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs hover:border-[#0552A2]/40 hover:shadow-md active:scale-[0.99] transition-all duration-200"
            >
              {/* Photo & Badges */}
              <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-900">
                <img
                  src={dest.imageUrl}
                  alt={dest.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  <span className="rounded bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white">
                    {dest.category}
                  </span>
                  <span className="rounded bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    {dest.difficulty}
                  </span>
                </div>
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded bg-white/95 px-2 py-0.5 text-[11px] font-bold text-slate-900">
                  <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
                  <span>{dest.rating}</span>
                  <span className="text-slate-400 font-normal">({dest.reviewsCount})</span>
                </span>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5">
                    <Mountain className="h-3 w-3 text-[#FDB716]" />
                    <span>Peak: {dest.altitude}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5">
                    <Clock className="h-3 w-3 text-[#92C4EA]" />
                    <span>{dest.duration}</span>
                  </span>
                </div>
              </div>

              {/* Body Content: Compact padding */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#EC1F27]">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{dest.location}</span>
                </div>
                <h2 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors truncate">
                  {dest.title}
                </h2>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Highlights bullets */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1">
                  {dest.highlights.slice(0, 2).map((hl, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px] text-slate-500">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & CTA footer */}
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                      All-inclusive
                    </span>
                    <span className="text-base font-extrabold text-[#0552A2]">
                      ${dest.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium"> / person</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0552A2] group-hover:translate-x-0.5 transition-transform">
                    <span>View Route</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto w-full px-4 py-12 text-center text-xs text-slate-500">
          Loading Himalayan expeditions...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
