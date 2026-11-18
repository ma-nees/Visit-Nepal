'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?mode=register');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="h-6 w-6 rounded-full border-2 border-[#0552A2] border-t-transparent animate-spin" />
    </div>
  );
}
