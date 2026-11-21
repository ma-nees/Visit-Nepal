'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Filter,
  Star,
  MapPin,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Wifi,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { hotels as defaultHotels, Hotel } from '@/data/mockData';

const CATEGORIES = [
  'All',
  'Luxury Heritage',
  'Resort & Spa',
  'Boutique Lodge',
  'Mountain Teahouse',
  'Eco Retreat',
];

export default function HotelsDirectoryPage() {
  const [hotelsList, setHotelsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const res = await api.hotels.list({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          q: searchQuery.trim() || undefined,
          sortBy,
        });
        if (res && res.hotels && res.hotels.length > 0) {
          setHotelsList(res.hotels);
        } else {
          // Fallback to local catalog
          setHotelsList(defaultHotels);
        }
      } catch (err) {
        console.warn('[Hotels API list fallback]', err);
        setHotelsList(defaultHotels);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [selectedCategory, searchQuery, sortBy]);

  const filteredHotels = hotelsList.filter((hotel) => {
    const matchesSearch =
      !searchQuery.trim() ||
      hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.district?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      hotel.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 antialiased pb-20">
      {/* Top Header Banner */}
      <div className="border-b border-slate-200/90 bg-white shadow-2xs">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8">
          <div className="max-w-4xl space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0552A2] border border-blue-200/80">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0552A2]" />
              <span>Official NTB Statutory Registry · Verified Stays &amp; Alpine Lodges</span>
            </div>
            <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Nepal Accommodations &amp; Mountain Lodges
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              From 13th-century living Newari heritage museums in Kathmandu to eco-luxury safari camps in Chitwan and high-altitude alpine refuges in the Everest &amp; Annapurna ranges.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hotel name, city, district (e.g. Bar Peepal, Pokhara, Chitwan)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#0552A2] focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 focus:border-[#0552A2] focus:outline-none"
              >
                <option value="popularity">Most Popular &amp; Verified</option>
                <option value="rating">Highest Rated (★ 4.8+)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0552A2] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {filteredHotels.length} Registered Accommodations
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-slate-200 border-t-[#0552A2]" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Retrieving official properties from Nepal Tourism Board registry...</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-poppins font-bold text-slate-900 text-base">No Matching Accommodations</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or switching to another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredHotels.map((hotel) => {
              const hotelId = hotel.id;
              const priceDisplay = hotel.basePriceNpr
                ? `NPR ${Number(hotel.basePriceNpr).toLocaleString('en-IN')}`
                : hotel.price || '$145 / night';
              const img = hotel.heroImage || hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
              const rating = hotel.rating || 4.9;
              const category = hotel.category || 'Luxury Heritage';

              return (
                <div
                  key={hotelId}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:border-[#0552A2]/40 hover:shadow-md transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={img}
                      alt={hotel.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-lg bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white border border-white/20">
                        {category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="rounded-lg bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[11px] font-extrabold text-slate-900 shadow-xs flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{hotel.location || `${hotel.district || 'Nepal'}`}</span>
                      </div>

                      <h3 className="font-poppins font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0552A2] transition-colors mt-1 line-clamp-1">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {hotel.description || hotel.tagline}
                      </p>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {((hotel.amenities || hotel.highlights || []) as string[]).slice(0, 3).map((am) => (
                          <span
                            key={am}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Starting from</span>
                        <span className="text-xs sm:text-sm font-extrabold text-[#0552A2] mt-0.5 block">
                          {priceDisplay}
                          <span className="text-[10px] font-normal text-slate-500"> / night</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/hotels/${hotelId}`}
                          className="inline-flex items-center justify-center rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-bold shadow-xs active:scale-98 transition-all cursor-pointer"
                        >
                          <span>Reserve Stay</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
