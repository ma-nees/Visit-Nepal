'use client';

import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  BedDouble,
  BellRing,
  Mic,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SchedulePage() {
  const { scheduleDays, toggleDayComplete } = useApp();
  const [selectedDay, setSelectedDay] = useState(scheduleDays[0]?.day || 1);

  const currentDay =
    scheduleDays.find((d) => d.day === selectedDay) || scheduleDays[0];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Header Banner: Compact, clean */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#031526] via-[#053568] to-[#031526] p-6 sm:p-8 text-white border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-[#92C4EA]">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Active Expedition Roadmap 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Daily Expedition Schedule &amp; Acclimatization Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Track daily altitude gains, morning briefing notes, teahouse confirmations, and mountain weather advisories.
          </p>
        </div>
      </div>

      {/* Day Selector Strip: Responsive 14-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {scheduleDays.map((day) => {
          const active = day.day === selectedDay;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-150 active:scale-[0.98] ${
                active
                  ? 'border-[#0552A2] bg-[#0552A2] text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
              }`}
            >
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    active ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  Day {day.day} • {day.date}
                </p>
                <p className="mt-0.5 text-xs sm:text-sm font-bold">{day.title}</p>
              </div>
              {day.completed ? (
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    active ? 'text-[#FDB716]' : 'text-emerald-500'
                  }`}
                />
              ) : (
                <Circle
                  className={`h-4 w-4 shrink-0 ${
                    active ? 'text-blue-200' : 'text-slate-300'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {currentDay && (
        <div key={currentDay.day} className="animate-subtle-fade-up grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stay, Alarm & Audio Note */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Day {currentDay.day} Logistics
                </h2>
                <button
                  onClick={() => toggleDayComplete(currentDay.day)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-150 active:scale-[0.96] ${
                    currentDay.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentDay.completed ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <span>Mark Completed</span>
                  )}
                </button>
              </div>

              <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-2.5 flex items-start gap-2.5">
                <BedDouble className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">
                    Overnight Stay
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    {currentDay.stay}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50/70 border border-amber-100 p-2.5 flex items-start gap-2.5">
                <BellRing className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">
                    Wake-up Alarm
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    {currentDay.alarm}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 flex items-start gap-2.5">
                <Mic className="h-4 w-4 text-[#EC1F27] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">
                    Acclimatization &amp; Gear Note
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentDay.audioNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 mb-3">
              Timeline: {currentDay.title}
            </h2>
            <div className="space-y-2.5">
              {currentDay.events.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3"
                >
                  <div className="flex items-center gap-1 text-xs font-bold text-[#0552A2] w-20 shrink-0 pt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{ev.time}</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {ev.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
