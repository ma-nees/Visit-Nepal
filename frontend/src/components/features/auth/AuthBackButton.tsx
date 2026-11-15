'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthBackButtonProps {
  label?: string;
  onClick: () => void;
}

export default function AuthBackButton({
  label = 'Back to Home',
  onClick,
}: AuthBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-3.5 left-3.5 sm:top-5 sm:left-6 z-30 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#0552A2] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold backdrop-blur-md border border-slate-200/90 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
