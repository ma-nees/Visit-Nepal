import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Types definition matching the comprehensive schema
export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'traveler' | 'business' | 'guide' | 'butler' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  phone?: string;
  avatarUrl?: string;
  bio?: string;
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

export interface CustomPlan {
  id: string;
  userId: string;
  userName: string;
  title: string;
  destinations: string[];
  startDate: string;
  durationDays: number;
  trekkingDifficulty: string;
  estimatedBudgetNpr: number;
  budgetBreakdown: {
    accommodationNpr: number;
    guideNpr: number;
    permitsNpr: number;
    transportNpr: number;
    activitiesNpr: number;
    butlerNpr: number;
  };
  accommodationPreference: string;
  guideRequested: boolean;
  transportRequested: boolean;
  butlerRequested: boolean;
  itinerary: Array<{ day: number; destination: string; activity: string; elevation: string }>;
  status: 'draft' | 'submitted' | 'approved' | 'converted_to_booking';
  createdAt: string;
}

export interface Booking {
  id: string;
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
  totalAmountNpr: number;
  status:
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

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  location: string;
  content: string;
  mediaUrl: string;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  comments: Array<{ id: string; authorName: string; authorAvatar: string; text: string; createdAt: string }>;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'permit' | 'kyc' | 'message' | 'assignment' | 'alert';
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
  timestamp: string;
}

export interface DatabaseState {
  users: UserAccount[];
  businesses: BusinessProfile[];
  guides: GuideProfile[];
  butlers: ButlerProfile[];
  destinations: Destination[];
  packages: TrekkingPackage[];
  services: ServiceListing[];
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
}

const DATA_FILE = path.join(__dirname, '../../data/db.json');

// Default initial state with realistic, verified seed records
function getInitialSeedData(): DatabaseState {
  const passwordHash = bcrypt.hashSync('NepalTourism2026!', 10);

  const users: UserAccount[] = [
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
      title: 'Trans-Himalayan Lo Manthang & Sky Caves Expedition',
      destinations: ['mustang-kingdom', 'pokhara-valley'],
      startDate: '2026-05-10',
      durationDays: 8,
      trekkingDifficulty: 'Moderate',
      estimatedBudgetNpr: 285000,
      budgetBreakdown: {
        accommodationNpr: 48000,
        guideNpr: 96000,
        permitsNpr: 65000,
        transportNpr: 45000,
        activitiesNpr: 15000,
        butlerNpr: 16000,
      },
      accommodationPreference: 'Boutique Heritage Lodges',
      guideRequested: true,
      transportRequested: true,
      butlerRequested: false,
      itinerary: [
        { day: 1, destination: 'Pokhara', activity: 'Pre-expedition gear inspection & orientation', elevation: '822m' },
        { day: 2, destination: 'Jomsom to Kagbeni', activity: 'Enter restricted gateway along Kali Gandaki', elevation: '2,810m' },
        { day: 3, destination: 'Kagbeni to Chele', activity: 'Climb through red clay canyons', elevation: '3,050m' },
        { day: 4, destination: 'Chele to Syangboche', activity: 'Cross high passes facing Nilgiri', elevation: '3,800m' },
        { day: 5, destination: 'Syangboche to Ghami', activity: 'Longest Mani wall in Nepal', elevation: '3,520m' },
        { day: 6, destination: 'Ghami to Tsarang', activity: 'Ancient library and monastery', elevation: '3,560m' },
        { day: 7, destination: 'Tsarang to Lo Manthang', activity: 'Enter the walled capital of Lo', elevation: '3,840m' },
        { day: 8, destination: 'Lo Manthang to Chhoser Caves', activity: 'Explore 2,500-year-old rock-cut dwellings', elevation: '3,900m' },
      ],
      status: 'submitted',
      createdAt: '2026-02-12T09:00:00Z',
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

  return {
    users,
    businesses,
    guides,
    butlers,
    destinations,
    packages,
    services,
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
  };
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
        return JSON.parse(raw);
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
