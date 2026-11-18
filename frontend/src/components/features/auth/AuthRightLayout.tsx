'use client';

import React from 'react';

interface AuthRightLayoutProps {
  children: React.ReactNode;
}

export default function AuthRightLayout({ children }: AuthRightLayoutProps) {
  return (
    <div className="w-full md:w-1/2 flex-1 md:h-full flex flex-col justify-center items-center px-4 py-5 sm:px-8 sm:py-8 lg:p-12 relative bg-white select-none border-t-0 md:border-l border-slate-200/80 min-h-[calc(100vh-52px)] md:min-h-0 overflow-y-auto">
      {/* Subtle architectural dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0552A2_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.025] pointer-events-none" />

      {/* Subtle organic ambient glow */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-gradient-to-br from-[#92C4EA]/12 via-blue-50/15 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-gradient-to-tr from-[#FDB716]/06 to-transparent rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-[420px] my-auto relative z-10 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
