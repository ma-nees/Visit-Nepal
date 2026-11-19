'use client';

import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  MapPin,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const heritagePillars = [
  {
    title: 'UNESCO World Heritage Monuments',
    tag: 'Kathmandu Valley',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1200&q=85',
    description:
      'Within a radius of barely twenty kilometers, seven monumental ensembles represent the architectural and artistic pinnacle of Newari civilization across centuries.',
    sites: [
      'Boudhanath Stupa — One of the largest spherical stupas in the world',
      'Pashupatinath Temple — Fifth-century holy sanctum on the sacred Bagmati River',
      'Bhaktapur Durbar Square — The preserved City of Devotees and 55-Window Palace',
      'Patan Durbar Square & Museum — Living center of bronze and stone artistry',
      'Swayambhunath — The ancient hilltop monkey temple overlooking the valley',
      'Changu Narayan — The oldest documented temple in Nepal with 5th-century inscriptions',
    ],
  },
  {
    title: 'Master Crafts: Thangkas, Bronze & Wood',
    tag: 'Living Guilds',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
    description:
      'In the quiet courtyards of Patan and Bhaktapur, master artisans practice sacred crafts passed down uninterrupted through dozens of generations.',
    sites: [
      'Mineral Pigment Thangka Painting on stretched cotton and silk',
      'Lost-Wax Bronze Sculpture casting of celestial Buddhist and Hindu deities',
      'Hand-Hammered Seven-Metal Himalayan Singing Bowls tuned to healing frequencies',
      'Intricate Newar Woodcarving of mythical peacocks, toranas, and roof struts',
    ],
  },
  {
    title: 'Sacred Himalayan Festivals & Masked Dances',
    tag: 'Living Rituals',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=85',
    description:
      'Festivals in Nepal are not theatrical reenactments—they are vibrant, dynamic community events where the boundary between gods and humans dissolves.',
    sites: [
      'Mani Rimdu (Autumn) — 3-day masked Cham dances at Tengboche & Chiwong Monasteries',
      'Indra Jatra (September) — Colossal chariot procession of the Living Goddess Kumari',
      'Tihar / Deepawali (October/November) — Festival of lights celebrating animals and kinship',
      'Bisket Jatra (April) — Dramatic tug-of-war chariot battles welcoming the Nepali New Year',
    ],
  },
  {
    title: 'Himalayan Mountain Communities',
    tag: 'Ancestral Kinship',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    description:
      'Over 125 distinct ethnic groups form Nepal’s cultural mosaic. In the high peaks, Sherpa communities maintain Buddhist gompas and mountain stewardship.',
    sites: [
      'The Sherpas of the Khumbu — Legendary high-altitude mountaineers and Buddhist guardians',
      'The Gurungs of the Annapurnas — Famous for stone villages, honey hunting, and brave heritage',
      'The Tamangs of Langtang & Helambu — Rich weaving, horse culture, and Buddhist shamanism',
      'The Tharus of the Southern Terai — Indigenous jungle foresters with distinct clay wall murals',
    ],
  },
];

export default function CulturePage() {
  return (
    <div className="bg-[#FFFFFF] text-[#10243A] selection:bg-[#0552A2] selection:text-white">
      {/* 1. Header Hero Banner */}
      <section className="relative overflow-hidden bg-[#031526] text-white pt-16 sm:pt-20 pb-8 sm:pb-12 border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1920&fm=webp&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031526] via-transparent to-[#031526]/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#92C4EA] inline-flex items-center gap-2">
            Cultural Anthology
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
            Culture &amp; Living Heritage
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-normal font-inter max-w-2xl leading-relaxed">
            Where sacred rituals, master craftsmanship, and architectural wonders endure across millennia. Explore the spiritual and artistic soul of Nepal.
          </p>
        </div>
      </section>

      {/* 2. Four Deep Heritage Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-14">
        {heritagePillars.map((pillar, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <ScrollReveal key={pillar.title} direction="up" duration={700} distance={24}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Visual Image Panel */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[16/11] rounded-3xl overflow-hidden bg-slate-900 shadow-xl group">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono">
                      {pillar.tag}
                    </div>
                  </div>
                </div>

                {/* Text Narrative */}
                <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-1' : ''}`}>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#0552A2] font-semibold">
                      Heritage Dimension {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-poppins text-3xl sm:text-4xl font-medium text-[#10243A] tracking-tight mt-1">
                      {pillar.title}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 font-normal font-inter leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                      Notable Sites &amp; Expressions
                    </span>
                    <ul className="space-y-2">
                      {pillar.sites.map((site) => (
                        <li key={site} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-normal font-inter">
                          <span className="text-[#FDB716] text-base leading-none mt-0.5">•</span>
                          <span>{site}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/explore?cat=Cultural"
                      className="inline-flex items-center gap-2 text-xs font-medium font-inter text-[#0552A2] hover:underline"
                    >
                      <span>Explore cultural routes &amp; temple tours</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      {/* 3. Cultural Etiquette & Responsible Tourism Strip */}
      <section className="bg-[#F7F9FC] py-10 sm:py-14 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Responsible Travel
            </span>
            <h2 className="font-poppins text-xl sm:text-2xl font-medium text-[#10243A]">
              Respecting Sacred Traditions &amp; Shrines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-1.5">
              <h3 className="font-inter text-lg font-semibold text-[#10243A]">Clockwise Circumambulation</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                Always walk clockwise around Buddhist stupas, chortens, and mani prayer walls to honor centuries of sacred custom.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-2">
              <h3 className="font-inter text-lg font-semibold text-[#10243A]">Temple Attire &amp; Footwear</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                Remove footwear and leather items before entering sacred shrines. Dress modestly with shoulders and knees respectfully covered.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-2">
              <h3 className="font-inter text-lg font-semibold text-[#10243A]">Fair Artisan Trade</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                Support traditional craft communities by purchasing certified hand-painted Thangkas and singing bowls directly from master workshops.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
