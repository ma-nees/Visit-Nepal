'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Mountain,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface ExperienceDetail {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  season: string;
  altitudeRange: string;
  heroImage: string;
  leadParagraph: string;
  deepDescription: string;
  topHighlights: string[];
  recommendedGear: string[];
  permitNotice: string;
  primaryRouteLink: string;
}

const experiencesData: ExperienceDetail[] = [
  {
    id: 'himalayan-trekking',
    title: 'Himalayan Trekking',
    subtitle: 'From Alpine Tea Houses to Glaciated Passes',
    tag: 'Classic Alpine',
    duration: '7 to 22 Days',
    season: 'Mar – May & Sep – Dec',
    altitudeRange: '1,400m – 5,416m',
    heroImage:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Step onto centuries-old trading routes that weave through rhododendron forests, stone-walled Sherpa villages, and high mountain amphitheatres.',
    deepDescription:
      'Nepal is the undisputed trekking capital of the world. Each day brings a rhythmic journey from warm lower valleys to glaciated crests. Accommodations range from authentic family-run tea houses with wood-stove hearths to boutique high-altitude eco-lodges.',
    topHighlights: [
      'Everest Base Camp & Gokyo Ri Lakes',
      'Annapurna Circuit & Thorong La Pass (5,416m)',
      'Manaslu High Altitude Circuit (8,163m Massif)',
      'Langtang Valley & Tamang Heritage Trail',
    ],
    recommendedGear: ['Layered merino thermal wear', 'Gore-Tex outer shell', 'Sturdy broken-in trekking boots', 'Trekking poles with snow baskets'],
    permitNotice: 'Digital TIMS Card and National Park Entry Permits (Sagarmatha, ACAP) required.',
    primaryRouteLink: '/explore?cat=Trekking',
  },
  {
    id: 'mountaineering',
    title: 'Mountaineering Expeditions',
    subtitle: 'High-Altitude Summits with IFMGA Sherpa Leaders',
    tag: 'Technical Summits',
    duration: '14 to 55 Days',
    season: 'April – May & October',
    altitudeRange: '6,119m – 8,848m',
    heroImage:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Scale Earth’s most formidable peaks under the expert guidance of certified IFMGA Sherpa summit leaders with unmatched alpine heritage.',
    deepDescription:
      'From accessible introductory trekking peaks like Island Peak (Imja Tse, 6,189m) and Mera Peak (6,476m) to technical 7,000m and 8,000m summits including Ama Dablam, Manaslu, and Sagarmatha. Every expedition is supported with high-altitude sherpas, fixed-line teams, and satellite medical links.',
    topHighlights: [
      'Mera Peak (6,476m) — Highest Trekking Peak',
      'Island Peak (6,189m) — Classic Alpine Climb',
      'Ama Dablam (6,812m) — The Matterhorn of the Himalaya',
      '8,000m Commercial Summits (Manaslu & Everest)',
    ],
    recommendedGear: ['Crampons & ice axe', 'Double high-altitude mountaineering boots', 'Down summit suit (-40°C)', 'Climbing harness & ascenders'],
    permitNotice: 'NMA Peak Climbing Permit or Ministry of Tourism Expedition Royalty required.',
    primaryRouteLink: '/services?tab=guide',
  },
  {
    id: 'adventure-outdoor',
    title: 'Adventure & Outdoor',
    subtitle: 'White Water, Thermal Flight & Canyoning',
    tag: 'Adrenaline Frontiers',
    duration: '1 to 6 Days',
    season: 'Oct – May',
    altitudeRange: '300m – 3,200m',
    heroImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Carve through glacial torrents, soar on thermals alongside Himalayan griffons, and rappel down cascading canyon waterfalls.',
    deepDescription:
      'Nepal’s steep drops from high glaciers to southern plains create world-class white-water rivers. Paddle through continuous Class IV–V rapids on the wild Sun Koshi and Karnali rivers. In Pokhara, launch on tandem paragliding flights from Sarangkot with 360-degree views of the Annapurnas.',
    topHighlights: [
      'Tandem Paragliding over Lake Phewa from Sarangkot',
      'Multi-Day White Water Rafting on Sun Koshi River',
      'The Last Resort Bungee Jump & Canyon Swing (160m Gorge)',
      'Heli-Skiing in the Untouched Annapurna Backcountry',
    ],
    recommendedGear: ['Quick-dry technical apparel', 'Action camera with waterproof housing', 'Trail running shoes', 'UV400 polarized sunglasses'],
    permitNotice: 'River running fees and civil aviation tandem authorizations covered by certified operators.',
    primaryRouteLink: '/explore?cat=Adventure',
  },
  {
    id: 'cultural-heritage',
    title: 'Cultural Heritage',
    subtitle: 'UNESCO Monument Zones & Living Traditions',
    tag: 'Living History',
    duration: '2 to 8 Days',
    season: 'Year-Round',
    altitudeRange: '1,400m',
    heroImage:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Immerse yourself in three medieval city-kingdoms where gilded pagodas, ancient shrines, and terracotta courtyards remain centers of daily devotion.',
    deepDescription:
      'The Kathmandu Valley features an unprecedented concentration of UNESCO World Heritage Sites. Walk through Bhaktapur’s preserved brick streets where pottery dries in sunlit courtyards, visit the fifth-century spires of Pashupatinath on the sacred Bagmati, and circumambulate the colossal stupas of Boudhanath and Swayambhunath.',
    topHighlights: [
      'Boudhanath Stupa — Heart of Tibetan Buddhism',
      'Bhaktapur Durbar Square — Medieval Living City',
      'Pashupatinath Temple — Sacred Hindu Sanctum',
      'Patan Museum — World-Renowned Himalayan Art Sanctuary',
    ],
    recommendedGear: ['Modest attire covering shoulders and knees', 'Slip-on shoes for temple entrances', 'Respectful camera etiquette', 'Local cultural guide'],
    permitNotice: 'Heritage conservation entry tickets at valley entry booths.',
    primaryRouteLink: '/culture',
  },
  {
    id: 'wildlife-nature',
    title: 'Wildlife & Nature',
    subtitle: 'Subtropical Jungle Safaris in Chitwan & Bardia',
    tag: 'Jungle Wilderness',
    duration: '3 to 5 Days',
    season: 'Oct – Mar',
    altitudeRange: '100m – 350m',
    heroImage:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Track the endangered greater one-horned rhinoceros and elusive Royal Bengal tigers through pristine sal forests and riverine savannahs.',
    deepDescription:
      'A dramatic contrast to the high glaciated peaks, Nepal’s southern lowlands protect some of the most successful wildlife recovery ecosystems on Earth. Glide silently in wooden dugouts along the Rapti River observing marsh muggers and gharials, or take 4x4 jeep safaris accompanied by licensed naturalists.',
    topHighlights: [
      '4x4 Jeep Safari into Chitwan National Park Deep Core',
      'Tracking Greater One-Horned Rhinos in the Wild',
      'Bird Watching — Over 540 Migratory and Native Species',
      'Bardia National Park — Remote Habitat of Wild Elephants and Tigers',
    ],
    recommendedGear: ['Neutral-colored clothing (khaki/green)', 'Binoculars (8x42 or 10x42)', 'Eco-friendly mosquito repellent', 'Wide-brim safari sun hat'],
    permitNotice: 'Department of National Parks and Wildlife Conservation park entry permits.',
    primaryRouteLink: '/explore?q=Chitwan',
  },
  {
    id: 'spiritual-journeys',
    title: 'Spiritual Journeys',
    subtitle: 'Silent Retreats, Sacred Caves & The Buddha’s Birthplace',
    tag: 'Inner Sanctuary',
    duration: '3 to 14 Days',
    season: 'Year-Round',
    altitudeRange: '150m – 3,870m',
    heroImage:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Follow the ancient footsteps of pilgrims, ascetics, and sages to high mountain meditation caves and sacred holy gardens.',
    deepDescription:
      'Nepal is the sacred crossroads of Vedic Hinduism and Vajrayana Buddhism. In Lumbini, stand at the exact stone marking the birth of Siddhartha Gautama in 623 BCE. In the highlands, join monks in morning horn chanting at Tengboche Monastery or visit Guru Rinpoche’s sacred meditation cave in Maratika.',
    topHighlights: [
      'Maya Devi Temple & Sacred Bodhi Tree in Lumbini',
      'Dawn Chanting at Tengboche Monastery under Ama Dablam',
      'Namobuddha Monastery — The Legend of Great Compassion',
      'Muktinath (3,800m) — Sacred Confluence of 108 Sacred Waterspouts',
    ],
    recommendedGear: ['Meditation shawl', 'Journal & mindfulness supplies', 'Warm wool socks for monastery flagstones', 'Offering white scarves (khata)'],
    permitNotice: 'Open spiritual sanctums with respect for silent prayer hours.',
    primaryRouteLink: '/explore?cat=Spiritual',
  },
  {
    id: 'food-local-experiences',
    title: 'Food & Local Gastronomy',
    subtitle: 'Newari Feasts, Mountain Teas & Himalayan Flavors',
    tag: 'Culinary Heritage',
    duration: 'Day Experience to 4 Days',
    season: 'Year-Round',
    altitudeRange: '1,400m – 3,500m',
    heroImage:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Explore Nepal’s rich culinary traditions, from fermented mountain delicacies to complex multi-dish Newari feasts.',
    deepDescription:
      'Nepali cuisine reflects the extreme geography of its people. Savor the traditional Samay Baji platter of flattened rice, buffalo choila, spiced black soybeans, and ginger shoots. High in the mountains, taste organic yak cheese, hearty buckwheat dhindo, and steaming bowls of Sherpa tsampa and thukpa.',
    topHighlights: [
      'Authentic Newari Samay Baji Feasting Experience',
      'Ilam High-Grown Orthodox Tea Tasting Sessions',
      'Handmade Tibetan Momo Making Workshop',
      'Yak Cheese Tasting at Kyanjin Gompa Alpine Creamery',
    ],
    recommendedGear: ['Curious palate for rich spices', 'Reusable stainless water canteen', 'Local market walking shoes'],
    permitNotice: 'Available year-round across valley bazaars and mountain lodges.',
    primaryRouteLink: '/services',
  },
  {
    id: 'festivals-traditions',
    title: 'Festivals & Living Celebrations',
    subtitle: 'Masked Dances, Chariots & Mountain Lights',
    tag: 'Sacred Calendar',
    duration: 'Seasonal Festivals',
    season: 'Autumn & Spring',
    altitudeRange: '1,400m – 3,867m',
    heroImage:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1400&q=85',
    leadParagraph:
      'Witness the vibrant colors, sacred masked Cham rituals, and ancient community celebrations that illuminate Nepal throughout the year.',
    deepDescription:
      'Nepal celebrates over 50 major festivals every year. In the high Khumbu, monks don elaborate silk robes and fierce deity masks for the 3-day Mani Rimdu festival. In the Kathmandu Valley, thousands gather for the colossal wooden chariot processions of Indra Jatra and Rato Machhindranath.',
    topHighlights: [
      'Mani Rimdu Festival at Tengboche & Chiwong Monasteries',
      'Indra Jatra & The Chariot of the Living Goddess Kumari',
      'Tihar — Festival of Lights & Reverence for Nature',
      'Bisket Jatra — New Year Tug-of-War Chariot in Bhaktapur',
    ],
    recommendedGear: ['Camera with low-light lens', 'Respectful festival behavior', 'Festive spirit and open curiosity'],
    permitNotice: 'Dates vary according to the lunar calendar. Check seasonal calendar.',
    primaryRouteLink: '/schedule',
  },
];

export default function ExperiencesPage() {
  const [activeTab, setActiveTab] = useState<string>('himalayan-trekking');

  const activeExp =
    experiencesData.find((e) => e.id === activeTab) || experiencesData[0];

  return (
    <div className="bg-[#FFFFFF] text-[#10243A] selection:bg-[#0552A2] selection:text-white">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-[#031526] text-white pt-24 sm:pt-32 pb-16 sm:pb-24 border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031526] via-transparent to-[#031526]/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#92C4EA] inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FDB716]" />
            Experiential Catalogue
          </span>
          <h1 className="font-poppins text-4xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.08]">
            Experience Nepal
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 font-normal font-inter max-w-2xl leading-relaxed">
            Eight iconic ways to encounter the heart of the Himalayas. From glaciated alpine passes to sacred living traditions and subtropical jungles.
          </p>

          {/* Quick Experience Selector Strip */}
          <div className="pt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {experiencesData.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setActiveTab(exp.id)}
                className={`text-xs font-medium font-inter px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer ${
                  activeTab === exp.id
                    ? 'bg-white text-[#0552A2] shadow-sm font-medium'
                    : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10'
                }`}
              >
                {exp.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured Experience Visual Deep-Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <ScrollReveal direction="up" duration={650} distance={20}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Panel (Col 1-7) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                <img
                  src={activeExp.heroImage}
                  alt={activeExp.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#FDB716]">
                    {activeExp.tag} · {activeExp.altitudeRange}
                  </span>
                  <h3 className="font-inter text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
                    {activeExp.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Narrative Details (Col 8-12) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#0552A2] font-semibold">
                  Featured Experience Profile
                </span>
                <h2 className="font-poppins text-3xl sm:text-4xl font-medium text-[#10243A] mt-1">
                  {activeExp.subtitle}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 font-normal font-inter leading-relaxed">
                {activeExp.leadParagraph}
              </p>

              <p className="text-xs sm:text-sm text-slate-500 font-normal font-inter leading-relaxed">
                {activeExp.deepDescription}
              </p>

              {/* Specs Metric Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-[#F7F9FC] border border-slate-200/70 p-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#0552A2]" />
                    Best Seasons
                  </span>
                  <strong className="text-xs text-slate-900 block mt-0.5">
                    {activeExp.season}
                  </strong>
                </div>
                <div className="rounded-xl bg-[#F7F9FC] border border-slate-200/70 p-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#FDB716]" />
                    Standard Duration
                  </span>
                  <strong className="text-xs text-slate-900 block mt-0.5">
                    {activeExp.duration}
                  </strong>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Top Recommended Routes
                </span>
                <div className="space-y-1.5">
                  {activeExp.topHighlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center gap-3">
                <Link
                  href={activeExp.primaryRouteLink}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0552A2] text-white hover:bg-[#044182] px-6 py-3 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-xs"
                >
                  <span>Explore Route Itineraries</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/custom-plan"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-5 py-3 text-xs sm:text-sm font-semibold transition-all"
                >
                  <span>Custom Trip</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. All 8 Visual Experiences Gallery Grid */}
      <section className="bg-[#F7F9FC] py-20 sm:py-28 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Complete Directory
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-medium text-[#10243A] tracking-tight">
              Eight Ways to Encounter Nepal
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal font-inter leading-relaxed">
              Explore the spectrum of experiences, from high-altitude technical climbs to peaceful living heritage retreats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiencesData.map((exp, idx) => (
              <ScrollReveal
                key={exp.id}
                direction="up"
                delay={idx * 60}
                duration={550}
                distance={20}
              >
                <div
                  onClick={() => {
                    setActiveTab(exp.id);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-xs hover:border-[#0552A2]/40 transition-all duration-300 h-full cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={exp.heroImage}
                      alt={exp.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#0552A2]">
                      {exp.tag}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <div>
                      <h3 className="font-inter text-xl font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                        <span>{exp.duration}</span>
                        <span>•</span>
                        <span>{exp.season.split('&')[0]}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed flex-1 line-clamp-3">
                      {exp.leadParagraph}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium font-inter text-[#0552A2] group-hover:underline">
                      <span>View Experience Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
