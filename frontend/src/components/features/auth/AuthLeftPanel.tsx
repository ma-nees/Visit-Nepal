'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NepalKnowledgeMap } from '@/components/network/NepalKnowledgeMap';

interface AuthLeftPanelProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLeftPanel({}: AuthLeftPanelProps) {
  return (
    <div className="w-full lg:w-1/2 min-h-0 lg:h-full flex items-center justify-center p-6 sm:p-8 lg:p-12 relative bg-gradient-to-b from-[#FBFBFA] via-[#F4F6F9] to-[#EBF0F5] text-slate-800 overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-slate-200/80 shadow-xs">
      
      {/* 1. Light & Clean Editorial Atmosphere */}
      <div className="absolute -top-24 -left-24 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full bg-[#92C4EA]/25 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full bg-[#0552A2]/08 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-60 sm:w-72 h-60 sm:h-72 rounded-full bg-[#FDB716]/10 blur-[90px] pointer-events-none" />

      {/* Floating subtle ambient pearl orb */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-16 w-80 h-80 rounded-full bg-[#92C4EA]/20 blur-3xl pointer-events-none"
      />

      {/* 2. Unified Content Stage (Header + Map + Spotlight tightly connected) */}
      <div className="w-full max-w-xl my-auto relative z-20 flex flex-col gap-4 sm:gap-5">
        {/* Top Header HUD */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-normal text-slate-900 tracking-tight">
            Map of the High Himalayas
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5 max-w-md leading-relaxed">
            From the 8,848m crest of Everest to sacred alpine monasteries and lush subtropical valleys.
          </p>
        </div>

        {/* Central Map Stage: Clean Unified Nepal Map */}
        <div className="w-full flex items-center justify-center">
          <NepalKnowledgeMap embedded={true} />
        </div>
      </div>

    </div>
  );
}
