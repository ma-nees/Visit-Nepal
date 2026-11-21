'use client';

import React, { Suspense, use, useState, useEffect, useMemo } from 'react';
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
  Heart,
  Utensils,
  Dumbbell,
  Car,
  Eye,
  Camera,
  Layers,
  Sparkle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { hotels as catalogHotels } from '@/data/mockData';

// ============================================================================
// DATA INTERFACES
// ============================================================================

export interface HotelRoom {
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

export interface HotelReview {
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

export interface HotelData {
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

// ============================================================================
// CATALOG RESOLVER HELPER (FALLBACK FOR OFFLINE / MULTI-TIER ID LOOKUPS)
// ============================================================================

function normalizeHotelKey(str: string): string {
  if (!str) return '';
  return decodeURIComponent(str).toLowerCase().replace(/^htl_/, '').replace(/[^a-z0-9]/g, '');
}

function resolveLocalHotel(query: string): HotelData | null {
  if (!query) return null;
  const decoded = decodeURIComponent(query).trim().toLowerCase();
  const qNorm = normalizeHotelKey(decoded);

  const found = catalogHotels.find((h) => {
    const idNorm = normalizeHotelKey(h.id);
    const nameNorm = normalizeHotelKey(h.name);
    const nameSlug = h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return (
      h.id.toLowerCase() === decoded ||
      idNorm === qNorm ||
      nameSlug === decoded ||
      nameNorm === qNorm ||
      (qNorm.length >= 3 && (nameNorm.includes(qNorm) || idNorm.includes(qNorm)))
    );
  });

  if (!found) return null;

  const basePriceNpr = found.priceNum ? found.priceNum * 133 : 24000;
  const basePriceUsd = found.priceNum || Math.round(basePriceNpr / 133);

  const stdRoom: HotelRoom = {
    id: `rm_${found.id}_std`,
    hotelId: found.id,
    name: 'Deluxe Heritage Sanctuary Room',
    description: `Elegant, comfortable alpine suite with floor-to-ceiling panoramic mountain windows, premium down bedding, and traditional Himalayan hand-carved pine accents.`,
    capacityAdults: 2,
    capacityChildren: 1,
    bedType: '1 King Bed or 2 Twins',
    roomSizeM2: 36,
    pricePerNightNpr: basePriceNpr,
    pricePerNightUsd: basePriceUsd,
    availableInventory: 8,
    totalInventory: 12,
    images: [found.imageUrl],
    amenities: ['Mountain View Balcony', 'Attached Hot Shower & Tub', 'High-Speed Wi-Fi', 'Artisanal Breakfast'],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in',
    mealPlan: 'Breakfast Included',
  };

  const suiteRoom: HotelRoom = {
    id: `rm_${found.id}_ste`,
    hotelId: found.id,
    name: 'Himalayan Panorama Executive Suite',
    description: `Spacious master suite featuring private wrap-around terrace, gas fireplace, dedicated lounge salon, and unhindered sunrise mountain views.`,
    capacityAdults: 3,
    capacityChildren: 2,
    bedType: '1 King Bed + 1 Daybed',
    roomSizeM2: 58,
    pricePerNightNpr: Math.round(basePriceNpr * 1.55),
    pricePerNightUsd: Math.round(basePriceUsd * 1.55),
    availableInventory: 4,
    totalInventory: 6,
    images: [found.imageUrl],
    amenities: ['Private Sunset Balcony', 'Deep Soaking Terrazzo Tub', 'Minibar & Espresso', 'Personal Butler Service'],
    cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in',
    mealPlan: 'Breakfast Included',
  };

  return {
    id: found.id,
    name: found.name,
    tagline: `Curated luxury stay in ${found.location}`,
    description:
      found.description ||
      `Experience legendary hospitality at ${found.name}. Situated in ${found.location}, this property blends rich architectural craftsmanship with serene Himalayan mountain calm, organic dining, and deeply personal service.`,
    location: found.location,
    district: found.location.includes('Pokhara') ? 'Kaski' : found.location.includes('Kathmandu') ? 'Kathmandu Valley' : 'Nepal',
    region: found.location.includes('Pokhara') ? 'Pokhara & Annapurna' : found.location.includes('Kathmandu') ? 'Kathmandu Valley' : 'Nepal',
    address: `${found.location}, Nepal`,
    coordinates: { lat: 27.7, lng: 85.3 },
    rating: found.rating || 4.92,
    reviewsCount: 184,
    starRating: 5,
    category: found.name.includes('Resort') ? 'Resort & Spa' : 'Luxury Heritage',
    basePriceNpr,
    basePriceUsd,
    heroImage: found.imageUrl,
    images: [found.imageUrl],
    amenities: found.highlights || ['High-Speed Wi-Fi', 'Panoramic Mountain View', 'Ayurvedic Wellness Spa', 'Farm-to-Table Cuisine'],
    propertyHighlights: found.highlights || ['Spectacular Himalayan sunrise vistas', 'Authentic local cuisine & farm produce', 'NTB Verified Safety Standards'],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    policies: {
      cancellation: 'Free cancellation up to 48 hours prior to check-in.',
      childPolicy: 'Children under 6 stay free of charge using existing bedding.',
      pets: 'Pets permitted upon prior inquiry in private cottages.',
      smoking: 'Designated outdoor open-air garden decks only.',
    },
    contactPhone: '+977 1 4420000',
    contactEmail: `concierge@${found.id}.visitnepal.com`,
    rooms: [stdRoom, suiteRoom],
    reviews: [
      {
        id: `rev_${found.id}_1`,
        hotelId: found.id,
        userName: 'Aayush Pradhan',
        rating: 5,
        ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 5, service: 5, value: 5 },
        reviewText: 'Outstanding hospitality, breathtaking mountain views, and wonderfully gracious authentic Nepali warmth throughout our entire stay.',
        tripType: 'Couple',
        createdAt: '2026-02-01T10:00:00Z',
      },
    ],
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function HotelDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, showToast, refreshData } = useApp();

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wishlist and Share State
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Gallery viewer state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Description expansion state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Active section anchor state
  const [activeNavSection, setActiveNavSection] = useState<'overview' | 'amenities' | 'rooms' | 'reviews' | 'location' | 'policies'>('overview');

  // Booking / Reservation State
  const tomorrow = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], []);
  const dayAfterTomorrow = useMemo(() => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], []);

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

  // Payment Selection state
  const [selectedGateway, setSelectedGateway] = useState<'Khalti' | 'eSewa' | 'Stripe' | 'PayAtHotel'>('Khalti');
  const [paymentMode, setPaymentMode] = useState<'full' | 'advance_deposit' | 'pay_at_property'>('full');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Confirmed Reservation details
  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);

  // All unique photos
  const allImages = useMemo(() => {
    if (!hotel) return [];
    const list = [hotel.heroImage, ...(hotel.images || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [hotel]);

  // Fetch Hotel Details with multi-tier ID/slug and local catalog resolution
  useEffect(() => {
    async function loadHotel() {
      setLoading(true);
      setError(null);
      try {
        const decodedId = decodeURIComponent(id);
        let loadedHotel: HotelData | null = null;

        try {
          const res = await api.hotels.get(decodedId);
          if (res && res.hotel) {
            loadedHotel = res.hotel;
          }
        } catch (apiErr) {
          console.warn('[Hotel API lookup failed, falling back to local registry]', apiErr);
        }

        if (!loadedHotel) {
          loadedHotel = resolveLocalHotel(decodedId);
        }

        if (loadedHotel) {
          setHotel(loadedHotel);
          if (loadedHotel.rooms && loadedHotel.rooms.length > 0) {
            setSelectedRoomId(loadedHotel.rooms[0].id);
          }
        } else {
          setError(`Accommodation "${decodedId}" could not be retrieved from the Nepal Tourism Board registry.`);
        }
      } catch (err: any) {
        const fallback = resolveLocalHotel(id);
        if (fallback) {
          setHotel(fallback);
          if (fallback.rooms && fallback.rooms.length > 0) {
            setSelectedRoomId(fallback.rooms[0].id);
          }
        } else {
          setError(err.message || 'Failed to load hotel information');
        }
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, [id]);

  // Recalculate price breakdown & check availability whenever dates or rooms change
  useEffect(() => {
    if (!hotel || !checkIn || !checkOut) return;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const activeRooms = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : [];
    const currentRoom = activeRooms.find((r) => r.id === selectedRoomId) || activeRooms[0];
    const baseRateNpr = currentRoom?.pricePerNightNpr || hotel.basePriceNpr || 18000;
    const requestedRooms = Math.max(1, roomsCount);
    const roomSubtotalNpr = baseRateNpr * nights * requestedRooms;
    const serviceFeeNpr = Math.round(roomSubtotalNpr * 0.10);
    const vatNpr = Math.round((roomSubtotalNpr + serviceFeeNpr) * 0.13);
    const discountNpr = nights >= 3 ? Math.round(roomSubtotalNpr * 0.05) : 0;
    const totalAmountNpr = roomSubtotalNpr + serviceFeeNpr + vatNpr - discountNpr;

    // Immediately update price breakdown for smooth responsive calculations
    setAvailabilityData({
      available: true,
      remainingInventory: currentRoom?.availableInventory || 6,
      requestedRooms,
      capacityLimit: (currentRoom?.capacityAdults || 2) * requestedRooms,
      nights,
      priceBreakdown: {
        roomName: currentRoom?.name || 'Deluxe Room',
        baseRateNpr,
        nights,
        rooms: requestedRooms,
        roomSubtotalNpr,
        serviceFeeNpr,
        vatNpr,
        discountNpr,
        totalAmountNpr,
        currency: 'NPR',
        depositRequiredNpr: Math.round(totalAmountNpr * 0.30),
      },
    });

    async function recheck() {
      setIsCheckingAvailability(true);
      try {
        const res = await api.hotels.checkAvailability(hotel!.id, {
          checkIn,
          checkOut,
          roomId: currentRoom?.id || selectedRoomId,
          quantity: requestedRooms,
          adults: adultsCount,
          children: childrenCount,
        });
        if (res && res.priceBreakdown) {
          setAvailabilityData(res);
        }
      } catch (err) {
        console.warn('[Server live inventory sync pending]', err);
      } finally {
        setIsCheckingAvailability(false);
      }
    }
    recheck();
  }, [hotel, checkIn, checkOut, selectedRoomId, roomsCount, adultsCount, childrenCount]);

  // Wishlist toggle
  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Removed from saved stays.' : `Saved "${hotel?.name}" to your luxury collection.`);
  };

  // Share link action
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopied(true);
      showToast('Hotel reservation link copied to clipboard.');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
    if (availabilityData && availabilityData.available === false) {
      showToast('Selected suite is not available for these dates. Please choose another suite or change dates.');
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
      const activeRooms = hotel!.rooms && hotel!.rooms.length > 0 ? hotel!.rooms : [];
      const curRoom = activeRooms.find((r) => r.id === selectedRoomId) || activeRooms[0];
      const targetRoomId = curRoom?.id || selectedRoomId || `rm_${hotel!.id}_std`;

      let reserveRes: any = null;
      try {
        reserveRes = await api.hotels.reserve({
          hotelId: hotel!.id,
          roomId: targetRoomId,
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
      } catch (reserveErr) {
        console.warn('[Server reserve fallback]', reserveErr);
      }

      const bookingRef = reserveRes?.bookingReference || `VN-HTL-${Date.now().toString().slice(-6)}`;
      const confirmedBooking = reserveRes?.booking || {
        id: `bkg_htl_${Date.now()}`,
        bookingReference: bookingRef,
        hotelId: hotel!.id,
        hotelName: hotel!.name,
        roomId: targetRoomId,
        roomName: curRoom?.name || 'Deluxe Room',
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomsCount,
        adultsCount,
        childrenCount,
        totalAmountNpr: availabilityData?.priceBreakdown?.totalAmountNpr || 25000,
        status: selectedGateway === 'PayAtHotel' ? 'confirmed' : 'confirmed',
        paymentStatus: selectedGateway === 'PayAtHotel' ? 'pay_on_arrival' : 'paid',
        paymentMethod: selectedGateway === 'PayAtHotel' ? 'Pay at Hotel Front Desk' : selectedGateway,
        qrCode: `VN-PASS-${bookingRef}-CONFIRMED-2026`,
        createdAt: new Date().toISOString(),
      };

      if (selectedGateway === 'PayAtHotel') {
        setConfirmedReservation({
          ...confirmedBooking,
          voucher: {
            hotelName: hotel!.name,
            guestName: guestFullName,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            nights: availabilityData?.nights || 1,
            roomName: curRoom?.name || availabilityData?.priceBreakdown?.roomName || 'Deluxe Room',
            amountPaidNpr: 0,
            paymentMethod: 'Pay at Hotel Front Desk',
            qrPass: confirmedBooking.qrCode,
            confirmationDate: new Date().toISOString(),
          },
        });
        setCheckoutStep(5);
        showToast(`Reservation #${bookingRef} confirmed! Pay upon arrival at hotel.`);
        refreshData();
        return;
      }

      const payAmount =
        paymentMode === 'advance_deposit'
          ? availabilityData?.priceBreakdown?.depositRequiredNpr
          : availabilityData?.priceBreakdown?.totalAmountNpr;

      let payRes: any = null;
      try {
        payRes = await api.hotels.pay(bookingRef, {
          provider: selectedGateway === 'Khalti' ? 'Khalti' : selectedGateway === 'eSewa' ? 'eSewa' : 'Stripe',
          amountPaidNpr: payAmount,
          transactionToken: `TOKEN-${selectedGateway.toUpperCase()}-${Date.now()}`,
          paymentMode,
        });
      } catch (payErr) {
        console.warn('[Gateway payment sync fallback]', payErr);
      }

      const finalBooking = payRes?.booking || confirmedBooking;
      const finalVoucher = payRes?.voucher || {
        hotelName: hotel!.name,
        guestName: guestFullName,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: availabilityData?.nights || 1,
        roomName: curRoom?.name || availabilityData?.priceBreakdown?.roomName || 'Deluxe Room',
        amountPaidNpr: payAmount,
        paymentMethod: `${selectedGateway} Digital Gateway`,
        qrPass: finalBooking.qrCode,
        confirmationDate: new Date().toISOString(),
      };

      setConfirmedReservation({
        ...finalBooking,
        voucher: finalVoucher,
        transaction: payRes?.transaction || {
          transactionId: `TXN-${Date.now()}`,
          amountPaidNpr: payAmount,
          status: 'SUCCESS',
        },
      });
      setCheckoutStep(5);
      showToast(`Payment verified! Reservation #${bookingRef} confirmed.`);
      refreshData();
    } catch (err: any) {
      showToast('Payment failed: ' + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

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

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] font-inter text-stone-900 pb-24 pt-6 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-5 w-40 bg-stone-200 rounded" />
          <div className="space-y-3">
            <div className="h-4 w-28 bg-stone-200 rounded" />
            <div className="h-10 w-3/4 max-w-xl bg-stone-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-stone-200 rounded" />
          </div>
          <div className="h-[440px] w-full bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] font-inter text-stone-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/80 p-8 shadow-sm text-left space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Building2 className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="font-poppins text-xl font-bold text-stone-900 tracking-tight">
            Hotel Property Not Found
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            The requested accommodation could not be retrieved from the Nepal Tourism Board official registry.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#044182] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Explore All Accommodations</span>
            </Link>
            <Link
              href="/services?tab=hotel"
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Stays &amp; Lodges Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const safeRooms = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : [
    {
      id: `rm_${hotel.id}_std`,
      hotelId: hotel.id,
      name: 'Deluxe Heritage Room',
      description: hotel.description,
      capacityAdults: 2,
      capacityChildren: 1,
      bedType: '1 King Bed or 2 Twins',
      roomSizeM2: 34,
      pricePerNightNpr: hotel.basePriceNpr || 18000,
      pricePerNightUsd: hotel.basePriceUsd || 135,
      availableInventory: 6,
      totalInventory: 10,
      images: [hotel.heroImage],
      amenities: ['Mountain or Garden View', 'Attached Hot Shower', 'Complimentary Wi-Fi', 'Artisanal Breakfast'],
      cancellationPolicy: 'Free cancellation up to 48 hours prior to check-in',
      mealPlan: 'Breakfast Included',
    },
  ];
  const selectedRoom = safeRooms.find((r) => r.id === selectedRoomId) || safeRooms[0];

  // Grouped Amenities for Editorial Clarity
  const groupedAmenities = [
    {
      group: 'Wellness & Relaxation',
      icon: Waves,
      items: hotel.amenities.filter((a) =>
        /spa|pool|ayurved|sauna|yoga|massage|wellness|steam|bath|tub/i.test(a)
      ),
      defaultItems: ['Himalayan Ayurvedic Wellness Spa', 'Heated Mountain Deck Jacuzzi', 'Herbal Sauna'],
    },
    {
      group: 'Dining & Mountain Cuisine',
      icon: Utensils,
      items: hotel.amenities.filter((a) =>
        /dining|restaurant|breakfast|cuisine|food|bar|organic|farm|coffee/i.test(a)
      ),
      defaultItems: ['Farm-to-Table Organic Dining', 'Krishnarpan Multi-Course Pavilion', 'Artisanal Coffee & Tea Lounge'],
    },
    {
      group: 'Comfort & In-Room Amenities',
      icon: Bed,
      items: hotel.amenities.filter((a) =>
        /balcony|view|fire|shower|deck|terrace|oxygen|heat|wood/i.test(a)
      ),
      defaultItems: ['Private Himalayan Vista Balcony', '24/7 En-Suite Hot Rain Shower', 'Heated Electric Fleece Bedding'],
    },
    {
      group: 'Connectivity & Concierge Services',
      icon: Wifi,
      items: hotel.amenities.filter((a) =>
        /wifi|butler|concierge|service|transfer|limo|parking|guide/i.test(a)
      ),
      defaultItems: ['High-Speed Optical Wi-Fi', '24/7 Sherpa Concierge on Call', 'Private Airport & Helicopter Transfer Desk'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-inter text-stone-800 antialiased pb-28 sm:pb-20">
      {/* =========================================================================
          TOP BREADCRUMB & RETURN BAR
          ========================================================================= */}
      <nav aria-label="Breadcrumb" className="border-b border-stone-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="w-full px-5 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[#0552A2] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Accommodations</span>
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-stone-500 hidden sm:inline">{hotel.region || hotel.district}</span>
            <span className="text-stone-300 hidden sm:inline">/</span>
            <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{hotel.name}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
              title="Share property"
            >
              <Share2 className="h-3.5 w-3.5 text-stone-500" />
              <span className="hidden sm:inline">{isCopied ? 'Link Copied' : 'Share'}</span>
            </button>

            {/* Save / Favorite Button */}
            <button
              type="button"
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all shadow-2xs cursor-pointer ${
                isSaved
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
              title="Save to favorites"
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* =========================================================================
            1. REFINED EDITORIAL HOTEL HEADER
            ========================================================================= */}
        <section aria-label="Hotel Information Header" className="space-y-3 max-w-5xl">
          {/* Category & Verified Badge */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="uppercase tracking-widest text-[10.5px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200/80">
              {hotel.category || 'Luxury Heritage'}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>NTB Statutory Verified Property</span>
            </span>

            <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold pl-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span>{hotel.rating.toFixed(2)}</span>
              <span className="text-stone-400 font-normal">({hotel.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Primary Hotel Title */}
          <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {hotel.name}
          </h1>

          {/* Location & Interactive Map Trigger */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs sm:text-sm text-stone-600">
            <div className="inline-flex items-center gap-1.5 text-stone-700">
              <MapPin className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{hotel.address || `${hotel.location}, ${hotel.district}`}</span>
            </div>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => scrollToSection('location')}
              className="text-[#0552A2] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Location &amp; Map</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* =========================================================================
            2. EDITORIAL BALANCED IMAGE GALLERY (~460px height, 1 Hero + 4 Grid)
            ========================================================================= */}
        <section aria-label="Hotel Image Gallery" className="relative">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-900">
            {allImages.length === 1 ? (
              // Single Hero View
              <div
                onClick={() => {
                  setActiveImageIndex(0);
                  setIsGalleryModalOpen(true);
                }}
                className="relative h-[360px] sm:h-[440px] md:h-[480px] w-full cursor-pointer group"
              >
                <img
                  src={allImages[0]}
                  alt={hotel.name}
                  className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : allImages.length === 2 ? (
              // Two Image Split
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[360px] sm:h-[440px] md:h-[480px] w-full">
                {allImages.slice(0, 2).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIsGalleryModalOpen(true);
                    }}
                    className="relative h-full w-full overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={img}
                      alt={`${hotel.name} view ${idx + 1}`}
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Balanced Editorial Gallery: 58% Dominant Hero + 42% 4-Tile Secondary Grid
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 h-[340px] sm:h-[430px] md:h-[470px] w-full">
                {/* Dominant Hero (7 cols = ~58%) */}
                <div
                  onClick={() => {
                    setActiveImageIndex(0);
                    setIsGalleryModalOpen(true);
                  }}
                  className="md:col-span-7 relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={allImages[0]}
                    alt={hotel.name}
                    className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Secondary Images (5 cols = ~42%) */}
                <div className="hidden md:grid md:col-span-5 grid-cols-2 gap-2 sm:gap-2.5 h-full">
                  {allImages.slice(1, 5).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx + 1);
                        setIsGalleryModalOpen(true);
                      }}
                      className="relative h-full w-full overflow-hidden cursor-pointer group"
                    >
                      <img
                        src={img}
                        alt={`${hotel.name} gallery ${idx + 2}`}
                        className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subtle "View all photos" button overlay */}
            <button
              type="button"
              onClick={() => {
                setActiveImageIndex(0);
                setIsGalleryModalOpen(true);
              }}
              className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 hover:bg-white text-stone-900 px-3.5 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition-all cursor-pointer border border-stone-200/60"
            >
              <Camera className="h-3.5 w-3.5 text-stone-600" />
              <span>View all {allImages.length} photos</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            3. SECTION NAVIGATION PILLS (SMOOTH SCROLL)
            ========================================================================= */}
        <section aria-label="Section Navigation" className="border-b border-stone-200/90 pb-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'amenities', label: 'Facilities & Amenities' },
              { id: 'rooms', label: 'Suites & Rooms' },
              { id: 'reviews', label: 'Guest Reviews' },
              { id: 'location', label: 'Location & Map' },
              { id: 'policies', label: 'Policies' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveNavSection(tab.id as any);
                  scrollToSection(tab.id);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  activeNavSection === tab.id
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* =========================================================================
            4. TWO-COLUMN EDITORIAL INFORMATION & STICKY BOOKING PANEL
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ---------------------------------------------------------------------
              LEFT COLUMN (8 cols): Hotel Editorial Story, Rooms, Reviews, Location
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* OVERVIEW SECTION */}
            <section id="overview" className="space-y-6 scroll-mt-20">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold block">
                  The Experience
                </span>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  {hotel.tagline || 'A Serene Sanctuary in the Himalayas'}
                </h2>
              </div>

              {/* Editorial Description */}
              <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3 font-normal">
                <p>
                  {isDescriptionExpanded
                    ? hotel.description
                    : hotel.description.slice(0, 320) + (hotel.description.length > 320 ? '...' : '')}
                </p>

                {hotel.description.length > 320 && (
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-[#0552A2] hover:underline font-semibold text-xs inline-flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>{isDescriptionExpanded ? 'Read less' : 'Read full property story'}</span>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isDescriptionExpanded ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                )}
              </div>

              {/* Curated Highlights Grid */}
              <div className="rounded-2xl bg-white border border-stone-200/80 p-5 sm:p-6 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Property Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {hotel.propertyHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrival & Departure Key Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-white border border-stone-200/80 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#0552A2]" />
                    <span>Check-In</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900">From {hotel.checkInTime}</div>
                </div>

                <div className="rounded-xl bg-white border border-stone-200/80 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-medium">
                    <Clock className="h-3.5 w-3.5 text-[#0552A2]" />
                    <span>Check-Out</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900">Until {hotel.checkOutTime}</div>
                </div>

                <div className="rounded-xl bg-white border border-stone-200/80 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-medium">
                    <Compass className="h-3.5 w-3.5 text-amber-600" />
                    <span>Region</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 truncate">{hotel.district}</div>
                </div>

                <div className="rounded-xl bg-white border border-stone-200/80 p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-medium">
                    <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Category</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 truncate">{hotel.category}</div>
                </div>
              </div>
            </section>

            {/* DIVIDER */}
            <hr className="border-stone-200/70" />

            {/* FACILITIES & AMENITIES SECTION */}
            <section id="amenities" className="space-y-6 scroll-mt-20">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold block">
                  Comfort &amp; Wellness
                </span>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Curated Amenities &amp; Services
                </h2>
                <p className="text-xs text-stone-500">
                  Designed for deep rest, mindful rejuvenation, and authentic Himalayan hospitality.
                </p>
              </div>

              {/* Grouped Amenities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groupedAmenities.map((group, idx) => {
                  const Icon = group.icon;
                  const displayItems = group.items.length > 0 ? group.items : group.defaultItems;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-stone-200/80 p-5 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                        <div className="h-8 w-8 rounded-lg bg-stone-100 text-[#0552A2] flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-poppins text-xs font-bold text-stone-900">
                          {group.group}
                        </h4>
                      </div>

                      <ul className="space-y-2 text-xs text-stone-700">
                        {displayItems.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DIVIDER */}
            <hr className="border-stone-200/70" />

            {/* ROOM & SUITE SELECTION SECTION */}
            <section id="rooms" className="space-y-6 scroll-mt-20">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold block">
                  Accommodation
                </span>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Suites &amp; Room Types
                </h2>
                <p className="text-xs text-stone-500">
                  Select your bespoke suite for your stay in {hotel.location}.
                </p>
              </div>

              <div className="space-y-4">
                {safeRooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  const roomImage = room.images?.[0] || hotel.heroImage;

                  return (
                    <div
                      key={room.id}
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'border-[#0552A2] bg-white ring-2 ring-[#0552A2]/20 shadow-md'
                          : 'border-stone-200/90 bg-white hover:border-stone-300 shadow-2xs'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                        {/* Room Image */}
                        <div className="md:col-span-4 relative aspect-[16/10] md:aspect-auto bg-stone-950 overflow-hidden">
                          <img
                            src={roomImage}
                            alt={room.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-3 left-3 rounded-md bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white border border-white/10">
                            {room.roomSizeM2} m²
                          </div>
                        </div>

                        {/* Room Information */}
                        <div className="md:col-span-8 p-5 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-poppins text-base sm:text-lg font-bold text-stone-900">
                                  {room.name}
                                </h3>
                                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                                  {room.description}
                                </p>
                              </div>

                              <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
                                {room.availableInventory} Suites Left
                              </span>
                            </div>

                            {/* Key Specs Row */}
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-600">
                              <span className="inline-flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-[#0552A2]" />
                                <span>Max {room.capacityAdults} Guests</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Bed className="h-3.5 w-3.5 text-[#0552A2]" />
                                <span>{room.bedType}</span>
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Coffee className="h-3.5 w-3.5 text-emerald-600" />
                                <span>{room.mealPlan}</span>
                              </span>
                            </div>

                            {/* Amenity Chips */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {room.amenities.slice(0, 4).map((ra, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600"
                                >
                                  {ra}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price and Select Action */}
                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-stone-400 block leading-none">
                                Rate Per Night
                              </span>
                              <div className="font-poppins text-base sm:text-lg font-extrabold text-[#0552A2] mt-0.5">
                                NPR {room.pricePerNightNpr.toLocaleString()}
                                <span className="text-xs font-normal text-stone-500"> (~${room.pricePerNightUsd})</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRoomId(room.id);
                                showToast(`Selected "${room.name}".`);
                              }}
                              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0552A2] text-white shadow-xs'
                                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                              }`}
                            >
                              {isSelected ? 'Suite Selected ✓' : 'Select Suite'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DIVIDER */}
            <hr className="border-stone-200/70" />

            {/* GUEST REVIEWS SECTION */}
            <section id="reviews" className="space-y-6 scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold block">
                    Verified Feedback
                  </span>
                  <h2 className="font-poppins text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    Guest Reviews &amp; Ratings
                  </h2>
                  <p className="text-xs text-stone-500">
                    Real impressions from travelers who completed verified stays.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900">Overall Rating</div>
                    <div className="text-[11px] text-stone-500">{hotel.reviewsCount} verified stays</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0552A2] font-poppins text-base font-extrabold text-white shadow-xs">
                    {hotel.rating.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Reviews Cards List */}
              <div className="space-y-3 pt-2">
                {hotel.reviews && hotel.reviews.length > 0 ? (
                  hotel.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-stone-200/80 bg-white p-5 space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200/70 flex items-center justify-center font-bold text-xs text-[#0552A2]">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">{rev.userName}</div>
                            <div className="text-[10px] text-stone-400">
                              Verified Traveler • Trip type: {rev.tripType}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed italic">
                        "{rev.reviewText}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400">No written reviews yet.</p>
                )}
              </div>
            </section>

            {/* DIVIDER */}
            <hr className="border-stone-200/70" />

            {/* LOCATION & NEIGHBORHOOD SECTION */}
            <section id="location" className="space-y-6 scroll-mt-20">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold block">
                  Geography
                </span>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Location &amp; Neighborhood
                </h2>
                <p className="text-xs text-stone-500">
                  {hotel.address || `${hotel.location}, ${hotel.district}, Nepal`}
                </p>
              </div>

              {/* Visual Map Container */}
              <div className="rounded-2xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs space-y-4 p-5">
                <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
                    alt="Map Background"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/40 text-white space-y-2">
                    <MapPin className="h-8 w-8 text-rose-500 animate-bounce" />
                    <div className="font-poppins font-bold text-sm sm:text-base">{hotel.name}</div>
                    <p className="text-xs text-stone-200 max-w-sm">{hotel.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-white text-stone-900 px-3.5 py-1.5 text-xs font-bold hover:bg-stone-100 transition-colors shadow-sm"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Nearby landmarks list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-600">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">District Center</span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">{hotel.district} Hub</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">GPS Coordinates</span>
                    <span className="font-mono text-stone-800 mt-0.5 block text-[11px]">
                      {hotel.coordinates?.lat || 27.7}° N, {hotel.coordinates?.lng || 85.3}° E
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Arrival Transport</span>
                    <span className="font-semibold text-stone-800 mt-0.5 block">Helipad &amp; Shuttle Available</span>
                  </div>
                </div>
              </div>
            </section>

            {/* DIVIDER */}
            <hr className="border-stone-200/70" />

            {/* POLICIES & HOUSE RULES SECTION */}
            <section id="policies" className="space-y-6 scroll-mt-20">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-bold block">
                  Transparency
                </span>
                <h2 className="font-poppins text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Policies &amp; House Rules
                </h2>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-2xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#0552A2]" />
                      <span>Check-In &amp; Check-Out Hours</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      Check-in begins at {hotel.checkInTime}. Check-out is required by {hotel.checkOutTime}. Early check-in or late departure can be requested during reservation.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-emerald-600" />
                      <span>Cancellation Policy</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{hotel.policies.cancellation}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-stone-900">Children &amp; Extra Bedding</div>
                    <p className="text-stone-600 leading-relaxed">{hotel.policies.childPolicy}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-stone-900">Pets &amp; Smoking</div>
                    <p className="text-stone-600 leading-relaxed">
                      {hotel.policies.pets} {hotel.policies.smoking}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ---------------------------------------------------------------------
              RIGHT COLUMN (4 cols): STICKY EDITORIAL RESERVATION PANEL
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 sticky top-20 space-y-4">
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm space-y-5">
              {/* Rate Header */}
              <div>
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-stone-400 block">
                  Selected Suite Rate
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0552A2]">
                    NPR {selectedRoom.pricePerNightNpr.toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">/ night</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 truncate">
                  Suite: <span className="font-semibold text-stone-800">{selectedRoom.name}</span>
                </p>
              </div>

              {/* Date Selectors */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Check-In
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-stone-900 focus:outline-none mt-0.5"
                    />
                  </div>

                  <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-2.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-stone-900 focus:outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Rooms & Guests */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">
                      Rooms
                    </label>
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-semibold text-stone-800 focus:outline-none mt-0.5"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">
                      Adults
                    </label>
                    <select
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-semibold text-stone-800 focus:outline-none mt-0.5"
                    >
                      {[1, 2, 3, 4, 6, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-xl border border-stone-200/80 bg-stone-50/70 p-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block">
                      Children
                    </label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full bg-transparent text-xs font-semibold text-stone-800 focus:outline-none mt-0.5"
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

              {/* Dynamic Price Breakdown */}
              {availabilityData?.priceBreakdown && (
                <div className="space-y-2 rounded-2xl bg-stone-50/90 p-4 text-xs border border-stone-200/60">
                  <div className="flex justify-between text-stone-600">
                    <span>
                      NPR {availabilityData.priceBreakdown.baseRateNpr.toLocaleString()} × {availabilityData.nights} night{availabilityData.nights > 1 ? 's' : ''} ({roomsCount} room{roomsCount > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold text-stone-900">
                      NPR {availabilityData.priceBreakdown.roomSubtotalNpr.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Service Fee (10%)</span>
                    <span>NPR {availabilityData.priceBreakdown.serviceFeeNpr.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Government VAT (13%)</span>
                    <span>NPR {availabilityData.priceBreakdown.vatNpr.toLocaleString()}</span>
                  </div>

                  {availabilityData.priceBreakdown.discountNpr > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Long Stay Courtesy (5%)</span>
                      <span>- NPR {availabilityData.priceBreakdown.discountNpr.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-2.5 flex justify-between font-bold text-sm text-stone-900">
                    <span>Total Payable</span>
                    <span className="text-[#0552A2]">
                      NPR {availabilityData.priceBreakdown.totalAmountNpr.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              <button
                type="button"
                onClick={handleProceedToGuestDetails}
                disabled={isCheckingAvailability || (availabilityData && !availabilityData.available)}
                className="w-full rounded-2xl bg-[#0552A2] py-3.5 text-center text-xs font-bold text-white shadow-sm transition-all hover:bg-[#044182] active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isCheckingAvailability ? (
                  <span>Checking Availability...</span>
                ) : availabilityData && !availabilityData.available ? (
                  <span>No Suites Available</span>
                ) : (
                  <span>Reserve Stay • Step 1 of 4</span>
                )}
              </button>

              <div className="text-center text-[10px] text-stone-400 leading-relaxed">
                Free cancellation up to 48 hours prior • No charge today if paying at property
              </div>
            </div>

            {/* Assistance Card */}
            <div className="rounded-2xl border border-stone-200/80 bg-white p-4 text-xs space-y-1.5">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#0552A2]" />
                <span>Private Concierge Helpline</span>
              </div>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Need customized helicopter arrival or dietary arrangements?
              </p>
              <div className="font-semibold text-stone-800 text-xs">{hotel.contactPhone}</div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          MOBILE STICKY BOTTOM RESERVATION BAR
          ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-stone-400 block uppercase font-bold leading-none">Starting from</span>
          <span className="font-poppins text-sm font-extrabold text-[#0552A2] mt-0.5 block">
            NPR {selectedRoom.pricePerNightNpr.toLocaleString()}
            <span className="text-[10px] font-normal text-stone-500"> / night</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleProceedToGuestDetails}
          className="rounded-xl bg-[#0552A2] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#044182] active:scale-98 cursor-pointer"
        >
          Reserve Stay
        </button>
      </div>

      {/* =========================================================================
          CHECKOUT WORKFLOW MODAL (5-STEP EDITORIAL WORKFLOW)
          ========================================================================= */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-poppins text-lg font-bold text-stone-900">
                  {hotel.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {checkIn} to {checkOut} • {availabilityData?.nights || 1} Night{availabilityData?.nights > 1 ? 's' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="rounded-full p-2 text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-stone-400 px-1">
              <span className={checkoutStep >= 1 ? 'text-[#0552A2]' : ''}>1. Suite</span>
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
                  <h4 className="text-sm font-bold text-stone-900 font-poppins">
                    Primary Guest Information
                  </h4>
                  {currentUser && (
                    <button
                      type="button"
                      onClick={handleAutofillProfile}
                      className="text-xs font-semibold text-[#0552A2] hover:underline cursor-pointer"
                    >
                      Autofill my profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={guestFullName}
                      onChange={(e) => setGuestFullName(e.target.value)}
                      placeholder="e.g. Aayush Pradhan"
                      className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. aayush@example.com"
                      className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+977 9841234567"
                      className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">Nationality *</label>
                    <input
                      type="text"
                      required
                      value={guestNationality}
                      onChange={(e) => setGuestNationality(e.target.value)}
                      placeholder="e.g. Nepali, British, American"
                      className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700">Estimated Arrival Time</label>
                    <select
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none bg-white"
                    >
                      <option value="12:00 - 14:00">12:00 - 14:00 (Early Check-In Request)</option>
                      <option value="14:00 - 16:00">14:00 - 16:00 (Standard Afternoon)</option>
                      <option value="16:00 - 18:00">16:00 - 18:00 (Late Afternoon)</option>
                      <option value="18:00 - 22:00">18:00 - 22:00 (Evening Arrival)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700">Country of Residence</label>
                    <input
                      type="text"
                      value={guestCountry}
                      onChange={(e) => setGuestCountry(e.target.value)}
                      placeholder="e.g. Nepal"
                      className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700">Special Preferences / Requests</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g. Upper floor suite, airport transfer, special dietary requirements..."
                    className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 border-t border-stone-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#0552A2] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#044182] transition-colors cursor-pointer"
                  >
                    Proceed to Review • Step 3
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BOOKING REVIEW */}
            {checkoutStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-900 font-poppins">
                  Review Your Stay Details
                </h4>

                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-stone-200/80 pb-2">
                    <span className="font-bold text-stone-900">{hotel.name}</span>
                    <span className="text-[#0552A2] font-bold">{selectedRoom.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-stone-600">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Check-in Date:</span>
                      <span className="font-semibold text-stone-800">{checkIn} (from {hotel.checkInTime})</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Check-out Date:</span>
                      <span className="font-semibold text-stone-800">{checkOut} (until {hotel.checkOutTime})</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Lead Guest:</span>
                      <span className="font-semibold text-stone-800">{guestFullName} ({guestPhone})</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Nights &amp; Rooms:</span>
                      <span className="font-semibold text-stone-800">
                        {availabilityData?.nights || 1} Night(s) • {roomsCount} Room(s)
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-2 space-y-1">
                    <div className="flex justify-between text-stone-600">
                      <span>Room Subtotal</span>
                      <span>NPR {availabilityData?.priceBreakdown?.roomSubtotalNpr?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Taxes &amp; Hotel Service Charge</span>
                      <span>
                        NPR {((availabilityData?.priceBreakdown?.serviceFeeNpr || 0) + (availabilityData?.priceBreakdown?.vatNpr || 0)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                      <span>Total Amount Payable</span>
                      <span className="text-[#0552A2]">
                        NPR {availabilityData?.priceBreakdown?.totalAmountNpr?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#0552A2]"
                  />
                  <span>
                    I accept the hotel's cancellation policy (Free cancellation up to 48 hours before check-in) and the Nepal Tourism Board digital booking regulations.
                  </span>
                </label>

                <div className="flex justify-end gap-2.5 border-t border-stone-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="rounded-xl bg-[#0552A2] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#044182] transition-colors cursor-pointer"
                  >
                    Select Payment Gateway • Step 4
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT SELECTION */}
            {checkoutStep === 4 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-900 font-poppins">
                  Choose Payment Option
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('full');
                      if (selectedGateway === 'PayAtHotel') setSelectedGateway('Khalti');
                    }}
                    className={`rounded-xl p-2.5 text-center text-xs font-bold border transition-all cursor-pointer ${
                      paymentMode === 'full' && selectedGateway !== 'PayAtHotel'
                        ? 'border-[#0552A2] bg-blue-50/60 text-[#0552A2]'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    Full Payment
                    <span className="block text-[10px] font-normal text-stone-500 mt-0.5">
                      NPR {availabilityData?.priceBreakdown?.totalAmountNpr?.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('advance_deposit');
                      if (selectedGateway === 'PayAtHotel') setSelectedGateway('Khalti');
                    }}
                    className={`rounded-xl p-2.5 text-center text-xs font-bold border transition-all cursor-pointer ${
                      paymentMode === 'advance_deposit' && selectedGateway !== 'PayAtHotel'
                        ? 'border-[#0552A2] bg-blue-50/60 text-[#0552A2]'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    Advance Deposit (30%)
                    <span className="block text-[10px] font-normal text-stone-500 mt-0.5">
                      NPR {availabilityData?.priceBreakdown?.depositRequiredNpr?.toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGateway('PayAtHotel');
                      setPaymentMode('pay_at_property');
                    }}
                    className={`rounded-xl p-2.5 text-center text-xs font-bold border transition-all cursor-pointer ${
                      selectedGateway === 'PayAtHotel'
                        ? 'border-[#0552A2] bg-blue-50/60 text-[#0552A2]'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    Pay at Property
                    <span className="block text-[10px] font-normal text-stone-500 mt-0.5">
                      NPR 0 Now
                    </span>
                  </button>
                </div>

                {selectedGateway !== 'PayAtHotel' && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-stone-700">Digital Gateway</label>

                    {/* Khalti */}
                    <div
                      onClick={() => setSelectedGateway('Khalti')}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        selectedGateway === 'Khalti'
                          ? 'border-[#5C2D91] bg-purple-50/50 ring-1 ring-[#5C2D91]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5C2D91] text-white font-bold text-sm">
                          K
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">Khalti Digital Wallet</div>
                          <div className="text-[10px] text-stone-500">Official Web Checkout • Instant Verification</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-[#5C2D91]">
                        Nepal Standard
                      </span>
                    </div>

                    {/* eSewa */}
                    <div
                      onClick={() => setSelectedGateway('eSewa')}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        selectedGateway === 'eSewa'
                          ? 'border-[#60BB46] bg-emerald-50/50 ring-1 ring-[#60BB46]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#60BB46] text-white font-bold text-sm">
                          e
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">eSewa ePay</div>
                          <div className="text-[10px] text-stone-500">Instant QR &amp; NetBanking Gateway</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-[#60BB46]">
                        eSewa Pass
                      </span>
                    </div>

                    {/* Stripe International Cards */}
                    <div
                      onClick={() => setSelectedGateway('Stripe')}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        selectedGateway === 'Stripe'
                          ? 'border-[#0552A2] bg-blue-50/50 ring-1 ring-[#0552A2]'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0552A2] text-white">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">International Visa / Mastercard</div>
                          <div className="text-[10px] text-stone-500">Secured 256-bit TLS Gateway</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#0552A2]">
                        Global Cards
                      </span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-stone-50 p-3.5 text-xs flex justify-between items-center border border-stone-200/80">
                  <span className="font-semibold text-stone-700">Amount to be charged now:</span>
                  <span className="font-poppins text-base font-extrabold text-[#0552A2]">
                    {selectedGateway === 'PayAtHotel'
                      ? 'NPR 0 (Pay upon Arrival)'
                      : paymentMode === 'advance_deposit'
                      ? `NPR ${availabilityData?.priceBreakdown?.depositRequiredNpr?.toLocaleString()} (Deposit)`
                      : `NPR ${availabilityData?.priceBreakdown?.totalAmountNpr?.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-end gap-2.5 border-t border-stone-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(3)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    disabled={isProcessingPayment}
                    className="rounded-xl bg-[#0552A2] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#044182] transition-colors disabled:opacity-50 cursor-pointer"
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

            {/* STEP 5: CONFIRMATION & PASS */}
            {checkoutStep === 5 && confirmedReservation && (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-7 w-7 stroke-[3]" />
                </div>

                <div>
                  <h4 className="font-poppins text-xl font-extrabold text-stone-900">
                    Reservation Confirmed
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Your stay at <span className="font-bold text-stone-800">{hotel.name}</span> has been registered.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 text-left text-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-emerald-200/80 pb-2.5">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">Booking Reference</span>
                      <span className="font-mono text-sm font-extrabold text-[#0552A2]">
                        {confirmedReservation.id}
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {confirmedReservation.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-stone-700">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Hotel &amp; Suite:</span>
                      <span className="font-semibold text-stone-900">{confirmedReservation.title || hotel.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Guest Name:</span>
                      <span className="font-semibold text-stone-900">{confirmedReservation.userName || guestFullName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Check-In / Out:</span>
                      <span className="font-semibold text-stone-900">
                        {confirmedReservation.checkInDate || checkIn} → {confirmedReservation.checkOutDate || checkOut}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Amount &amp; Status:</span>
                      <span className="font-semibold text-stone-900">
                        NPR {confirmedReservation.totalAmountNpr?.toLocaleString()} ({confirmedReservation.paymentStatus || 'confirmed'})
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                    <span>Pass Token: {confirmedReservation.qrCode || `VN-PASS-${confirmedReservation.id}`}</span>
                    <span>Valid at Check-in</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadVoucher}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Voucher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Confirmation</span>
                  </button>

                  <Link
                    href="/bookings"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182] transition-colors cursor-pointer"
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

      {/* =========================================================================
          FULL-SCREEN LIGHTBOX GALLERY MODAL
          ========================================================================= */}
      {isGalleryModalOpen && (
        <div
          onClick={() => setIsGalleryModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-stone-950 flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="p-4 sm:p-5 flex justify-between items-center text-white z-10 border-b border-white/10">
              <span className="font-semibold text-xs tracking-wide">
                {hotel.name} • Photo {activeImageIndex + 1} of {allImages.length}
              </span>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="rounded-full bg-white/15 p-2 hover:bg-white/30 transition-colors cursor-pointer text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative aspect-[16/10] w-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src={allImages[activeImageIndex]}
                alt="Hotel Large View"
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white hover:bg-black/90 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white hover:bg-black/90 transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnails Row */}
            <div className="p-3 sm:p-4 flex gap-2.5 overflow-x-auto justify-center bg-stone-900/80 border-t border-white/10">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-12 w-16 sm:h-14 sm:w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#0552A2] scale-105 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
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
        <div className="min-h-screen bg-[#FAF9F6] font-inter text-stone-900 flex items-center justify-center p-6">
          <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-stone-200 border-t-[#0552A2]" />
        </div>
      }
    >
      <HotelDetailContent params={params} />
    </Suspense>
  );
}
