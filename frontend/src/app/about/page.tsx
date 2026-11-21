'use client';

import Link from 'next/link';
import {
  Mountain,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Globe2,
  TreePine,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const geographicalFacts = [
  {
    metric: '60m to 8,848.86m',
    title: 'Extreme Vertical Rise',
    desc: 'The steepest altitudinal gradient on Earth, spanning tropical jungle plains to the pinnacle of Sagarmatha within less than 150 km.',
  },
  {
    metric: '8 of 14 Summits',
    title: 'World’s Eight-Thousanders',
    desc: 'Home to the majority of Earth’s highest peaks: Everest, Kanchenjunga, Lhotse, Makalu, Cho Oyu, Dhaulagiri, Manaslu, and Annapurna.',
  },
  {
    metric: '12 Bioclimates',
    title: 'Unrivaled Diversity',
    desc: 'From dense subtropical rainforests and temperate pine hills to alpine tundra, glacial moraines, and arctic high-altitude zones.',
  },
  {
    metric: '125+ Communities',
    title: 'Living Cultural Tapestry',
    desc: 'Over 125 distinct ethnic groups with more than 120 recorded spoken languages and harmonious syncretic spiritual practices.',
  },
];

const pillarsOfIdentity = [
  {
    title: 'Himalayan Geography & Rivers',
    tag: 'Physical Landscape',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop&auto=format',
    text: 'Nepal occupies 147,516 square kilometers along the central crest of the Great Himalayan Arc. Three primary east-west river systems—the Koshi, Gandaki, and Karnali—originate in Tibetan glaciers, slicing through massive gorges before joining the sacred Ganges.',
  },
  {
    title: 'Biodiversity & Wildlife Havens',
    tag: 'Natural Ecology',
    image:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=85',
    text: 'Despite occupying merely 0.1% of global land surface, Nepal shelters over 9% of all bird species, 4.5% of mammal species, and more than 6,000 flowering plant varieties. It is one of the world’s greatest sanctuaries for the endangered one-horned rhinoceros and elusive snow leopard.',
  },
  {
    title: 'Harmonious Spiritual Syncretism',
    tag: 'Spiritual Legacy',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=85',
    text: 'Nepal is unique for its seamless harmony between Hinduism and Vajrayana Buddhism. Ancient temples and Buddhist stupas often stand side-by-side in Kathmandu courtyards, revered simultaneously by worshippers of both traditions.',
  },
  {
    title: 'Sustainable Tourism & Fair Sherpa Wages',
    tag: 'Our Commitment',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    text: 'Visit Nepal works to promote responsible mountain stewardship: strictly enforcing weight limits and fair insurance for porters, eliminating single-use plastics along trail corridors, and supporting local alpine village micro-economies.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FFFFFF] text-[#10243A] selection:bg-[#0552A2] selection:text-white">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-[#031526] text-white pt-16 sm:pt-20 pb-8 sm:pb-12 border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&auto=format&fm=webp&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031526] via-transparent to-[#031526]/80" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#92C4EA] inline-flex items-center gap-2">
            Official Country Overview
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
            About Nepal
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-normal font-inter max-w-2xl leading-relaxed">
            Where Earth’s highest glaciated pinnacles rise above sacred ancient kingdoms and subtropical wilderness. Discover our geography, people, and environmental stewardship.
          </p>
        </div>
      </section>

      {/* 2. Numeric Dimension Grid */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 border-b border-slate-100">
        <ScrollReveal direction="up" duration={650} distance={20}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {geographicalFacts.map((fact) => (
              <div key={fact.title} className="space-y-1">
                <span className="text-2xl sm:text-3xl font-inter font-semibold text-[#0552A2] block">
                  {fact.metric}
                </span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#10243A] font-inter">
                  {fact.title}
                </h3>
                <p className="text-xs text-slate-500 font-normal font-inter leading-relaxed">
                  {fact.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Four Core Dimensions of Nepal */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-10 sm:py-16 space-y-10 sm:space-y-14">
        {pillarsOfIdentity.map((pillar, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <ScrollReveal key={pillar.title} direction="up" duration={700} distance={24}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${isEven ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                {/* Visual Image */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                  </div>
                </div>

                {/* Narrative */}
                <div className={`lg:col-span-6 space-y-3.5 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="text-[#0552A2] font-semibold uppercase tracking-wider">{pillar.tag}</span>
                    <span>Dimension {String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#10243A] tracking-tight">
                    {pillar.title}
                  </h2>
                  <p className="text-sm text-slate-600 font-normal font-inter leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      {/* 4. Practical Travel Essentials */}
      <section className="bg-[#F7F9FC] py-10 sm:py-14 border-t border-slate-200/60">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Planning Essentials
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-medium text-[#10243A]">
              Practical Information for Travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0552A2] font-bold">Entry &amp; Visas</span>
              <h3 className="font-inter text-lg font-semibold text-[#10243A]">On-Arrival Tourist Visas</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                Most nationalities can obtain a tourist visa upon arrival at Tribhuvan International Airport (TIA) in Kathmandu for 15, 30, or 90 days with online pre-application.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#0552A2] font-bold">Currency &amp; Payments</span>
              <h3 className="font-inter text-lg font-semibold text-[#10243A]">Nepali Rupee (NPR)</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                Major credit cards are accepted in Kathmandu and Pokhara hotels. Carry sufficient cash rupees when trekking in high alpine tea house regions.
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#EC1F27] font-bold">Safety &amp; Emergency</span>
              <h3 className="font-inter text-lg font-semibold text-[#10243A]">24/7 Tourist Police: 1144</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                Dedicated emergency and tourist protection assistance desk with immediate medical helicopter dispatch coordination across all mountain trails.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
