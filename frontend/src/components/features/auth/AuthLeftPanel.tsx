'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import { NepalKnowledgeMap } from '@/components/network/NepalKnowledgeMap';

interface AuthLeftPanelProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function AuthLeftPanel({}: AuthLeftPanelProps) {
  return (
    <div className="w-full lg:w-1/2 min-h-[560px] lg:h-full lg:max-h-screen relative bg-[#020713] text-white flex flex-col justify-between p-6 sm:p-8 lg:p-8 pt-20 sm:pt-20 lg:pt-20 overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-white/10">
      
      {/* 1. Silky Aesthetic Ambient Atmosphere (No dot-matrix grid) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020713] via-[#041427] to-[#01050D] pointer-events-none" />
      
      {/* Subtle organic radial glows */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#0552A2]/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full bg-[#92C4EA]/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 rounded-full bg-[#0552A2]/20 blur-[100px] pointer-events-none" />

      {/* Floating ambient glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.18, 0.32, 0.18],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-16 w-80 h-80 rounded-full bg-[#0552A2]/30 blur-3xl pointer-events-none"
      />

      {/* 2. Top Header HUD */}
      <div className="relative z-20 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-[#FDB716] tracking-wider uppercase">
            <Sparkles className="h-3 w-3 text-[#FDB716]" />
            <span>Sacred Geography</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#92C4EA]/80">
            <Compass className="h-3.5 w-3.5 text-[#FDB716]" />
            <span>Himalayan Realm</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-white tracking-tight">
            Map of the High Himalayas
          </h2>
          <p className="text-xs text-slate-300 font-light mt-0.5 max-w-md leading-relaxed">
            From the 8,848m crest of Everest to sacred alpine monasteries and lush subtropical valleys.
          </p>
        </div>
      </div>

      {/* 3. Central Map Stage: Clean Unified Nepal Map */}
      <div className="relative z-20 my-auto py-3 flex items-center justify-center flex-1">
        <div className="w-full">
          <NepalKnowledgeMap embedded={true} />
        </div>
      </div>

    </div>
  );
}
