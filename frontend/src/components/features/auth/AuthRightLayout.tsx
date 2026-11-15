'use client';

import React from 'react';

interface AuthRightLayoutProps {
  children: React.ReactNode;
}

export default function AuthRightLayout({ children }: AuthRightLayoutProps) {
  return (
    <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-16 relative bg-[#FAF9F5] overflow-y-auto">
      {/* Subtle topographic atmospheric backdrop */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#0552A2_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Glow highlight */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md my-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
