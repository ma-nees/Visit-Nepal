'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTravelStore } from '@/store/useTravelStore';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useTravelStore();

  useEffect(() => {
    if (currentUser?.role === 'guide') {
      router.replace('/portals/guide');
    } else if (currentUser?.role === 'business') {
      router.replace('/portals/business');
    } else if (currentUser?.role === 'admin') {
      router.replace('/portals/admin');
    } else if (currentUser?.role === 'butler') {
      router.replace('/portals/butler');
    } else {
      router.replace('/');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020B14] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#FDB716] border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading your Himalayan dashboard...</p>
      </div>
    </div>
  );
}
