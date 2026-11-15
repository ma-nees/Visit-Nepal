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
      className="absolute top-5 left-5 sm:top-7 sm:left-7 z-30 inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-[#0552A2] px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-slate-200/80 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
