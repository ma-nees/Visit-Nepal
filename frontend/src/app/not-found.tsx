import Link from 'next/link';
import { Compass, Home, ArrowRight, Mountain } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FFFFFF] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 border border-blue-100 text-[#0552A2] shadow-xs">
          <Mountain className="h-10 w-10 text-[#0552A2]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0552A2]">
            404 • High Altitude Deviation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#10243A] tracking-tight">
            Trailhead Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            The pass or route you are looking for does not exist or has been shifted in the seasonal itinerary.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0552A2] text-white hover:bg-[#044182] px-6 py-2.5 text-xs font-semibold transition-all active:scale-95 shadow-xs"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/destinations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-6 py-2.5 text-xs font-semibold transition-all"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Browse Destinations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
