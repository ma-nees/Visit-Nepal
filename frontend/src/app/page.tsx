'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MapPin,
  Mountain,
  Compass,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import InteractiveMap from '@/components/InteractiveMap';
import HeroVideoTitle from '@/components/features/hero/HeroVideoTitle';

// 8 Primary Destinations required by specification
const editorialDestinations = [
  {
    id: 'everest-region',
    name: 'Everest Region (Khumbu)',
    region: 'Eastern High Himalaya',
    altitude: '5,364m – 8,848m',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1600&q=85',
    tag: 'Crown of the Earth',
    description:
      'The sacred throne of Sagarmatha. Towering glaciated ramparts, ancient Buddhist gompas, and the legendary warmth of Sherpa mountain villages.',
    link: '/explore/dest_ebc',
  },
  {
    id: 'mustang',
    name: 'Upper Mustang',
    region: 'Trans-Himalayan Plateau',
    altitude: '3,840m',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
    tag: 'Forbidden Kingdom',
    description:
      'A moonscape of ochre canyon cliffs, wind-sculpted sky caves, and the whitewashed fortified walls of 14th-century Lo Manthang.',
    link: '/explore?q=Mustang',
  },
  {
    id: 'annapurna-region',
    name: 'Annapurna Sanctuary',
    region: 'Central Himalaya',
    altitude: '4,130m – 5,416m',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    tag: 'Alpine Amphitheater',
    description:
      'Surrounded by a ring of ten towering peaks above 7,000 meters, traversed by the world’s most celebrated circuit trail.',
    link: '/explore/dest_annapurna',
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu Valley',
    region: 'Ancient Capital Basin',
    altitude: '1,400m',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1200&q=85',
    tag: 'Living Heritage',
    description:
      'Seven UNESCO World Heritage sites clustered in one valley. Intricate terracotta courtyards, gilded pagoda roofs, and the scent of incense.',
    link: '/explore?q=Kathmandu',
  },
  {
    id: 'pokhara',
    name: 'Pokhara & Phewa Lake',
    region: 'Western Foothills',
    altitude: '822m',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    tag: 'Lake of Reflections',
    description:
      'Peaceful subtropical waters reflecting the iconic fishtail summit of Machapuchare. The serene gateway to high alpine expeditions.',
    link: '/explore?q=Pokhara',
  },
  {
    id: 'chitwan',
    name: 'Chitwan National Park',
    region: 'Southern Terai Plains',
    altitude: '150m',
    image:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=85',
    tag: 'Subtropical Wilderness',
    description:
      'Ancient sal forests and misty riverbanks sheltering the endangered greater one-horned rhinoceros and elusive Royal Bengal tigers.',
    link: '/explore?q=Chitwan',
  },
  {
    id: 'lumbini',
    name: 'Lumbini Sacred Garden',
    region: 'Southwestern Plains',
    altitude: '150m',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=85',
    tag: 'Cradle of Peace',
    description:
      'The sacred birthplace of Siddhartha Gautama (The Buddha). A tranquil oasis of international monasteries, lotus ponds, and ancient ruins.',
    link: '/explore?q=Lumbini',
  },
  {
    id: 'rara-lake',
    name: 'Rara Lake & Karnali',
    region: 'Far-Western Wilderness',
    altitude: '2,990m',
    image:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=85',
    tag: 'Crystal Solitude',
    description:
      'Nepal’s largest deep-blue alpine lake, encircled by untouched pine forests and mirrored snowy ridges in pristine remote solitude.',
    link: '/explore?q=Rara',
  },
];

// 8 Primary Experiences required by specification
const editorialExperiences = [
  {
    id: 'trekking',
    title: 'Himalayan Trekking',
    category: 'Alpine Journeys',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    description:
      'Traverse high glacial passes, stay in authentic family-run tea houses, and walk under the shadow of the world’s highest summits.',
    duration: '7 to 21 Days',
    season: 'Autumn & Spring',
  },
  {
    id: 'mountaineering',
    title: 'Mountaineering Expeditions',
    category: 'High Altitude Summits',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1000&q=80',
    description:
      'Technical peak climbing and summit ascents led by certified IFMGA Sherpa leaders with decades of Himalayan alpine heritage.',
    duration: '14 to 50 Days',
    season: 'April – May',
  },
  {
    id: 'adventure',
    title: 'Adventure & Outdoor',
    category: 'Wild Waters & Air',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    description:
      'Paragliding over Lake Phewa, class IV+ white-water rafting through Himalayan gorges, and deep glacial canyoning.',
    duration: '1 to 5 Days',
    season: 'Oct – May',
  },
  {
    id: 'culture',
    title: 'Cultural Heritage',
    category: 'Living Traditions',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1000&q=80',
    description:
      'Centuries of Newar architectural mastery, terracotta courtyards, living goddess Kumari traditions, and UNESCO monuments.',
    duration: '2 to 7 Days',
    season: 'Year-Round',
  },
  {
    id: 'wildlife',
    title: 'Wildlife & Nature',
    category: 'Jungle Safaris',
    image:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1000&q=80',
    description:
      'Tracking one-horned rhinos, Royal Bengal tigers, and gharial crocodiles through the dense sal forests of Chitwan and Bardia.',
    duration: '3 to 5 Days',
    season: 'Oct – Mar',
  },
  {
    id: 'spiritual',
    title: 'Spiritual Journeys',
    category: 'Mindfulness & Monasteries',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1000&q=80',
    description:
      'Meditation retreats at high Tibetan Buddhist monasteries, dawn circumbulations of Boudhanath, and pilgrimages to Lumbini.',
    duration: '3 to 14 Days',
    season: 'Year-Round',
  },
  {
    id: 'food',
    title: 'Food & Local Gastronomy',
    category: 'Authentic Flavors',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1000&q=80',
    description:
      'Savor traditional multi-course Newari feasts, mountain organic teas from Ilam, hand-pinched momos, and wholesome Himalayan dal bhat.',
    duration: 'Half Day to 3 Days',
    season: 'Year-Round',
  },
  {
    id: 'festivals',
    title: 'Festivals & Traditions',
    category: 'Sacred Celebrations',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1000&q=80',
    description:
      'Experience the mystic masked Cham dances of Mani Rimdu, the chariot processions of Indra Jatra, and the golden lights of Tihar.',
    duration: 'Seasonal Dates',
    season: 'Autumn & Spring',
  },
];

// Cultural highlights for Section 8
const cultureFeatures = [
  {
    title: 'Ancient Temples & UNESCO Monuments',
    subtitle: 'Sacred Architecture',
    desc: 'Seven UNESCO World Heritage monument zones in Kathmandu Valley, from the fifth-century spires of Pashupatinath to the massive mandala of Boudhanath.',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Traditional Newari Architecture',
    subtitle: 'Mastery in Wood & Brick',
    desc: 'Tiered pagoda roofs with carved strut deities, sunken stone waterspouts (dhunge dharas), and secluded brick courtyards preserved through dynasties.',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Local Art & Sacred Craftsmanship',
    subtitle: 'Thangkas & Bronze Casting',
    desc: 'Living master artisans practicing mineral-pigment Thangka painting, lost-wax bronze deity sculpting, and hand-hammered singing bowls.',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Himalayan Mountain Communities',
    subtitle: 'Sherpa, Gurung & Tamang Lore',
    desc: 'Generations of high-altitude mountain kinship, alpine hospitality, stone tea-house hearths, and deep reverence for the sacred peaks.',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  },
];

// Stories & Journal articles for Section 9
const travelStories = [
  {
    id: 'story-1',
    title: 'The High Passes of Khumbu: Crossing Cho La at 5,420 Meters',
    category: 'Adventure Chronicles',
    date: 'Autumn Field Notes',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'First light over the glaciated ridge between Dzongla and Gokyo. How patience, acclimatization, and seasoned Sherpa leadership define a safe alpine traverse.',
  },
  {
    id: 'story-2',
    title: 'Inside the Ancient Walled Capital of Upper Mustang: Lo Manthang',
    category: 'Destination Story',
    date: 'Cultural Dispatch',
    readTime: '8 min read',
    image:
    'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'Beyond the rainshadow mountains, life in the 14th-century capital continues around Buddhist prayer wheels, earthen monasteries, and wind-blown alleys.',
  },
  {
    id: 'story-3',
    title: 'A Guide to Seasonal Weather Windows in the Nepal Himalaya',
    category: 'Travel Recommendations',
    date: 'Practical Guide',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
    excerpt:
      'Comparing autumn’s crystal-clear summit visibilities and crisp sub-zero nights against spring’s vibrant rhododendron blooms and warmer valley passes.',
  },
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
        if (window.scrollY <= 800) {
          setScrollY(window.scrollY);
        }
        ticking = false;
      });
  ticking = true;
}
    };

window.addEventListener('scroll', handleScroll, { passive: true });
return () => window.removeEventListener('scroll', handleScroll);
  }, []);

return (
    <div className="bg-[#FFFFFF] text-[#10243A] selection:bg-[#0552A2] selection:text-white">
      {/* =========================================================================
          1. HERO SECTION: Full-Screen Cinematic Experience (100vh)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[100dvh] flex flex-col justify-between pt-12 sm:pt-14 lg:pt-[52px]">
        {/* Edge-to-edge High-Resolution Himalayan Landscape with subtle parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&auto=format')",
            transform: `translate3d(0, ${Math.min(scrollY * 0.16, 90)}px, 0)`,
          }}
        />

        {/* Sophisticated Editorial Vignette: Soft gradient for crystal clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031526]/90 via-transparent to-slate-950/40" />

            {/* Hero Narrative: Left-aligned editorial typography */}
            <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 flex-1 flex flex-col justify-center">
              <ScrollReveal direction="up" duration={750} distance={24} className="max-w-4xl space-y-5">
                {/* Minimal Eyebrow */}
                <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase text-[#92C4EA]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FDB716]" />
                  <span>Visit Nepal Official</span>
                </div>

                {/* Main Heading: Discover Nepal with dynamic cinematic video masking */}
                <HeroVideoTitle />

                {/* Supporting Text */}
                <p className="text-base sm:text-xl text-slate-200/90 font-normal font-inter leading-relaxed max-w-xl">
                  Where the Himalayas meet extraordinary experiences.
                </p>

            {/* Primary & Secondary Minimal CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/explore"
                prefetch={true}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0552A2] px-6 py-2.5 text-xs sm:text-sm font-semibold font-inter tracking-wide text-white hover:bg-[#044182] active:scale-[0.98] transition-all shadow-md shadow-[#0552A2]/30 min-h-[40px]"
              >
                <span>Explore Nepal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#experiences"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 px-5 py-2.5 text-xs sm:text-sm font-semibold font-inter tracking-wide text-white active:scale-[0.98] transition-all min-h-[40px]"
              >
                <span>Discover Experiences</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

            {/* Subtle Bottom Scroll Indicator & Coordinates Whisper */}
            <div className="relative w-full px-4 sm:px-6 lg:px-8 pb-4 pt-1">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-white/70">
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>27°59′17″ N, 86°55′31″ E · Himalayan Range, Nepal</span>
                </div>
        </div>
      </div>
    </section>

      {/* =========================================================================
          2. CREDIBILITY STRIP: Four High-Impact Mountain Pillars
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 border-b border-slate-100">
        <ScrollReveal direction="up" duration={600} distance={20}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 items-center text-center">
            {/* Col 1: 8 of 14 */}
            <div className="py-3 sm:py-1 px-3 sm:px-5 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0552A2] leading-none">
                8 <span className="text-lg sm:text-xl font-bold text-slate-400">of</span> 14
              </span>
              <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                8,000M Summits
              </p>
            </div>

            {/* Col 2: 8,848.86m */}
            <div className="py-3 sm:py-1 px-3 sm:px-5 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0552A2] leading-none">
                8,848<span className="text-base sm:text-lg font-bold text-[#FDB716]">.86</span><span className="text-xs font-semibold text-slate-600 ml-0.5">m</span>
              </span>
              <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                Highest Altitude
              </p>
            </div>

            {/* Col 3: 10 UNESCO */}
            <div className="py-3 sm:py-1 px-3 sm:px-5 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0552A2] leading-none">
                10 <span className="text-base sm:text-lg font-bold text-slate-800">UNESCO</span>
              </span>
              <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                Heritage Sites
              </p>
            </div>

            {/* Col 4: 100% */}
            <div className="py-3 sm:py-1 px-3 sm:px-5 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0552A2] leading-none">
                100<span className="text-lg sm:text-xl font-bold text-emerald-600">%</span>
              </span>
              <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
                Certified &amp; Protected
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          3. DESTINATIONS SECTION: Explore the Extraordinary (Asymmetrical Editorial)
          ========================================================================= */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18 space-y-6 sm:space-y-8">
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={600} distance={20} className="max-w-2xl space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
            Iconic Destinations
          </span>
          <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-medium text-[#10243A] tracking-tight">
            Explore the Extraordinary
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
            From the world&apos;s highest mountains to ancient cities and peaceful landscapes.
          </p>
        </ScrollReveal>

        {/* Asymmetrical Editorial Composition 1: Panoramic Feature (Everest + Mustang) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* Everest Region — 7 Columns Panoramic Panel */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" duration={650} distance={24} className="h-full">
              <Link
                href={editorialDestinations[0].link}
                className="group relative flex flex-col justify-between h-[340px] sm:h-[390px] lg:h-[430px] w-full rounded-2xl overflow-hidden bg-slate-950 p-4 sm:p-5 transition-all duration-500 border border-slate-200/80 shadow-md"
              >
                <img
                  src={editorialDestinations[0].image}
                  alt={editorialDestinations[0].name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Corner Badge (Keeps mountain peaks 100% visible) */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[11px] font-mono tracking-wider text-[#FDB716] border border-white/15 shadow-sm">
                    {editorialDestinations[0].tag} · {editorialDestinations[0].altitude}
                  </span>
                </div>

                {/* Compact Docked Glass Card (Preserves unobstructed landscape photography) */}
                <div className="relative z-10 rounded-xl bg-slate-950/75 backdrop-blur-md p-4 sm:p-5 border border-white/15 text-white space-y-1.5 shadow-lg group-hover:bg-slate-950/85 transition-colors">
                  <h3 className="font-inter text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white group-hover:text-slate-100 transition-colors">
                    {editorialDestinations[0].name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200/90 font-normal font-inter max-w-lg leading-relaxed line-clamp-2">
                    {editorialDestinations[0].description}
                  </p>
                  <div className="pt-1 inline-flex items-center gap-2 text-xs font-semibold font-inter text-[#92C4EA] group-hover:text-[#FDB716] transition-colors">
                    <span>Discover destination</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>

          {/* Mustang — 5 Columns Editorial Portrait Panel */}
          <div className="lg:col-span-5">
            <ScrollReveal direction="up" delay={120} duration={650} distance={24} className="h-full">
              <Link
                href={editorialDestinations[1].link}
                className="group relative flex flex-col justify-between h-[340px] sm:h-[390px] lg:h-[430px] w-full rounded-2xl overflow-hidden bg-slate-950 p-4 sm:p-5 transition-all duration-500 border border-slate-200/80 shadow-md"
              >
                <img
                  src={editorialDestinations[1].image}
                  alt={editorialDestinations[1].name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Corner Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[10px] font-mono tracking-wider text-[#FDB716] border border-white/15 shadow-sm">
                    {editorialDestinations[1].tag} · {editorialDestinations[1].altitude}
                  </span>
                </div>

                {/* Compact Docked Glass Card */}
                <div className="relative z-10 rounded-xl bg-slate-950/75 backdrop-blur-md p-4 sm:p-5 border border-white/15 text-white space-y-1.5 shadow-lg group-hover:bg-slate-950/85 transition-colors">
                  <h3 className="font-inter text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-slate-100 transition-colors">
                    {editorialDestinations[1].name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200/90 font-normal font-inter leading-relaxed line-clamp-2">
                    {editorialDestinations[1].description}
                  </p>
                  <div className="pt-1 inline-flex items-center gap-1.5 text-xs font-semibold font-inter text-[#92C4EA] group-hover:text-[#FDB716] transition-colors">
                    <span>Discover destination</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition 2: Triplet Panel (Annapurna, Kathmandu, Pokhara) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {[editorialDestinations[2], editorialDestinations[3], editorialDestinations[4]].map((dest, i) => (
            <ScrollReveal key={dest.id} direction="up" delay={i * 90} duration={600} distance={20}>
              <Link
                href={dest.link}
                className="group block space-y-2 cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-mono text-white">
                    {dest.altitude}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {dest.region}
                  </span>
                  <h3 className="font-inter text-lg sm:text-xl font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors mt-0.5">
                    {dest.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed mt-0.5 line-clamp-2">
                    {dest.description}
                  </p>
                  <div className="pt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0552A2] group-hover:underline">
                    <span>Discover destination</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Asymmetrical Editorial Composition 3: The Southern Terai & Sacred Lakes (Chitwan, Lumbini, Rara Lake) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-2">
          {[editorialDestinations[5], editorialDestinations[6], editorialDestinations[7]].map((dest, i) => (
            <ScrollReveal key={dest.id} direction="up" delay={i * 90} duration={600} distance={20}>
              <Link
                href={dest.link}
                className="group block space-y-2 cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-mono text-white">
                    {dest.altitude}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {dest.region}
                  </span>
                  <h3 className="font-inter text-lg sm:text-xl font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors mt-0.5">
                    {dest.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed mt-0.5 line-clamp-2">
                    {dest.description}
                  </p>
                  <div className="pt-1.5 inline-flex items-center gap-1.5 text-xs font-medium font-inter text-[#0552A2] group-hover:underline">
                    <span>Discover destination</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. EXPERIENCES SECTION: Experience Nepal (8 Visual Stories)
          ========================================================================= */}
      <section id="experiences" className="bg-[#F7F9FC] py-10 sm:py-14 lg:py-18 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Section Heading */}
          <ScrollReveal direction="up" duration={600} distance={20} className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Himalayan Encounters
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-medium text-[#10243A] tracking-tight">
              Experience Nepal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
              Eight distinct visual journeys into the high mountains, living spiritualities, and untouched wilderness.
            </p>
          </ScrollReveal>

          {/* 8 Distinct Visual Experience Stories (4x2 Responsive Editorial Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {editorialExperiences.map((exp, idx) => (
              <ScrollReveal key={exp.id} direction="up" delay={idx * 60} duration={550} distance={20}>
                <Link
                  href="/experiences"
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/70 shadow-2xs hover:border-[#0552A2]/30 hover:shadow-xs transition-all duration-300 h-full"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#0552A2]">
                      {exp.category}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-2">
                    <div>
                      <h3 className="font-inter text-base sm:text-lg font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors leading-snug">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{exp.duration}</span>
                        <span>•</span>
                        <span>{exp.season}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal font-inter leading-relaxed flex-1 line-clamp-3">
                      {exp.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold font-inter text-[#0552A2] group-hover:underline">
                        <span>Explore itineraries</span>
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. DISCOVER NEPAL: Immersive Storytelling Introduction
          ========================================================================= */}
      <section id="discover" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Editorial Narrative & Key Dimensions (Col 1-6) */}
          <div className="lg:col-span-6 space-y-4">
            <ScrollReveal direction="up" duration={650} distance={20} className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
                About Nepal
              </span>
              <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-medium text-[#10243A] tracking-tight leading-tight">
                A Land of Extreme Geography &amp; Timeless Spirit
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80} duration={650} distance={20} className="space-y-3 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              <p>
                Nowhere else on Earth does the landscape rise with such breathtaking verticality. Within less than 150 kilometers, Nepal transitions from warm subtropical river basins (60 meters above sea level) into the highest summits on the planet, culminating at the 8,848.86m apex of Sagarmatha.
              </p>
              <p>
                Across this dramatic terrain thrive twelve bioclimatic zones, more than 850 species of birds, and over 125 distinct ethnic communities—each safeguarding their ancestral languages, mountain rituals, and living architectural heritage.
              </p>
              <p>
                From the sacred birthplace of Lord Buddha in Lumbini to the monastic highlands of the Khumbu, Nepal is not merely a destination—it is a transformative encounter with nature and human spirit.
              </p>
            </ScrollReveal>

            {/* Numeric Accents */}
            <ScrollReveal direction="up" delay={140} duration={650} distance={20}>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xl sm:text-2xl font-inter font-semibold text-[#0552A2] block">60m to 8,848m</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Elevation Rise</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-inter font-semibold text-[#0552A2] block">12 Zones</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Bioclimates</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-inter font-semibold text-[#0552A2] block">125+</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Ethnic Cultures</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Layered Editorial Photography Panel (Col 7-12) */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="up" delay={150} duration={750} distance={28}>
              <div className="rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85"
                    alt="Himalayan Monastery Dawn"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-102"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono tracking-wider text-[#FDB716] border border-white/10">
                      Sacred Monasteries of the High Valley
                    </span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50/70 border-t border-slate-100">
                  <p className="font-inter text-xs sm:text-sm font-normal text-slate-700 italic">
                    &ldquo;In the silence of the high peaks, the soul discovers its native home.&rdquo;
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CULTURE & HERITAGE: Living Traditions & Craftsmanship
          ========================================================================= */}
      <section id="culture" className="bg-[#F7F9FC] py-10 sm:py-14 lg:py-18 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Section Heading */}
          <ScrollReveal direction="up" duration={600} distance={20} className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Living Traditions
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-medium text-[#10243A] tracking-tight">
              Culture &amp; Living Heritage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
              Where sacred rituals, master craftsmanship, and architectural wonders endure across millennia.
            </p>
          </ScrollReveal>

          {/* 4 Museum-Grade Cultural Editorial Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {cultureFeatures.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={idx * 80} duration={600} distance={20}>
                <div className="flex flex-col sm:flex-row gap-4 items-start bg-white rounded-xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs h-full">
                  <div className="relative h-36 sm:h-32 w-full sm:w-36 shrink-0 rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#0552A2] font-semibold">
                      {item.subtitle}
                    </span>
                    <h3 className="font-inter text-base sm:text-lg font-semibold text-[#10243A]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal font-inter leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. INTERACTIVE DESTINATION MAP: Cartographic Himalayan Discovery
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <ScrollReveal direction="up" duration={700} distance={24}>
          <InteractiveMap />
        </ScrollReveal>
      </section>

      {/* =========================================================================
          8. STORIES & FIELD JOURNAL: Travel Guides & Cultural Chronicles
          ========================================================================= */}
      <section id="stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8">
        {/* Section Heading & Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <ScrollReveal direction="up" duration={600} distance={20} className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Field Notes
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-medium text-[#10243A] tracking-tight">
              Stories &amp; Field Journal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
              Curated expedition guides, destination chronicles, and cultural discoveries from across Nepal.
            </p>
          </ScrollReveal>

          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold font-inter text-[#0552A2] hover:underline shrink-0"
          >
            <span>View All Journal Stories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3 Large Editorial Story Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {travelStories.map((story, idx) => (
            <ScrollReveal key={story.id} direction="up" delay={idx * 90} duration={600} distance={20}>
              <Link href="/stories" className="group flex flex-col space-y-2 cursor-pointer">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
                    {story.category}
                  </span>
                </div>

                <div className="space-y-1 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>{story.date}</span>
                    <span>•</span>
                    <span>{story.readTime}</span>
                  </div>

                  <h3 className="font-inter text-base font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-normal font-inter leading-relaxed flex-1 line-clamp-2">
                    {story.excerpt}
                  </p>

                  <div className="pt-1.5 inline-flex items-center gap-1 text-xs font-semibold font-inter text-[#0552A2] group-hover:underline">
                    <span>Read story</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
