'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mountain,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Compass,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import InteractiveMap from '@/components/InteractiveMap';

interface DestinationItem {
  id: string;
  name: string;
  category: 'High Himalaya' | 'Cultural Valley' | 'Ancient Kingdom' | 'Wildlife & Plains' | 'Alpine Lake';
  region: string;
  altitude: string;
  bestSeason: string;
  duration: string;
  image: string;
  tag: string;
  description: string;
  highlights: string[];
  link: string;
}

const allDestinations: DestinationItem[] = [
  {
    id: 'everest-region',
    name: 'Everest Region (Khumbu)',
    category: 'High Himalaya',
    region: 'Eastern Nepal',
    altitude: '2,800m – 8,848m',
    bestSeason: 'Mar – May, Oct – Dec',
    duration: '12 – 20 Days',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
    tag: 'Crown of the World',
    description:
      'The legendary homeland of the Sherpa people and the colossal amphitheater of Sagarmatha, Lhotse, and Ama Dablam.',
    highlights: ['Everest Base Camp', 'Kala Patthar Summit', 'Tengboche Monastery', 'Gokyo Turquoise Lakes'],
    link: '/explore/dest_ebc',
  },
  {
    id: 'annapurna-sanctuary',
    name: 'Annapurna Sanctuary & Circuit',
    category: 'High Himalaya',
    region: 'Central Nepal',
    altitude: '1,400m – 5,416m',
    bestSeason: 'Sep – Nov, Mar – May',
    duration: '10 – 18 Days',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    tag: 'Alpine Amphitheater',
    description:
      'A complete circumambulation of the Annapurna massif, crossing the sub-zero Thorong La Pass and stepping into natural stone arenas.',
    highlights: ['Thorong La Pass', 'Annapurna Base Camp', 'Poon Hill Sunrise', 'Mardi Himal Crest'],
    link: '/explore/dest_annapurna',
  },
  {
    id: 'upper-mustang',
    name: 'Upper Mustang',
    category: 'Ancient Kingdom',
    region: 'Trans-Himalayan Rainshadow',
    altitude: '2,800m – 3,840m',
    bestSeason: 'May – Oct (Monsoon-Free)',
    duration: '10 – 14 Days',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
    tag: 'Walled Kingdom of Lo',
    description:
      'A mystical desert plateau of ochre canyons, preserved 14th-century Buddhist monasteries, and ancient wind-sculpted sky caves.',
    highlights: ['Walled City of Lo Manthang', 'Chhoser Sky Caves', 'Red Fluted Cliffs', 'Muktinath Holy Shrine'],
    link: '/explore?q=Mustang',
  },
  {
    id: 'kathmandu-valley',
    name: 'Kathmandu Valley',
    category: 'Cultural Valley',
    region: 'Central Basin',
    altitude: '1,400m',
    bestSeason: 'Year-Round',
    duration: '3 – 7 Days',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1200&q=85',
    tag: 'UNESCO Cultural Heart',
    description:
      'Seven UNESCO World Heritage monument zones clustered in one ancient basin. Intricate Newar wood carvings, sacred stupas, and medieval courtyards.',
    highlights: ['Boudhanath Stupa Mandala', 'Pashupatinath Temple', 'Bhaktapur Durbar Square', 'Patan Museum'],
    link: '/explore?q=Kathmandu',
  },
  {
    id: 'pokhara-valley',
    name: 'Pokhara & Phewa Lake',
    category: 'Alpine Lake',
    region: 'Western Foothills',
    altitude: '822m',
    bestSeason: 'Oct – Apr',
    duration: '3 – 5 Days',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    tag: 'Lake of Reflections',
    description:
      'Tranquil waters mirroring the majestic fishtail peak of Machapuchare. Nepal’s premier adventure capital and leisure haven.',
    highlights: ['Phewa Lake Wooden Boats', 'Sarangkot Dawn Panorama', 'World Peace Pagoda', 'Begnas Lake'],
    link: '/explore?q=Pokhara',
  },
  {
    id: 'chitwan-national-park',
    name: 'Chitwan National Park',
    category: 'Wildlife & Plains',
    region: 'Southern Terai',
    altitude: '150m',
    bestSeason: 'Oct – Mar',
    duration: '3 – 4 Days',
    image:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=85',
    tag: 'Subtropical Jungle',
    description:
      'Dense sal forests and meandering river systems safeguarding the endangered one-horned rhinoceros, Royal Bengal tigers, and gharials.',
    highlights: ['Jeep Jungle Safari', 'Canoeing Rapti River', 'Bird Watching (500+ species)', 'Tharu Heritage'],
    link: '/explore?q=Chitwan',
  },
  {
    id: 'lumbini',
    name: 'Lumbini Sacred Garden',
    category: 'Cultural Valley',
    region: 'Southwestern Plains',
    altitude: '150m',
    bestSeason: 'Oct – Mar',
    duration: '2 – 3 Days',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=85',
    tag: 'Birthplace of Lord Buddha',
    description:
      'The sacred birthplace of Siddhartha Gautama. A sanctuary of peace containing archaeological ruins dating back to Emperor Ashoka in 249 BCE.',
    highlights: ['Maya Devi Temple Marker', 'Ashoka Pillar', 'International Monastic Zone', 'Eternal Peace Flame'],
    link: '/explore?q=Lumbini',
  },
  {
    id: 'rara-lake',
    name: 'Rara Lake & Karnali',
    category: 'Alpine Lake',
    region: 'Far-Western Highlands',
    altitude: '2,990m',
    bestSeason: 'Apr – Jun, Sep – Nov',
    duration: '6 – 9 Days',
    image:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=85',
    tag: 'Queen of High Lakes',
    description:
      'The largest and deepest natural freshwater lake in Nepal, encircled by coniferous pine forests and snowy summits in the remote Karnali wilderness.',
    highlights: ['Crystal Mirror Waters', 'Murma Top Viewpoint', 'Pine Forest Trails', 'Untamed Solitude'],
    link: '/explore?q=Rara',
  },
  {
    id: 'langtang-valley',
    name: 'Langtang Valley',
    category: 'High Himalaya',
    region: 'Central North',
    altitude: '1,470m – 4,984m',
    bestSeason: 'Mar – May, Sep – Nov',
    duration: '7 – 10 Days',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
    tag: 'Valley of Glaciers',
    description:
      'The closest high Himalayan valley to Kathmandu, renowned for its rich Tamang culture, yak cheese monasteries, and sweeping glacial moraines.',
    highlights: ['Kyanjin Gompa', 'Kyanjin Ri Viewpoint', 'Tamang Heritage Trail', 'Langtang Lirung Glacier'],
    link: '/explore/dest_langtang',
  },
  {
    id: 'manaslu-circuit',
    name: 'Manaslu Circuit',
    category: 'High Himalaya',
    region: 'Western Gorkha',
    altitude: '1,400m – 5,106m',
    bestSeason: 'Sep – Nov, Mar – May',
    duration: '14 – 16 Days',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    tag: 'Mountain of the Spirit',
    description:
      'An untouched teahouse circuit circling the world’s eighth highest peak (8,163m) through remote Tibetan-influenced border villages.',
    highlights: ['Larkya La Pass (5,106m)', 'Birendra Glacial Lake', 'Pungyen Gompa', 'Restricted Trail Auth'],
    link: '/explore/dest_manaslu',
  },
];

const categories = [
  'All',
  'High Himalaya',
  'Cultural Valley',
  'Ancient Kingdom',
  'Wildlife & Plains',
  'Alpine Lake',
];

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered =
    selectedCategory === 'All'
      ? allDestinations
      : allDestinations.filter((d) => d.category === selectedCategory);

  return (
    <div className="bg-[#FFFFFF] text-[#10243A] selection:bg-[#0552A2] selection:text-white">
      {/* 1. Header Banner */}
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
            Geographical Catalogue
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
            Destinations of Nepal
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-normal font-inter max-w-2xl leading-relaxed">
            From glaciated 8,000-meter peaks and wind-carved desert canyons to subtropical sal jungles and medieval UNESCO valleys.
          </p>

          {/* Category Filter Pills: Smart 2-Row Balanced Grid on Mobile, Single Row on Desktop */}
          <div className="pt-2.5 grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1 sm:gap-1.5 pb-0.5">
            {categories.map((cat) => {
              const isLong = cat === 'Lakes & Valleys';
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-7 sm:h-7.5 inline-flex items-center justify-center text-[11px] sm:text-xs font-semibold font-inter px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                    isLong ? 'col-span-2 sm:col-auto' : 'col-span-1 sm:col-auto'
                  } ${
                    selectedCategory === cat
                      ? 'bg-white text-[#0552A2] shadow-xs font-semibold'
                      : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Destinations Asymmetrical Editorial Showcase */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Showing {filtered.length} Curated Regions
          </span>
          <span className="text-xs font-semibold font-inter text-[#0552A2]">
            Category: {selectedCategory}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((dest, idx) => (
            <ScrollReveal
              key={dest.id}
              direction="up"
              delay={idx * 60}
              duration={550}
              distance={20}
            >
              <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 h-full">
                {/* Visual Image Panel */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-2 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="text-[#0552A2] font-semibold">{dest.category}</span>
                      <span>{dest.altitude}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mt-1">
                      {dest.region}
                    </span>
                    <h3 className="font-inter text-lg sm:text-xl font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors mt-0.5">
                      {dest.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 font-normal font-inter leading-relaxed flex-1 line-clamp-2">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Key Waypoints
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dest.highlights.slice(0, 3).map((h) => (
                        <span
                          key={h}
                          className="text-[10.5px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80 font-inter"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specs Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#0552A2]" />
                      {dest.bestSeason.split(',')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {dest.duration}
                    </span>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      href={dest.link}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0552A2] text-white hover:bg-[#044182] py-2.5 text-xs font-semibold font-inter transition-colors"
                    >
                      <span>Explore Destination</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. Interactive Nepal Map Embedded */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12 sm:py-16 bg-white">
        <ScrollReveal direction="up" duration={700} distance={20}>
          <InteractiveMap />
        </ScrollReveal>
      </section>

      {/* 4. Editorial Trip Builder Callout */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-10 pb-16 sm:pb-24">
        <div className="rounded-xl bg-[#0552A2] text-white p-8 sm:p-12 relative overflow-hidden border border-blue-900 shadow-md">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#92C4EA] block">
              Tailor Your Expedition
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight">
              Combine Multiple Regions Into One Custom Itinerary
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-normal font-inter leading-relaxed">
              Pair an Everest alpine trek with a peaceful retreat in Pokhara, private wildlife safaris in Chitwan, and certified Sherpa mountain guides.
            </p>
            <div className="pt-2">
              <Link
                href="/custom-plan"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-[#0552A2] hover:bg-slate-100 px-5 py-2.5 text-xs sm:text-sm font-semibold font-inter transition-colors shadow-xs"
              >
                <Compass className="h-4 w-4" />
                <span>Launch Custom Trip Planner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
