'use client';

import { Suspense, use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Mountain,
  Calendar,
  Star,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { destinations } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import StandardBookingModal from '@/components/features/booking/StandardBookingModal';

function PackageDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addBooking } = useApp();
  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState('2026-11-15');
  const [booked, setBooked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dest = destinations.find((d) => d.id === id);

  if (!dest) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Expedition not found
        </h1>
        <Link
          href="/explore"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0552A2] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>
      </div>
    );
  }

  const totalAmount = dest.price * travelers;

  const handleBook = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0552A2] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to all expeditions</span>
      </Link>

      {/* Hero */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl border border-slate-200/90 shadow-md">
        <img
          src={dest.imageUrl}
          alt={dest.title}
          className="h-full w-full object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
        <div className="absolute bottom-6 left-5 right-5 sm:left-8 sm:right-8 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="rounded bg-[#0552A2] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {dest.category}
            </span>
            <span className="rounded bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md border border-white/20 text-white">
              {dest.difficulty} Grade
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-900/80 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
              <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
              <span>{dest.rating}</span>
              <span className="text-slate-300 font-normal text-[10px]">({dest.reviewsCount} reviews)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md text-white">
            {dest.title}
          </h1>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 font-medium">
            <MapPin className="h-3.5 w-3.5 text-[#EC1F27]" />
            <span>{dest.location}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <Clock className="h-4 w-4 text-[#0552A2]" />
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
              <p className="text-xs font-extrabold text-slate-900">
                {dest.duration}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <Mountain className="h-4 w-4 text-[#EC1F27]" />
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Altitude</p>
              <p className="text-xs font-extrabold text-slate-900">
                {dest.altitude}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Best Season</p>
              <p className="text-xs font-extrabold text-slate-900">
                {dest.bestSeason}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <Star className="h-4 w-4 text-[#FDB716]" />
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Difficulty</p>
              <p className="text-xs font-extrabold text-slate-900">
                {dest.difficulty}
              </p>
            </div>
          </div>

          {/* Overview */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900">
              Expedition Overview
            </h2>
            <p className="text-xs leading-relaxed text-slate-600">
              {dest.description}
            </p>
            <h3 className="text-xs font-bold text-slate-900 pt-1">
              Key Highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dest.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-1.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day by Day Itinerary */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900">
              Day-by-Day Itinerary
            </h2>
            <div className="space-y-3">
              {dest.itinerary.map((item) => (
                <div
                  key={item.day}
                  className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0552A2] text-xs font-black text-white">
                    D{item.day}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0552A2]">
                        {item.altitude}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Booking Card */}
        <div>
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Price per person</span>
                <p className="text-2xl font-extrabold text-[#0552A2]">
                  ${dest.price}
                </p>
              </div>
              <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Guaranteed Departure
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Travelers
                </label>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTravelers((v) => Math.max(1, v - 1))}
                      className="h-6 w-6 rounded bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 active:scale-95 text-xs"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setTravelers((v) => Math.min(12, v + 1))}
                      className="h-6 w-6 rounded bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 active:scale-95 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 space-y-1.5 text-xs border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>
                  ${dest.price} × {travelers} travelers
                </span>
                <span>${totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                <span>Total</span>
                <span className="text-[#0552A2]">${totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {booked ? (
              <div className="space-y-2">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-semibold text-emerald-800 text-center">
                  Expedition booked! View your QR pass in Bookings.
                </div>
                <Link
                  href="/bookings"
                  className="block w-full rounded-lg bg-slate-900 py-2 text-center text-xs font-bold text-white hover:bg-slate-800 active:scale-[0.98] transition-all"
                >
                  Go to My Bookings
                </Link>
              </div>
            ) : (
              <button
                onClick={handleBook}
                className="w-full rounded-lg bg-[#0552A2] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#044182] active:scale-[0.98] transition-all cursor-pointer"
              >
                Book Expedition Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Production Standard Booking Modal */}
      {dest && (
        <StandardBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pkg={{
            id: dest.id,
            title: dest.title,
            category: 'Trek',
            provider: 'Himalayan Sherpa Expeditions',
            duration: dest.duration,
            durationDays: parseInt(dest.duration) || 12,
            location: dest.location,
            basePriceNpr: dest.price * 135,
            basePriceUsd: dest.price,
            imageUrl: dest.imageUrl,
          }}
        />
      )}
    </div>
  );
}

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full px-4 py-12 text-sm text-slate-500">
          Loading expedition details...
        </div>
      }
    >
      <PackageDetailContent params={params} />
    </Suspense>
  );
}

