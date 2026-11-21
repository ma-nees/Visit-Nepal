import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { UserRole, DEFAULT_ROLE_PERMISSIONS } from '../middleware/auth';

// Types definition matching the comprehensive schema
export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  username?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'banned';
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  location?: string;
  travelInterests?: string[];
  followers?: string[];
  following?: string[];
  savedPosts?: string[];
  emergencyContact?: string;
  kycStatus: 'not_submitted' | 'submitted' | 'under_review' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  name: string;
  businessType: 'trekking' | 'hotel' | 'homestay' | 'transport' | 'activity';
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  panNumber: string;
  status: 'pending' | 'verified' | 'suspended';
  documents: Array<{ id: string; type: string; fileUrl: string; status: 'pending' | 'approved' | 'rejected' }>;
  createdAt: string;
}

export interface GuideProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  experienceYears: number;
  languages: string[];
  specializations: string[];
  certifications: Array<{ id: string; title: string; issuer: string; year: string; verified: boolean }>;
  dailyRateNpr: number;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  verificationStatus: 'not_submitted' | 'submitted' | 'under_review' | 'verified' | 'rejected';
  expeditionsCount: number;
}

export interface ButlerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  languages: string[];
  experienceYears: number;
  dailyRateNpr: number;
  rating: number;
  isAvailable: boolean;
  verificationStatus: 'not_submitted' | 'submitted' | 'under_review' | 'verified' | 'rejected';
  completedTasksCount: number;
}

export interface Destination {
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
  attractions: Array<{ id: string; name: string; description: string; ticketPriceNpr: number }>;
  coordinates: { lat: number; lng: number };
  status: 'published' | 'draft' | 'archived';
  rating: number;
  reviewsCount: number;
}

export interface TrekkingPackage {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  destinationId: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous';
  durationDays: number;
  maxElevationM: number;
  priceNpr: number;
  groupSizeMax: number;
  bestSeasons: string[];
  inclusions: string[];
  exclusions: string[];
  requiredGear: string[];
  safetyGuidelines: string[];
  itinerary: Array<{ day: number; title: string; elevation: string; desc: string }>;
  availableDates: string[];
}

export interface ServiceListing {
  id: string;
  businessId?: string;
  providerName: string;
  category: 'Trek' | 'Stay' | 'Adventure' | 'Transport' | 'Guide' | 'Butler';
  title: string;
  description: string;
  location: string;
  priceNpr: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  availability: string[];
}

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
  mealPlan: 'Room Only' | 'Breakfast Included' | 'Half Board' | 'All-Inclusive';
}

export interface HotelReview {
  id: string;
  hotelId: string;
  userId: string;
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
  tripType: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
  createdAt: string;
}

export interface HotelListing {
  id: string;
  businessId?: string;
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
  category: 'Luxury Heritage' | 'Resort & Spa' | 'Boutique Lodge' | 'Mountain Teahouse' | 'Eco Retreat';
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

export interface Quotation {
  id: string;
  customTripId: string;
  agencyId: string;
  agencyName: string;
  quotedAmountNpr: number;
  breakdown: {
    accommodationNpr: number;
    guideNpr: number;
    porterNpr: number;
    permitsNpr: number;
    transportNpr: number;
    mealsNpr: number;
    equipmentNpr: number;
    serviceChargeNpr: number;
    taxVatNpr: number;
  };
  agencyNotes: string;
  alternativeRoutesSuggested?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  respondedAt?: string;
}

export interface CustomItineraryDay {
  day: number;
  title: string;
  destination: string;
  activity: string;
  elevation: string;
  distanceKm?: number;
  walkingHours?: number;
  isRestDay?: boolean;
  notes?: string;
}

export interface CustomPlan {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  title: string;
  destinations: string[];
  startDate: string;
  endDate?: string;
  durationDays: number;
  travelersCount?: number;
  adultsCount?: number;
  childrenCount?: number;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Experienced Trekker' | 'Technical Mountaineer';
  travelStyle?: 'Ultra-Luxury Heritage' | 'Boutique Comfort' | 'Authentic Teahouse' | 'Alpine Expedition Camp';
  trekkingDifficulty: string;
  estimatedBudgetNpr: number;
  budgetBreakdown: {
    accommodationNpr: number;
    guideNpr: number;
    porterNpr?: number;
    permitsNpr: number;
    transportNpr: number;
    activitiesNpr: number;
    mealsNpr?: number;
    equipmentNpr?: number;
    butlerNpr: number;
    serviceChargeNpr?: number;
    taxVatNpr?: number;
  };
  accommodationPreference: string;
  guideRequested: boolean;
  porterRequested?: boolean;
  transportRequested: boolean;
  butlerRequested: boolean;
  mealsPlan?: 'All-Inclusive (3 Meals/Day)' | 'Breakfast Only' | 'Pay As You Go';
  equipmentRental?: string[];
  emergencyServices?: string[];
  detectedPermits?: Array<{
    id: string;
    name: string;
    feeNpr: number;
    authority: string;
    required: boolean;
  }>;
  itinerary: CustomItineraryDay[];
  travelerContact?: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber?: string;
    emergencyContact?: string;
    dietaryNotes?: string;
  };
  quotations?: Quotation[];
  status:
    | 'DRAFT'
    | 'PENDING_REVIEW'
    | 'QUOTED'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'draft'
    | 'submitted'
    | 'approved'
    | 'converted_to_booking';
  rejectionReason?: string;
  bookingId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  bookingType?: 'standard' | 'custom';
  customTripId?: string;
  invoiceNumber?: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessId?: string;
  serviceId?: string;
  title: string;
  provider: string;
  category: 'Trek' | 'Stay' | 'Adventure' | 'Transport' | 'Guide' | 'Butler' | 'Custom Expedition';
  date: string;
  participantsCount: number;
  participants: Array<{ fullName: string; nationality: string; passportNumber?: string }>;
  travelerDetails?: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    passportNumber?: string;
    emergencyContact?: string;
    dietaryNotes?: string;
  };
  optionsAndAddons?: Array<{ name: string; priceNpr: number }>;
  priceBreakdown?: {
    basePriceNpr: number;
    addOnsNpr: number;
    taxVatNpr: number;
    serviceChargeNpr: number;
    totalAmountNpr: number;
  };
  totalAmountNpr: number;
  status:
    | 'PENDING'
    | 'PENDING_REVIEW'
    | 'QUOTED'
    | 'CONFIRMED'
    | 'PAID'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REFUNDED'
    | 'draft'
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'awaiting_payment'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'refund_requested'
    | 'refunded';
  paymentStatus: 'unpaid' | 'pending' | 'successful' | 'failed' | 'refunded';
  paymentId?: string;
  paymentMethod?: string;
  assignedGuideId?: string;
  assignedGuideName?: string;
  assignedButlerId?: string;
  assignedButlerName?: string;
  qrCode: string;
  meetingPoint: string;
  contactPhone: string;
  cancellationReason?: string;
  // Hotel reservation specific fields
  hotelId?: string;
  hotelName?: string;
  roomId?: string;
  roomName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nightsCount?: number;
  roomsCount?: number;
  adultsCount?: number;
  childrenCount?: number;
  specialRequests?: string;
  arrivalTime?: string;
  cancellationPolicy?: string;
  refundAmountNpr?: number;
  refundStatus?: 'none' | 'pending' | 'approved' | 'processed' | 'rejected';
  paymentMode?: 'full' | 'advance_deposit' | 'pay_at_property';
  createdAt: string;
  updatedAt: string;
}

export interface PermitApplication {
  id: string;
  userId: string;
  travelerName: string;
  passportNumber: string;
  nationality: string;
  permitType:
    | 'TIMS Card'
    | 'Sagarmatha National Park Entry'
    | 'Annapurna Conservation Area (ACAP)'
    | 'Upper Mustang Restricted Area'
    | 'Manaslu Circuit Restricted Area';
  route: string;
  startDate: string;
  endDate: string;
  emergencyContact: string;
  insurancePolicyNumber: string;
  supportingDocuments: Array<{ id: string; name: string; url: string }>;
  status:
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'additional_info_required'
    | 'approved'
    | 'rejected'
    | 'cancelled';
  permitOfficialNumber?: string;
  issuedBy?: string;
  decisionNotes?: string;
  decidedAt?: string;
  feeNpr: number;
  isReceipt: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  userId: string;
  amountNpr: number;
  currency: 'NPR';
  provider: 'Khalti' | 'eSewa' | 'Stripe' | 'Bank Transfer';
  providerTxnId?: string;
  status: 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';
  receiptUrl: string;
  createdAt: string;
}

export interface ScheduleEvent {
  id: string;
  userId: string;
  role: 'traveler' | 'guide' | 'butler' | 'business';
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  bookingId?: string;
}

export interface Conversation {
  id: string;
  participants: Array<{ userId: string; name: string; role: string; avatarUrl?: string }>;
  lastMessage: string;
  lastMessageAt: string;
  bookingId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface PostReply {
  id: string;
  userId: string;
  authorName: string;
  authorUsername?: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface PostComment {
  id: string;
  userId?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likesCount?: number;
  likedBy?: string[];
  parentId?: string;
  replies?: PostReply[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorUsername?: string;
  authorAvatar: string;
  authorRole: string;
  authorVerified?: boolean;
  location: string;
  destinationTag?: string;
  content: string;
  mediaUrl: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video';
  hashtags?: string[];
  likesCount: number;
  likedBy: string[];
  savedBy?: string[];
  commentsCount: number;
  comments: PostComment[];
  sharesCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'permit' | 'kyc' | 'message' | 'assignment' | 'alert' | 'like' | 'comment' | 'reply' | 'follow' | 'mention';
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  reason?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface PayoutTransaction {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientRole: 'agency' | 'business' | 'guide' | 'butler' | 'hotel';
  amountNpr: number;
  status: 'pending' | 'completed' | 'rejected';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
  };
  notes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  travelerId: string;
  travelerName: string;
  amountNpr: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}

export interface PlatformSettings {
  commissions: {
    agencyCommissionPercent: number; // e.g. 12%
    hotelCommissionPercent: number; // e.g. 10%
    guideCommissionPercent: number; // e.g. 5%
    butlerDailyCompensationNpr: number; // e.g. 6000
  };
  taxes: {
    vatPercent: number; // 13%
    serviceChargePercent: number; // 5%
  };
  general: {
    siteTitle: string;
    supportEmail: string;
    supportPhone: string;
    emergencyHotline: string;
    maintenanceMode: boolean;
    currency: string;
    enableRegistration: boolean;
    requireKycApproval: boolean;
  };
}

export interface CmsContent {
  heroBanner: {
    title: string;
    subtitle: string;
    badge: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
  };
  announcements: Array<{
    id: string;
    title: string;
    body: string;
    type: 'info' | 'warning' | 'alert';
    active: boolean;
    createdAt: string;
  }>;
  travelAdvisories: Array<{
    id: string;
    region: string;
    condition: 'Open' | 'Caution' | 'Restricted';
    notes: string;
    updatedAt: string;
  }>;
}

export interface DatabaseState {
  users: UserAccount[];
  businesses: BusinessProfile[];
  guides: GuideProfile[];
  butlers: ButlerProfile[];
  destinations: Destination[];
  packages: TrekkingPackage[];
  services: ServiceListing[];
  hotels: HotelListing[];
  customPlans: CustomPlan[];
  bookings: Booking[];
  permits: PermitApplication[];
  payments: PaymentTransaction[];
  schedules: ScheduleEvent[];
  conversations: Conversation[];
  messages: Message[];
  communityPosts: CommunityPost[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  rolePermissions: Record<string, string[]>;
  payouts: PayoutTransaction[];
  refunds: RefundRecord[];
  platformSettings: PlatformSettings;
  cmsContent: CmsContent;
}

const DATA_FILE = path.join(__dirname, '../../data/db.json');

// Default initial state with realistic, verified seed records
function getInitialSeedData(): DatabaseState {
  const passwordHash = bcrypt.hashSync('NepalTourism2026!', 10);

  const users: UserAccount[] = [
    {
      id: 'usr_super_admin_1',
      email: 'superadmin@visitnepal.com',
      passwordHash,
      name: 'Govinda Thapa (Platform Director)',
      role: 'super_admin',
      status: 'active',
      phone: '+977-1-4499000',
      emergencyContact: 'HQ Ministry Desk (+977-1-4499001)',
      kycStatus: 'verified',
      bio: 'Super Administrator & Executive Director with master governance over Visit Nepal platform ecosystem.',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr_traveler_1',
      email: 'aayush.traveler@visitnepal.com',
      passwordHash,
      name: 'Aayush Pradhan',
      role: 'traveler',
      status: 'active',
      phone: '+977-9801234567',
      emergencyContact: 'Sita Pradhan (+977-9811234567)',
      kycStatus: 'verified',
      bio: 'High-altitude trekker and landscape photographer exploring the Nepal Himalaya.',
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: '2026-01-10T08:00:00Z',
    },
    {
      id: 'usr_business_1',
      email: 'partner@himalayanexpeditions.com',
      passwordHash,
      name: 'Himalayan Sherpa Expeditions',
      role: 'business',
      status: 'active',
      phone: '+977-1-4412345',
      kycStatus: 'verified',
      bio: 'Premier IFMGA-accredited Himalayan expedition and trekking agency based in Thamel, Kathmandu.',
      createdAt: '2026-01-05T09:00:00Z',
      updatedAt: '2026-01-05T09:00:00Z',
    },
    {
      id: 'usr_guide_1',
      email: 'pasang.sherpa@visitnepal.com',
      passwordHash,
      name: 'Pasang Nuru Sherpa',
      role: 'guide',
      status: 'active',
      phone: '+977-9841889900',
      kycStatus: 'verified',
      bio: 'Certified IFMGA Mountain Guide with 12 Everest summits and 18 years of high-altitude leadership.',
      createdAt: '2026-01-08T10:00:00Z',
      updatedAt: '2026-01-08T10:00:00Z',
    },
    {
      id: 'usr_butler_1',
      email: 'sherpa.butler@visitnepal.com',
      passwordHash,
      name: 'Pemba Tenzing Sherpa',
      role: 'butler',
      status: 'active',
      phone: '+977-9851098765',
      kycStatus: 'verified',
      bio: 'Elite Sherpa Butler & alpine concierge providing personalized logistics, gear, and camp hospitality.',
      createdAt: '2026-01-12T11:00:00Z',
      updatedAt: '2026-01-12T11:00:00Z',
    },
    {
      id: 'usr_admin_1',
      email: 'officer@ntb.gov.np',
      passwordHash,
      name: 'Kritish Shrestha (NTB Officer)',
      role: 'admin',
      status: 'active',
      phone: '+977-1-4256909',
      kycStatus: 'verified',
      bio: 'Nepal Tourism Board Senior Compliance Officer & Digital Permit Registrar.',
      createdAt: '2026-01-01T08:00:00Z',
      updatedAt: '2026-01-01T08:00:00Z',
    },
  ];

  const businesses: BusinessProfile[] = [
    {
      id: 'biz_1',
      ownerId: 'usr_business_1',
      name: 'Himalayan Sherpa Expeditions',
      businessType: 'trekking',
      description: 'Official NTB-registered expedition company providing high alpine treks and private logistics.',
      address: 'Tridevi Marg, Thamel, Kathmandu, Nepal',
      contactEmail: 'partner@himalayanexpeditions.com',
      contactPhone: '+977-1-4412345',
      panNumber: '601248912',
      status: 'verified',
      documents: [
        { id: 'doc_1', type: 'Company Registration', fileUrl: '/uploads/reg_himalayan.pdf', status: 'approved' },
        { id: 'doc_2', type: 'Tourism License', fileUrl: '/uploads/lic_ntb_2026.pdf', status: 'approved' },
      ],
      createdAt: '2026-01-05T09:00:00Z',
    },
  ];

  const guides: GuideProfile[] = [
    {
      id: 'gd_1',
      userId: 'usr_guide_1',
      name: 'Pasang Nuru Sherpa',
      email: 'pasang.sherpa@visitnepal.com',
      phone: '+977-9841889900',
      licenseNumber: 'NMA-IFMGA-042',
      experienceYears: 18,
      languages: ['English', 'Nepali', 'Tibetan', 'Hindi', 'French (Basic)'],
      specializations: ['Everest Region', 'Technical Glacial Crossings', 'High Altitude Acclimatization'],
      certifications: [
        { id: 'cert_1', title: 'IFMGA Mountain Guide Diploma', issuer: 'International Federation of Mountain Guides', year: '2014', verified: true },
        { id: 'cert_2', title: 'Advanced Wilderness Life Support (AWLS)', issuer: 'HRA Nepal', year: '2024', verified: true },
      ],
      dailyRateNpr: 12000,
      rating: 4.98,
      reviewsCount: 184,
      isAvailable: true,
      verificationStatus: 'verified',
      expeditionsCount: 46,
    },
  ];

  const butlers: ButlerProfile[] = [
    {
      id: 'bt_1',
      userId: 'usr_butler_1',
      name: 'Pemba Tenzing Sherpa',
      email: 'sherpa.butler@visitnepal.com',
      phone: '+977-9851098765',
      services: ['Alpine Concierge', 'Luggage & Pack Transit', 'Tea House Reservation Priority', 'Helicopter Dispatch'],
      languages: ['English', 'Nepali', 'Sherpa'],
      experienceYears: 11,
      dailyRateNpr: 8500,
      rating: 4.96,
      isAvailable: true,
      verificationStatus: 'verified',
      completedTasksCount: 142,
    },
  ];

  const destinations: Destination[] = [
    {
      id: 'everest-region',
      name: 'Everest Region (Khumbu)',
      category: 'High Himalaya',
      region: 'Eastern Nepal',
      altitude: '2,800m – 8,848m',
      bestSeason: 'Mar – May, Oct – Dec',
      duration: '12 – 20 Days',
      image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=85',
      tag: 'Crown of the World',
      description: 'The legendary homeland of the Sherpa people and the colossal amphitheater of Sagarmatha, Lhotse, and Ama Dablam.',
      highlights: ['Everest Base Camp', 'Kala Patthar Summit', 'Tengboche Monastery', 'Gokyo Turquoise Lakes'],
      attractions: [
        { id: 'att_ebc', name: 'Everest Base Camp (5,364m)', description: 'Historic base of global 8,848m attempts', ticketPriceNpr: 0 },
        { id: 'att_tengboche', name: 'Tengboche Monastery', description: 'Sacred Buddhist monastic center with panorama', ticketPriceNpr: 300 },
      ],
      coordinates: { lat: 27.9881, lng: 86.9250 },
      status: 'published',
      rating: 4.96,
      reviewsCount: 520,
    },
    {
      id: 'annapurna-sanctuary',
      name: 'Annapurna Sanctuary & Circuit',
      category: 'High Himalaya',
      region: 'Central Nepal',
      altitude: '1,400m – 5,416m',
      bestSeason: 'Sep – Nov, Mar – May',
      duration: '10 – 18 Days',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
      tag: 'Alpine Amphitheater',
      description: 'A 360-degree basin ringed by Annapurna I, Machapuchare, and Hiunchuli, transitioning from lush rhododendrons to sheer ice walls.',
      highlights: ['Thorong La Pass (5,416m)', 'Machapuchare Base Camp', 'Poon Hill Sunrise', 'Muktinath Pilgrimage'],
      attractions: [
        { id: 'att_abc', name: 'Annapurna Base Camp', description: 'Surrounded by 7,000m and 8,000m summits', ticketPriceNpr: 0 },
        { id: 'att_muktinath', name: 'Muktinath Temple', description: 'Sacred eternal flames & 108 water sprouts', ticketPriceNpr: 0 },
      ],
      coordinates: { lat: 28.5300, lng: 83.8780 },
      status: 'published',
      rating: 4.92,
      reviewsCount: 435,
    },
    {
      id: 'mustang-kingdom',
      name: 'Upper Mustang (Lo Manthang)',
      category: 'Ancient Kingdom',
      region: 'Trans-Himalayan Rainshadow',
      altitude: '2,800m – 3,840m',
      bestSeason: 'May – Nov (Monsoon Free)',
      duration: '10 – 14 Days',
      image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=85',
      tag: 'The Walled Realm',
      description: 'Wind-carved ochre gorges, sky caves dating back millennia, and the preserved 14th-century capital of the Kings of Lo.',
      highlights: ['Walled Capital of Lo Manthang', 'Chhoser Sky Caves', 'Ghar Gompa', 'Tibetan Buddhist Monasteries'],
      attractions: [
        { id: 'att_lomanthang', name: 'Royal Palace of Lo Manthang', description: '14th-century four-story fortress', ticketPriceNpr: 500 },
      ],
      coordinates: { lat: 29.1825, lng: 83.9567 },
      status: 'published',
      rating: 4.97,
      reviewsCount: 168,
    },
    {
      id: 'kathmandu-valley',
      name: 'Kathmandu Valley',
      category: 'Cultural Valley',
      region: 'Central Basin',
      altitude: '1,400m',
      bestSeason: 'Year Round (Best: Oct – Apr)',
      duration: '3 – 5 Days',
      image: 'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=1200&q=85',
      tag: 'Living Heritage',
      description: 'Seven UNESCO World Heritage sites clustered within 20 kilometers: medieval Durbar squares, gilded stupas, and ancient crafts.',
      highlights: ['Boudhanath Stupa', 'Pashupatinath Temple', 'Patan Durbar Square', 'Bhaktapur Medieval City'],
      attractions: [
        { id: 'att_boudha', name: 'Boudhanath Stupa', description: 'Massive mandala stupa with prayer wheels', ticketPriceNpr: 400 },
        { id: 'att_bhaktapur', name: 'Bhaktapur Durbar Square', description: '55-Window Palace and Nyatapola temple', ticketPriceNpr: 1500 },
      ],
      coordinates: { lat: 27.7172, lng: 85.3240 },
      status: 'published',
      rating: 4.89,
      reviewsCount: 680,
    },
    {
      id: 'pokhara-valley',
      name: 'Pokhara & Phewa Lake',
      category: 'Cultural Valley',
      region: 'Western Foothills',
      altitude: '822m',
      bestSeason: 'Year Round (Best: Sep – May)',
      duration: '3 – 7 Days',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      tag: 'Lake of Reflections',
      description: 'Subtropical waters reflecting Machapuchare, adventure sports launchpads, and serene lakeside retreats.',
      highlights: ['Phewa Lake Boating', 'Sarangkot Sunrise', 'World Peace Pagoda', 'Paragliding over Valley'],
      attractions: [
        { id: 'att_phewa', name: 'Phewa Lake & Tal Barahi', description: 'Island temple surrounded by mountain reflections', ticketPriceNpr: 100 },
      ],
      coordinates: { lat: 28.2096, lng: 83.9856 },
      status: 'published',
      rating: 4.91,
      reviewsCount: 540,
    },
    {
      id: 'chitwan-national-park',
      name: 'Chitwan National Park',
      category: 'Wildlife & Plains',
      region: 'Southern Terai Plains',
      altitude: '150m',
      bestSeason: 'Oct – Mar',
      duration: '3 – 4 Days',
      image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=85',
      tag: 'Subtropical Wilderness',
      description: 'UNESCO-protected riverine forests sheltering one-horned rhinos, Royal Bengal tigers, and over 500 species of birds.',
      highlights: ['Jeep Safari Tracking Rhinos', 'Canoe Ride with Gharials', 'Tharu Cultural Dances', 'Bird Watching in Sal Forest'],
      attractions: [
        { id: 'att_safari', name: 'Sauraha Wildlife Center', description: 'Conservation base and riverfront watchtowers', ticketPriceNpr: 2000 },
      ],
      coordinates: { lat: 27.5341, lng: 84.4525 },
      status: 'published',
      rating: 4.82,
      reviewsCount: 390,
    },
    {
      id: 'lumbini-sacred-garden',
      name: 'Lumbini Sacred Garden',
      category: 'Cultural Valley',
      region: 'Southwestern Plains',
      altitude: '150m',
      bestSeason: 'Oct – Apr',
      duration: '2 – 3 Days',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=85',
      tag: 'Cradle of Peace',
      description: 'The UNESCO-listed birthplace of the Buddha, featuring the ancient Ashoka Pillar, Maya Devi Temple, and international monasteries.',
      highlights: ['Maya Devi Temple Marker', 'Ashoka Pillar (249 BCE)', 'International Monastic Zone', 'Eternal Peace Flame'],
      attractions: [
        { id: 'att_mayadevi', name: 'Maya Devi Temple Complex', description: 'Archaeological birth spot of Siddhartha Gautama', ticketPriceNpr: 500 },
      ],
      coordinates: { lat: 27.4840, lng: 83.2760 },
      status: 'published',
      rating: 4.85,
      reviewsCount: 290,
    },
    {
      id: 'rara-lake',
      name: 'Rara Lake & Karnali',
      category: 'Alpine Lake',
      region: 'Far-Western Highlands',
      altitude: '2,990m',
      bestSeason: 'Apr – Jun, Sep – Nov',
      duration: '6 – 9 Days',
      image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=85',
      tag: 'Crystal Solitude',
      description: 'Nepal’s largest alpine lake, surrounded by untouched pine and juniper forests and snowy peaks in deep tranquility.',
      highlights: ['Mirror Blue Lake', 'Murma Top Viewpoint', 'Pine Forest Ridge Walks', 'Remote Wilderness Solitude'],
      attractions: [
        { id: 'att_murmatop', name: 'Murma Top (3,700m)', description: 'Panoramic lookout over Rara Lake & Kanjiroba peaks', ticketPriceNpr: 0 },
      ],
      coordinates: { lat: 29.5256, lng: 82.0792 },
      status: 'published',
      rating: 4.95,
      reviewsCount: 140,
    },
  ];

  const packages: TrekkingPackage[] = [
    {
      id: 'pkg_ebc_14',
      businessId: 'biz_1',
      businessName: 'Himalayan Sherpa Expeditions',
      title: 'Everest Base Camp & Kala Patthar High Trek',
      destinationId: 'everest-region',
      difficulty: 'Challenging',
      durationDays: 14,
      maxElevationM: 5545,
      priceNpr: 185000,
      groupSizeMax: 10,
      bestSeasons: ['Oct – Dec', 'Mar – May'],
      inclusions: ['All tea house stays', 'IFMGA certified guide', 'TIMS & National Park permits', 'Lukla return flights', 'Porter gear carriage'],
      exclusions: ['International flights', 'Emergency medical evacuation insurance', 'Personal gear', 'Tips'],
      requiredGear: ['Down jacket (-20C)', 'Gore-Tex shell', 'Crampons (Microspikes)', 'Sturdy waterproof hiking boots', 'Thermal layers'],
      safetyGuidelines: ['Mandatory rest/acclimatization days in Namche & Dingboche', 'Pulse oximeter daily checks', 'Portable altitude chamber access'],
      itinerary: [
        { day: 1, title: 'Fly Kathmandu to Lukla (2,840m) & Trek to Phakding', elevation: '2,610m', desc: 'Scenic flight into Tenzing-Hillary Airport, followed by gradual riverside trek along the Dudh Koshi.' },
        { day: 2, title: 'Phakding to Namche Bazaar', elevation: '3,440m', desc: 'Cross Hillary Suspension Bridge and make the steep ascent to the capital of the Khumbu.' },
        { day: 3, title: 'Acclimatization Day in Namche Bazaar', elevation: '3,880m', desc: 'Hike to Everest View Hotel for first panorama of Ama Dablam, Lhotse, and Everest.' },
        { day: 4, title: 'Namche to Tengboche Monastery', elevation: '3,860m', desc: 'Forested descent followed by ascent to the spiritual heart of the Khumbu.' },
        { day: 5, title: 'Tengboche to Dingboche', elevation: '4,410m', desc: 'Trek above tree line into the high alpine valley with close views of Ama Dablam.' },
        { day: 6, title: 'Acclimatization in Dingboche', elevation: '4,730m', desc: 'Ascend Nagarjun Hill for sweeping views of Makalu and Island Peak.' },
        { day: 7, title: 'Dingboche to Lobuche', elevation: '4,910m', desc: 'Pass the memorials for fallen mountaineers at Thokla Pass.' },
        { day: 8, title: 'Lobuche to Gorak Shep & Everest Base Camp', elevation: '5,364m', desc: 'Walk alongside Khumbu Glacier to reach EBC, return to Gorak Shep for the night.' },
        { day: 9, title: 'Kala Patthar Summit & Descend to Pheriche', elevation: '5,545m', desc: 'Pre-dawn climb for iconic sunrise over Mount Everest crest.' },
        { day: 10, title: 'Pheriche to Namche Bazaar', elevation: '3,440m', desc: 'Long steady descent back to high-altitude comforts.' },
        { day: 11, title: 'Namche to Lukla', elevation: '2,840m', desc: 'Final trekking day celebrating with the crew.' },
        { day: 12, title: 'Fly Lukla to Kathmandu', elevation: '1,400m', desc: 'Morning flight back to capital and hotel transfer.' },
      ],
      availableDates: ['2026-03-15', '2026-04-01', '2026-04-20', '2026-10-05', '2026-10-25', '2026-11-12'],
    },
    {
      id: 'pkg_act_12',
      businessId: 'biz_1',
      businessName: 'Himalayan Sherpa Expeditions',
      title: 'Annapurna Circuit & Thorong La High Pass',
      destinationId: 'annapurna-sanctuary',
      difficulty: 'Challenging',
      durationDays: 12,
      maxElevationM: 5416,
      priceNpr: 135000,
      groupSizeMax: 12,
      bestSeasons: ['Sep – Nov', 'Mar – May'],
      inclusions: ['ACAP & TIMS permits', 'Licensed English speaking guide', 'All meals on trail', 'Jeep and bus transfers'],
      exclusions: ['Travel insurance', 'Hot showers/charging fees at high altitude', 'Beverages'],
      requiredGear: ['Four-season sleeping bag', 'Trekking poles', 'Windproof jacket & pants', 'Polarized sunglasses'],
      safetyGuidelines: ['Gradual altitude ascent through Manang', 'Pre-dawn departure for Thorong La Pass before wind pick-up'],
      itinerary: [
        { day: 1, title: 'Drive Kathmandu to Besisahar & Chame', elevation: '2,670m', desc: 'Scenic mountain highway transition.' },
        { day: 2, title: 'Chame to Pisang', elevation: '3,200m', desc: 'Walk through pine forests facing Paungda Danda rock wall.' },
        { day: 3, title: 'Upper Pisang to Manang', elevation: '3,540m', desc: 'Spectacular vistas of Annapurna II, III, and IV.' },
        { day: 4, title: 'Acclimatization Day in Manang', elevation: '3,800m', desc: 'Visit Gangapurna Lake and Milarepa Cave.' },
        { day: 5, title: 'Manang to Yak Kharka', elevation: '4,050m', desc: 'Steady climb into alpine tundra.' },
        { day: 6, title: 'Yak Kharka to Thorong Phedi', elevation: '4,525m', desc: 'Base of the massive pass.' },
        { day: 7, title: 'Cross Thorong La Pass (5,416m) to Muktinath', elevation: '5,416m', desc: 'Epic dawn traverse into Mustang arid plains.' },
        { day: 8, title: 'Muktinath to Jomsom via Kagbeni', elevation: '2,720m', desc: 'Walk through Kali Gandaki river canyon.' },
        { day: 9, title: 'Fly or Drive Jomsom to Pokhara', elevation: '822m', desc: 'Relax by Phewa Lake.' },
      ],
      availableDates: ['2026-03-20', '2026-04-10', '2026-09-25', '2026-10-15'],
    },
  ];

  const services: ServiceListing[] = [
    {
      id: 'srv_guide_pasang',
      businessId: 'biz_1',
      providerName: 'Pasang Nuru Sherpa (IFMGA)',
      category: 'Guide',
      title: 'Private IFMGA High-Altitude Mountain Guide',
      description: 'Senior expedition leader for technical routes, glacier navigation, and tailored mountaineering guidance.',
      location: 'Khumbu & Annapurna Ranges',
      priceNpr: 12000,
      duration: 'Per Day',
      rating: 4.98,
      reviewsCount: 184,
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      availability: ['2026-03-10 to 2026-05-30', '2026-09-15 to 2026-12-15'],
    },
    {
      id: 'srv_butler_pemba',
      providerName: 'Pemba Tenzing Sherpa',
      category: 'Butler',
      title: 'Dedicated Sherpa Butler & Alpine Concierge',
      description: 'Complete on-trail personal care: luxury camp arrangements, luggage transit, nutrition tracking, and priority reservations.',
      location: 'Everest & Mustang Circuits',
      priceNpr: 8500,
      duration: 'Per Day',
      rating: 4.96,
      reviewsCount: 142,
      imageUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=600&q=80',
      availability: ['Year Round'],
    },
    {
      id: 'srv_hotel_dwarikas',
      providerName: "The Dwarika's Hotel",
      category: 'Stay',
      title: 'Heritage Courtyard Suite & Cultural Dining',
      description: 'Award-winning master Newari terracotta sanctuary with authentic centuries-old woodcarvings and dining.',
      location: 'Battisputali, Kathmandu',
      priceNpr: 35000,
      duration: 'Per Night',
      rating: 4.96,
      reviewsCount: 310,
      imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=600&q=80',
      availability: ['All Year'],
    },
    {
      id: 'srv_heli_rescue',
      businessId: 'biz_1',
      providerName: 'Himalayan Air Evac Services',
      category: 'Transport',
      title: 'High-Altitude 4x4 & Helicopter Charter',
      description: 'Direct chartered Airbus H125 transfers to Lukla, Syangboche, or Annapurna Base Camp with rapid rescue readiness.',
      location: 'Nationwide Nepal',
      priceNpr: 180000,
      duration: 'Per Flight Route',
      rating: 4.99,
      reviewsCount: 95,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      availability: ['24/7 on Weather Clearance'],
    },
    {
      id: 'srv_paragliding',
      providerName: 'Pokhara Sky Adrenaline',
      category: 'Adventure',
      title: 'Tandem Paragliding from Sarangkot',
      description: 'Thermal soaring above Phewa Lake with direct frontal views of the Annapurna massif.',
      location: 'Sarangkot, Pokhara',
      priceNpr: 9500,
      duration: '45 Minutes Flight',
      rating: 4.9,
      reviewsCount: 420,
      imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=600&q=80',
      availability: ['Daily, Morning Thermals'],
    },
  ];

  const bookings: Booking[] = [
    {
      id: 'BKG-84920',
      userId: 'usr_traveler_1',
      userName: 'Aayush Pradhan',
      userEmail: 'aayush.traveler@visitnepal.com',
      businessId: 'biz_1',
      serviceId: 'pkg_ebc_14',
      title: 'Everest Base Camp & Kala Patthar High Trek',
      provider: 'Himalayan Sherpa Expeditions',
      category: 'Trek',
      date: '2026-04-01 to 2026-04-14',
      participantsCount: 2,
      participants: [
        { fullName: 'Aayush Pradhan', nationality: 'Nepali', passportNumber: '09812401' },
        { fullName: 'Sita Pradhan', nationality: 'Nepali', passportNumber: '09812402' },
      ],
      totalAmountNpr: 370000,
      status: 'confirmed',
      paymentStatus: 'successful',
      paymentId: 'TXN-KHL-99821',
      paymentMethod: 'Khalti Digital Wallet',
      assignedGuideId: 'gd_1',
      assignedGuideName: 'Pasang Nuru Sherpa (IFMGA)',
      assignedButlerId: 'bt_1',
      assignedButlerName: 'Pemba Tenzing Sherpa',
      qrCode: 'VN-PASS-BKG-84920-VERIFIED-2026',
      meetingPoint: 'Tribhuvan Domestic Airport, Terminal 2, Kathmandu',
      contactPhone: '+977-1-4412345',
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-01T10:05:00Z',
    },
    {
      id: 'BKG-51042',
      userId: 'usr_traveler_1',
      userName: 'Aayush Pradhan',
      userEmail: 'aayush.traveler@visitnepal.com',
      serviceId: 'srv_hotel_dwarikas',
      title: "The Dwarika's Hotel Heritage Courtyard Suite",
      provider: "The Dwarika's Hotel",
      category: 'Stay',
      date: '2026-03-30 to 2026-04-01',
      participantsCount: 2,
      participants: [{ fullName: 'Aayush Pradhan', nationality: 'Nepali' }],
      totalAmountNpr: 70000,
      status: 'confirmed',
      paymentStatus: 'successful',
      paymentId: 'TXN-CARD-11029',
      paymentMethod: 'Credit Card (NPR)',
      qrCode: 'VN-PASS-BKG-51042-VERIFIED-2026',
      meetingPoint: 'Battisputali Front Desk Concierge',
      contactPhone: '+977-1-4479488',
      createdAt: '2026-02-05T14:30:00Z',
      updatedAt: '2026-02-05T14:32:00Z',
    },
    {
      id: 'BKG-99214',
      userId: 'usr_traveler_1',
      userName: 'Aayush Pradhan',
      userEmail: 'aayush.traveler@visitnepal.com',
      businessId: 'biz_1',
      title: 'Upper Mustang 4x4 Expedition & Monastery Tour',
      provider: 'Himalayan Sherpa Expeditions',
      category: 'Custom Expedition',
      date: '2026-05-10 to 2026-05-18',
      participantsCount: 4,
      participants: [{ fullName: 'Aayush Pradhan', nationality: 'Nepali' }],
      totalAmountNpr: 480000,
      status: 'pending',
      paymentStatus: 'unpaid',
      qrCode: 'VN-PASS-BKG-99214-PENDING',
      meetingPoint: 'Pokhara Lakeside Tourist Bus Terminal',
      contactPhone: '+977-1-4412345',
      createdAt: '2026-02-12T09:15:00Z',
      updatedAt: '2026-02-12T09:15:00Z',
    },
  ];

  const permits: PermitApplication[] = [
    {
      id: 'PMT-2026-001',
      userId: 'usr_traveler_1',
      travelerName: 'Aayush Pradhan',
      passportNumber: '09812401',
      nationality: 'Nepali',
      permitType: 'TIMS Card',
      route: 'Lukla – Namche Bazaar – Everest Base Camp – Kala Patthar',
      startDate: '2026-04-01',
      endDate: '2026-04-14',
      emergencyContact: 'Sita Pradhan (+977-9811234567)',
      insurancePolicyNumber: 'HIMALAYA-INS-98231',
      supportingDocuments: [
        { id: 'doc_id_1', name: 'Citizenship / Passport Copy', url: '/uploads/traveler_id.pdf' },
      ],
      status: 'approved',
      permitOfficialNumber: 'TIMS-EBC-2026-8812',
      issuedBy: 'Nepal Tourism Board (NTB) Desk',
      decidedAt: '2026-02-02T11:00:00Z',
      decisionNotes: 'All identification and guide assignment verified. Approved.',
      feeNpr: 2000,
      isReceipt: false,
      createdAt: '2026-02-01T10:10:00Z',
    },
    {
      id: 'PMT-2026-002',
      userId: 'usr_traveler_1',
      travelerName: 'Aayush Pradhan',
      passportNumber: '09812401',
      nationality: 'Nepali',
      permitType: 'Sagarmatha National Park Entry',
      route: 'Monjo Checkpoint to Sagarmatha Conservation Area',
      startDate: '2026-04-02',
      endDate: '2026-04-13',
      emergencyContact: 'Sita Pradhan (+977-9811234567)',
      insurancePolicyNumber: 'HIMALAYA-INS-98231',
      supportingDocuments: [
        { id: 'doc_id_2', name: 'Identification Document', url: '/uploads/traveler_id.pdf' },
      ],
      status: 'approved',
      permitOfficialNumber: 'DNPWC-SNP-2026-1044',
      issuedBy: 'Department of National Parks and Wildlife Conservation',
      decidedAt: '2026-02-02T11:15:00Z',
      decisionNotes: 'Conservation fee verified and park entry approved.',
      feeNpr: 3000,
      isReceipt: false,
      createdAt: '2026-02-01T10:12:00Z',
    },
    {
      id: 'PMT-2026-003',
      userId: 'usr_traveler_1',
      travelerName: 'Aayush Pradhan',
      passportNumber: '09812401',
      nationality: 'Nepali',
      permitType: 'Upper Mustang Restricted Area',
      route: 'Kagbeni – Chele – Ghami – Tsarang – Lo Manthang',
      startDate: '2026-05-10',
      endDate: '2026-05-18',
      emergencyContact: 'Sita Pradhan (+977-9811234567)',
      insurancePolicyNumber: 'HIMALAYA-INS-98231',
      supportingDocuments: [
        { id: 'doc_id_3', name: 'Immigration Clearance Form', url: '/uploads/mustang_imm.pdf' },
      ],
      status: 'under_review',
      decisionNotes: 'Pending Department of Immigration group minimum clearance verification.',
      feeNpr: 65000,
      isReceipt: true,
      createdAt: '2026-02-12T09:20:00Z',
    },
  ];

  const payments: PaymentTransaction[] = [
    {
      id: 'TXN-KHL-99821',
      bookingId: 'BKG-84920',
      userId: 'usr_traveler_1',
      amountNpr: 370000,
      currency: 'NPR',
      provider: 'Khalti',
      providerTxnId: 'KHL-EPAY-881293',
      status: 'successful',
      receiptUrl: '/receipts/TXN-KHL-99821.pdf',
      createdAt: '2026-02-01T10:05:00Z',
    },
    {
      id: 'TXN-CARD-11029',
      bookingId: 'BKG-51042',
      userId: 'usr_traveler_1',
      amountNpr: 70000,
      currency: 'NPR',
      provider: 'Stripe',
      providerTxnId: 'ch_3N829104',
      status: 'successful',
      receiptUrl: '/receipts/TXN-CARD-11029.pdf',
      createdAt: '2026-02-05T14:32:00Z',
    },
  ];

  const customPlans: CustomPlan[] = [
    {
      id: 'PLN-2026-88',
      userId: 'usr_traveler_1',
      userName: 'Aayush Pradhan',
      userEmail: 'aayush.traveler@visitnepal.com',
      title: 'Trans-Himalayan Lo Manthang & Sky Caves Expedition',
      destinations: ['mustang-kingdom', 'pokhara-valley'],
      startDate: '2026-05-10',
      endDate: '2026-05-18',
      durationDays: 8,
      travelersCount: 2,
      adultsCount: 2,
      childrenCount: 0,
      experienceLevel: 'Experienced Trekker',
      travelStyle: 'Boutique Comfort',
      trekkingDifficulty: 'Moderate',
      estimatedBudgetNpr: 285000,
      budgetBreakdown: {
        accommodationNpr: 48000,
        guideNpr: 64000,
        porterNpr: 24000,
        permitsNpr: 65000,
        transportNpr: 45000,
        activitiesNpr: 15000,
        mealsNpr: 24000,
        butlerNpr: 0,
        taxVatNpr: 32500,
        serviceChargeNpr: 12500,
      },
      accommodationPreference: 'Boutique Heritage Lodges',
      guideRequested: true,
      porterRequested: true,
      transportRequested: true,
      butlerRequested: false,
      mealsPlan: 'All-Inclusive (3 Meals/Day)',
      equipmentRental: ['Down Sleeping Bag (-20C)', 'Trekking Poles (Pair)'],
      emergencyServices: ['Helicopter Rescue Authorization', 'Satellite Beacon'],
      detectedPermits: [
        { id: 'RAP-MUSTANG', name: 'Upper Mustang Special Restricted Area Permit (RAP)', feeNpr: 65000, authority: 'Department of Immigration, Nepal', required: true },
        { id: 'ACAP-ENTRY', name: 'Annapurna Conservation Area Entry Permit (ACAP)', feeNpr: 3000, authority: 'National Trust for Nature Conservation (NTNC)', required: true },
      ],
      itinerary: [
        { day: 1, title: 'Pokhara Rendezvous', destination: 'Pokhara', activity: 'Pre-expedition gear inspection & orientation', elevation: '822m', distanceKm: 0, walkingHours: 0, isRestDay: true },
        { day: 2, title: 'Flight to Jomsom & Trek to Kagbeni', destination: 'Jomsom to Kagbeni', activity: 'Enter restricted gateway along Kali Gandaki valley', elevation: '2,810m', distanceKm: 11, walkingHours: 3.5 },
        { day: 3, title: 'Kagbeni to Chele Red Gorges', destination: 'Kagbeni to Chele', activity: 'Climb through red clay canyons and rock bridges', elevation: '3,050m', distanceKm: 15, walkingHours: 5.5 },
        { day: 4, title: 'Chele to Syangboche Passes', destination: 'Chele to Syangboche', activity: 'Cross high pass facing Nilgiri and Damodar Himal', elevation: '3,800m', distanceKm: 14, walkingHours: 6 },
        { day: 5, title: 'Syangboche to Ghami Valley', destination: 'Syangboche to Ghami', activity: 'Pass Mani wall and red cliff formations', elevation: '3,520m', distanceKm: 12, walkingHours: 5 },
        { day: 6, title: 'Ghami to Tsarang Fortress', destination: 'Ghami to Tsarang', activity: 'Ancient library, White Palace & Red Monastery', elevation: '3,560m', distanceKm: 11, walkingHours: 4.5 },
        { day: 7, title: 'Tsarang to Walled Lo Manthang', destination: 'Tsarang to Lo Manthang', activity: 'Enter the walled capital of the Kings of Lo', elevation: '3,840m', distanceKm: 13, walkingHours: 5 },
        { day: 8, title: 'Chhoser Sky Caves & Monasteries', destination: 'Lo Manthang to Chhoser Caves', activity: 'Explore 2,500-year-old rock-cut dwellings', elevation: '3,900m', distanceKm: 8, walkingHours: 3.5, isRestDay: false },
      ],
      travelerContact: {
        fullName: 'Aayush Pradhan',
        email: 'aayush.traveler@visitnepal.com',
        phone: '+977-9801234567',
        nationality: 'Nepali',
        passportNumber: '09812401',
        emergencyContact: 'Sita Pradhan (+977-9811234567)',
        dietaryNotes: 'Standard Himalayan / Vegetarian Friendly',
      },
      quotations: [
        {
          id: 'QUO-2026-001',
          customTripId: 'PLN-2026-88',
          agencyId: 'biz_1',
          agencyName: 'Himalayan Sherpa Expeditions',
          quotedAmountNpr: 275000,
          breakdown: {
            accommodationNpr: 45000,
            guideNpr: 60000,
            porterNpr: 22000,
            permitsNpr: 68000,
            transportNpr: 40000,
            mealsNpr: 22000,
            equipmentNpr: 5000,
            serviceChargeNpr: 10000,
            taxVatNpr: 3000,
          },
          agencyNotes: 'Approved with licensed IFMGA Mustang lead guide Pasang Nuru Sherpa. Includes flight Pokhara-Jomsom-Pokhara and Mustang Special Permit fast-track clearance.',
          alternativeRoutesSuggested: 'Recommended adding 1 additional acclimatization afternoon in Lo Manthang for Chhoser cave meditation.',
          status: 'PENDING',
          createdAt: '2026-02-13T10:00:00Z',
        },
      ],
      status: 'QUOTED',
      createdAt: '2026-02-12T09:00:00Z',
    },
    {
      id: 'PLN-2026-89',
      userId: 'usr_traveler_1',
      userName: 'Aayush Pradhan',
      userEmail: 'aayush.traveler@visitnepal.com',
      title: 'Manaslu Circuit & Larkya La High Alpine Traverse',
      destinations: ['manaslu', 'annapurna'],
      startDate: '2026-06-01',
      endDate: '2026-06-14',
      durationDays: 14,
      travelersCount: 3,
      adultsCount: 3,
      childrenCount: 0,
      experienceLevel: 'Technical Mountaineer',
      travelStyle: 'Alpine Expedition Camp',
      trekkingDifficulty: 'Challenging',
      estimatedBudgetNpr: 410000,
      budgetBreakdown: {
        accommodationNpr: 60000,
        guideNpr: 112000,
        porterNpr: 45000,
        permitsNpr: 55000,
        transportNpr: 50000,
        activitiesNpr: 20000,
        mealsNpr: 42000,
        equipmentNpr: 14000,
        butlerNpr: 0,
        taxVatNpr: 40000,
        serviceChargeNpr: 18000,
      },
      accommodationPreference: 'Authentic Teahouse / High Camp',
      guideRequested: true,
      porterRequested: true,
      transportRequested: true,
      butlerRequested: false,
      mealsPlan: 'All-Inclusive (3 Meals/Day)',
      equipmentRental: ['Crampons & Microspikes', 'Expedition Down Jacket', 'Trekking Poles'],
      emergencyServices: ['High-Altitude Medical Oxygen', 'Helicopter Evacuation Registration'],
      detectedPermits: [
        { id: 'RAP-MANASLU', name: 'Manaslu Restricted Area Permit (MRAP)', feeNpr: 18000, authority: 'Department of Immigration', required: true },
        { id: 'MCAP-ENTRY', name: 'Manaslu Conservation Area Permit (MCAP)', feeNpr: 3000, authority: 'NTNC', required: true },
        { id: 'ACAP-ENTRY', name: 'Annapurna Conservation Area Permit (ACAP)', feeNpr: 3000, authority: 'NTNC', required: true },
      ],
      itinerary: [
        { day: 1, title: 'Drive Kathmandu to Soti Khola', destination: 'Soti Khola', activity: 'Private 4WD Scorpio transfer along Budhi Gandaki', elevation: '710m', distanceKm: 140, walkingHours: 0 },
        { day: 2, title: 'Soti Khola to Machha Khola', destination: 'Machha Khola', activity: 'Trek along rocky cliff paths and suspension bridges', elevation: '870m', distanceKm: 14, walkingHours: 5.5 },
        { day: 3, title: 'Machha Khola to Jagat Gateway', destination: 'Jagat', activity: 'Enter Restricted Manaslu Conservation Area checkpoint', elevation: '1,340m', distanceKm: 16, walkingHours: 6 },
        { day: 4, title: 'Jagat to Deng Pine Trails', destination: 'Deng', activity: 'Bamboo groves and dramatic valley waterfalls', elevation: '1,860m', distanceKm: 15, walkingHours: 6 },
        { day: 5, title: 'Deng to Namrung Tibetan Culture', destination: 'Namrung', activity: 'Witness Mani stones and high Tibetan architecture', elevation: '2,630m', distanceKm: 14, walkingHours: 5.5 },
        { day: 6, title: 'Namrung to Samagaon Village', destination: 'Samagaon', activity: 'Breathtaking open view of Mt. Manaslu (8,163m)', elevation: '3,530m', distanceKm: 16, walkingHours: 6.5 },
        { day: 7, title: 'Samagaon Acclimatization & Pungyen Gompa', destination: 'Samagaon', activity: 'Acclimatization hike to ancient glacial monastery', elevation: '4,050m', distanceKm: 8, walkingHours: 4, isRestDay: true },
        { day: 8, title: 'Samagaon to Samdo Border Village', destination: 'Samdo', activity: 'High alpine Yak pastures near Tibet border', elevation: '3,860m', distanceKm: 9, walkingHours: 3.5 },
        { day: 9, title: 'Samdo to Dharmasala High Base', destination: 'Dharmasala', activity: 'Final high camp preparation for pass crossing', elevation: '4,460m', distanceKm: 12, walkingHours: 4.5 },
        { day: 10, title: 'Cross Larkya La Pass to Bhimthang', destination: 'Larkya La (5,106m) to Bhimthang', activity: 'Glacier crossing over Larkya La summit with panoramic peaks', elevation: '5,106m', distanceKm: 17, walkingHours: 8.5 },
        { day: 11, title: 'Bhimthang to Tilije Rhododendron Forest', destination: 'Tilije', activity: 'Descend through Dudh Khola alpine forests', elevation: '2,300m', distanceKm: 15, walkingHours: 5.5 },
        { day: 12, title: 'Tilije to Dharapani Junction', destination: 'Dharapani', activity: 'Connect with classic Annapurna circuit trail', elevation: '1,860m', distanceKm: 9, walkingHours: 3.5 },
        { day: 13, title: 'Drive to Besisahar & Pokhara', destination: 'Pokhara', activity: 'Scenic mountain highway transfer', elevation: '822m', distanceKm: 110, walkingHours: 0 },
        { day: 14, title: 'Return Transfer to Kathmandu', destination: 'Kathmandu', activity: 'Celebratory farewell dinner in Thamel', elevation: '1,400m', distanceKm: 200, walkingHours: 0, isRestDay: true },
      ],
      travelerContact: {
        fullName: 'Aayush Pradhan',
        email: 'aayush.traveler@visitnepal.com',
        phone: '+977-9801234567',
        nationality: 'Nepali',
        passportNumber: '09812401',
        emergencyContact: 'Sita Pradhan (+977-9811234567)',
      },
      quotations: [],
      status: 'PENDING_REVIEW',
      createdAt: '2026-02-15T11:00:00Z',
    },
  ];

  const schedules: ScheduleEvent[] = [
    {
      id: 'sch_1',
      userId: 'usr_traveler_1',
      role: 'traveler',
      title: 'Lukla Departure Flight & Expedition Start',
      date: '2026-04-01',
      time: '06:15 AM',
      location: 'TIA Domestic Terminal, Kathmandu',
      status: 'upcoming',
      bookingId: 'BKG-84920',
    },
    {
      id: 'sch_2',
      userId: 'usr_guide_1',
      role: 'guide',
      title: 'Lead Expedition: Everest Base Camp (Aayush Pradhan group)',
      date: '2026-04-01',
      time: '06:00 AM',
      location: 'Lukla Airport Rendezvous',
      status: 'upcoming',
      bookingId: 'BKG-84920',
    },
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv_1',
      participants: [
        { userId: 'usr_traveler_1', name: 'Aayush Pradhan', role: 'traveler' },
        { userId: 'usr_guide_1', name: 'Pasang Nuru Sherpa (IFMGA)', role: 'guide' },
      ],
      lastMessage: 'All acclimatization gear and microspikes are packed. See you in Lukla on April 1st!',
      lastMessageAt: '2026-02-14T11:20:00Z',
      bookingId: 'BKG-84920',
    },
    {
      id: 'conv_2',
      participants: [
        { userId: 'usr_traveler_1', name: 'Aayush Pradhan', role: 'traveler' },
        { userId: 'usr_business_1', name: 'Himalayan Sherpa Expeditions', role: 'business' },
      ],
      lastMessage: 'Your TIMS and Sagarmatha National Park entry permits have been issued by the NTB officer.',
      lastMessageAt: '2026-02-03T08:30:00Z',
      bookingId: 'BKG-84920',
    },
  ];

  const messages: Message[] = [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_traveler_1',
      senderName: 'Aayush Pradhan',
      senderRole: 'traveler',
      content: 'Namaste Pasang Dai! Should we bring our own thermal sleeping bags or do the tea houses supply down blankets?',
      timestamp: '2026-02-14T10:45:00Z',
      isRead: true,
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'usr_guide_1',
      senderName: 'Pasang Nuru Sherpa',
      senderRole: 'guide',
      content: 'Namaste Aayush bhai! Tea houses have quilts, but above Namche at Lobuche and Gorak Shep it drops to -15C. I strongly recommend bringing a -20C down bag. We will do a full gear check in Kathmandu.',
      timestamp: '2026-02-14T11:05:00Z',
      isRead: true,
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'usr_guide_1',
      senderName: 'Pasang Nuru Sherpa',
      senderRole: 'guide',
      content: 'All acclimatization gear and microspikes are packed. See you in Lukla on April 1st!',
      timestamp: '2026-02-14T11:20:00Z',
      isRead: false,
    },
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: 'post_1',
      userId: 'usr_traveler_1',
      authorName: 'Aayush Pradhan',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      authorRole: 'Traveler',
      location: 'Ama Dablam Base Camp, Khumbu',
      content: 'Watching the morning alpenglow illuminate the granite pyramids of Ama Dablam at 4,600m. The sheer serenity of early autumn in the high Himalaya is unmatched.',
      mediaUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      likesCount: 38,
      likedBy: ['usr_guide_1', 'usr_butler_1'],
      commentsCount: 3,
      comments: [
        { id: 'c_1', authorName: 'Pasang Nuru Sherpa', authorAvatar: '', text: 'Great photo! The ridge route is crystal clear this morning.', createdAt: '2h ago' },
        { id: 'c_2', authorName: 'Sita Pradhan', authorAvatar: '', text: 'Breathtaking capture!', createdAt: '1h ago' },
      ],
      createdAt: '2026-02-14T06:30:00Z',
    },
    {
      id: 'post_2',
      userId: 'usr_guide_1',
      authorName: 'Pasang Nuru Sherpa',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      authorRole: 'Guide (IFMGA)',
      location: 'Cho La Pass (5,420m)',
      content: 'Safety Advisory: The northern descent from Cho La Pass has fresh compacted hard-ice. Microspikes or crampons are required for all crossing parties. Stay roped up on the glacial slope.',
      mediaUrl: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1000&q=80',
      likesCount: 64,
      likedBy: ['usr_traveler_1'],
      commentsCount: 2,
      comments: [
        { id: 'c_3', authorName: 'Himalayan Sherpa Expeditions', authorAvatar: '', text: 'Thank you Pasang Dai, briefing our teams immediately.', createdAt: '4h ago' },
      ],
      createdAt: '2026-02-13T14:10:00Z',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      userId: 'usr_traveler_1',
      title: 'Permit Approved: TIMS Card 2026',
      body: 'Nepal Tourism Board has officially approved your TIMS permit application for Everest Base Camp.',
      type: 'permit',
      link: '/bookings',
      isRead: false,
      createdAt: '2026-02-02T11:01:00Z',
    },
    {
      id: 'notif_2',
      userId: 'usr_traveler_1',
      title: 'Booking Confirmed: EBC Expedition',
      body: 'Himalayan Sherpa Expeditions confirmed your 14-day expedition reservation.',
      type: 'booking',
      link: '/bookings',
      isRead: true,
      createdAt: '2026-02-01T10:06:00Z',
    },
    {
      id: 'notif_3',
      userId: 'usr_guide_1',
      title: 'New Expedition Assignment',
      body: 'You have been assigned as lead IFMGA guide for Booking #BKG-84920 departing April 1st.',
      type: 'assignment',
      link: '/portals/guide',
      isRead: false,
      createdAt: '2026-02-01T10:07:00Z',
    },
    {
      id: 'notif_4',
      userId: 'usr_admin_1',
      title: 'Pending Permit Verification',
      body: 'New Upper Mustang Restricted Area application PMT-2026-003 awaits officer review.',
      type: 'permit',
      link: '/portals/admin',
      isRead: false,
      createdAt: '2026-02-12T09:21:00Z',
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'audit_1',
      actorId: 'usr_admin_1',
      actorName: 'Kritish Shrestha (NTB)',
      actorRole: 'admin',
      action: 'APPROVE_PERMIT',
      targetType: 'permit',
      targetId: 'PMT-2026-001',
      details: { permitType: 'TIMS Card', traveler: 'Aayush Pradhan', feeNpr: 2000 },
      timestamp: '2026-02-02T11:00:00Z',
    },
    {
      id: 'audit_2',
      actorId: 'usr_admin_1',
      actorName: 'Kritish Shrestha (NTB)',
      actorRole: 'admin',
      action: 'APPROVE_BUSINESS_KYC',
      targetType: 'business',
      targetId: 'biz_1',
      details: { companyName: 'Himalayan Sherpa Expeditions', pan: '601248912' },
      timestamp: '2026-01-05T12:00:00Z',
    },
  ];

  const payouts: PayoutTransaction[] = [
    {
      id: 'PAY-2026-001',
      recipientId: 'biz_1',
      recipientName: 'Himalayan Sherpa Expeditions',
      recipientRole: 'agency',
      amountNpr: 280000,
      status: 'completed',
      bankDetails: {
        bankName: 'Nepal Investment Mega Bank',
        accountNumber: '01800100293812',
        accountName: 'Himalayan Sherpa Expeditions Pvt Ltd',
        branch: 'Thamel Branch, Kathmandu',
      },
      notes: 'Settlement for Everest Base Camp bookings (Jan-Feb 2026 cycle)',
      processedBy: 'usr_super_admin_1',
      processedAt: '2026-02-15T10:00:00Z',
      createdAt: '2026-02-14T09:00:00Z',
    },
    {
      id: 'PAY-2026-002',
      recipientId: 'gd_1',
      recipientName: 'Pasang Nuru Sherpa',
      recipientRole: 'guide',
      amountNpr: 96000,
      status: 'pending',
      bankDetails: {
        bankName: 'Nabil Bank Ltd',
        accountNumber: '00291049281729',
        accountName: 'Pasang Nuru Sherpa',
        branch: 'Namche Bazaar / Kathmandu',
      },
      notes: 'Guide daily rate settlement for 8 days high-altitude guidance',
      createdAt: '2026-02-18T14:20:00Z',
    },
    {
      id: 'PAY-2026-003',
      recipientId: 'bt_1',
      recipientName: 'Pemba Tenzing Sherpa',
      recipientRole: 'butler',
      amountNpr: 42500,
      status: 'pending',
      bankDetails: {
        bankName: 'Global IME Bank',
        accountNumber: '11902049281920',
        accountName: 'Pemba Tenzing Sherpa',
        branch: 'Khumjung / Lukla Desk',
      },
      notes: 'Alpine concierge and gear portage completion allowance',
      createdAt: '2026-02-19T11:00:00Z',
    },
    {
      id: 'PAY-2026-004',
      recipientId: 'htl_barpeepal',
      recipientName: 'Bar Peepal Resort',
      recipientRole: 'hotel',
      amountNpr: 185000,
      status: 'completed',
      bankDetails: {
        bankName: 'Sanima Bank',
        accountNumber: '00401029384756',
        accountName: 'Bar Peepal Resort Pvt Ltd',
        branch: 'Lakeside Pokhara',
      },
      notes: 'Direct reservation payout after 10% platform commission',
      processedBy: 'usr_super_admin_1',
      processedAt: '2026-02-16T15:30:00Z',
      createdAt: '2026-02-15T12:00:00Z',
    },
  ];

  const refunds: RefundRecord[] = [
    {
      id: 'REF-2026-001',
      bookingId: 'BKG-51042',
      travelerId: 'usr_traveler_1',
      travelerName: 'Aayush Pradhan',
      amountNpr: 35000,
      reason: 'Adverse weather grounding Lukla flights - partial cancellation authorized by NTB',
      status: 'pending',
      createdAt: '2026-02-16T08:30:00Z',
    },
  ];

  const platformSettings: PlatformSettings = {
    commissions: {
      agencyCommissionPercent: 12,
      hotelCommissionPercent: 10,
      guideCommissionPercent: 5,
      butlerDailyCompensationNpr: 6000,
    },
    taxes: {
      vatPercent: 13,
      serviceChargePercent: 5,
    },
    general: {
      siteTitle: 'Visit Nepal Official National Tourism & Expedition Platform',
      supportEmail: 'support@visitnepal.com',
      supportPhone: '+977 1 4256909',
      emergencyHotline: '+977 1 4256909 / 1144',
      maintenanceMode: false,
      currency: 'NPR',
      enableRegistration: true,
      requireKycApproval: true,
    },
  };

  const cmsContent: CmsContent = {
    heroBanner: {
      title: 'Journey Through the Sacred Realm of the High Himalaya',
      subtitle: 'Official Government of Nepal Tourism Platform connecting global travelers to verified IFMGA Sherpa guides, iconic trekking circuits, and authentic heritage stays.',
      badge: 'Nepal Tourism Board 2026 · Official Digital Gateway',
      ctaPrimaryText: 'Explore Certified Expeditions',
      ctaPrimaryLink: '/explore',
    },
    announcements: [
      {
        id: 'ann_1',
        title: 'Spring 2026 High Altitude Permits Queue Now Open',
        body: 'Expedition permits for Everest, Annapurna, and Upper Mustang are now processed with real-time digital verification seals.',
        type: 'info',
        active: true,
        createdAt: '2026-02-15T00:00:00Z',
      },
      {
        id: 'ann_2',
        title: 'Mandatory Guide Regulation Compliance',
        body: 'All solo and group foreign trekkers in restricted conservation zones must be accompanied by an NMA/IFMGA certified mountain guide.',
        type: 'warning',
        active: true,
        createdAt: '2026-02-10T00:00:00Z',
      },
    ],
    travelAdvisories: [
      {
        id: 'adv_1',
        region: 'Solukhumbu (Everest Base Camp & Gokyo)',
        condition: 'Open',
        notes: 'Clear skies in morning. Snow above Lobuche (4,940m). Crampons and microspikes advised.',
        updatedAt: '2026-02-20T06:00:00Z',
      },
      {
        id: 'adv_2',
        region: 'Thorong La Pass (Annapurna Circuit)',
        condition: 'Caution',
        notes: 'High wind velocity reported above 5,000m. Crossing strictly permitted between 05:00 - 09:00 AM only.',
        updatedAt: '2026-02-19T18:00:00Z',
      },
    ],
  };

  return {
    users,
    businesses,
    guides,
    butlers,
    destinations,
    packages,
    services,
    hotels: getInitialHotels(),
    customPlans,
    bookings,
    permits,
    payments,
    schedules,
    conversations,
    messages,
    communityPosts,
    notifications,
    auditLogs,
    rolePermissions: { ...DEFAULT_ROLE_PERMISSIONS },
    payouts,
    refunds,
    platformSettings,
    cmsContent,
  };
}

export function getInitialHotels(): HotelListing[] {
  return [
    {
      id: 'htl_dwarikas',
      businessId: 'biz_1',
      name: "The Dwarika's Hotel",
      tagline: 'Living Museum of 13th-Century Newari Heritage & Royal Hospitality',
      description:
        "The Dwarika's Hotel is a living architectural sanctuary in Kathmandu, meticulously constructed around salvaged 13th-to-16th-century carved wood and terracotta artifacts. Nestled in Battisputali, the property offers world-class Ayurvedic wellness treatments, tranquil brick courtyards, an organic farm-to-table dining experience, and deeply personalized Sherpa concierge service.",
      location: 'Battisputali, Kathmandu',
      district: 'Kathmandu Valley',
      region: 'Central Nepal',
      address: 'Battisputali Road, Kathmandu 44600, Nepal',
      coordinates: { lat: 27.7058, lng: 85.3444 },
      rating: 4.96,
      reviewsCount: 382,
      starRating: 5,
      category: 'Luxury Heritage',
      basePriceNpr: 34500,
      basePriceUsd: 260,
      heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Heritage Courtyard Pool',
        'Pancha Kosha Himalayan Spa',
        'Krishnarpan Organic Dining (6-22 Courses)',
        'Fusion Bar & Cigar Lounge',
        'Complimentary High-Speed Wi-Fi',
        '24/7 Butler & Front Desk Concierge',
        'Airport Limousine Service',
        'Valet Parking',
      ],
      propertyHighlights: [
        'Preserved 13th-century hand-carved Newari woodwork throughout property',
        'Organic farm produce sourced daily from their private Dhulikhel estate',
        '10 minutes from Pashupatinath Temple and 15 minutes from Tribhuvan Airport',
        'Authentic Ayurvedic wellness treatments supervised by resident physicians',
      ],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      policies: {
        cancellation: 'Free cancellation up to 48 hours prior to check-in. Cancellations within 48 hours incur 1 night charge.',
        childPolicy: 'Children up to 5 years stay free of charge using existing bedding.',
        pets: 'Pets are not allowed on property.',
        smoking: 'Non-smoking rooms. Dedicated heritage courtyard smoking pavilions available.',
      },
      contactPhone: '+977 1 4479488',
      contactEmail: 'reservations@dwarikas.com',
      rooms: [
        {
          id: 'rm_dwarikas_heritage_deluxe',
          hotelId: 'htl_dwarikas',
          name: 'Heritage Deluxe Room',
          description: 'Spacious suite featuring original terracotta floor tiles, hand-woven linens, and custom brass bath fixtures.',
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: '1 King Bed or 2 Twin Beds',
          roomSizeM2: 44,
          pricePerNightNpr: 34500,
          pricePerNightUsd: 260,
          availableInventory: 8,
          totalInventory: 10,
          images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Private Balcony', 'Deep Soaking Bathtub', 'Hand-Crafted Organic Toiletries', 'Nespresso Coffee Machine', 'In-Room Safe'],
          cancellationPolicy: 'Free cancellation until 48h before arrival',
          mealPlan: 'Breakfast Included',
        },
        {
          id: 'rm_dwarikas_junior_suite',
          hotelId: 'htl_dwarikas',
          name: 'Heritage Junior Suite',
          description: 'Expansive historic suite with separated lounge parlor, custom Newari wooden four-poster bed, and courtyard garden views.',
          capacityAdults: 3,
          capacityChildren: 1,
          bedType: '1 King Four-Poster Bed + Daybed',
          roomSizeM2: 68,
          pricePerNightNpr: 48000,
          pricePerNightUsd: 360,
          availableInventory: 5,
          totalInventory: 6,
          images: [
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Separate Living Area', 'Courtyard Garden View', 'Complimentary Evening Cocktails', 'Rain Shower & Tub', 'Daily Fresh Fruit Basket'],
          cancellationPolicy: 'Free cancellation until 48h before arrival',
          mealPlan: 'Breakfast Included',
        },
        {
          id: 'rm_dwarikas_royal_suite',
          hotelId: 'htl_dwarikas',
          name: 'Royal Heritage Executive Suite',
          description: 'A palatial residence spanning two levels with private open-air terrace, dedicated 24-hour butler, and antique museum artifacts.',
          capacityAdults: 4,
          capacityChildren: 2,
          bedType: '2 King Beds',
          roomSizeM2: 120,
          pricePerNightNpr: 85000,
          pricePerNightUsd: 640,
          availableInventory: 2,
          totalInventory: 2,
          images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Private Butler', 'Private Open-Air Terrace', 'Double Rain Shower & Whirlpool', 'Executive Bar', 'VIP Airport Transfer'],
          cancellationPolicy: 'Free cancellation until 7 days before arrival',
          mealPlan: 'All-Inclusive',
        },
      ],
      reviews: [
        {
          id: 'rev_dw_1',
          hotelId: 'htl_dwarikas',
          userId: 'usr_traveler_1',
          userName: 'Dr. Alistair Finch',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 4.8, service: 5, value: 4.9 },
          reviewText: 'Stepping into Dwarika’s feels like time-traveling into an ancient Malla palace. Krishnarpan 9-course dinner was unforgettable.',
          tripType: 'Couple',
          createdAt: '2026-02-10T14:30:00Z',
        },
        {
          id: 'rev_dw_2',
          hotelId: 'htl_dwarikas',
          userId: 'usr_traveler_2',
          userName: 'Sunita Sharma',
          rating: 5,
          ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 5, service: 5, value: 4.8 },
          reviewText: 'Impeccable Ayurvedic spa and courteous staff. The best hotel in Nepal without question.',
          tripType: 'Solo',
          createdAt: '2026-01-22T09:15:00Z',
        },
      ],
    },
    {
      id: 'htl_barpeepal',
      businessId: 'biz_2',
      name: 'Bar Peepal Resort',
      tagline: 'Phewa Lake Infinity Vista & Himalayan Sunrise Sanctuary',
      description:
        'Perched atop Sarangkot hill overlooking tranquil Phewa Lake and the dramatic Fishtail (Machhapuchhre) and Annapurna mountain range. Features a heated hillside infinity pool, private balconies for every room, and farm-fresh organic dining.',
      location: 'Sarangkot Road, Pokhara',
      district: 'Pokhara & Annapurna',
      region: 'Western Nepal',
      address: 'Sarangkot Hillside, Pokhara 33700, Nepal',
      coordinates: { lat: 28.238, lng: 83.9556 },
      rating: 4.9,
      reviewsCount: 295,
      starRating: 5,
      category: 'Resort & Spa',
      basePriceNpr: 19200,
      basePriceUsd: 145,
      heroImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=85',
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Hillside Heated Infinity Pool',
        'Annapurna Panorama Yoga Deck',
        'Ayurveda Herbal Sauna',
        'Organic Mountain View Restaurant',
        'Free Airport Shuttle (Pokhara Int’l)',
        'High-Speed Wi-Fi',
      ],
      propertyHighlights: [
        'Direct sunrise views over Fishtail & Annapurna without leaving your bed',
        'Heated outdoor infinity pool looking down onto Phewa Lake',
        'Close to paragliding take-off point at Sarangkot',
      ],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      policies: {
        cancellation: 'Free cancellation up to 48 hours before arrival. 1 night charge for late cancellation.',
        childPolicy: 'Children under 6 stay free.',
        pets: 'Small pets allowed upon prior notice.',
        smoking: 'Smoking permitted on open balconies only.',
      },
      contactPhone: '+977 61 465220',
      contactEmail: 'contact@barpeepalresort.com',
      rooms: [
        {
          id: 'rm_barpeepal_deluxe_lake',
          hotelId: 'htl_barpeepal',
          name: 'Deluxe Lake View Room',
          description: 'Contemporary room with private wood-deck balcony overlooking Phewa Lake and the World Peace Pagoda.',
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: '1 King Bed',
          roomSizeM2: 38,
          pricePerNightNpr: 19200,
          pricePerNightUsd: 145,
          availableInventory: 12,
          totalInventory: 14,
          images: [
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Private Balcony', 'Lake & Mountain View', 'Rain Shower', 'Espresso Maker'],
          cancellationPolicy: 'Free cancellation until 48h before check-in',
          mealPlan: 'Breakfast Included',
        },
        {
          id: 'rm_barpeepal_annapurna_suite',
          hotelId: 'htl_barpeepal',
          name: 'Annapurna Sunrise Executive Suite',
          description: 'Corner luxury suite with wrap-around glass floor-to-ceiling windows and panoramic Annapurna mountain vistas.',
          capacityAdults: 3,
          capacityChildren: 1,
          bedType: '1 King Bed + 1 Daybed',
          roomSizeM2: 58,
          pricePerNightNpr: 29500,
          pricePerNightUsd: 220,
          availableInventory: 6,
          totalInventory: 8,
          images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Wrap-around Glass Balcony', 'Jacuzzi with Mountain View', 'Complimentary Minibar', 'Butler on Call'],
          cancellationPolicy: 'Free cancellation until 48h before check-in',
          mealPlan: 'Breakfast Included',
        },
      ],
      reviews: [
        {
          id: 'rev_bp_1',
          hotelId: 'htl_barpeepal',
          userId: 'usr_traveler_1',
          userName: 'Marcus Vance',
          rating: 5,
          ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 5, service: 4.9, value: 4.8 },
          reviewText: 'Waking up to the golden dawn on Machhapuchhre was a spiritual experience. The infinity pool is breathtaking.',
          tripType: 'Couple',
          createdAt: '2026-02-14T08:00:00Z',
        },
      ],
    },
    {
      id: 'htl_yeti_namche',
      businessId: 'biz_1',
      name: 'Yeti Mountain Home Namche',
      tagline: 'Luxury Alpine Lodge at 3,440m Altitude in the Heart of Sherpa Country',
      description:
        'Yeti Mountain Home in Namche Bazaar combines warm Sherpa stone architecture with alpine luxury. Heated under-blankets, on-site oxygen concentrators, panoramic sun terraces facing Kongde Ri peak, and hearty high-altitude cuisine prepare trekkers for the heights of Everest.',
      location: 'Namche Bazaar, Everest',
      district: 'Solukhumbu (Everest Region)',
      region: 'Eastern Himalaya',
      address: 'Namche Bazaar 56002, Sagarmatha National Park, Nepal',
      coordinates: { lat: 27.8069, lng: 86.714 },
      rating: 4.92,
      reviewsCount: 184,
      starRating: 4.5,
      category: 'Mountain Teahouse',
      basePriceNpr: 26000,
      basePriceUsd: 195,
      heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=85',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Heated Electric Blankets',
        'Medical Oxygen Concentrators on Call',
        'Kongde Ri Sun Terrace',
        'Cozy Wood-Fired Fireplace Lounge',
        'Hot High-Pressure En-Suite Showers',
        'Sherpa Herbal Tea Bar',
        'Satellite Wi-Fi',
      ],
      propertyHighlights: [
        'Direct Kongde Ri and Thamserku mountain views from the dining lounge',
        'Electric heated beds in all rooms — essential comfort at 3,440m',
        '5-minute walk to Namche Saturday market and Sherpa Cultural Museum',
      ],
      checkInTime: '13:00',
      checkOutTime: '10:00',
      policies: {
        cancellation: 'Free cancellation up to 72 hours before arrival. Weather flight delays covered without penalty.',
        childPolicy: 'Suitable for children over 8 years due to altitude acclimatization.',
        pets: 'Pets not permitted.',
        smoking: 'Strictly non-smoking property.',
      },
      contactPhone: '+977 38 540123',
      contactEmail: 'namche@yetimountainhome.com',
      rooms: [
        {
          id: 'rm_yeti_alpine_twin',
          hotelId: 'htl_yeti_namche',
          name: 'Alpine Heated Twin Room',
          description: 'Wood-paneled alpine room with individual electric mattress warmers, thermal duvets, and private attached bathroom with continuous hot water.',
          capacityAdults: 2,
          capacityChildren: 0,
          bedType: '2 Single Heated Beds',
          roomSizeM2: 28,
          pricePerNightNpr: 26000,
          pricePerNightUsd: 195,
          availableInventory: 10,
          totalInventory: 12,
          images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Electric Heated Blankets', 'Attached Hot Shower', 'Thermal Insulation', 'Oxygen Monitor on Request'],
          cancellationPolicy: 'Free cancellation until 72h before check-in',
          mealPlan: 'Breakfast Included',
        },
        {
          id: 'rm_yeti_himalayan_king',
          hotelId: 'htl_yeti_namche',
          name: 'Himalayan Vista King Room',
          description: 'Spacious king bedroom with picture windows framing Kongde Ri and the high amphitheater of Namche Bazaar.',
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: '1 King Heated Bed',
          roomSizeM2: 35,
          pricePerNightNpr: 32000,
          pricePerNightUsd: 240,
          availableInventory: 6,
          totalInventory: 6,
          images: [
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Kongde Ri Mountain View', 'Electric Heated Bed', 'Plush Down Duvet', 'Hot Water Bottle Service'],
          cancellationPolicy: 'Free cancellation until 72h before check-in',
          mealPlan: 'Half Board',
        },
      ],
      reviews: [
        {
          id: 'rev_ymh_1',
          hotelId: 'htl_yeti_namche',
          userId: 'usr_traveler_1',
          userName: 'Elena Rostova',
          rating: 5,
          ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 5, service: 5, value: 4.8 },
          reviewText: 'After hiking up the steep hill from Phakding, stepping into Yeti Mountain Home with hot showers and warm heated blankets was paradise.',
          tripType: 'Solo',
          createdAt: '2026-02-18T16:00:00Z',
        },
      ],
    },
    {
      id: 'htl_shinta_mani',
      businessId: 'biz_1',
      name: 'Shinta Mani Mustang - A Bensley Collection',
      tagline: 'Ultra-Luxury Sanctuary Designed by Bill Bensley in Ancient Mustang',
      description:
        'An extraordinary 29-suite luxury sanctuary in the rain-shadow kingdom of Mustang. Each suite boasts panoramic views of Mount Nilgiri, bespoke Tibetan hand-knotted textiles, private Sherpa butler service, all-inclusive gourmet dining, and curated private expeditions into the walled medieval capital of Lo Manthang.',
      location: 'Marpha & Jomsom, Mustang',
      district: 'Mustang (Kingdom of Lo)',
      region: 'Trans-Himalayan Plateau',
      address: 'Nilgiri View Ridge, Jomsom 33100, Mustang, Nepal',
      coordinates: { lat: 28.784, lng: 83.743 },
      rating: 4.99,
      reviewsCount: 128,
      starRating: 5,
      category: 'Luxury Heritage',
      basePriceNpr: 112000,
      basePriceUsd: 850,
      heroImage: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1400&q=85',
      images: [
        'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'All-Inclusive Experiential Stays',
        'Private Dedicated Sherpa Butler',
        'Nilgiri Spa by Tibetan Traditional Amchi',
        'Helicopter Pad On-Site',
        'Curated 4x4 Overland Expeditions',
        'Fine Dining Himalayan Wine Cellar',
        'Personalized Trekking Permits Coordination',
      ],
      propertyHighlights: [
        'Awarded World’s Best High-Altitude Luxury Resort by Condé Nast Traveler',
        'Personal Amchi (Tibetan medicine doctor) wellness consultations included',
        'Private helicopter access directly onto the resort’s private mountain pad',
      ],
      checkInTime: '14:00',
      checkOutTime: '12:00',
      policies: {
        cancellation: 'Free cancellation up to 14 days before arrival. 50% deposit required at reservation.',
        childPolicy: 'Welcome for children over 10 years of age.',
        pets: 'Pets not permitted.',
        smoking: 'Non-smoking suites throughout.',
      },
      contactPhone: '+977 69 440120',
      contactEmail: 'mustang@shintamani.com',
      rooms: [
        {
          id: 'rm_shinta_nilgiri_suite',
          hotelId: 'htl_shinta_mani',
          name: 'Nilgiri Mountain View Suite',
          description: 'A masterpiece of sustainable architecture with floor-to-ceiling vistas of Mount Nilgiri, handcrafted Yak bone and stone furniture, and open fireplace.',
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: '1 Super King Bed',
          roomSizeM2: 68,
          pricePerNightNpr: 112000,
          pricePerNightUsd: 850,
          availableInventory: 5,
          totalInventory: 6,
          images: [
            'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Nilgiri View Fireplace', 'Personal Butler', 'All Excursions Included', 'Copper Soaking Tub', 'Daily High-Altitude Massage'],
          cancellationPolicy: 'Free cancellation up to 14 days before arrival',
          mealPlan: 'All-Inclusive',
        },
      ],
      reviews: [
        {
          id: 'rev_sm_1',
          hotelId: 'htl_shinta_mani',
          userId: 'usr_traveler_1',
          userName: 'Lord Arthur Sterling',
          rating: 5,
          ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 5, service: 5, value: 5 },
          reviewText: 'One of the most extraordinary hotel experiences on planet Earth. The private excursions with their master guides were phenomenal.',
          tripType: 'Couple',
          createdAt: '2026-02-05T12:00:00Z',
        },
      ],
    },
    {
      id: 'htl_barahi',
      businessId: 'biz_2',
      name: 'Barahi Jungle Lodge',
      tagline: 'Riverfront Eco-Luxury & Wild Tiger Safaris on the Rapti River',
      description:
        'Nestled along the Rapti River facing the primary jungle of Chitwan National Park. Features standalone thatched eco-cottages, an infinity swimming pool right on the riverbank, and guided walking safaris with legendary local naturalists.',
      location: 'Meghauli, Chitwan',
      district: 'Chitwan National Park',
      region: 'Southern Terai',
      address: 'Andrauli, Meghauli, Chitwan 44200, Nepal',
      coordinates: { lat: 27.578, lng: 84.225 },
      rating: 4.88,
      reviewsCount: 240,
      starRating: 5,
      category: 'Eco Retreat',
      basePriceNpr: 29000,
      basePriceUsd: 220,
      heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85',
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Riverbank Infinity Swimming Pool',
        'Private Wooden River Decks',
        'Jeep & River Boat Safaris with Naturalists',
        'Tharu Cultural Performances',
        'Banyan Bush Dinners under Stars',
        'Tiger & Rhino Tracking Excursions',
      ],
      propertyHighlights: [
        'Watch wild rhinos and crocodiles drinking from the river straight from your cottage',
        '100% solar-assisted eco-sustainable resort architecture',
        'Private canoe boat safaris at golden sunrise',
      ],
      checkInTime: '13:00',
      checkOutTime: '11:00',
      policies: {
        cancellation: 'Free cancellation up to 48 hours prior to check-in.',
        childPolicy: 'Children of all ages welcome. Baby cots available upon request.',
        pets: 'Pets not permitted due to national park wildlife regulations.',
        smoking: 'Outdoor areas only.',
      },
      contactPhone: '+977 56 695333',
      contactEmail: 'info@barahijunglelodge.com',
      rooms: [
        {
          id: 'rm_barahi_river_cottage',
          hotelId: 'htl_barahi',
          name: 'Deluxe Riverfront Safari Cottage',
          description: 'Stand-alone luxury cottage built from local bamboo, mud, and thatch with private wooden veranda gazing into Chitwan National Park.',
          capacityAdults: 2,
          capacityChildren: 1,
          bedType: '1 King Bed or 2 Twin Beds',
          roomSizeM2: 48,
          pricePerNightNpr: 29000,
          pricePerNightUsd: 220,
          availableInventory: 14,
          totalInventory: 16,
          images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Private River Veranda', 'Deep Soaking Tub', 'Complimentary Jungle Safari', 'Binoculars in Room'],
          cancellationPolicy: 'Free cancellation until 48h before arrival',
          mealPlan: 'All-Inclusive',
        },
      ],
      reviews: [
        {
          id: 'rev_bj_1',
          hotelId: 'htl_barahi',
          userId: 'usr_traveler_1',
          userName: 'Nadia Petrov',
          rating: 5,
          ratingsBreakdown: { cleanliness: 4.9, comfort: 5, location: 5, service: 5, value: 4.8 },
          reviewText: 'We saw two one-horned rhinos crossing the river right in front of our balcony during afternoon tea! Exceptional naturalists.',
          tripType: 'Family',
          createdAt: '2026-01-30T10:00:00Z',
        },
      ],
    },
    {
      id: 'htl_everest_view',
      businessId: 'biz_1',
      name: 'Hotel Everest View',
      tagline: 'Guinness World Record Holder at 3,880m with Direct Everest Summit Panorama',
      description:
        'Established in 1971 and opened by legendary mountaineers, Hotel Everest View sits on a forested ridge above Namche Bazaar. Recognized by the Guinness Book of World Records as the highest placed luxury hotel in the world, every single room commands an unobstructed direct view of Mount Everest, Lhotse, and Ama Dablam.',
      location: 'Syangboche (3,880m), Everest',
      district: 'Solukhumbu',
      region: 'Everest Region',
      address: 'Syangboche Ridge, Sagarmatha National Park, Nepal',
      coordinates: { lat: 27.82, lng: 86.72 },
      rating: 4.98,
      reviewsCount: 310,
      starRating: 5,
      category: 'Boutique Lodge',
      basePriceNpr: 42000,
      basePriceUsd: 315,
      heroImage: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1400&q=85',
      images: [
        'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: [
        'Direct Everest Terrace Dining',
        'Pressurized Oxygen En-Suite Rooms',
        'Private Helicopter Landing Pad',
        'Japanese Stone Garden in High Alpine',
        'Authentic Dining with Organic Bakery',
        'Satellite Wi-Fi',
      ],
      propertyHighlights: [
        'Every single room has a private balcony directly facing Mount Everest',
        'Private helipad connecting directly to Kathmandu Tribhuvan Airport in 45 mins',
        'Oxygen concentrators in all bedrooms for restful sleep at 3,880m',
      ],
      checkInTime: '13:00',
      checkOutTime: '11:00',
      policies: {
        cancellation: 'Free cancellation up to 5 days before arrival.',
        childPolicy: 'Suitable for travelers acclimatized above 3,000m.',
        pets: 'Pets not allowed.',
        smoking: 'Non-smoking.',
      },
      contactPhone: '+977 1 4412508',
      contactEmail: 'hev@himalayan-hotel.com',
      rooms: [
        {
          id: 'rm_ev_everest_facing',
          hotelId: 'htl_everest_view',
          name: 'Everest Panorama Luxury Room',
          description: 'Iconic room with floor-to-ceiling glass doors opening directly toward Mt. Everest, Lhotse, and Ama Dablam.',
          capacityAdults: 2,
          capacityChildren: 0,
          bedType: '1 King Bed or 2 Twins',
          roomSizeM2: 34,
          pricePerNightNpr: 42000,
          pricePerNightUsd: 315,
          availableInventory: 12,
          totalInventory: 12,
          images: [
            'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=800&q=80',
          ],
          amenities: ['Direct Everest Balcony', 'Oxygen Enriched System', 'Attached Hot Shower', 'Thermal Fleece Blankets'],
          cancellationPolicy: 'Free cancellation until 5 days before arrival',
          mealPlan: 'Breakfast Included',
        },
      ],
      reviews: [
        {
          id: 'rev_hev_1',
          hotelId: 'htl_everest_view',
          userId: 'usr_traveler_1',
          userName: 'Captain Thomas Reed',
          rating: 5,
          ratingsBreakdown: { cleanliness: 5, comfort: 5, location: 5, service: 5, value: 5 },
          reviewText: 'Having morning cappuccino on the terrace while watching the morning sun illuminate Everest summit is something I will remember for the rest of my life.',
          tripType: 'Couple',
          createdAt: '2026-02-12T07:45:00Z',
        },
      ],
    },
  ];
}

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const state = JSON.parse(raw);
        let modified = false;

        if (!state.hotels || !Array.isArray(state.hotels) || state.hotels.length === 0) {
          state.hotels = getInitialHotels();
          modified = true;
        }

        const initial = getInitialSeedData();
        if (!state.rolePermissions) {
          state.rolePermissions = initial.rolePermissions;
          modified = true;
        }
        if (!state.payouts) {
          state.payouts = initial.payouts;
          modified = true;
        }
        if (!state.refunds) {
          state.refunds = initial.refunds;
          modified = true;
        }
        if (!state.platformSettings) {
          state.platformSettings = initial.platformSettings;
          modified = true;
        }
        if (!state.cmsContent) {
          state.cmsContent = initial.cmsContent;
          modified = true;
        }
        if (!state.users.some((u: UserAccount) => u.role === 'super_admin')) {
          state.users.unshift(initial.users[0]);
          modified = true;
        }

        if (modified) {
          this.saveDirect(state);
        }
        return state;
      }
    } catch (err) {
      console.error('[dbStore] Error reading persistent storage, initializing defaults:', err);
    }
    const initial = getInitialSeedData();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(state: DatabaseState): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmp = `${DATA_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf-8');
      fs.renameSync(tmp, DATA_FILE);
    } catch (err) {
      console.error('[dbStore] Failed to write db.json:', err);
    }
  }

  public save(): void {
    this.saveDirect(this.state);
  }

  public getState(): DatabaseState {
    return this.state;
  }
}

export const db = new DatabaseManager();
