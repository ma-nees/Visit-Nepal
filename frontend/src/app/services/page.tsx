'use client';

import { Suspense, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Hotel as HotelIcon,
  UserCheck,
  ConciergeBell,
  ShieldCheck,
  Bus,
  Compass,
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  hotels,
  guides,
  butlers,
  permits,
  transports,
  activities,
} from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

const tabs = [
  { id: 'hotel', label: 'Stays & Lodges', icon: HotelIcon },
  { id: 'guide', label: 'Mountain Guides', icon: UserCheck },
  { id: 'butler', label: 'Sherpa Butler', icon: ConciergeBell },
  { id: 'permit', label: 'Trek Permits', icon: ShieldCheck },
  { id: 'transport', label: 'Transport & 4x4', icon: Bus },
  { id: 'activity', label: 'Adventures', icon: Compass },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'hotel';
  const [activeTab, setActiveTab] = useState(
    tabs.some((t) => t.id === initialTab) ? initialTab : 'hotel'
  );
  const { addBooking, showToast } = useApp();

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.replaceState(null, '', url.toString());
    }
  }, []);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3.5 sm:py-5 lg:py-6 space-y-3 sm:space-y-4 font-inter">
      {/* 1. Optimized & Clean Services Header */}
      <div className="relative pb-3 sm:pb-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0552A2] tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Government Verified Services • NTB 2026</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-poppins leading-tight">
              Official Travel Services &amp; <span className="text-[#0552A2]">Digital Permits</span>
            </h1>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Book certified IFMGA Sherpa guides, historic boutique tea houses, dedicated Sherpa butlers, mountain flights, and instant permits.
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-7 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-semibold">
              <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>NTB Certified</span>
            </span>

            <span className="h-7 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-800 text-[11px] font-semibold">
              <Sparkles className="h-3 w-3 text-[#0552A2] shrink-0" />
              <span>Direct Booking</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tab Strip: Smart 2x2 Grid on Mobile, Single Row on Desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`h-7.5 sm:h-8 inline-flex items-center justify-center gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                active
                  ? 'bg-[#0552A2] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hotels */}
      {activeTab === 'hotel' && (
        <div className="animate-subtle-fade-up grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4.5">
          {hotels.map((h) => (
            <div
              key={h.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs hover:border-[#0552A2]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img
                  src={h.imageUrl}
                  alt={h.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
                  <span>{h.rating}</span>
                </span>
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#0552A2]/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                  NTB Verified
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3.5 space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-[10.5px] font-semibold text-[#EC1F27] mb-1">
                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate">{h.location}</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors leading-snug line-clamp-1">
                    {h.name}
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {h.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {h.highlights.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-600 truncate max-w-[140px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 leading-none">
                      From
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0552A2] mt-0.5">
                      {h.price}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      addBooking({
                        title: `${h.name}: Standard Suite`,
                        provider: h.name,
                        category: 'Stay',
                        date: 'Nov 18 - Nov 20, 2026',
                        status: 'Confirmed',
                        amount: `$${h.priceNum * 2}`,
                        color: '#16A34A',
                        meetingPoint: `${h.location} Front Desk, 02:00 PM`,
                        assignedGuide: 'Front Desk Concierge',
                        contactPhone: '+977 1 4479488',
                      })
                    }
                    className="inline-flex items-center justify-center rounded-lg bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                  >
                    Reserve Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mountain Guides */}
      {activeTab === 'guide' && (
        <div className="animate-subtle-fade-up grid grid-cols-1 md:grid-cols-3 gap-4">
          {guides.map((g) => (
            <div
              key={g.id}
              className="flex flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#0552A2]/40 hover:shadow-md transition-all duration-200 space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={g.avatar}
                  alt={g.name}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {g.name}
                  </h2>
                  <p className="text-[11px] font-semibold text-[#0552A2]">
                    {g.role}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
                    <span>{g.rating} ({g.reviews} reviews)</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{g.bio}</p>
              <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <p>
                  <span className="font-bold text-slate-800">Experience:</span>{' '}
                  {g.experience}
                </p>
                <p>
                  <span className="font-bold text-slate-800">Summits:</span>{' '}
                  {g.summits}
                </p>
                <p className="truncate">
                  <span className="font-bold text-slate-800">Languages:</span>{' '}
                  {g.languages.join(', ')}
                </p>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#0552A2]">
                  {g.rate}
                </span>
                <button
                  onClick={() => {
                    addBooking({
                      title: `Certified Mountain Guide: ${g.name}`,
                      provider: g.role,
                      category: 'Trek',
                      date: 'Spring 2026',
                      amount: g.rate,
                      status: 'Confirmed',
                      color: '#0552A2',
                      meetingPoint: 'Kathmandu / Trailhead Base Briefing',
                      assignedGuide: g.name,
                      contactPhone: '+977 9851012345',
                    });
                    showToast(`Hired ${g.name} (${g.rate}). Added to your Bookings.`);
                  }}
                  className="rounded-lg bg-[#0552A2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Hire Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sherpa Butlers */}
      {activeTab === 'butler' && (
        <div className="animate-subtle-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {butlers.map((b) => (
            <div
              key={b.id}
              className="flex flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#0552A2]/40 hover:shadow-md transition-all duration-200 space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.avatar}
                  alt={b.name}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">
                      {b.name}
                    </h2>
                    <span className="text-sm font-extrabold text-[#0552A2]">
                      {b.rate}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-purple-700">
                    {b.role}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                    <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
                    <span>{b.rating}</span>
                    <span>•</span>
                    <span>{b.trips}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {b.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-800"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
              <button
                onClick={() =>
                  addBooking({
                    title: `Sherpa Butler Concierge: ${b.name}`,
                    provider: b.name,
                    category: 'Stay',
                    date: 'Spring 2026',
                    amount: b.rate,
                    status: 'Confirmed',
                    color: '#7E22CE',
                    meetingPoint: 'Kathmandu / Trailhead Base',
                    assignedGuide: b.name,
                    contactPhone: '+977 9851098765',
                  })
                }
                className="w-full rounded-lg bg-purple-700 py-2 text-xs font-bold text-white hover:bg-purple-800 active:scale-[0.98] transition-all cursor-pointer"
              >
                Book Sherpa Butler
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Trek Permits */}
      {activeTab === 'permit' && (
        <div className="animate-subtle-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {permits.map((p) => {
            const statusStyle =
              p.status === 'Approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : p.status === 'Under Review'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';
            return (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {p.code}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                      {p.title}
                    </h2>
                  </div>
                  <span
                    className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold ${statusStyle}`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p>
                    <span className="font-bold text-slate-800">Authority:</span>{' '}
                    {p.authority}
                  </p>
                  <p>
                    <span className="font-bold text-slate-800">Validity:</span>{' '}
                    {p.validity}
                  </p>
                  <p>
                    <span className="font-bold text-slate-800">Fee:</span>{' '}
                    {p.cost}
                  </p>
                  <p>
                    <span className="font-bold text-slate-800">Status Note:</span>{' '}
                    {p.approvalDate}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (p.status === 'Approved') {
                      const permitData = {
                        permitCode: p.code,
                        title: p.title,
                        authority: p.authority,
                        validity: p.validity,
                        fee: p.cost,
                        approvalDate: p.approvalDate,
                        traveler: 'Aayush Pradhan',
                        passportNumber: '09812401',
                        status: 'OFFICIALLY APPROVED',
                        securityVerificationToken: `NTB-VERIFY-${p.code}-2026-OK`,
                      };
                      const blob = new Blob([JSON.stringify(permitData, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `NTB-Official-Permit-${p.code}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      showToast(`Downloaded official digital permit ${p.code}. Authorized by NTB.`);
                    } else {
                      try {
                        const res = await api.permits.apply({
                          permitType: p.title as any,
                          passportNumber: '09812401',
                          route: p.title.includes('Sagarmatha') ? 'Khumbu Trail' : 'Nepal Himalaya',
                        });
                        showToast(`Application receipt #${res.permit.id} lodged with NTB officer queue.`);
                      } catch {
                        showToast(`Submitted ${p.code} to official review queue.`);
                      }
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  {p.status === 'Approved'
                    ? 'Download Official Digital Permit (QR)'
                    : 'Submit Permit Application'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Transport */}
      {activeTab === 'transport' && (
        <div className="animate-subtle-fade-up grid grid-cols-1 md:grid-cols-3 gap-4">
          {transports.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#0552A2]/40 hover:shadow-md transition-all duration-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">
                  {t.type}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <Star className="h-3 w-3 fill-[#FDB716] text-[#FDB716]" />
                  <span>{t.rating}</span>
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900">{t.title}</h2>
              <div className="space-y-0.5 text-xs text-slate-600">
                <p>Capacity: {t.seats}</p>
                <p>{t.driver}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#0552A2]">
                  {t.price}
                </span>
                <button
                  onClick={() =>
                    addBooking({
                      title: t.title,
                      provider: t.type,
                      category: 'Transport',
                      date: 'Nov 20, 2026',
                      status: 'Confirmed',
                      amount: t.price,
                      color: '#0D9488',
                      meetingPoint: 'Kathmandu / Pokhara Terminal',
                      assignedGuide: 'Verified Driver',
                      contactPhone: '+977 9801234567',
                    })
                  }
                  className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 active:scale-[0.98] transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Adventures */}
      {activeTab === 'activity' && (
        <div className="animate-subtle-fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => (
            <div
              key={a.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-[#0552A2]/40 hover:shadow-lg transition-all duration-200"
            >
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                  <Star className="h-3.5 w-3.5 fill-[#FDB716] text-[#FDB716]" />
                  <span>{a.rating}</span>
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#EC1F27]">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{a.location}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors leading-snug line-clamp-1">
                  {a.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{a.duration}</span>
                  <span>•</span>
                  <span className="truncate text-slate-600">{a.operator}</span>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Rate per person
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-[#0552A2]">
                      {a.price}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      addBooking({
                        title: a.title,
                        provider: a.operator,
                        category: 'Adventure',
                        date: 'Nov 22, 2026',
                        status: 'Confirmed',
                        amount: a.price,
                        color: '#0552A2',
                        meetingPoint: `${a.location} Departure Base`,
                        assignedGuide: a.operator,
                        contactPhone: '+977 1 4412345',
                      })
                    }
                    className="inline-flex items-center justify-center rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
                  >
                    Book Experience
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto w-full px-4 py-8 text-xs text-slate-500">
          Loading services...
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
