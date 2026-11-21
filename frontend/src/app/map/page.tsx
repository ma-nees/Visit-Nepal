'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Compass, Sparkles, MapPin, Mountain, Layers } from 'lucide-react';
import DistrictMapExplorer from '@/components/DistrictMapExplorer';
import InteractiveMap from '@/components/InteractiveMap';

function MapContent() {
  const searchParams = useSearchParams();
  const districtParam = searchParams.get('district') || 'Solukhumbu';
  const [activeView, setActiveView] = useState<'districts' | 'peaks'>('districts');

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pt-16 sm:pt-20 pb-14 px-4 sm:px-6 md:px-8 lg:px-10 relative overflow-hidden font-inter">
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#92C4EA]/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full bg-[#0552A2]/05 blur-[130px] pointer-events-none" />

      <div className="w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Navigation Breadcrumb & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0552A2] bg-white px-3 py-1.5 rounded-lg transition-all border border-slate-200/80 shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-mono text-[#0552A2] flex items-center gap-1.5 font-semibold">
              <Compass className="h-3.5 w-3.5 text-[#0552A2]" />
              Traveler Resources
            </span>
          </div>

          {/* Mode Switcher: 77 Districts vs Alpine Peaks Atlas */}
          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveView('districts')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'districts'
                  ? 'bg-white text-[#0552A2] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>District Travel Explorer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('peaks')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'peaks'
                  ? 'bg-white text-[#0552A2] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mountain className="h-3.5 w-3.5" />
              <span>Map of the High Himalayas</span>
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0552A2]">
            <Sparkles className="h-3.5 w-3.5 text-[#FDB716]" />
            <span>Interactive Cartographic Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-poppins font-bold text-slate-900 tracking-tight leading-tight">
            {activeView === 'districts'
              ? 'District Travel Explorer'
              : 'Map of the High Himalayas'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
            {activeView === 'districts'
              ? 'Explore Nepal across all 77 districts. Select any district on the interactive vector map or search below to reveal available trekking routes, cultural heritage sites, safari lodges, and expedition packages.'
              : 'Precision vector cartography featuring sacred monasteries, high Himalayan passes, 8,000-meter massifs, elevation telemetry, and regional expeditions across the Kingdom of Nepal.'}
          </p>
        </div>

        {/* Main Content Component */}
        {activeView === 'districts' ? (
          <DistrictMapExplorer initialDistrict={districtParam} />
        ) : (
          <div className="w-full">
            <InteractiveMap />
          </div>
        )}
      </div>
    </div>
  );
}

export default function NepalMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono">
            <Compass className="h-4 w-4 animate-spin text-[#0552A2]" />
            <span>Loading District Travel Explorer...</span>
          </div>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
