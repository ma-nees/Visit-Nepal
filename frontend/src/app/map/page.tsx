'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { NepalKnowledgeMap } from '@/components/network/NepalKnowledgeMap';

export default function NepalMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBFA] via-[#F4F6F9] to-[#EBF0F5] text-slate-800 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Light & Clean Editorial Atmosphere */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#92C4EA]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full bg-[#0552A2]/08 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FDB716]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#0552A2] bg-white/90 hover:bg-white px-3.5 py-2 rounded-xl transition-all border border-slate-200/80 shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-mono text-[#0552A2] flex items-center gap-1.5 font-semibold">
              <Compass className="h-3.5 w-3.5 text-[#0552A2]" />
              Sacred Geography
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1 border border-slate-200/90 text-[11px] font-bold text-[#0552A2] tracking-wider uppercase shadow-xs self-start sm:self-auto">
            <Sparkles className="h-3 w-3 text-[#FDB716]" />
            <span>Kingdom of the Himalayas</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-poppins font-semibold text-slate-900 tracking-tight">
            Map of the High Himalayas
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl leading-relaxed">
            High-precision vector cartography featuring key Himalayan expedition hotspots, sacred monasteries, and alpine valleys across Nepal.
          </p>
        </div>

        {/* Nepal Knowledge Map Component */}
        <div className="w-full">
          <NepalKnowledgeMap embedded={false} />
        </div>

      </div>
    </div>
  );
}
