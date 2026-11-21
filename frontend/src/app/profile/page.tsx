'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  LogOut,
  Check,
  Compass,
  CalendarCheck,
  Building2,
  ConciergeBell,
  Shield,
  ShieldAlert,
  X,
  Printer,
  Maximize2,
  QrCode,
  ShieldCheck,
  MapPin,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  Bookmark,
  Ticket,
  Heart,
  Map,
  Star,
  Settings,
  Lock,
  Camera,
  Edit3,
  Key,
  AlertCircle,
  FileText,
  User,
  Headset,
  Folder,
  Home,
  ChevronRight,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { useApp, UserRole } from '@/context/AppContext';
import {
  printOfficialReceipt,
  downloadOfficialReceiptHtml,
  sanitizeName,
} from '@/lib/receiptGenerator';

interface PersonaProfile {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  country: string;
  dob: string;
  address: string;
  memberSince: string;
  title: string;
  avatar: string;
  portalLink: string;
  portalLabel: string;
  description: string;
  highlights: string[];
}

const roleIcon: Record<UserRole, LucideIcon> = {
  super_admin: ShieldAlert,
  ntb_admin: Shield,
  admin: Shield,
  agency: Building2,
  business: Building2,
  guide: Award,
  butler: ConciergeBell,
  traveler: Compass,
};

const personaProfiles: PersonaProfile[] = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    name: 'Govinda Thapa',
    email: 'superadmin@visitnepal.com',
    phone: '+977 1 4410022',
    nationality: 'Nepali',
    country: 'Nepal',
    dob: '12 Jan 1982',
    address: 'Kathmandu HQ, Bagmati 44600, Nepal',
    memberSince: 'Platform Founder 2020',
    title: 'Platform Director & Chief Administrator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    portalLink: '/admin',
    portalLabel: 'super admin command center',
    description: 'Full platform governance: global user management, dynamic RBAC matrices, platform financial settlements, hotel and package catalog approvals, and cryptographic audit stream.',
    highlights: ['Platform Commander', 'Financial Governance', 'Global Security Desk'],
  },
  {
    role: 'traveler',
    label: 'Traveler',
    name: 'Aayush Pradhan',
    email: 'aayush.traveler@visitnepal.com',
    phone: '+977 9841-234567',
    nationality: 'Nepali',
    country: 'Nepal',
    dob: '15 Aug 1994',
    address: 'Ward 26, Thamel Marg, Kathmandu 44600, Nepal',
    memberSince: 'March 2024',
    title: 'Traveler',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    portalLink: '/dashboard',
    portalLabel: 'my bookings & passes',
    description: 'Passionate Himalayan trekker, photographer, and tea enthusiast. Exploring high-altitude glacial passes, Annapurna sanctuary, and ancient monastic trails.',
    highlights: ['Annapurna Circuit Pass', 'TIMS Verified 2026', 'High Altitude Clearance (5,416m)'],
  },
  {
    role: 'guide',
    label: 'Mountain Guide',
    name: 'Pasang Nuru Sherpa',
    email: 'pasang.sherpa@visitnepal.com',
    phone: '+977 9801-778899',
    nationality: 'Nepali (Sherpa)',
    country: 'Nepal',
    dob: '04 May 1988',
    address: 'Namche Bazaar, Solukhumbu, Nepal',
    memberSince: 'January 2022',
    title: 'NMA & IFMGA Lead Mountain Guide',
    avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/guide',
    portalLabel: 'mountain guide portal',
    description: 'Assigned expedition rosters, client altitude telemetry, daily rate payouts, and 14x 8,000m summit leader.',
    highlights: ['14x Everest Summits', 'IFMGA Lead Badge', 'Wilderness First Responder'],
  },
  {
    role: 'butler',
    label: 'Sherpa Butler',
    name: 'Mingma Sherpa',
    email: 'sherpa.butler@visitnepal.com',
    phone: '+977 9851-443322',
    nationality: 'Nepali',
    country: 'Nepal',
    dob: '19 Nov 1991',
    address: 'Khumjung Village, Solukhumbu, Nepal',
    memberSince: 'June 2023',
    title: 'Dedicated Sherpa Butler & VIP Concierge',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/butler',
    portalLabel: 'Sherpa butler portal',
    description: 'Guest gear portage itineraries, VIP teahouse reservations, warm bedding logistics, and baggage tracking.',
    highlights: ['VIP Teahouse Desk', 'Khumbu Route Concierge', 'Portage Operations'],
  },
  {
    role: 'agency',
    label: 'Tour Agency',
    name: 'Himalayan Expeditions Enterprise',
    email: 'partner@himalayanexpeditions.com',
    phone: '+977 1 4429988',
    nationality: 'Registered Agency',
    country: 'Nepal',
    dob: 'Est. 2010',
    address: 'Durbar Marg, Kathmandu, Nepal',
    memberSince: 'November 2021',
    title: 'Licensed Tour Operator & Expedition Suite',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/business',
    portalLabel: 'agency operations hub',
    description: 'Manage client group bookings, guide allocations, permit filings, and financial settlements.',
    highlights: ['TAAN Certified Agency', 'Helicopter Fleet Access', 'B2B Operator Portal'],
  },
  {
    role: 'ntb_admin',
    label: 'NTB Admin',
    name: 'Ministry Tourism Officer',
    email: 'officer@ntb.gov.np',
    phone: '+977 1 4256909',
    nationality: 'Official Desk',
    country: 'Nepal',
    dob: 'Govt. 2026',
    address: 'Bhrikutimandap, Kathmandu, Nepal',
    memberSince: 'January 2020',
    title: 'Nepal Tourism Board (NTB) Government Admin Desk',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    portalLink: '/portals/admin',
    portalLabel: 'NTB government desk',
    description: 'National real-time traveler tracking, TIMS and restricted permit queues, and compliance logs.',
    highlights: ['National Security Desk', 'Permit Approval Authority', 'Rescue Coordination'],
  },
];

/* Crisp Barcode Pattern Generator */
function BarcodePattern({ value, height = 36 }: { value: string; height?: number }) {
  const bars = [
    3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 1, 2, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1,
    2, 1, 1, 3, 2, 2, 1, 3, 1, 1, 2, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2,
    1, 3, 2, 1, 2, 2, 3, 1, 1, 2, 3, 2, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 1, 3,
  ];

  let currentX = 2;
  const rects: React.ReactNode[] = [];

  bars.forEach((width, idx) => {
    if (idx % 2 === 0) {
      rects.push(
        <rect
          key={idx}
          x={currentX}
          y="0"
          width={width * 1.15}
          height={height}
          fill="#0f172a"
        />
      );
    }
    currentX += width * 1.6;
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        style={{ height: `${height}px` }}
        className="w-full max-w-[260px]"
        viewBox={`0 0 ${currentX + 4} ${height}`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        {rects}
      </svg>
      <span className="mt-1 font-mono text-[9px] font-bold tracking-widest text-slate-500 uppercase">
        {value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, role, setRole, bookings, logout, showToast } = useApp();

  const activeRole: UserRole = currentUser?.role || role || 'traveler';
  const currentPersona =
    personaProfiles.find((p) => p.role === activeRole) || personaProfiles[0];

  // Editable Profile State
  const [profileData, setProfileData] = useState({
    name: currentPersona.name,
    email: currentPersona.email,
    phone: currentPersona.phone,
    nationality: currentPersona.nationality,
    country: currentPersona.country,
    dob: currentPersona.dob,
    address: currentPersona.address,
    title: currentPersona.title,
    bio: currentPersona.description,
    avatar: currentPersona.avatar,
    memberSince: currentPersona.memberSince,
  });

  // Travel Preferences State
  const [preferences, setPreferences] = useState({
    destinations: ['Everest Khumbu', 'Annapurna Sanctuary', 'Upper Mustang', 'Langtang Valley', 'Manaslu Circuit'],
    travelStyle: 'Alpine Trekker & Cultural Explorer',
    adventureLevel: 'Strenuous / High Altitude (5,000m+)',
    accommodation: 'Mountain Eco-Lodges & Authentic Teahouses',
    interests: ['High Altitude Passes', 'Monastic Heritage', 'Alpine Photography', 'Glacial Lakes', 'Wildlife Safaris'],
    preferredSeason: 'Autumn (Sep – Nov) & Spring (Mar – May)',
    dietary: 'Vegetarian / High-Carb High-Altitude Trail Diet',
  });

  // Travel Documents State
  const [documents] = useState({
    passportNo: 'NP-89241088',
    passportCountry: 'Nepal',
    passportExpiry: '14 Nov 2031',
    visaStatus: 'Citizen Exemption · Valid National ID #NID-7729-104',
    timsPermitId: 'TIMS-2026-7814',
    timsPermitCoverage: 'Annapurna Conservation Area & Sagarmatha National Park',
    emergencyPrimary: 'Sunita Pradhan (Spouse) · +977 9851-098765',
    emergencySecondary: 'Pasang Nuru Sherpa (Lead Guide) · +977 9801-778899',
    satelliteDevice: 'Garmin inReach #8816-NEPAL-EBC',
    medicalClearance: 'Cleared for >5,400m AMS · Blood Group: O+',
  });

  // Account Security State
  const [securityData] = useState({
    passwordLastChanged: '42 days ago',
    twoFactorEnabled: true,
    kycLevel: 'Level 3 NTB Government Verified',
    activeSessions: '2 active devices (MacBook Pro · Kathmandu; iPhone 15 · Pokhara)',
    privacySetting: 'Public Explorer Profile active on Community Feed',
  });

  // Modals State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPreferencesOpen, setIsEditPreferencesOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isTimsModalOpen, setIsTimsModalOpen] = useState(false);
  const [isSavedPlacesOpen, setIsSavedPlacesOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<UserRole | null>(null);

  // Forms Temporary States
  const [tempProfile, setTempProfile] = useState({ ...profileData });
  const [tempPreferences, setTempPreferences] = useState({ ...preferences });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Sync profile data when persona changes
  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      name: currentPersona.name,
      email: currentPersona.email,
      phone: currentPersona.phone,
      nationality: currentPersona.nationality,
      country: currentPersona.country,
      dob: currentPersona.dob,
      address: currentPersona.address,
      title: currentPersona.title,
      bio: currentPersona.description,
      avatar: currentPersona.avatar,
      memberSince: currentPersona.memberSince,
    }));
  }, [currentPersona]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(`vn_profile_${activeRole}`);
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      const savedPrefs = localStorage.getItem(`vn_preferences_${activeRole}`);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch {
      // Ignore
    }
  }, [activeRole]);

  // Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditProfileOpen(false);
        setIsEditPreferencesOpen(false);
        setIsChangePasswordOpen(false);
        setIsAvatarModalOpen(false);
        setIsTimsModalOpen(false);
        setIsSavedPlacesOpen(false);
        setIsReviewsOpen(false);
        setIsDocumentsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...tempProfile });
    try {
      localStorage.setItem(`vn_profile_${activeRole}`, JSON.stringify(tempProfile));
    } catch {
      // Ignore
    }
    setIsEditProfileOpen(false);
    if (showToast) showToast('Profile details updated successfully');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferences({ ...tempPreferences });
    try {
      localStorage.setItem(`vn_preferences_${activeRole}`, JSON.stringify(tempPreferences));
    } catch {
      // Ignore
    }
    setIsEditPreferencesOpen(false);
    if (showToast) showToast('Travel preferences updated');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      if (showToast) showToast('Please enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      if (showToast) showToast('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      if (showToast) showToast('New passwords do not match');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangePasswordOpen(false);
    if (showToast) showToast('Password changed successfully');
  };

  const handleSwitchUser = async (targetRole: UserRole) => {
    if (targetRole === activeRole) return;
    setSwitchingRole(targetRole);
    try {
      await setRole(targetRole);
      if (showToast) {
        const target = personaProfiles.find((p) => p.role === targetRole);
        showToast(`Switched persona to ${target?.name || targetRole}`);
      }
    } finally {
      setSwitchingRole(null);
    }
  };

  const handleLogout = () => {
    logout();
    if (showToast) showToast('Signed out of session');
    router.push('/login');
  };

  // Download QR Code utility
  const handleDownloadQr = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 320, 320);
      ctx.fillStyle = '#0552A2';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('VISIT NEPAL TIMS 2026', 45, 40);
      ctx.fillStyle = '#031526';
      for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
          if ((i + j) % 2 === 0 || (i * j) % 3 === 0) {
            ctx.fillRect(52 + i * 12, 60 + j * 12, 11, 11);
          }
        }
      }
      ctx.font = '12px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`TOKEN: VN-2026-${activeRole.toUpperCase()}`, 50, 300);

      const a = document.createElement('a');
      a.download = `TIMS-QR-${activeRole.toUpperCase()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      if (showToast) showToast('QR Code saved to downloads');
    }
  };

  const bookingCount = Array.isArray(bookings) && bookings.length > 0 ? bookings.length : 12;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 sm:pb-12 pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 md:px-8 lg:px-10 font-inter text-slate-900 antialiased">
      <div className="w-full space-y-6 sm:space-y-8">
        
        {/* =========================================================================
            TOP UTILITY BAR: Breadcrumb & Persona Switcher
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#0552A2] transition-colors">
              Visit Nepal
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">Account &amp; Traveler Identity</span>
          </div>

          {/* Compact Persona Switcher */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Switch Persona:
            </span>
            {personaProfiles.map((p) => {
              const isCurrent = p.role === activeRole;
              const isSwitching = switchingRole === p.role;
              const Icon = roleIcon[p.role] || Compass;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleSwitchUser(p.role)}
                  disabled={isSwitching}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#0552A2] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            MAIN BALANCED LAYOUT: LEFT ACCOUNT/MENU + RIGHT DIGITAL TIMS PASS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* -----------------------------------------------------------------------
              LEFT COLUMN (lg:col-span-7): Account Overview, Stats, Explore & Menu
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* 1. Account Header with Settings */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Account
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your personal travel profile, preferences, and verified bookings
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempProfile({ ...profileData });
                    setIsEditProfileOpen(true);
                  }}
                  className="h-10 w-10 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-[#0552A2] transition-colors cursor-pointer"
                  title="Profile Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 2. Profile Overview Card (Exact Match to User Reference) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 transition-shadow hover:shadow-sm">
              <div className="flex items-start sm:items-center gap-4">
                {/* Avatar with Verified Checkmark & Camera Overlay */}
                <div className="relative group shrink-0">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                  />
                  {/* Verified Checkmark Badge */}
                  <div
                    className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[#0552A2] text-white flex items-center justify-center shadow-xs border-2 border-white"
                    title="Verified Traveler"
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  {/* Quick Change Avatar Button */}
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                {/* Info & Metadata */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-poppins text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {profileData.name}
                    </h2>
                    <span className="rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                      PRO
                    </span>
                    <span className="rounded-md bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-[#0552A2] uppercase tracking-wide">
                      {activeRole.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate font-mono">
                    {profileData.email}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                    {profileData.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Quick Stats & Activity Counters */}
            <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* 0 Saved Places */}
                <button
                  type="button"
                  onClick={() => setIsSavedPlacesOpen(true)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:bg-blue-100 transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">0</span>
                  <span className="text-[11px] font-medium text-slate-500">Saved Places</span>
                </button>

                {/* Upcoming Bookings */}
                <Link
                  href="/dashboard"
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:bg-emerald-100 transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{bookingCount}</span>
                  <span className="text-[11px] font-medium text-slate-500">Upcoming Bookings</span>
                </Link>

                {/* Past Bookings */}
                <Link
                  href="/dashboard"
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-hover:bg-amber-100 transition-colors">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">0</span>
                  <span className="text-[11px] font-medium text-slate-500">Past Bookings</span>
                </Link>

                {/* Reviews */}
                <button
                  type="button"
                  onClick={() => setIsReviewsOpen(true)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1 group-hover:bg-rose-100 transition-colors">
                    <Heart className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">0</span>
                  <span className="text-[11px] font-medium text-slate-500">Reviews</span>
                </button>
              </div>

              {/* Status Pill Overlay */}
              <div className="mt-3.5 flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-300 text-emerald-700 text-xs font-semibold shadow-2xs">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Sign in to save activity · Verified Active</span>
                </div>
              </div>
            </div>

            {/* 4. "Plan Your Dream Trip" Banner Card */}
            <div className="bg-[#EDF5FD] border border-blue-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-white text-[#0552A2] flex items-center justify-center shadow-2xs shrink-0">
                  <Map className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-poppins text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    Plan Your Dream Trip
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    Discover top destinations, create your itinerary and get personalized advice...
                  </p>
                </div>
              </div>

              <Link
                href="/explore"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Explore Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 5. Menu List Items (Exact Set from User Reference) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {/* My Bookings */}
              <Link
                href="/dashboard"
                className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-blue-100/70 text-[#0552A2] flex items-center justify-center shrink-0">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-slate-900">
                      My Bookings
                    </h4>
                    <p className="text-xs text-slate-500">
                      View and manage your bookings
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </Link>

              {/* Saved Places */}
              <button
                type="button"
                onClick={() => setIsSavedPlacesOpen(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-slate-900">
                      Saved Places
                    </h4>
                    <p className="text-xs text-slate-500">
                      Destinations and experiences you've saved
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>

              {/* My Itinerary */}
              <Link
                href="/schedule"
                className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-slate-900">
                      My Itinerary
                    </h4>
                    <p className="text-xs text-slate-500">
                      View your planned trips
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </Link>

              {/* Reviews & Ratings */}
              <button
                type="button"
                onClick={() => setIsReviewsOpen(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-slate-900">
                      Reviews &amp; Ratings
                    </h4>
                    <p className="text-xs text-slate-500">
                      Your feedback helps others
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>

              {/* Help & Support */}
              <Link
                href="/chat"
                className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center shrink-0">
                    <Headset className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-slate-900">
                      Help &amp; Support
                    </h4>
                    <p className="text-xs text-slate-500">
                      FAQs, contact us and support
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </Link>

              {/* My Documents */}
              <button
                type="button"
                onClick={() => setIsDocumentsOpen(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center shrink-0">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-slate-900">
                      My Documents
                    </h4>
                    <p className="text-xs text-slate-500">
                      Store your required documents
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>
            </div>

            {/* 6. Personal Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">
                    Personal Information
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTempProfile({ ...profileData });
                    setIsEditProfileOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0552A2] hover:text-[#044182] cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                <div>
                  <dt className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    Full Legal Name
                  </dt>
                  <dd className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                    {profileData.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    Registered Email
                  </dt>
                  <dd className="font-medium text-slate-800 text-xs mt-0.5 break-all">
                    {profileData.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    Mobile Phone
                  </dt>
                  <dd className="font-medium text-slate-800 text-xs mt-0.5">
                    {profileData.phone}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    Nationality &amp; Citizenship
                  </dt>
                  <dd className="font-medium text-slate-800 text-xs mt-0.5">
                    {profileData.nationality} ({profileData.country})
                  </dd>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <dt className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    Permanent Address
                  </dt>
                  <dd className="font-medium text-slate-700 text-xs mt-0.5">
                    {profileData.address}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 7. Travel Preferences Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">
                    Travel Preferences
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTempPreferences({ ...preferences });
                    setIsEditPreferencesOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0552A2] hover:text-[#044182] cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Update</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block mb-1.5">
                    Preferred Destinations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {preferences.destinations.map((dest) => (
                      <span
                        key={dest}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0552A2] font-semibold text-xs border border-blue-200/60"
                      >
                        <MapPin className="h-3 w-3" />
                        <span>{dest}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                      Travel Style
                    </span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      {preferences.travelStyle}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider block">
                      Adventure Level
                    </span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      {preferences.adventureLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN (lg:col-span-5): The Iconic Digital TIMS Pass Ticket Card
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* THE DIGITAL TIMS PASS TICKET CARD (Image 1 Exact Match) */}
            <div className="relative w-full max-w-[420px] lg:max-w-[440px] xl:max-w-[460px] mx-auto pt-3">
              
              {/* Floating "Click to inspect full details" Pill Button */}
              <div className="flex justify-center -mb-3.5 z-30 relative">
                <button
                  type="button"
                  onClick={() => setIsTimsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0552A2] hover:bg-[#044182] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Click to inspect full details</span>
                </button>
              </div>

              {/* Ticket Card Container with Authentic Physical Notches */}
              <div
                onClick={() => setIsTimsModalOpen(true)}
                className="group relative cursor-pointer select-none rounded-2xl bg-white text-slate-900 border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Top Himalayan Tricolor Dash Strip */}
                <div className="h-2 bg-[repeating-linear-gradient(90deg,#0552A2_0_24px,#EC1F27_24px_48px,#FDB716_48px_72px,#0552A2_72px_96px,#ffffff_96px_110px)]" />

                {/* Upper Section */}
                <div className="p-5 sm:p-6 pb-4 space-y-3 relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#031526] text-[#FDB716] shadow-xs">
                        <Compass className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-poppins text-base font-bold text-slate-900 leading-none">
                          Visit Nepal
                        </h4>
                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          Digital TIMS pass
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        Verified
                      </span>
                      <Maximize2 className="h-3.5 w-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Holder Identity */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      HOLDER
                    </p>
                    <p className="font-poppins text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                      {profileData.name}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0552A2]">
                      {profileData.title || 'Traveler'}
                    </p>
                  </div>
                </div>

                {/* Perforated Seam with Genuine Cutout Notches */}
                <div className="relative py-1">
                  {/* Left Semi-Circular Notch */}
                  <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#F8FAFC] border-r border-slate-200/90 shadow-inner z-20 pointer-events-none" />
                  {/* Right Semi-Circular Notch */}
                  <span className="absolute -right-3.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#F8FAFC] border-l border-slate-200/90 shadow-inner z-20 pointer-events-none" />
                  {/* Dashed Line */}
                  <div className="border-t-2 border-dashed border-slate-200 mx-5" />
                </div>

                {/* Lower Section with Key Telemetry */}
                <div className="p-5 sm:p-6 pt-3 space-y-3.5 text-xs">
                  {/* Registered Email */}
                  <div className="flex items-start gap-2.5">
                    <Mail className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        REGISTERED EMAIL
                      </span>
                      <span className="font-semibold text-slate-800 break-all text-xs sm:text-[13px]">
                        {profileData.email}
                      </span>
                    </div>
                  </div>

                  {/* Emergency Hotline & Jurisdiction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          EMERGENCY HOTLINE
                        </span>
                        <span className="font-bold text-red-600 text-xs">
                          +977 1 4256909 / 1144
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          JURISDICTION
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">
                          Nepal Tourism Authority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bookings */}
                  <div className="flex items-start gap-2.5 pt-0.5">
                    <Calendar className="h-4 w-4 text-[#0552A2] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        BOOKINGS
                      </span>
                      <span className="font-semibold text-slate-800 text-xs">
                        {bookingCount} bookings
                      </span>
                    </div>
                  </div>

                  {/* Crisp Barcode Pattern */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col items-center">
                    <BarcodePattern value={`VN-2026-${activeRole.toUpperCase()}-SECURE`} height={38} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar for Ticket & Documents */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
              <button
                type="button"
                onClick={() => setIsTimsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer flex-1 justify-center"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Inspect Pass</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  printOfficialReceipt({
                    invoiceNumber: `VN-TIMS-2026-${Math.floor(10000 + Math.random() * 89999)}`,
                    bookingId: `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`,
                    qrCode: `VN-TIMS-${activeRole.toUpperCase()}-VERIFIED-2026`,
                    travelerName: sanitizeName(profileData.name),
                    travelerEmail: profileData.email,
                    travelerPhone: profileData.phone,
                    packageTitle: `Official TIMS Permit & Clearance (${profileData.title})`,
                    departureDate: '2026-05-15',
                    provider: 'Nepal Tourism Board Desks',
                    assignedGuide: 'IFMGA Certified Sherpa Guide',
                    meetingPoint: 'Kathmandu Departure Base / Lukla Hub',
                    items: [
                      {
                        description: 'Government TIMS Trekking Clearance Pass',
                        details: 'Official checkpoint entry documentation',
                        qty: '1 Pass',
                        amountNpr: 15000,
                      },
                    ],
                    subtotalNpr: 15000,
                    serviceChargeNpr: 750,
                    vatNpr: 1950,
                    totalNpr: 17700,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex-1 justify-center"
              >
                <Printer className="h-3.5 w-3.5 text-[#0552A2]" />
                <span>Print Pass</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {/* Emergency & Mountain Safety Details */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/80">
                <ShieldCheck className="h-4 w-4 text-red-600" />
                <h3 className="font-poppins text-sm font-bold text-slate-900">
                  Emergency &amp; Mountain Rescue
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium text-[10.5px] uppercase tracking-wider block">
                    Primary Emergency Contact
                  </span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    {documents.emergencyPrimary}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium text-[10.5px] uppercase tracking-wider block">
                    Satellite Telemetry Link
                  </span>
                  <p className="font-mono font-semibold text-slate-800 text-xs mt-0.5">
                    {documents.satelliteDevice}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-red-50/70 border border-red-200/80">
                  <div className="flex items-center gap-2 text-red-700 font-semibold text-xs">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>Himalayan Rescue (HRA) Hotline</span>
                  </div>
                  <p className="text-[11px] text-red-600 font-mono font-bold mt-1">
                    +977 1 4256909 / 1144 (24/7 SAR Heli Dispatch)
                  </p>
                </div>
              </div>
            </div>

            {/* Account Security & Privacy Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-sm font-bold text-slate-900">
                    Account Security &amp; Privacy
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="text-xs font-semibold text-[#0552A2] hover:text-[#044182] cursor-pointer"
                >
                  Update
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-medium text-[10.5px] uppercase tracking-wider block">
                      Account Password
                    </span>
                    <span className="font-mono text-slate-700">••••••••••••••••</span>
                  </div>
                  <span className="text-[10.5px] text-slate-400">Changed {securityData.passwordLastChanged}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-medium text-[10.5px] uppercase tracking-wider block">
                      Two-Factor Authentication
                    </span>
                    <span className="font-semibold text-emerald-700 text-xs">Protected &amp; Active</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION BAR (Image 2 Exact Native App Replica)
          ========================================================================= */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 sm:hidden flex items-center justify-around shadow-lg">
        <Link href="/" className="flex flex-col items-center text-slate-500 hover:text-slate-900 text-[10px] font-medium">
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link href="/explore" className="flex flex-col items-center text-slate-500 hover:text-slate-900 text-[10px] font-medium">
          <Compass className="h-5 w-5 mb-0.5" />
          <span>Explore</span>
        </Link>
        <Link href="/schedule" className="flex flex-col items-center text-slate-500 hover:text-slate-900 text-[10px] font-medium">
          <Calendar className="h-5 w-5 mb-0.5" />
          <span>Schedule</span>
        </Link>
        <Link href="/bookings" className="flex flex-col items-center text-slate-500 hover:text-slate-900 text-[10px] font-medium">
          <Ticket className="h-5 w-5 mb-0.5" />
          <span>Booking</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-emerald-600 text-[10px] font-bold">
          <User className="h-5 w-5 mb-0.5 stroke-[2.5]" />
          <span>Account</span>
        </Link>
      </nav>

      {/* =========================================================================
          MODAL 1: FULL DIGITAL TIMS PASS INSPECTOR MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isTimsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsTimsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col w-full max-w-xl xl:max-w-2xl bg-white shadow-2xl border border-slate-200/90 text-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden font-inter"
              style={{
                maxHeight: 'min(94dvh, calc(100dvh - 1.5rem))',
                width: 'min(100%, 42rem)',
              }}
            >
              {/* Top Himalayan Tricolor Dash Strip */}
              <div className="h-2 sm:h-2.5 bg-[repeating-linear-gradient(90deg,#0552A2_0_30px,#FDB716_30px_60px,#EC1F27_60px_90px,#ffffff_90px_120px)] shrink-0" />

              {/* Fixed Header Bar */}
              <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-200/80 flex items-center justify-between gap-3 bg-white z-20">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#031526] text-[#FDB716] shadow-xs shrink-0">
                    <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0552A2] truncate">
                        Government of Nepal · Ministry of Tourism
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-2.5 w-2.5 stroke-[2.5]" />
                        OFFICIAL VERIFIED
                      </span>
                    </div>
                    <h2 className="font-poppins text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
                      Visit Nepal Official Digital TIMS Pass
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTimsModalOpen(false)}
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                  aria-label="Close pass details"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Middle Scrollable Content Area */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-3.5 scrollbar-thin">
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                      1. Traveler Information
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500">
                      Pass ID: VN-2026-{activeRole.toUpperCase()}-8848
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px]">Full Name</span>
                      <p className="font-poppins font-bold text-slate-900 text-xs sm:text-sm mt-0.5 truncate">{profileData.name}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px]">Traveler Category</span>
                      <p className="font-semibold text-[#0552A2] capitalize text-xs sm:text-[13px] mt-0.5">{profileData.title || 'Traveler'}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px]">Registered Email</span>
                      <p className="font-medium text-slate-800 text-xs mt-0.5 truncate">{profileData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0552A2]">
                      2. Emergency &amp; Checkpoint Telemetry
                    </span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200/70 px-2 py-0.5 rounded-full">
                      Himalayan Rescue Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px]">Emergency Contact</span>
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">{documents.emergencyPrimary}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px]">Satellite Messenger</span>
                      <p className="font-mono font-semibold text-slate-900 text-xs mt-0.5">{documents.satelliteDevice}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium text-[10px] sm:text-[11px]">Total Active Bookings</span>
                      <p className="font-bold text-[#0552A2] text-xs sm:text-sm mt-0.5">{bookingCount} Registered Routes</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-[#0552A2] shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Official Verification &amp; Checkpost Seal
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                        Authorized by Nepal Tourism Authority. Present this pass at Lukla, Namche, or Besisahar checkposts.
                      </p>
                      <div className="pt-1">
                        <BarcodePattern value={`VN-2026-${activeRole.toUpperCase()}-SECURE`} height={36} />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-2.5 shadow-sm border border-slate-200 shrink-0">
                      <QrCode className="h-20 w-20 sm:h-24 sm:w-24 text-[#031526]" />
                      <span className="mt-1 font-mono text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        CHECKPOST SCAN
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Action Footer */}
              <div className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-2.5 z-20">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      printOfficialReceipt({
                        invoiceNumber: `VN-TIMS-2026-${Math.floor(10000 + Math.random() * 89999)}`,
                        bookingId: `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`,
                        qrCode: `VN-TIMS-${activeRole.toUpperCase()}-VERIFIED-2026`,
                        travelerName: sanitizeName(profileData.name),
                        travelerEmail: profileData.email,
                        travelerPhone: profileData.phone,
                        packageTitle: `Official TIMS Permit & Clearance (${profileData.title})`,
                        departureDate: '2026-05-15',
                        provider: 'Nepal Tourism Board Desks',
                        assignedGuide: 'IFMGA Certified Sherpa Guide',
                        meetingPoint: 'Kathmandu Departure Base / Lukla Hub',
                        items: [
                          {
                            description: 'Government TIMS Trekking Clearance Pass',
                            details: 'Official checkpoint entry documentation',
                            qty: '1 Pass',
                            amountNpr: 15000,
                          },
                        ],
                        subtotalNpr: 15000,
                        serviceChargeNpr: 750,
                        vatNpr: 1950,
                        totalNpr: 17700,
                      })
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadOfficialReceiptHtml({
                        invoiceNumber: `VN-TIMS-2026-${Math.floor(10000 + Math.random() * 89999)}`,
                        bookingId: `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`,
                        qrCode: `VN-TIMS-${activeRole.toUpperCase()}-VERIFIED-2026`,
                        travelerName: sanitizeName(profileData.name),
                        travelerEmail: profileData.email,
                        travelerPhone: profileData.phone,
                        packageTitle: `Official TIMS Permit & Clearance (${profileData.title})`,
                        departureDate: '2026-05-15',
                        provider: 'Nepal Tourism Board Desks',
                        assignedGuide: 'IFMGA Certified Sherpa Guide',
                        meetingPoint: 'Kathmandu Departure Base / Lukla Hub',
                        items: [
                          {
                            description: 'Government TIMS Trekking Clearance Pass',
                            details: 'Official checkpoint entry documentation',
                            qty: '1 Pass',
                            amountNpr: 15000,
                          },
                        ],
                        subtotalNpr: 15000,
                        serviceChargeNpr: 750,
                        vatNpr: 1950,
                        totalNpr: 17700,
                      })
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5 text-[#0552A2]" />
                    <span>Download Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                  >
                    <QrCode className="h-3.5 w-3.5 text-slate-500" />
                    <span>Download QR</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTimsModalOpen(false)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5 rotate-180 text-slate-500" />
                  <span>Back to Ticket</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: EDIT PROFILE MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
            onClick={() => setIsEditProfileOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">Edit Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={tempProfile.dob}
                      onChange={(e) => setTempProfile({ ...tempProfile, dob: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nationality</label>
                    <input
                      type="text"
                      value={tempProfile.nationality}
                      onChange={(e) => setTempProfile({ ...tempProfile, nationality: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Country</label>
                    <input
                      type="text"
                      value={tempProfile.country}
                      onChange={(e) => setTempProfile({ ...tempProfile, country: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Permanent Residential Address</label>
                  <input
                    type="text"
                    value={tempProfile.address}
                    onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Traveler Biography</label>
                  <textarea
                    rows={3}
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#0552A2] hover:bg-[#044182] px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 3: UPDATE PREFERENCES MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isEditPreferencesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
            onClick={() => setIsEditPreferencesOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">Update Travel Preferences</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditPreferencesOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSavePreferences} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Travel Style</label>
                  <input
                    type="text"
                    value={tempPreferences.travelStyle}
                    onChange={(e) => setTempPreferences({ ...tempPreferences, travelStyle: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Adventure Level</label>
                  <input
                    type="text"
                    value={tempPreferences.adventureLevel}
                    onChange={(e) => setTempPreferences({ ...tempPreferences, adventureLevel: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Accommodation Preference</label>
                  <input
                    type="text"
                    value={tempPreferences.accommodation}
                    onChange={(e) => setTempPreferences({ ...tempPreferences, accommodation: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditPreferencesOpen(false)}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#0552A2] hover:bg-[#044182] px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 4: CHANGE PASSWORD MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isChangePasswordOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsChangePasswordOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">Change Account Password</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-type new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#0552A2] hover:bg-[#044182] px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 5: AVATAR PICKER MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsAvatarModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">Choose Profile Photo</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <p className="text-slate-500">Select an explorer avatar from the verified Himalayan library:</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProfileData((prev) => ({ ...prev, avatar: url }));
                        setIsAvatarModalOpen(false);
                        if (showToast) showToast('Avatar updated');
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        profileData.avatar === url ? 'border-[#0552A2] ring-2 ring-blue-200' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={url} alt="Option" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 6: SAVED PLACES MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isSavedPlacesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsSavedPlacesOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">Saved Places</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSavedPlacesOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center py-6 space-y-2">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-[#0552A2] mx-auto flex items-center justify-center">
                  <Bookmark className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No saved places yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse destinations, trekking packages, and heritage hotels to save them to your account.
                </p>
                <Link
                  href="/destinations"
                  onClick={() => setIsSavedPlacesOpen(false)}
                  className="inline-block mt-3 px-4 py-2 bg-[#0552A2] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#044182]"
                >
                  Browse Destinations
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 7: REVIEWS & RATINGS MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isReviewsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsReviewsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter p-5 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">Reviews &amp; Ratings</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewsOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="text-center py-6 space-y-2">
                <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
                  <Star className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No reviews submitted</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  After completing your booked trek or hotel stay, your verified reviews will appear here.
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setIsReviewsOpen(false)}
                  className="inline-block mt-3 px-4 py-2 bg-[#0552A2] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#044182]"
                >
                  View Completed Trips
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 8: MY DOCUMENTS MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isDocumentsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsDocumentsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter p-5 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-poppins text-base font-bold text-slate-900">My Travel Documents</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDocumentsOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Digital TIMS Permit</span>
                    <span className="text-[11px] text-slate-500 font-mono">{documents.timsPermitId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDocumentsOpen(false);
                      setIsTimsModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0552A2] text-white text-xs font-semibold cursor-pointer"
                  >
                    View
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Passport Record</span>
                    <span className="text-[11px] text-slate-500 font-mono">{documents.passportNo} ({documents.passportCountry})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Verified</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">High Altitude Clearance</span>
                    <span className="text-[11px] text-slate-500">{documents.medicalClearance}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0552A2] text-[10px] font-bold">Active</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDocumentsOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
