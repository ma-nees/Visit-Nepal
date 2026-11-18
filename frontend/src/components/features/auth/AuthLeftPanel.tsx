'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { NepalKnowledgeMap } from '@/components/network/NepalKnowledgeMap';

interface AuthLeftPanelProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLeftPanel({ }: AuthLeftPanelProps) {
  return (
    <div className="hidden md:flex md:w-1/2 h-full items-center justify-center p-4 sm:p-6 lg:px-8 lg:py-4 xl:p-10 relative bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-slate-800 overflow-hidden select-none border-b md:border-b-0 md:border-r border-slate-200/80 shadow-xs">
      {/* Subtle architectural dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0552A2_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />

      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full bg-[#92C4EA]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-[#0552A2]/08 blur-[120px] pointer-events-none" />

      {/* Unified Content Stage */}
      <div className="w-full max-w-lg my-auto relative z-20 flex flex-col gap-3 sm:gap-4">
        {/* Top Header HUD */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/90 border border-blue-200/70 px-2.5 py-0.5 text-[9.5px] font-bold text-[#0552A2] tracking-wider uppercase shadow-2xs">
            <Sparkles className="h-2.5 w-2.5 text-[#FDB716]" />
            <span>Sacred Geography • Nepal Tourism Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-slate-900 tracking-tight">
            Map of the High Himalayas
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5 max-w-md leading-relaxed">
            From the 8,848m crest of Everest to sacred alpine monasteries and lush subtropical valleys.
          </p>
        </div>

        {/* Central Map Stage */}
        <div className="w-full flex items-center justify-center">
          <NepalKnowledgeMap embedded={true} />
        </div>
      </div>
    </div>
  );
}
