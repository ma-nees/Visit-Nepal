'use client';

import React from 'react';

interface AuthRightLayoutProps {
  children: React.ReactNode;
}

export default function AuthRightLayout({ children }: AuthRightLayoutProps) {
  return (
    <div className="w-full lg:w-1/2 min-h-0 lg:h-full flex items-center justify-center p-4 sm:p-6 lg:px-8 lg:py-4 xl:px-12 xl:py-6 relative bg-[#FAF9F5] lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* Silky organic ambient warmth (no dot grid) */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#92C4EA]/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FDB716]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/2 -translate-y-1/2 w-80 h-80 bg-blue-50/60 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md my-auto relative z-10 py-1 sm:py-2 lg:py-0">
        {children}
      </div>
    </div>
  );
}
