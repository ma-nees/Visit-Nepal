'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  MessageSquare,
  X,
  Share2,
  Check,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { useApp } from '@/context/AppContext';

interface Story {
  id: string;
  title: string;
  category: 'Adventure' | 'Culture' | 'Guides' | 'Safety' | 'Photography';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  fullBodySnippet: string;
}

const storiesData: Story[] = [
  {
    id: 'cho-la-traverse',
    title: 'Crossing Cho La at Dawn: 5,420 Meters Above the Clouds',
    category: 'Adventure',
    author: 'Dawa Tenzing Sherpa',
    authorRole: 'IFMGA Lead Guide',
    date: 'October 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
    excerpt:
      'First light over the glaciated ridge between Dzongla and Gokyo. How patience, acclimatization pacing, and calm decision-making define a safe alpine traverse.',
    fullBodySnippet:
      'At 4:30 AM in Dzongla, the thermometer reads -14°C. Our team buckles microspikes as the eastern horizon above Ama Dablam turns a deep violet-gold. The high pass demands absolute discipline...',
  },
  {
    id: 'lo-manthang-walled-city',
    title: 'Inside the Ancient Walled Capital of Upper Mustang',
    category: 'Culture',
    author: 'Elena Rostova',
    authorRole: 'Cultural Anthropologist',
    date: 'September 2026',
    readTime: '8 min read',
    image:
      'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
    excerpt:
      'Beyond the rainshadow peaks, life in the 14th-century capital continues around Buddhist prayer wheels, earthen monasteries, and wind-blown labyrinthine alleys.',
    fullBodySnippet:
      'Entering through the sole gate of Lo Manthang feels like stepping through a tear in the fabric of time. The whitewashed royal palace rises four storeys, framed against bare red cliffs...',
  },
  {
    id: 'acclimatization-protocol',
    title: 'The Medical Protocol for High-Altitude Acclimatization',
    category: 'Safety',
    author: 'Dr. Sandeep Adhikari',
    authorRole: 'Himalayan Rescue Association',
    date: 'August 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=85',
    excerpt:
      'Understanding barometric pressure drops, rest-day pacing at Namche Bazaar and Dingboche, and Diamox guidelines certified by high-altitude physicians.',
    fullBodySnippet:
      'Ascending above 3,500 meters reduces oxygen saturation. Our golden rule: climb high, sleep low, maintain 4–5 liters of daily fluid intake, and never ascend with persisting headache...',
  },
  {
    id: 'bhaktapur-woodcarvers',
    title: 'The Living Woodcarvers of Bhaktapur: Preserving Newari Artistry',
    category: 'Culture',
    author: 'Kiran Shakya',
    authorRole: 'Heritage Restorer',
    date: 'July 2026',
    readTime: '7 min read',
    image:
      'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1200&q=85',
    excerpt:
      'In the courtyards of the Dattatreya Square, master woodcarvers shape centuries-old Sal wood using chisel techniques passed down through sixteen generations.',
    fullBodySnippet:
      'The rhythmic tap of the wooden mallet echoes across the brick courtyard. Master carver Rajendra demonstrates the iconic Peacock Window strut, where every feather is sculpted from solid timber...',
  },
  {
    id: 'autumn-vs-spring-weather',
    title: 'Autumn Crystal Skies vs. Spring Wildflower Blooms',
    category: 'Guides',
    author: 'Pemba Nuru Sherpa',
    authorRole: 'Senior Expedition Coordinator',
    date: 'June 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    excerpt:
      'A practical guide to choosing your trekking window: comparing October’s sharp summit visibility with April’s vibrant rhododendron canopy.',
    fullBodySnippet:
      'Every Himalayan season possesses its own distinct personality. Autumn offers dry trails, high visibility, and crisp cold nights. Spring brings warmer valleys and bursting scarlet blossoms...',
  },
  {
    id: 'chitwan-dawn-patrol',
    title: 'Mists Over the Rapti: Tracking Wildlife at First Light',
    category: 'Photography',
    author: 'Marcus Vance',
    authorRole: 'Wildlife Photographer',
    date: 'May 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=85',
    excerpt:
      'Drifting silently down the river in a dugout canoe while greater one-horned rhinos graze along the misty elephant grass shoreline.',
    fullBodySnippet:
      'The morning fog hangs low over the Rapti River. Our canoe captain uses a single bamboo pole. Suddenly, thirty meters away, a silhouette emerges—a prehistoric giant grazing peacefully in morning dew...',
  },
];

const categories = ['All', 'Adventure', 'Culture', 'Guides', 'Safety', 'Photography'];

export default function StoriesPage() {
  const { showToast } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveStory(null);
    };
    if (activeStory) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStory]);

  const handleShare = async (story: Story) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.excerpt,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${story.title} - ${shareUrl}`);
      showToast('Article link copied to clipboard.');
    }
  };

  const filtered = storiesData.filter((s) => {
    const matchCat = selectedCat === 'All' || s.category === selectedCat;
    const matchSearch =
      !searchFilter.trim() ||
      s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.author.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-[#FFFFFF] text-[#10243A] selection:bg-[#0552A2] selection:text-white">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-[#031526] text-white pt-16 sm:pt-20 pb-8 sm:pb-12 border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1920&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031526] via-transparent to-[#031526]/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#92C4EA] inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FDB716]" />
            Field Dispatches &amp; Chronicles
          </span>
          <h1 className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
            Stories &amp; Field Journal
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-normal font-inter max-w-2xl leading-relaxed">
            First-person chronicles, trail notes, mountain medicine advice, and cultural reflections written by certified guides and travelers.
          </p>

          {/* Filter Pills: Non-scrollable wrapping layout */}
          <div className="pt-3 flex flex-wrap items-center gap-1.5 sm:gap-2 pb-0.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`h-8 inline-flex items-center text-xs font-semibold font-inter px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
                  selectedCat === c
                    ? 'bg-white text-[#0552A2] shadow-xs font-semibold'
                    : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white border border-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Story Catalogue */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Showing {filtered.length} Editorial Articles
          </span>
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search field stories..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0552A2] font-inter"
            />
          </div>
        </div>

        {/* Featured First Story — Panoramic Hero Card */}
        {filtered.length > 0 && selectedCat === 'All' && !searchFilter && (
          <ScrollReveal direction="up" duration={700} distance={24}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#F7F9FC] rounded-2xl p-4 sm:p-7 border border-slate-200/80 shadow-2xs">
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
                  <img
                    src={filtered[0].image}
                    alt={filtered[0].title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0552A2] px-3 py-0.5 rounded-full text-[10px] font-semibold">
                    Featured Dispatch
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>{filtered[0].date}</span>
                  <span>•</span>
                  <span>{filtered[0].readTime}</span>
                </div>

                <h2 className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-medium text-[#10243A] leading-tight">
                  {filtered[0].title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed">
                  {filtered[0].excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {filtered[0].author}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {filtered[0].authorRole}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveStory(filtered[0])}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0552A2] text-white px-4 py-2 text-xs font-semibold hover:bg-[#044182] transition-all shadow-xs cursor-pointer"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(selectedCat === 'All' && !searchFilter ? filtered.slice(1) : filtered).map(
            (story, idx) => (
              <ScrollReveal
                key={story.id}
                direction="up"
                delay={idx * 60}
                duration={550}
                distance={20}
              >
                <article
                  onClick={() => setActiveStory(story)}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-[#0552A2]/30 transition-all duration-300 h-full cursor-pointer"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                      {story.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>{story.date}</span>
                      <span>•</span>
                      <span>{story.readTime}</span>
                    </div>

                    <h3 className="font-inter text-xl font-semibold text-[#10243A] group-hover:text-[#0552A2] transition-colors leading-snug">
                      {story.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal font-inter leading-relaxed flex-1 line-clamp-3">
                      {story.excerpt}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium font-inter">
                        By {story.author}
                      </span>
                      <span className="font-medium font-inter text-[#0552A2] group-hover:underline inline-flex items-center gap-1">
                        <span>Read</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          )}
        </div>
      </section>

      {/* Story Reader Modal */}
      {activeStory && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveStory(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs overflow-y-auto animate-subtle-fade-up"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              aria-label="Close story"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono">
                {activeStory.category}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>{activeStory.date}</span>
                <span>•</span>
                <span>{activeStory.readTime}</span>
              </div>

              <h2 className="font-poppins text-2xl sm:text-3xl font-medium text-[#10243A] leading-tight">
                {activeStory.title}
              </h2>

              <div className="flex items-center justify-between border-y border-slate-100 py-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">{activeStory.author}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{activeStory.authorRole}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleShare(activeStory)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Share</span>
                </button>
              </div>

              <div className="space-y-4 pt-2 text-sm sm:text-base text-slate-700 font-light leading-relaxed">
                <p className="font-medium text-slate-800 italic border-l-2 border-[#0552A2] pl-3">
                  &ldquo;{activeStory.excerpt}&rdquo;
                </p>
                <p>{activeStory.fullBodySnippet}</p>
                <p>
                  In the Nepal Himalaya, every trail and high pass teaches humility. As weather shifts across the ridges, local knowledge and respect for mountain heritage ensure safe, unforgettable journeys.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0552A2] hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Join the Discussion in Community</span>
              </Link>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Community Dispatches Strip */}
      <section className="bg-[#F7F9FC] py-16 sm:py-20 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0552A2]">
              Live Community Feed
            </span>
            <h3 className="font-poppins text-2xl sm:text-3xl font-medium text-[#10243A]">
              Connect With Real Travelers &amp; Guides
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl">
              Post your summit photographs, share live trail updates, and converse directly with mountain leaders on the Visit Nepal community network.
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-full bg-[#0552A2] text-white hover:bg-[#044182] px-6 py-3 text-xs font-semibold transition-all shadow-xs shrink-0"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Open Community Feed</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
