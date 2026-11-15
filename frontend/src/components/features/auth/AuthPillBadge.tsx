'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthPillBadgeProps {
  label: string;
}

export default function AuthPillBadge({ label }: AuthPillBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-[#0552A2]/20 px-3.5 py-1 text-[11px] font-bold text-[#0552A2] tracking-wider uppercase shadow-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0552A2] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0552A2]"></span>
      </span>
      <span>{label}</span>
      <Sparkles className="h-3 w-3 text-[#FDB716]" />
    </div>
  );
}
