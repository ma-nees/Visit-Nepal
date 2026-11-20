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
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { destinations } from '@/data/mockData';
import { getScaleDestinations } from '@/data/scaleCatalog';
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

  const dest =
    destinations.find((d) => d.id === id) ||
    getScaleDestinations(1000).find((d) => d.id === id);

  if (!dest) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center font-inter">
        <h1 className="text-2xl font-bold text-slate-900 font-poppins">
          Expedition Not Found
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          The requested Himalayan route could not be found in the official registry.
        </p>
        <Link
          href="/explore"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#044182] transition-all shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to All Expeditions</span>
        </Link>
      </div>
    );
  }

  const totalAmount = dest.price * travelers;

  const handleBook = () => {
    setIsModalOpen(true);
  };

  // Curated secondary accent image for editorial depth
  const secondaryImageUrl =
    dest.id.includes('ebc') || dest.id.includes('everest')
      ? 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
      : dest.id.includes('annapurna')
      ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
      : dest.id.includes('langtang')
      ? 'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-inter text-slate-900 antialiased">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-[#0552A2] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Expeditions</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {dest.title}
            </span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] font-semibold text-emerald-800">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>NTB Verified Route</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          1. SOPHISTICATED EDITORIAL HERO (Balanced 2-Column Composition)
          ========================================================================= */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Column: Package Typography & Key Parameters (~56% width) */}
            <div className="w-full lg:w-[56%] space-y-4">
              {/* Category, Difficulty & Rating Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#0552A2] px-2.5 py-1 text-[11px] font-semibold text-white tracking-wide">
                  {dest.category}
                </span>
                <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                  {dest.difficulty} Grade
                </span>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
                  <Star className="h-3.5 w-3.5 fill-[#FDB716] text-[#FDB716]" />
                  <span>{dest.rating}</span>
                  <span className="text-slate-400 font-normal text-[10px]">({dest.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Package Heading */}
              <h1 className="font-poppins text-2xl sm:text-3xl lg:text-[34px] font-semibold text-slate-900 tracking-tight leading-tight">
                {dest.title}
              </h1>

              {/* Geographic Region Kicker */}
              <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#EC1F27]">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{dest.location}</span>
              </p>

              {/* Refined Minimal Horizontal Specs Strip (Replaces 4 bulky cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-slate-900 block font-poppins">
                    {dest.duration}
                  </span>
                </div>

                <div className="space-y-0.5 sm:border-l sm:border-slate-100 sm:pl-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Mountain className="h-3 w-3 text-slate-400" />
                    Max Altitude
                  </span>
                  <span className="font-semibold text-slate-900 block font-poppins">
                    {dest.altitude}
                  </span>
                </div>

                <div className="space-y-0.5 sm:border-l sm:border-slate-100 sm:pl-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    Best Season
                  </span>
                  <span className="font-semibold text-slate-900 block truncate" title={dest.bestSeason}>
                    {dest.bestSeason}
                  </span>
                </div>

                <div className="space-y-0.5 sm:border-l sm:border-slate-100 sm:pl-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Compass className="h-3 w-3 text-slate-400" />
                    Difficulty
                  </span>
                  <span className="font-semibold text-slate-900 block">
                    {dest.difficulty}
                  </span>
                </div>
              </div>

              {/* Editorial Intro Excerpt */}
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {dest.description}
              </p>
            </div>

            {/* Right Column: Destination Imagery with Visual Depth (~44% width) */}
            <div className="w-full lg:w-[44%] shrink-0 relative pt-2 pb-4 sm:pb-5">
              {/* Primary Main Image (Compact 320–360px height) */}
              <div className="relative h-[280px] sm:h-[340px] lg:h-[350px] w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-950 group">
                <img
                  src={dest.imageUrl}
                  alt={dest.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                />

                {/* Floating Altitude / Telemetry Tag */}
                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-md text-[10.5px] font-mono text-white border border-white/15">
                  <Mountain className="h-3 w-3 text-[#FDB716]" />
                  <span>Apex: {dest.altitude}</span>
                </div>
              </div>

              {/* Secondary Overlapping Image for Visual Depth */}
              <div className="absolute -bottom-1 left-4 sm:left-6 w-36 sm:w-44 h-24 sm:h-28 rounded-xl overflow-hidden border-2 border-white shadow-md z-10 hidden sm:block group">
                <img
                  src={secondaryImageUrl}
                  alt="Himalayan Waypoint"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[9.5px] font-medium font-inter text-white tracking-wide">
                    Waypoints &amp; Lodging
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN CONTENT STAGE (Two-Column Balanced Grid)
          ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Itinerary, Highlights & Expedition Notes (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Highlights */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="font-poppins text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0552A2]" />
                <span>Expedition Highlights</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                {dest.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-poppins text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#0552A2]" />
                  <span>Day-by-Day Itinerary</span>
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  {dest.itinerary.length} Expedition Stages
                </span>
              </div>

              {/* Connected Timeline */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-100 space-y-6">
                {dest.itinerary.map((item) => (
                  <div key={item.day} className="relative group">
                    {/* Timeline Node Badge */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#0552A2] text-white text-[11px] font-bold font-mono shadow-xs border-2 border-white">
                      D{item.day}
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-1.5 hover:border-slate-300 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-poppins text-sm font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        {item.altitude && (
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#0552A2] border border-blue-100">
                            {item.altitude}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included & Official Logistics */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="font-poppins text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Expedition Logistics &amp; Inclusions</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Licensed IFMGA / NMA mountain leader and guide team</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>All TIMS Trekking Cards &amp; National Park conservation permits</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Traditional alpine teahouse lodging &amp; full mountain board</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Satellite communication &amp; 24/7 Medevac emergency dispatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Sidebar (4 Columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
              {/* Price Header */}
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Price per person
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-poppins text-3xl font-bold text-[#0552A2] tracking-tight">
                      ${dest.price}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">USD</span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-semibold text-emerald-800">
                  Guaranteed Departure
                </span>
              </div>

              {/* Booking Controls */}
              <div className="space-y-4">
                {/* Date Selection */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0552A2] focus:border-[#0552A2] transition-all"
                  />
                </div>

                {/* Travelers Stepper */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Travelers
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTravelers((v) => Math.max(1, v - 1))}
                        className="h-7 w-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 active:scale-95 text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setTravelers((v) => Math.min(12, v + 1))}
                        className="h-7 w-7 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 active:scale-95 text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="rounded-xl bg-slate-50 p-4 space-y-2 border border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>${dest.price} × {travelers} travelers</span>
                  <span className="font-medium">${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/80 pt-2 text-sm">
                  <span>Total Amount</span>
                  <span className="text-[#0552A2] font-poppins">${totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              {booked ? (
                <div className="space-y-2">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 text-center">
                    Expedition booked! View your digital pass in Bookings.
                  </div>
                  <Link
                    href="/bookings"
                    className="block w-full rounded-xl bg-slate-900 py-3 text-center text-xs font-semibold text-white hover:bg-slate-800 active:scale-[0.98] transition-all"
                  >
                    Go to My Bookings
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBook}
                  className="w-full rounded-xl bg-[#0552A2] hover:bg-[#044182] py-3 text-xs font-semibold tracking-wide text-white shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                >
                  Book Expedition Now
                </button>
              )}

              {/* Trust Indicators */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
                  <span>Licensed Nepal Tourism Board Operator</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Flexible date rescheduling up to 14 days prior</span>
                </div>
              </div>
            </div>
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
        <div className="w-full px-4 py-16 text-center text-xs text-slate-500 font-inter">
          Loading expedition details...
        </div>
      }
    >
      <PackageDetailContent params={params} />
    </Suspense>
  );
}
