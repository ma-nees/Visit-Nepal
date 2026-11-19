'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { NepalKnowledgeMap } from '@/components/network/NepalKnowledgeMap';

export default function NepalMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBFA] via-[#F4F6F9] to-[#EBF0F5] text-slate-800 pt-16 sm:pt-20 pb-10 sm:pb-12 px-3.5 sm:px-6 lg:px-8 relative overflow-hidden font-inter">
      {/* Light & Clean Editorial Atmosphere */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#92C4EA]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full bg-[#0552A2]/08 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FDB716]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0552A2] bg-white/90 hover:bg-white px-3 py-1.5 rounded-lg transition-all border border-slate-200/80 shadow-2xs"
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

          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 border border-slate-200/90 text-[10px] font-bold text-[#0552A2] tracking-wider uppercase shadow-2xs self-start sm:self-auto">
            <Sparkles className="h-3 w-3 text-[#FDB716]" />
            <span>Kingdom of the Himalayas</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-poppins font-semibold text-slate-900 tracking-tight leading-tight">
            Map of the High Himalayas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
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
