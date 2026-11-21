'use client';

import React, { Suspense, use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Users,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Download,
  Printer,
  Share2,
  ExternalLink,
  Info,
  Check,
  AlertCircle,
  FileText,
  BadgeCheck,
  Bed,
  Maximize2,
  Coffee,
  Wifi,
  Tv,
  Bath,
  Waves,
  Compass,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

interface HotelRoom {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  capacityAdults: number;
  capacityChildren: number;
  bedType: string;
  roomSizeM2: number;
  pricePerNightNpr: number;
  pricePerNightUsd: number;
  availableInventory: number;
  totalInventory: number;
  images: string[];
  amenities: string[];
  cancellationPolicy: string;
  mealPlan: string;
}

interface HotelReview {
  id: string;
  hotelId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  ratingsBreakdown: {
    cleanliness: number;
    comfort: number;
    location: number;
    service: number;
    value: number;
  };
  reviewText: string;
  tripType: string;
  createdAt: string;
}

interface HotelData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  district: string;
  region: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewsCount: number;
  starRating: number;
  category: string;
  basePriceNpr: number;
  basePriceUsd: number;
  heroImage: string;
  images: string[];
  amenities: string[];
  propertyHighlights: string[];
  checkInTime: string;
  checkOutTime: string;
  policies: {
    cancellation: string;
    childPolicy: string;
    pets: string;
    smoking: string;
  };
  contactPhone: string;
  contactEmail: string;
  rooms: HotelRoom[];
  reviews: HotelReview[];
}

function HotelDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, showToast, refreshData } = useApp();

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery viewer state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Booking / Reservation State
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState<string>(searchParams.get('checkIn') || tomorrow);
  const [checkOut, setCheckOut] = useState<string>(searchParams.get('checkOut') || dayAfterTomorrow);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // Live availability calculation
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Checkout flow state (1: Select Room, 2: Guest Details, 3: Review, 4: Payment, 5: Confirmation)
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Guest Information state
  const [guestFullName, setGuestFullName] = useState(currentUser?.name || 'Aayush Pradhan');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || 'aayush.traveler@visitnepal.com');
  const [guestPhone, setGuestPhone] = useState('+977 9841234567');
  const [guestCountry, setGuestCountry] = useState('Nepal');
  const [guestNationality, setGuestNationality] = useState('Nepali');
  const [specialRequests, setSpecialRequests] = useState('Quiet room on upper floor preferred.');
  const [arrivalTime, setArrivalTime] = useState('14:00 - 16:00');
  const [isBookingForSomeoneElse, setIsBookingForSomeoneElse] = useState(false);

  // Payment Selection state
  const [selectedGateway, setSelectedGateway] = useState<'Khalti' | 'eSewa' | 'Stripe' | 'PayAtHotel'>('Khalti');
  const [paymentMode, setPaymentMode] = useState<'full' | 'advance_deposit' | 'pay_at_property'>('full');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Confirmed Reservation details
  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);

  // Fetch Hotel Details from backend API
  useEffect(() => {
    async function loadHotel() {
      setLoading(true);
      try {
        const res = await api.hotels.get(id);
        if (res && res.hotel) {
          setHotel(res.hotel);
          if (res.hotel.rooms && res.hotel.rooms.length > 0) {
            setSelectedRoomId(res.hotel.rooms[0].id);
          }
        } else {
          setError('Hotel not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load hotel information');
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, [id]);

  // Recalculate price breakdown & check availability whenever dates or rooms change
  useEffect(() => {
    async function recheck() {
      if (!hotel || !checkIn || !checkOut) return;
      setIsCheckingAvailability(true);
      try {
        const res = await api.hotels.checkAvailability(id, {
          checkIn,
          checkOut,
          roomId: selectedRoomId,
          quantity: roomsCount,
          adults: adultsCount,
          children: childrenCount,
        });
        setAvailabilityData(res);
      } catch (err) {
        console.warn('[Availability check failed]', err);
      } finally {
        setIsCheckingAvailability(false);
      }
    }
    recheck();
  }, [id, hotel, checkIn, checkOut, selectedRoomId, roomsCount, adultsCount, childrenCount]);

  // Autofill current user profile
  const handleAutofillProfile = () => {
    if (currentUser) {
      setGuestFullName(currentUser.name || 'Aayush Pradhan');
      setGuestEmail(currentUser.email || 'aayush.traveler@visitnepal.com');
      showToast('Autofilled guest details from your verified traveler profile.');
    }
  };

  // Step transitions
  const handleProceedToGuestDetails = () => {
    if (!availabilityData?.available) {
      showToast('Selected room is not available for these dates. Please choose another room or change dates.');
      return;
    }
    setCheckoutStep(2);
    setIsCheckoutModalOpen(true);
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestFullName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      showToast('Please fill in all required guest information.');
      return;
    }
    setCheckoutStep(3);
  };

  const handleProceedToPayment = () => {
    if (!termsAccepted) {
      showToast('Please accept the booking terms and hotel cancellation policy to proceed.');
      return;
    }
    setCheckoutStep(4);
  };

  // Execute payment & complete reservation
  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // 1. Create reservation record
      const reserveRes = await api.hotels.reserve({
        hotelId: hotel!.id,
        roomId: selectedRoomId,
        checkIn,
        checkOut,
        roomsCount,
        adultsCount,
        childrenCount,
        guestInfo: {
          fullName: guestFullName,
          email: guestEmail,
          phone: guestPhone,
          country: guestCountry,
          nationality: guestNationality,
        },
        specialRequests,
        arrivalTime,
        paymentMode: selectedGateway === 'PayAtHotel' ? 'pay_at_property' : paymentMode,
      });

      if (!reserveRes.success || !reserveRes.booking) {
        throw new Error('Failed to create hotel reservation session.');
      }

      const bookingRef = reserveRes.bookingReference;

      // 2. If pay at hotel, confirm immediately
      if (selectedGateway === 'PayAtHotel') {
        setConfirmedReservation({
          ...reserveRes.booking,
          voucher: {
            hotelName: hotel!.name,
            guestName: guestFullName,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            nights: availabilityData?.nights || 1,
            roomName: availabilityData?.priceBreakdown?.roomName || 'Deluxe Room',
            amountPaidNpr: 0,
            paymentMethod: 'Pay at Hotel Front Desk',
            qrPass: reserveRes.booking.qrCode,
            confirmationDate: new Date().toISOString(),
          },
        });
        setCheckoutStep(5);
        showToast(`Reservation #${bookingRef} confirmed! Pay upon arrival at hotel.`);
        refreshData();
        return;
      }

      // 3. Process gateway payment (Khalti, eSewa, Stripe)
      const payAmount =
        paymentMode === 'advance_deposit'
          ? availabilityData?.priceBreakdown?.depositRequiredNpr
          : availabilityData?.priceBreakdown?.totalAmountNpr;

      const payRes = await api.hotels.pay(bookingRef, {
        provider: selectedGateway === 'Khalti' ? 'Khalti' : selectedGateway === 'eSewa' ? 'eSewa' : 'Stripe',
        amountPaidNpr: payAmount,
        transactionToken: `TOKEN-${selectedGateway.toUpperCase()}-${Date.now()}`,
        paymentMode,
      });

      if (payRes.success && payRes.booking) {
        setConfirmedReservation({
          ...payRes.booking,
          voucher: payRes.voucher,
          transaction: payRes.transaction,
        });
        setCheckoutStep(5);
        showToast(`Payment verified! Reservation #${bookingRef} confirmed.`);
        refreshData();
      }
    } catch (err: any) {
      showToast('Payment failed: ' + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Download pass / voucher
  const handleDownloadVoucher = () => {
    if (!confirmedReservation) return;
    const dataStr = JSON.stringify(confirmedReservation, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Voucher-${confirmedReservation.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded hotel confirmation voucher.');
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-20 text-left font-inter">
        <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-slate-200 border-t-[#0552A2]" />
        <p className="mt-4 text-xs font-semibold text-slate-500">Loading hotel details and live room availability...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-20 text-left font-inter">
        <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
        <h2 className="mt-3 text-lg font-bold text-slate-900 font-poppins">Hotel Property Not Found</h2>
        <p className="mt-1 text-xs text-slate-500">
          The requested accommodation could not be retrieved from the Nepal Tourism Board registry.
        </p>
        <Link
          href="/services?tab=hotel"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Stays & Lodges</span>
        </Link>
      </div>
    );
  }

  const selectedRoom = hotel.rooms.find((r) => r.id === selectedRoomId) || hotel.rooms[0];
  const allImages = [hotel.heroImage, ...(hotel.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 antialiased pb-16">
      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-slate-200/90 bg-white shadow-2xs">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-3">
          <Link
            href="/services?tab=hotel"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0552A2] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Stays & Lodges</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span>NTB Certified Stay</span>
            </span>
          </div>
        </div>
      </div>

      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 space-y-6">
        {/* =====================================================================
            1. HOTEL TITLE & LOCATION HEADER
            ===================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#0552A2] uppercase tracking-wider">
                {hotel.category}
              </span>
              <div className="flex items-center text-[#FDB716]">
                {[...Array(hotel.starRating || 5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FDB716]" />
                ))}
              </div>
            </div>

            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {hotel.name}
            </h1>

            <p className="text-xs text-slate-500 font-medium">{hotel.tagline}</p>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
              <MapPin className="h-3.5 w-3.5 text-[#EC1F27] shrink-0" />
              <span>{hotel.address}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-800">{hotel.district}</span>
            </div>
          </div>

          {/* Quick Rating Badge & Anchor */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">
                {hotel.rating >= 4.9 ? 'Exceptional' : 'Superb'}
              </div>
              <div className="text-[11px] text-slate-500">{hotel.reviewsCount} verified reviews</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0552A2] font-poppins text-sm font-extrabold text-white shadow-sm">
              {hotel.rating}
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. HIGH-QUALITY IMAGE GALLERY (Main + 4-Grid Layout)
            ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          <div className="md:col-span-2 relative group overflow-hidden bg-slate-950 cursor-pointer">
            <img
              src={allImages[0]}
              alt={hotel.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2.5">
            {allImages.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative group overflow-hidden bg-slate-950 cursor-pointer">
                <img
                  src={img}
                  alt={`${hotel.name} ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {idx === 3 && (
                  <button
                    onClick={() => setIsGalleryModalOpen(true)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center text-white text-xs font-bold hover:bg-black/75 transition-colors"
                  >
                    View All {allImages.length} Photographs
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            3. MAIN CONTENT (2-COLUMN: DETAILS LEFT, BOOKING PANEL RIGHT)
            ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Description, Amenities, Rooms, Policies, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview & Story */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-3">
              <h2 className="font-poppins text-lg font-bold text-slate-900">
                Property Overview
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {hotel.description}
              </p>

              {/* Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Property Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hotel.propertyHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Facilities & Amenities */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-3">
              <h2 className="font-poppins text-lg font-bold text-slate-900">
                Hotel Facilities &amp; Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {hotel.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs font-semibold text-slate-700">
                    <Sparkles className="h-3.5 w-3.5 text-[#0552A2]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Selection Section */}
            <div className="space-y-4">
              <div>
                <h2 className="font-poppins text-xl font-bold text-slate-900">
                  Available Room Types
                </h2>
                <p className="text-xs text-slate-500">
                  Select your preferred accommodation suite for your stay.
                </p>
              </div>

              <div className="space-y-4">
                {hotel.rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`overflow-hidden rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-[#0552A2] bg-blue-50/20 shadow-md ring-1 ring-[#0552A2]'
                          : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Room Image */}
                        <div className="md:col-span-4 relative aspect-[4/3] md:aspect-auto bg-slate-900 overflow-hidden">
                          <img
                            src={room.images[0] || hotel.heroImage}
                            alt={room.name}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                            {room.roomSizeM2} m²
                          </span>
                        </div>

                        {/* Room Details */}
                        <div className="md:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-poppins text-base font-bold text-slate-900">
                                  {room.name}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                  {room.description}
                                </p>
                              </div>
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shrink-0">
                                {room.availableInventory} Left
                              </span>
                            </div>

                            {/* Room Specs */}
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5 text-[#0552A2]" />
                                Max {room.capacityAdults} Adults, {room.capacityChildren} Child
                              </span>
                              <span className="flex items-center gap-1">
                                <Bed className="h-3.5 w-3.5 text-[#0552A2]" />
                                {room.bedType}
                              </span>
                              <span className="flex items-center gap-1">
                                <Coffee className="h-3.5 w-3.5 text-emerald-600" />
                                {room.mealPlan}
                              </span>
                            </div>

                            {/* Room Amenities Chips */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {room.amenities.map((ra, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                                >
                                  {ra}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price & Selection CTA */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                Price Per Night
                              </span>
                              <div className="font-poppins text-lg font-extrabold text-[#0552A2]">
                                NPR {room.pricePerNightNpr.toLocaleString()}
                                <span className="text-xs font-normal text-slate-500"> (~${room.pricePerNightUsd})</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRoomId(room.id);
                                showToast(`Selected "${room.name}".`);
                              }}
                              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#0552A2] text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected ? 'Room Selected ✓' : 'Select This Room'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check-In / Check-Out Policies */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-3">
              <h2 className="font-poppins text-lg font-bold text-slate-900">
                Hotel Policies &amp; House Rules
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-700">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#0552A2]" />
                    <span>Check-in &amp; Check-out</span>
                  </div>
                  <p>Check-in: from {hotel.checkInTime} • Check-out: until {hotel.checkOutTime}</p>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-[#EC1F27]" />
                    <span>Cancellation Policy</span>
                  </div>
                  <p>{hotel.policies.cancellation}</p>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">Children &amp; Extra Beds</div>
                  <p>{hotel.policies.childPolicy}</p>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">Pets &amp; Smoking</div>
                  <p>{hotel.policies.pets} {hotel.policies.smoking}</p>
                </div>
              </div>
            </div>

            {/* Guest Reviews & Ratings */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-poppins text-lg font-bold text-slate-900">
                    Guest Reviews &amp; Ratings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real reviews from verified travelers who completed stays.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-poppins text-xl font-extrabold text-[#0552A2]">
                    {hotel.rating} / 5
                  </span>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-3 pt-2">
                {hotel.reviews && hotel.reviews.length > 0 ? (
                  hotel.reviews.map((rev) => (
                    <div key={rev.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0552A2] text-xs font-bold text-white">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900">{rev.userName}</div>
                            <div className="text-[10px] text-slate-400">Trip: {rev.tripType}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#FDB716] font-bold text-xs">
                          <Star className="h-3.5 w-3.5 fill-[#FDB716]" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700">
                        "{rev.reviewText}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No written reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Interactive Booking Panel */}
          <div className="lg:col-span-4 sticky top-20 space-y-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Starting Rate
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-poppins text-2xl font-black text-[#0552A2]">
                    NPR {selectedRoom.pricePerNightNpr.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">/ night</span>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Check-In</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 focus:border-[#0552A2] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Check-Out</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 focus:border-[#0552A2] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rooms and Guests Counter */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700">Rooms</label>
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} Room{n > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700">Adults</label>
                    <select
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 6, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} Adult{n > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700">Children</label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Price Breakdown & Calculation */}
              {availabilityData?.priceBreakdown && (
                <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      NPR {availabilityData.priceBreakdown.baseRateNpr.toLocaleString()} × {availabilityData.nights} nights ({roomsCount} room{roomsCount > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold text-slate-900">
                      NPR {availabilityData.priceBreakdown.roomSubtotalNpr.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Hotel Service Charge (10%)</span>
                    <span>NPR {availabilityData.priceBreakdown.serviceFeeNpr.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Government VAT (13%)</span>
                    <span>NPR {availabilityData.priceBreakdown.vatNpr.toLocaleString()}</span>
                  </div>

                  {availabilityData.priceBreakdown.discountNpr > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Long Stay Discount (5%)</span>
                      <span>- NPR {availabilityData.priceBreakdown.discountNpr.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Payable</span>
                    <span className="text-[#0552A2]">
                      NPR {availabilityData.priceBreakdown.totalAmountNpr.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleProceedToGuestDetails}
                disabled={isCheckingAvailability || (availabilityData && !availabilityData.available)}
                className="w-full rounded-xl bg-[#0552A2] py-3 text-center text-xs font-bold text-white shadow-sm transition-all hover:bg-[#044182] active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isCheckingAvailability ? (
                  <span>Checking Availability...</span>
                ) : availabilityData && !availabilityData.available ? (
                  <span>No Rooms Available for Dates</span>
                ) : (
                  <span>Reserve Stay Now • Step 1/4</span>
                )}
              </button>

              <div className="text-center text-[10px] text-slate-400">
                Instant confirmation • Verified Nepal Tourism Board gateway
              </div>
            </div>

            {/* Assistance Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#0552A2]" />
                <span>Hotel Front Desk Helpline</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Need customized arrival transfers or special dietary arrangements?
              </p>
              <div className="font-bold text-slate-800">{hotel.contactPhone}</div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          CHECKOUT MODAL / PROGRESS WORKFLOW (PHASE 2 & 3)
          ========================================================================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 space-y-5"
          >
            {/* Header & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900">
                  {hotel.name} Reservation
                </h3>
                <p className="text-xs text-slate-500">
                  {checkIn} to {checkOut} ({availabilityData?.nights || 1} Night{availabilityData?.nights > 1 ? 's' : ''})
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Stepper (1: Select Room -> 2: Guest Details -> 3: Review -> 4: Payment -> 5: Confirmation) */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-2">
              <span className={checkoutStep >= 1 ? 'text-[#0552A2]' : ''}>1. Room</span>
              <span>→</span>
              <span className={checkoutStep >= 2 ? 'text-[#0552A2]' : ''}>2. Guest Details</span>
              <span>→</span>
              <span className={checkoutStep >= 3 ? 'text-[#0552A2]' : ''}>3. Review</span>
              <span>→</span>
              <span className={checkoutStep >= 4 ? 'text-[#0552A2]' : ''}>4. Payment</span>
              <span>→</span>
              <span className={checkoutStep === 5 ? 'text-emerald-600' : ''}>5. Confirmation</span>
            </div>

            {/* STEP 2: GUEST DETAILS */}
            {checkoutStep === 2 && (
              <form onSubmit={handleProceedToReview} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 font-poppins">
                    Primary Guest Information
                  </h4>
                  {currentUser && (
                    <button
                      type="button"
                      onClick={handleAutofillProfile}
                      className="text-xs font-semibold text-[#0552A2] hover:underline"
                    >
                      Autofill my profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestFullName}
                      onChange={(e) => setGuestFullName(e.target.value)}
                      placeholder="e.g. Aayush Pradhan"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. aayush@example.com"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+977 9841234567"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Nationality *</label>
                    <input
                      type="text"
                      required
                      value={guestNationality}
                      onChange={(e) => setGuestNationality(e.target.value)}
                      placeholder="e.g. Nepali, American, British"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Estimated Arrival Time</label>
                    <select
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none bg-white"
                    >
                      <option value="12:00 - 14:00">12:00 - 14:00 (Early Check-In Request)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00 (Standard)</option>
                      <option value="16:00 - 18:00">16:00 - 18:00 (Late Afternoon)</option>
                      <option value="18:00 - 22:00">18:00 - 22:00 (Evening Arrival)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Country of Residence</label>
                    <input
                      type="text"
                      value={guestCountry}
                      onChange={(e) => setGuestCountry(e.target.value)}
                      placeholder="e.g. Nepal"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Special Requests / Notes</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g. Upper floor room, airport pickup, dietary requirements..."
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Back to Details
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0552A2] px-5 py-2 text-xs font-bold text-white hover:bg-[#044182]"
                  >
                    Review Reservation • Step 3
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BOOKING REVIEW */}
            {checkoutStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 font-poppins">
                  Review Your Stay Details
                </h4>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200/80 pb-2">
                    <span className="font-bold text-slate-900">{hotel.name}</span>
                    <span className="text-[#0552A2] font-bold">{selectedRoom.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Check-in Date:</span>
                      <span className="font-semibold text-slate-800">{checkIn} (from {hotel.checkInTime})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Check-out Date:</span>
                      <span className="font-semibold text-slate-800">{checkOut} (until {hotel.checkOutTime})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lead Guest:</span>
                      <span className="font-semibold text-slate-800">{guestFullName} ({guestPhone})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nights &amp; Rooms:</span>
                      <span className="font-semibold text-slate-800">
                        {availabilityData?.nights || 1} Night(s) • {roomsCount} Room(s)
                      </span>
                    </div>
                  </div>

                  {/* Financial summary */}
                  <div className="border-t border-slate-200 pt-2 space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Room Subtotal</span>
                      <span>NPR {availabilityData?.priceBreakdown?.roomSubtotalNpr?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Taxes &amp; Hotel Service Charge</span>
                      <span>
                        NPR {((availabilityData?.priceBreakdown?.serviceFeeNpr || 0) + (availabilityData?.priceBreakdown?.vatNpr || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Amount Payable</span>
                      <span className="text-[#0552A2]">
                        NPR {availabilityData?.priceBreakdown?.totalAmountNpr?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms agreement */}
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#0552A2]"
                  />
                  <span>
                    I accept the hotel's cancellation policy (Free cancellation up to 48 hours before check-in) and the Nepal Tourism Board digital booking terms.
                  </span>
                </label>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="rounded-xl bg-[#0552A2] px-5 py-2 text-xs font-bold text-white hover:bg-[#044182]"
                  >
                    Select Payment Gateway • Step 4
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT GATEWAY (KHALTI, ESEWA, STRIPE, PAY AT HOTEL) */}
            {checkoutStep === 4 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 font-poppins">
                  Choose Payment Method
                </h4>

                {/* Payment Mode Selector: Full vs Deposit vs Pay at Hotel */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('full');
                      if (selectedGateway === 'PayAtHotel') setSelectedGateway('Khalti');
                    }}
                    className={`rounded-xl p-2.5 text-center text-xs font-bold border transition-all ${
                      paymentMode === 'full' && selectedGateway !== 'PayAtHotel'
                        ? 'border-[#0552A2] bg-blue-50 text-[#0552A2]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Full Payment (100%)
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      NPR {availabilityData?.priceBreakdown?.totalAmountNpr?.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('advance_deposit');
                      if (selectedGateway === 'PayAtHotel') setSelectedGateway('Khalti');
                    }}
                    className={`rounded-xl p-2.5 text-center text-xs font-bold border transition-all ${
                      paymentMode === 'advance_deposit' && selectedGateway !== 'PayAtHotel'
                        ? 'border-[#0552A2] bg-blue-50 text-[#0552A2]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Advance Deposit (30%)
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      NPR {availabilityData?.priceBreakdown?.depositRequiredNpr?.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGateway('PayAtHotel');
                      setPaymentMode('pay_at_property');
                    }}
                    className={`rounded-xl p-2.5 text-center text-xs font-bold border transition-all ${
                      selectedGateway === 'PayAtHotel'
                        ? 'border-[#0552A2] bg-blue-50 text-[#0552A2]'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Pay at Property
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      NPR 0 Now
                    </span>
                  </button>
                </div>

                {/* Gateway Providers */}
                {selectedGateway !== 'PayAtHotel' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700">Online Payment Gateway</label>

                    {/* Khalti Web Checkout */}
                    <label
                      onClick={() => setSelectedGateway('Khalti')}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        selectedGateway === 'Khalti'
                          ? 'border-[#5C2D91] bg-purple-50/50 shadow-2xs ring-1 ring-[#5C2D91]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5C2D91] text-white font-bold text-sm">
                          K
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Khalti Digital Wallet</div>
                          <div className="text-[10px] text-slate-500">Official Web Checkout • Sandbox Verified</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-[#5C2D91]">
                        Nepal Standard
                      </span>
                    </label>

                    {/* eSewa ePay */}
                    <label
                      onClick={() => setSelectedGateway('eSewa')}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        selectedGateway === 'eSewa'
                          ? 'border-[#60BB46] bg-emerald-50/50 shadow-2xs ring-1 ring-[#60BB46]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#60BB46] text-white font-bold text-sm">
                          e
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">eSewa ePay</div>
                          <div className="text-[10px] text-slate-500">Instant QR &amp; NetBanking Verification</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-[#60BB46]">
                        eSewa Pass
                      </span>
                    </label>

                    {/* International Card / Stripe */}
                    <label
                      onClick={() => setSelectedGateway('Stripe')}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        selectedGateway === 'Stripe'
                          ? 'border-[#0552A2] bg-blue-50/50 shadow-2xs ring-1 ring-[#0552A2]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0552A2] text-white">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">International Visa / Mastercard</div>
                          <div className="text-[10px] text-slate-500">Secured 256-bit TLS Gateway</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#0552A2]">
                        Global Cards
                      </span>
                    </label>
                  </div>
                )}

                {/* Amount to pay summary */}
                <div className="rounded-xl bg-slate-50 p-3 text-xs flex justify-between items-center border border-slate-200/80">
                  <span className="font-semibold text-slate-700">Amount to be charged now:</span>
                  <span className="font-poppins text-base font-extrabold text-[#0552A2]">
                    {selectedGateway === 'PayAtHotel'
                      ? 'NPR 0 (Pay at Check-In)'
                      : paymentMode === 'advance_deposit'
                      ? `NPR ${availabilityData?.priceBreakdown?.depositRequiredNpr?.toLocaleString()} (Deposit)`
                      : `NPR ${availabilityData?.priceBreakdown?.totalAmountNpr?.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(3)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isProcessingPayment}
                    className="rounded-xl bg-[#0552A2] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#044182] disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <span>Verifying with {selectedGateway}...</span>
                    ) : (
                      <span>Confirm &amp; Complete Reservation</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CONFIRMATION & DIGITAL PASS */}
            {checkoutStep === 5 && confirmedReservation && (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>

                <div>
                  <h4 className="font-poppins text-xl font-extrabold text-slate-900">
                    Reservation Confirmed!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your stay at <span className="font-bold text-slate-800">{hotel.name}</span> has been confirmed.
                  </p>
                </div>

                {/* Confirmation Voucher Card */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 text-left text-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-emerald-200/80 pb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Booking Reference</span>
                      <span className="font-mono text-sm font-extrabold text-[#0552A2]">
                        {confirmedReservation.id}
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold">
                      {confirmedReservation.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Hotel &amp; Room:</span>
                      <span className="font-semibold text-slate-900">{confirmedReservation.title}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Guest Name:</span>
                      <span className="font-semibold text-slate-900">{confirmedReservation.userName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Check-In / Check-Out:</span>
                      <span className="font-semibold text-slate-900">
                        {confirmedReservation.checkInDate} → {confirmedReservation.checkOutDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Amount &amp; Status:</span>
                      <span className="font-semibold text-slate-900">
                        NPR {confirmedReservation.totalAmountNpr?.toLocaleString()} ({confirmedReservation.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* QR Token */}
                  <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                    <span>Digital Pass Token: {confirmedReservation.qrCode}</span>
                    <span>Valid at Check-in</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadVoucher}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Voucher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Confirmation</span>
                  </button>

                  <Link
                    href="/bookings"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
                  >
                    <span>View in My Bookings</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GALLERY FULL SCREEN LIGHTBOX MODAL */}
      {isGalleryModalOpen && (
        <div
          onClick={() => setIsGalleryModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-950 flex flex-col justify-between"
          >
            <div className="p-4 flex justify-between items-center text-white z-10">
              <span className="font-bold text-xs">{hotel.name} Photo Gallery ({activeImageIndex + 1}/{allImages.length})</span>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="rounded-full bg-white/20 p-1.5 hover:bg-white/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full overflow-hidden flex items-center justify-center">
              <img
                src={allImages[activeImageIndex]}
                alt="Hotel Large View"
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/80"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnails row */}
            <div className="p-3 flex gap-2 overflow-x-auto justify-center bg-black/60">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-12 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#0552A2] scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-20 text-left font-inter">
          <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-slate-200 border-t-[#0552A2]" />
          <p className="mt-3 text-xs font-semibold text-slate-500">Loading hotel reservation details...</p>
        </div>
      }
    >
      <HotelDetailContent params={params} />
    </Suspense>
  );
}
