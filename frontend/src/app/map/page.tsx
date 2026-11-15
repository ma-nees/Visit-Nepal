'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { NepalKnowledgeMap } from '@/components/network/NepalKnowledgeMap';

export default function NepalMapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020713] via-[#041427] to-[#01050D] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Silky Atmospheric Ambient Glow (No dot grid) */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#0552A2]/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full bg-[#92C4EA]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#0552A2]/15 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-2 rounded-xl transition-all border border-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono text-[#92C4EA] flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#FDB716]" />
              Sacred Geography
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 border border-white/15 text-[11px] font-bold text-[#FDB716] tracking-wider uppercase self-start sm:self-auto">
            <Sparkles className="h-3 w-3 text-[#FDB716]" />
            <span>Kingdom of the Himalayas</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight">
            Map of the High Himalayas
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl leading-relaxed">
            High-precision vector cartography featuring key Himalayan expedition hotspots, sacred monasteries, and alpine valleys across Nepal.
          </p>
        </div>

        {/* Nepal Knowledge Map Component */}
        <div className="w-full">
          <NepalKnowledgeMap embedded={false} />
        </div>

      </div>
    </main>
  );
}
