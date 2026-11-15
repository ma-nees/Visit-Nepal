'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  Mountain,
  Hotel,
  UserCheck,
  ConciergeBell,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { hotels, guides, butlers } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

interface CustomDay {
  day: number;
  title: string;
  altitude: string;
  notes: string;
}

export default function CustomTripPlannerPage() {
  const { addBooking } = useApp();

  // Step 1: Destination & Duration
  const [region, setRegion] = useState('Everest (Solukhumbu)');
  const [durationDays, setDurationDays] = useState(10);
  const [travelersCount, setTravelersCount] = useState(2);
  const [startDate, setStartDate] = useState('2026-11-20');

  // Step 2: Selected Custom Services
  const [selectedHotel, setSelectedHotel] = useState<string>(hotels[0].id);
  const [selectedGuide, setSelectedGuide] = useState<string>(guides[0].id);
  const [includeButler, setIncludeButler] = useState<boolean>(true);
  const [selectedButler, setSelectedButler] = useState<string>(butlers[0].id);
  const [transportType, setTransportType] = useState<string>('Domestic Mountain Flight (Buddha Air)');
  const [needPermits, setNeedPermits] = useState<boolean>(true);

  // Step 3: Custom Itinerary Days
  const [customDays, setCustomDays] = useState<CustomDay[]>([
    { day: 1, title: 'Arrival in Kathmandu & Gear Check', altitude: '1,400m', notes: 'Hotel check-in and briefing with lead guide' },
    { day: 2, title: 'Scenic Mountain Flight & Trailhead Start', altitude: '2,610m', notes: 'Fly to mountain airstrip and begin gentle trek' },
    { day: 3, title: 'Acclimatization & Ridge Exploration', altitude: '3,440m', notes: 'Hike to panoramic viewpoint for Everest and Ama Dablam' },
    { day: 4, title: 'Monastery Visit & High Alpine Trek', altitude: '3,860m', notes: 'Receive traditional blessing and teahouse rest' },
  ]);

  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayAlt, setNewDayAlt] = useState('');
  const [booked, setBooked] = useState(false);

  const addCustomDay = () => {
    if (!newDayTitle.trim()) return;
    const nextDayNum = customDays.length + 1;
    setCustomDays((prev) => [
      ...prev,
      {
        day: nextDayNum,
        title: newDayTitle.trim(),
        altitude: newDayAlt.trim() || '3,000m',
        notes: 'Custom planned day',
      },
    ]);
    setNewDayTitle('');
    setNewDayAlt('');
  };

  const removeCustomDay = (dayNum: number) => {
    setCustomDays((prev) =>
      prev.filter((d) => d.day !== dayNum).map((d, idx) => ({ ...d, day: idx + 1 }))
    );
  };

  // Cost calculation
  const chosenHotel = hotels.find((h) => h.id === selectedHotel) || hotels[0];
  const chosenGuide = guides.find((g) => g.id === selectedGuide) || guides[0];
  const chosenButler = butlers.find((b) => b.id === selectedButler) || butlers[0];

  const hotelCost = chosenHotel.priceNum * 3;
  const guideCost = chosenGuide.rateNum * durationDays;
  const butlerCost = includeButler ? 45 * durationDays : 0;
  const transportCost = transportType.includes('Flight') ? 115 * travelersCount : 120 * 2;
  const permitsCost = needPermits ? 40 * travelersCount : 0;
  const baseTrekLogistics = 400 * travelersCount;

  const totalEstimatedCost = (
    hotelCost +
    guideCost +
    butlerCost +
    transportCost +
    permitsCost +
    baseTrekLogistics
  );

  const handleCreateAndBook = async () => {
    const totalNpr = totalEstimatedCost * 135; // Convert USD base to NPR
    await addBooking({
      title: `Custom Expedition: ${region} (${durationDays} Days)`,
      provider: 'Himalayan Sherpa Expeditions',
      category: 'Trek',
      date: `${startDate} (${durationDays} Days)`,
      status: 'Confirmed',
      amount: `NPR ${totalNpr.toLocaleString()}`,
      color: '#0552A2',
      meetingPoint: 'Tribhuvan International Airport (TIA) Terminal 2',
      assignedGuide: `${chosenGuide.name} (IFMGA)`,
      contactPhone: '+977 1 4412345',
    });

    // Also persist custom plan to backend
    try {
      await api.customPlans.save({
        title: `Custom Expedition: ${region} (${durationDays} Days)`,
        destinations: [region.toLowerCase().replace(/[^a-z0-9]/g, '-')],
        startDate,
        durationDays,
        trekkingDifficulty: 'Moderate',
        estimatedBudgetNpr: totalNpr,
        accommodationPreference: chosenHotel.name,
        guideRequested: true,
        transportRequested: true,
        butlerRequested: includeButler,
        itinerary: customDays.map((d) => ({
          day: d.day,
          destination: region,
          activity: d.title,
          elevation: d.altitude,
        })),
        status: 'submitted',
      });
    } catch (err) {
      console.warn('Custom plan saved to local state');
    }

    setBooked(true);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner: Compact, clean */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0552A2] via-[#064385] to-slate-900 p-6 sm:p-8 text-white border border-white/10">
        <div className="max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <Sparkles className="h-3.5 w-3.5 text-[#FDB716]" />
            <span>Tailor-Made Himalayan Journeys 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Build Your Custom Nepal Trip Plan
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
            Choose your preferred region, handpick certified mountain guides, select luxury heritage hotels or authentic teahouses, and build your own daily trail milestones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Region & General Scope */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#0552A2]" />
              <h2 className="text-base font-extrabold text-slate-900">
                1. Region, Dates &amp; Travelers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination / Trekking Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Everest (Solukhumbu)">Everest Region (Solukhumbu)</option>
                  <option value="Annapurna Circuit & Sanctuary">Annapurna Circuit & Sanctuary</option>
                  <option value="Upper Mustang Forbidden Kingdom">Upper Mustang Forbidden Kingdom</option>
                  <option value="Langtang Valley & Glaciers">Langtang Valley & Glaciers</option>
                  <option value="Chitwan Wildlife & Jungle">Chitwan Wildlife & Jungle</option>
                  <option value="Manaslu Circuit (Restricted)">Manaslu Circuit (Restricted)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trip Duration ({durationDays} Days)
                </label>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-[#0552A2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Travelers ({travelersCount} Pax)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 4, 6, 8].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setTravelersCount(count)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${travelersCount === count
                        ? 'bg-[#0552A2] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Custom Service Add-ons */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#0552A2]" />
              <h2 className="text-base font-extrabold text-slate-900">
                2. Select Dedicated Guide, Stay &amp; Services
              </h2>
            </div>

            {/* Guide Pick */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Certified Mountain Guide
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {guides.map((g) => {
                  const active = selectedGuide === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGuide(g.id)}
                      className={`rounded-xl border p-2.5 text-left transition-colors ${active
                        ? 'border-[#0552A2] bg-blue-50/70 ring-1 ring-[#0552A2]'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={g.avatar}
                          alt={g.name}
                          loading="lazy"
                          decoding="async"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {g.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{g.rate}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotel / Stay Pick */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Base Camp &amp; Valley Stays
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hotels.map((h) => {
                  const active = selectedHotel === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setSelectedHotel(h.id)}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-colors ${active
                        ? 'border-[#0552A2] bg-blue-50/70 ring-1 ring-[#0552A2]'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <img
                        src={h.imageUrl}
                        alt={h.name}
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">
                          {h.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{h.location}</p>
                        <p className="text-xs font-extrabold text-[#0552A2]">{h.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sherpa Butler & Transport Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => setIncludeButler((v) => !v)}
                className={`cursor-pointer rounded-xl border p-3 transition-colors ${includeButler
                  ? 'border-purple-600 bg-purple-50/70'
                  : 'border-slate-200 bg-white'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ConciergeBell className="h-4 w-4 text-purple-700" />
                    <span className="text-xs font-bold text-slate-900">
                      Include Sherpa Butler
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeButler}
                    onChange={() => { }}
                    className="h-3.5 w-3.5 accent-purple-600"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Luggage handling, teahouse room reservations, hot tea service.
                </p>
              </div>

              <div
                onClick={() => setNeedPermits((v) => !v)}
                className={`cursor-pointer rounded-xl border p-3 transition-colors ${needPermits
                  ? 'border-emerald-600 bg-emerald-50/70'
                  : 'border-slate-200 bg-white'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-900">
                      Trek Permits Included
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={needPermits}
                    onChange={() => { }}
                    className="h-3.5 w-3.5 accent-emerald-600"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Auto-process TIMS &amp; National Park passes through NTB Admin.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3: Custom Itinerary Builder */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0552A2]" />
                <h2 className="text-base font-extrabold text-slate-900">
                  3. Customize Your Daily Itinerary
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {customDays.length} Planned Days
              </span>
            </div>

            <div className="space-y-2">
              {customDays.map((d) => (
                <div
                  key={d.day}
                  className="flex items-start justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0552A2] text-xs font-extrabold text-white">
                      D{d.day}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{d.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Target Altitude: <span className="font-semibold text-blue-700">{d.altitude}</span> • {d.notes}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCustomDay(d.day)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove day"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Custom Milestone */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Day Milestone (e.g. Summit Kala Patthar)"
                value={newDayTitle}
                onChange={(e) => setNewDayTitle(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
              />
              <input
                type="text"
                placeholder="Altitude (e.g. 5,545m)"
                value={newDayAlt}
                onChange={(e) => setNewDayAlt(e.target.value)}
                className="w-full sm:w-32 rounded-lg border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
              />
              <button
                type="button"
                onClick={addCustomDay}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Day</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right: Live Price Breakdown & Checkout */}
        <div>
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Custom Plan Summary
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {region}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {durationDays} Days • {travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'} • Starts {startDate}
              </p>
            </div>

            {/* Itemized Calculation */}
            <div className="space-y-2 border-t border-b border-slate-100 py-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected Guide ({chosenGuide.name}):</span>
                <span className="font-semibold">${guideCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Valley / Teahouse Stays ({chosenHotel.name}):</span>
                <span className="font-semibold">${hotelCost}</span>
              </div>
              {includeButler && (
                <div className="flex justify-between text-purple-700 font-medium">
                  <span>Sherpa Butler Service:</span>
                  <span>${butlerCost}</span>
                </div>
              )}
              {needPermits && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Digital Trekking Permits:</span>
                  <span>${permitsCost}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Domestic Flights / Transport:</span>
                <span className="font-semibold">${transportCost}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Porters &amp; Trail Logistics:</span>
                <span className="font-semibold">${baseTrekLogistics}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Total Custom Package</span>
                <p className="text-2xl font-extrabold text-[#0552A2]">
                  ${totalEstimatedCost.toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                ~${Math.round(totalEstimatedCost / travelersCount).toLocaleString()} / person
              </span>
            </div>

            {booked ? (
              <div className="space-y-2">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs font-semibold text-emerald-800 text-center">
                  Custom trip booked! Check your itinerary in Bookings.
                </div>
                <Link
                  href="/bookings"
                  prefetch={true}
                  className="block w-full rounded-lg bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-slate-800"
                >
                  View My Custom Booking
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCreateAndBook}
                className="w-full rounded-lg bg-[#EC1F27] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#d11920] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Confirm Custom Plan &amp; Book</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            <p className="text-center text-[10px] text-slate-400">
              Includes safety gear check, insurance coordination, and NTB compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
