'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  SlidersHorizontal,
  Trash2,
  Eye,
  CheckSquare,
  AlertTriangle,
  Smartphone,
  Laptop,
  type LucideIcon,
} from 'lucide-react';
import { useApp, UserRole } from '@/context/AppContext';
import { Booking } from '@/data/mockData';

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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    portalLink: '/admin',
    portalLabel: 'super admin command center',
    description:
      'Full platform governance: global user management, dynamic RBAC matrices, platform financial settlements, hotel and package catalog approvals, and cryptographic audit stream.',
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
    title: 'Alpine Trekker & Photographer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    portalLink: '/dashboard',
    portalLabel: 'my bookings & passes',
    description:
      'Passionate Himalayan trekker, photographer, and tea enthusiast. Exploring high-altitude glacial passes, Annapurna sanctuary, and ancient monastic trails.',
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
    avatar: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/guide',
    portalLabel: 'mountain guide portal',
    description:
      'Assigned expedition rosters, client altitude telemetry, daily rate payouts, and 14x 8,000m summit leader.',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/butler',
    portalLabel: 'Sherpa butler portal',
    description:
      'Guest gear portage itineraries, VIP teahouse reservations, warm bedding logistics, and baggage tracking.',
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
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/business',
    portalLabel: 'agency operations hub',
    description:
      'Manage client group bookings, guide allocations, permit filings, and financial settlements.',
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    portalLink: '/portals/admin',
    portalLabel: 'NTB government desk',
    description:
      'National real-time traveler tracking, TIMS and restricted permit queues, and compliance logs.',
    highlights: ['National Security Desk', 'Permit Approval Authority', 'Rescue Coordination'],
  },
];

type ProfileTab =
  | 'overview'
  | 'personal'
  | 'preferences'
  | 'trips'
  | 'saved'
  | 'documents'
  | 'security';

interface SavedDestination {
  id: string;
  title: string;
  region: string;
  category: string;
  image: string;
  link: string;
}

const INITIAL_SAVED: SavedDestination[] = [
  {
    id: 'dest_phewa',
    title: 'Phewa Lake & Sarangkot Ridge',
    region: 'Pokhara, Gandaki Province',
    category: 'Lakes & Himalayan Views',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    link: '/explore?q=Pokhara',
  },
  {
    id: 'dest_ebc',
    title: 'Everest Base Camp & Kala Patthar',
    region: 'Solukhumbu, Sagarmatha NP',
    category: 'High Altitude Expedition',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    link: '/explore/dest_ebc',
  },
  {
    id: 'htl_dwarikas',
    title: "The Dwarika's Hotel",
    region: 'Battisputali, Kathmandu',
    category: 'Heritage Luxury Stay',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    link: '/hotels/htl_dwarikas',
  },
  {
    id: 'dest_mustang',
    title: 'Lo Manthang Walled Kingdom',
    region: 'Upper Mustang, Annapurna',
    category: 'Tibetan Cultural Circuit',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    link: '/explore?q=Mustang',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, role, setRole, bookings, logout, showToast } = useApp();

  const activeRole: UserRole = currentUser?.role || role || 'traveler';
  const currentPersona =
    personaProfiles.find((p) => p.role === activeRole) || personaProfiles[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  // Editable Profile State
  const [profileData, setProfileData] = useState({
    name: currentPersona.name,
    username: '@aayush.pradhan',
    travelerId: 'VN-TRV-2026-89104',
    email: currentPersona.email,
    phone: currentPersona.phone,
    nationality: currentPersona.nationality,
    country: currentPersona.country,
    dob: currentPersona.dob,
    gender: 'Male',
    preferredLanguage: 'English / Nepali',
    address: currentPersona.address,
    title: currentPersona.title,
    bio: currentPersona.description,
    avatar: currentPersona.avatar,
    memberSince: currentPersona.memberSince,
    emailVerified: true,
    phoneVerified: true,
  });

  // Travel Preferences State
  const [preferences, setPreferences] = useState({
    destinations: ['Everest Khumbu', 'Annapurna Sanctuary', 'Upper Mustang', 'Langtang Valley'],
    travelStyle: 'Alpine Trekker & Cultural Explorer',
    adventureLevel: 'Strenuous / High Altitude (5,000m+)',
    accommodation: 'Mountain Eco-Lodges & Authentic Teahouses',
    interests: ['High Altitude Passes', 'Monastic Heritage', 'Alpine Photography', 'Glacial Lakes'],
    preferredSeason: 'Autumn (Sep – Nov) & Spring (Mar – May)',
    dietary: 'Vegetarian / High-Carb High-Altitude Trail Diet',
    groupPreference: 'Small Group Guided (4–8 Trekkers)',
  });

  // Travel Documents State
  const [documents] = useState({
    passportNo: 'NP-89241088',
    passportCountry: 'Nepal',
    passportExpiry: '14 Nov 2031',
    visaStatus: 'Citizen Exemption • Valid National ID #NID-7729-104',
    timsPermitId: 'TIMS-2026-7814',
    timsPermitCoverage: 'Annapurna Conservation Area & Sagarmatha National Park',
    emergencyPrimary: 'Sunita Pradhan (Spouse) • +977 9851-098765',
    emergencySecondary: 'Pasang Nuru Sherpa (Lead Guide) • +977 9801-778899',
    satelliteDevice: 'Garmin inReach #8816-NEPAL-EBC',
    medicalClearance: 'Cleared for >5,400m AMS • Blood Group: O+',
  });

  // Saved destinations
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>(INITIAL_SAVED);

  // Security & Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    publicProfile: true,
    smsAlerts: true,
    emailAlerts: true,
    passwordLastChanged: '42 days ago',
    kycLevel: 'Level 3 NTB Government Verified',
  });

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<UserRole | null>(null);

  // Temp Form States
  const [tempProfile, setTempProfile] = useState({ ...profileData });
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

  // Close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditProfileOpen(false);
        setIsAvatarModalOpen(false);
        setIsChangePasswordOpen(false);
        setIsDeleteModalOpen(false);
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
    showToast('Profile details updated successfully');
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(`vn_preferences_${activeRole}`, JSON.stringify(preferences));
    } catch {
      // Ignore
    }
    showToast('Travel preferences saved');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast('Please enter your current password');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangePasswordOpen(false);
    showToast('Password changed successfully');
  };

  const handleRemoveSaved = (id: string) => {
    setSavedDestinations((prev) => prev.filter((d) => d.id !== id));
    showToast('Removed from saved destinations');
  };

  const handleSwitchUser = async (targetRole: UserRole) => {
    if (targetRole === activeRole) return;
    setSwitchingRole(targetRole);
    try {
      await setRole(targetRole);
      const target = personaProfiles.find((p) => p.role === targetRole);
      showToast(`Switched persona to ${target?.name || targetRole}`);
    } finally {
      setSwitchingRole(null);
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out of session');
    router.push('/login');
  };

  // Find next upcoming adventure
  const upcomingBooking: Booking | undefined = useMemo(() => {
    return bookings.find(
      (b) => b.status === 'Confirmed' || b.status === 'Checked In' || b.status === 'Pending'
    );
  }, [bookings]);

  // Profile completion calculation
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (profileData.avatar) score += 20;
    if (profileData.name && profileData.email) score += 20;
    if (profileData.emailVerified && profileData.phoneVerified) score += 20;
    if (documents.emergencyPrimary) score += 20;
    if (preferences.destinations.length > 0) score += 20;
    return score;
  }, [profileData, documents, preferences]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 sm:pb-16 pt-4 sm:pt-6 font-inter text-slate-900 antialiased">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 space-y-6">
        {/* =========================================================================
            TOP UTILITY BAR: Breadcrumb & Compact Persona Switcher
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#0552A2] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">Traveler Profile &amp; Hub</span>
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
            1. REFINED HORIZONTAL PROFILE HEADER (Desktop Horizontal, Mobile Stacked)
            ========================================================================= */}
        <header className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0">
              {/* Avatar with Camera Overlay & Verification Check */}
              <div className="relative group shrink-0 self-start sm:self-auto">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                />
                <div
                  className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#0552A2] text-white flex items-center justify-center shadow-xs border-2 border-white"
                  title="Verified Profile"
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute inset-0 rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>

              {/* Identity & Badges */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-poppins text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {profileData.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider">
                    PRO TRAVELER
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10.5px] font-bold text-[#0552A2] uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3 text-[#0552A2]" />
                    <span>NTB VERIFIED</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                  <span className="font-mono text-slate-600">{profileData.username}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-500">{profileData.travelerId}</span>
                  <span className="text-slate-300">•</span>
                  <span>{profileData.nationality}</span>
                  <span className="text-slate-300">•</span>
                  <span>{profileData.memberSince}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{profileData.email}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{profileData.phone}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Profile Completion & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              {/* Profile Completion Indicator */}
              <div className="space-y-1.5 sm:min-w-[180px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Profile Readiness</span>
                  <span className="font-bold text-[#0552A2]">{completionPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0552A2] to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-[10.5px] text-slate-400 block">
                  All mandatory permits &amp; IDs verified
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempProfile({ ...profileData });
                    setIsEditProfileOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className="h-8.5 w-8.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-[#0552A2] transition-colors cursor-pointer shadow-2xs"
                  title="Account Security Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================================
            2. PROFILE SECTION NAVIGATION TABS
            ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/70 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: Compass },
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'preferences', label: 'Travel Preferences', icon: SlidersHorizontal },
            { id: 'trips', label: 'Trips & Bookings', icon: Ticket, badge: bookings.length },
            { id: 'saved', label: 'Saved Destinations', icon: Bookmark, badge: savedDestinations.length },
            { id: 'documents', label: 'Documents & Passes', icon: FileText, badge: '5' },
            { id: 'security', label: 'Security & Settings', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`h-9.5 inline-flex items-center gap-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0552A2] text-white shadow-2xs'
                    : 'bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            3. TAB CONTENT VIEWS
            ========================================================================= */}

        {/* -------------------------------------------------------------------------
            TAB 1: OVERVIEW
            ------------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total Bookings
                </span>
                <p className="font-poppins text-xl font-bold text-slate-900">{bookings.length}</p>
                <span className="text-[11px] text-slate-500">Expeditions &amp; Stays</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                  Completed Stays
                </span>
                <p className="font-poppins text-xl font-bold text-emerald-700">
                  {bookings.filter((b) => b.status === 'Completed').length || 3}
                </p>
                <span className="text-[11px] text-slate-500">Verified Completed</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                  Saved Places
                </span>
                <p className="font-poppins text-xl font-bold text-slate-900">{savedDestinations.length}</p>
                <span className="text-[11px] text-slate-500">Himalayan Wishlist</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                  Active Passes
                </span>
                <p className="font-poppins text-xl font-bold text-[#0552A2]">2 Active</p>
                <span className="text-[11px] text-emerald-600 font-semibold">TIMS &amp; ACAP Pass</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                  Identity KYC
                </span>
                <p className="font-poppins text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Level 3 NTB</span>
                </p>
                <span className="text-[11px] text-slate-500">Government Verified</span>
              </div>
            </div>

            {/* Next Adventure Spotlight */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#0552A2]" />
                  <h2 className="font-poppins text-base font-bold text-slate-900">
                    Next Adventure &amp; Upcoming Stay
                  </h2>
                </div>
                <Link
                  href="/bookings"
                  className="text-xs font-semibold text-[#0552A2] hover:underline flex items-center gap-1"
                >
                  <span>All Bookings ({bookings.length})</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {upcomingBooking ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] font-bold text-[#0552A2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {upcomingBooking.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200">
                        {upcomingBooking.status}
                      </span>
                    </div>
                    <h3 className="font-poppins text-base font-bold text-slate-900">
                      {upcomingBooking.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{upcomingBooking.date}</span>
                      <span className="text-slate-300">•</span>
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{upcomingBooking.meetingPoint}</span>
                    </p>
                  </div>

                  <Link
                    href="/bookings"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2 text-xs font-bold shadow-2xs transition-colors shrink-0"
                  >
                    <span>View Booking Voucher</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-[#0552A2] mx-auto flex items-center justify-center">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">No upcoming adventures scheduled</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Explore high-altitude trekking packages, heritage hotel stays, and custom itineraries across Nepal.
                  </p>
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <Link
                      href="/hotels"
                      className="px-4 py-2 rounded-xl bg-[#0552A2] text-white text-xs font-bold hover:bg-[#044182]"
                    >
                      Book a Stay
                    </Link>
                    <Link
                      href="/explore"
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                    >
                      Browse Treks
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Checklist & Explorer Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Completion Tasks */}
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h3 className="font-poppins text-sm font-bold text-slate-900">
                    Traveler Profile Checklist
                  </h3>
                  <span className="text-xs font-bold text-emerald-700">4 of 5 Completed</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Primary Email &amp; Phone Verified</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Verified</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>National Identity &amp; Passport Registered</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Verified</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Himalayan Travel Preferences Configured</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Complete</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>TIMS Clearance Card Paired</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">Active</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('documents')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span>Upload Backup Travel Insurance Policy</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 underline">Add Now</span>
                  </button>
                </div>
              </div>

              {/* Verified Clearances & Badges */}
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h3 className="font-poppins text-sm font-bold text-slate-900">
                    Verified Clearances &amp; Badges
                  </h3>
                  <span className="text-xs text-slate-400">NTB Statutory</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">TIMS Clearance Pass 2026</p>
                      <p className="text-[11px] text-slate-500 font-mono">Token: TIMS-2026-7814</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Authorized for Annapurna Conservation Area &amp; Sagarmatha National Park checkpoints.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 text-[#0552A2] flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900">High Altitude Clearance (5,416m)</p>
                      <p className="text-[11px] text-slate-500 font-mono">Thorong La Pass Completed</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Certified high-altitude trekking readiness verified by IFMGA lead guides.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 2: PERSONAL INFORMATION
            ------------------------------------------------------------------------- */}
        {activeTab === 'personal' && (
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="font-poppins text-lg font-bold text-slate-900">
                  Personal Information &amp; Legal Identity
                </h2>
                <p className="text-xs text-slate-500">
                  Official traveler records used for hotel front desk check-in, park permits, and high-altitude manifests.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTempProfile({ ...profileData });
                  setIsEditProfileOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Information</span>
              </button>
            </div>

            {/* 1. Basic Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Basic Information
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <dt className="text-slate-400 font-medium">Full Legal Name</dt>
                  <dd className="font-bold text-slate-900 text-sm mt-0.5">{profileData.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Traveler Title / Role</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">{profileData.title}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Date of Birth</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">{profileData.dob}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Gender</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">{profileData.gender}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Nationality &amp; Citizenship</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">
                    {profileData.nationality} ({profileData.country})
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Preferred Languages</dt>
                  <dd className="font-semibold text-slate-800 mt-0.5">{profileData.preferredLanguage}</dd>
                </div>
                <div className="sm:col-span-3 pt-1 border-t border-slate-200/60">
                  <dt className="text-slate-400 font-medium">Traveler Biography &amp; Expedition Focus</dt>
                  <dd className="text-slate-700 mt-1 leading-relaxed">{profileData.bio}</dd>
                </div>
              </dl>
            </div>

            {/* 2. Contact Information */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Contact Information
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <dt className="text-slate-400 font-medium">Registered Email Address</dt>
                  <dd className="font-medium text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
                    <span>{profileData.email}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 font-medium">Primary Mobile Phone</dt>
                  <dd className="font-medium text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
                    <span>{profileData.phone}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-slate-400 font-medium">Residential / Mailing Address</dt>
                  <dd className="font-medium text-slate-800 mt-0.5">{profileData.address}</dd>
                </div>
              </dl>
            </div>

            {/* 3. Emergency & Safety Contacts */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Emergency &amp; Mountain Rescue Contacts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-red-50/50 p-4 rounded-xl border border-red-200/80">
                <div>
                  <span className="text-slate-500 font-medium block">Primary Next-of-Kin Contact</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{documents.emergencyPrimary}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Secondary Field Contact</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{documents.emergencySecondary}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Satellite Telemetry Beacon</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{documents.satelliteDevice}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Himalayan Rescue (HRA) 24/7 Hotline</span>
                  <p className="font-mono font-bold text-red-600 mt-0.5">+977 1 4256909 / 1144</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 3: TRAVEL PREFERENCES
            ------------------------------------------------------------------------- */}
        {activeTab === 'preferences' && (
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="font-poppins text-lg font-bold text-slate-900">
                  Himalayan Travel Preferences
                </h2>
                <p className="text-xs text-slate-500">
                  Customizes personalized expedition recommendations, guide allocations, and hotel suggestions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-4 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <span>Save Preferences</span>
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Preferred Destinations */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Preferred Trekking Regions &amp; Valleys:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Everest Khumbu',
                    'Annapurna Sanctuary',
                    'Upper Mustang',
                    'Langtang Valley',
                    'Manaslu Circuit',
                    'Dolpo High Plateau',
                    'Kanchenjunga Wilderness',
                    'Chitwan Wildlife Reserve',
                  ].map((dest) => {
                    const isSelected = preferences.destinations.includes(dest);
                    return (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => {
                          setPreferences((prev) => ({
                            ...prev,
                            destinations: isSelected
                              ? prev.destinations.filter((d) => d !== dest)
                              : [...prev.destinations, dest],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0552A2] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {dest} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel Style & Adventure Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Primary Travel Style:</label>
                  <select
                    value={preferences.travelStyle}
                    onChange={(e) => setPreferences({ ...preferences, travelStyle: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  >
                    <option value="Alpine Trekker & Cultural Explorer">Alpine Trekker &amp; Cultural Explorer</option>
                    <option value="Luxury Heritage & Boutique Stays">Luxury Heritage &amp; Boutique Stays</option>
                    <option value="Fastpacking & High Himalayan Passes">Fastpacking &amp; High Himalayan Passes</option>
                    <option value="Wildlife Safari & River Expeditions">Wildlife Safari &amp; River Expeditions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Trekking Difficulty Level:</label>
                  <select
                    value={preferences.adventureLevel}
                    onChange={(e) => setPreferences({ ...preferences, adventureLevel: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  >
                    <option value="Easy / Gentle Cultural Walks (< 2,500m)">Easy / Gentle Cultural Walks (&lt; 2,500m)</option>
                    <option value="Moderate Mountain Trekking (2,500m – 4,000m)">Moderate Mountain Trekking (2,500m – 4,000m)</option>
                    <option value="Strenuous / High Altitude (5,000m+)">Strenuous / High Altitude (5,000m+)</option>
                    <option value="Technical Alpine Mountaineering (> 6,000m)">Technical Alpine Mountaineering (&gt; 6,000m)</option>
                  </select>
                </div>
              </div>

              {/* Accommodation & Dietary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Preferred Accommodation Style:</label>
                  <select
                    value={preferences.accommodation}
                    onChange={(e) => setPreferences({ ...preferences, accommodation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  >
                    <option value="Mountain Eco-Lodges & Authentic Teahouses">Mountain Eco-Lodges &amp; Authentic Teahouses</option>
                    <option value="5-Star Heritage Hotels & Boutique Stays">5-Star Heritage Hotels &amp; Boutique Stays</option>
                    <option value="Luxury Glamping & Wilderness Tents">Luxury Glamping &amp; Wilderness Tents</option>
                    <option value="Traditional Homestays with Local Families">Traditional Homestays with Local Families</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Dietary Preferences on Trail:</label>
                  <select
                    value={preferences.dietary}
                    onChange={(e) => setPreferences({ ...preferences, dietary: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0552A2]/20"
                  >
                    <option value="Vegetarian / High-Carb High-Altitude Trail Diet">Vegetarian / High-Carb High-Altitude Trail Diet</option>
                    <option value="Standard Nepali Dal Bhat & Mountain Cuisine">Standard Nepali Dal Bhat &amp; Mountain Cuisine</option>
                    <option value="Vegan / Plant-Based Only">Vegan / Plant-Based Only</option>
                    <option value="Gluten-Free Trail Menu">Gluten-Free Trail Menu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 4: TRIPS & BOOKINGS
            ------------------------------------------------------------------------- */}
        {activeTab === 'trips' && (
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h2 className="font-poppins text-lg font-bold text-slate-900">
                  Trips &amp; Confirmed Reservations
                </h2>
                <p className="text-xs text-slate-500">
                  All active hotel bookings, trekking permits, and travel passes connected to your account.
                </p>
              </div>

              <Link
                href="/bookings"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] hover:bg-[#044182] text-white px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>Manage In Booking Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-[#0552A2]/50 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] font-bold text-[#0552A2] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {b.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{b.category}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{b.title}</h3>
                    <p className="text-xs text-slate-500">{b.date} • Rendezvous: {b.meetingPoint}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="font-poppins font-bold text-slate-900 text-sm">{b.amount}</span>
                    <Link
                      href="/bookings"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 5: SAVED DESTINATIONS
            ------------------------------------------------------------------------- */}
        {activeTab === 'saved' && (
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h2 className="font-poppins text-lg font-bold text-slate-900">
                  Saved Destinations &amp; Stays Wishlist
                </h2>
                <p className="text-xs text-slate-500">
                  Himalayan peaks, protected conservation areas, and heritage hotels saved for future expeditions.
                </p>
              </div>

              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 text-xs font-semibold"
              >
                <span>Browse More</span>
                <Compass className="h-3.5 w-3.5 text-[#0552A2]" />
              </Link>
            </div>

            {savedDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {savedDestinations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.region}</span>
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <Link
                          href={item.link}
                          className="text-xs font-bold text-[#0552A2] hover:underline"
                        >
                          Explore
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveSaved(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove from saved"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <Bookmark className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Your wishlist is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore destinations, trekking routes, and boutique stays to save them to your account.
                </p>
                <Link
                  href="/explore"
                  className="inline-block px-4 py-2 bg-[#0552A2] text-white rounded-xl text-xs font-bold"
                >
                  Explore Nepal
                </Link>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 6: DOCUMENTS & TRAVEL PASSES
            ------------------------------------------------------------------------- */}
        {activeTab === 'documents' && (
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h2 className="font-poppins text-lg font-bold text-slate-900">
                  Travel Documents &amp; Checkpoint Passes
                </h2>
                <p className="text-xs text-slate-500">
                  Government clearances, digital TIMS cards, and high-altitude emergency bonds.
                </p>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Traveler Vault</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">National Passport</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active &amp; Valid
                  </span>
                </div>
                <p className="font-mono text-sm font-extrabold text-[#0552A2]">{documents.passportNo}</p>
                <p className="text-[11px] text-slate-500">
                  Issuing Country: {documents.passportCountry} • Expires: {documents.passportExpiry}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Digital TIMS Permit</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0552A2] text-[10px] font-bold">
                    Park Validated
                  </span>
                </div>
                <p className="font-mono text-sm font-extrabold text-[#0552A2]">{documents.timsPermitId}</p>
                <p className="text-[11px] text-slate-500">{documents.timsPermitCoverage}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">National Citizenship / ID</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Verified
                  </span>
                </div>
                <p className="text-slate-800 font-semibold">{documents.visaStatus}</p>
                <p className="text-[11px] text-slate-500">Department of National ID &amp; Civil Registration</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Medical Altitude Clearance</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Cleared 5,400m
                  </span>
                </div>
                <p className="text-slate-800 font-semibold">{documents.medicalClearance}</p>
                <p className="text-[11px] text-slate-500">Himalayan Rescue Association Clearance Database</p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 7: SECURITY & SETTINGS
            ------------------------------------------------------------------------- */}
        {activeTab === 'security' && (
          <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <div className="pb-3 border-b border-slate-100 space-y-0.5">
              <h2 className="font-poppins text-lg font-bold text-slate-900">
                Account Security &amp; Settings
              </h2>
              <p className="text-xs text-slate-500">
                Manage your login credentials, two-factor authentication, and active sessions.
              </p>
            </div>

            {/* Password & 2FA */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Authentication &amp; Credentials
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Account Password</span>
                    <span className="text-slate-500 font-mono">••••••••••••••••</span>
                    <span className="text-[10.5px] text-slate-400 ml-2">
                      (Changed {securitySettings.passwordLastChanged})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-slate-500">Protect account via authenticator app / SMS tokens</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Active Devices & Sessions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Active Login Sessions
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-[#0552A2]" />
                    <div>
                      <p className="font-bold text-slate-900">MacBook Pro • macOS (Chrome)</p>
                      <p className="text-[11px] text-slate-500">Kathmandu, Nepal • IP 103.240.x.x (Active Session)</p>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">This Device</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900">iPhone 15 Pro • iOS (Safari)</p>
                      <p className="text-[11px] text-slate-500">Pokhara, Nepal • Active 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px]">Mobile App</span>
                </div>
              </div>
            </div>

            {/* Session Actions & Danger Zone */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500" />
                <span>Sign Out of Session</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                <span>Request Account Deletion</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: EDIT PROFILE MODAL
          ========================================================================= */}
      {isEditProfileOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditProfileOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter my-6 animate-scale-up">
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
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
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={tempProfile.dob}
                    onChange={(e) => setTempProfile({ ...tempProfile, dob: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={tempProfile.address}
                  onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bio &amp; Traveler Focus</label>
                <textarea
                  rows={3}
                  value={tempProfile.bio}
                  onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0552A2] hover:bg-[#044182] px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CHANGE AVATAR MODAL
          ========================================================================= */}
      {isAvatarModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAvatarModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#0552A2]" />
                <h3 className="font-poppins text-base font-bold text-slate-900">Select Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
              ].map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => {
                    setProfileData((prev) => ({ ...prev, avatar: url }));
                    setIsAvatarModalOpen(false);
                    showToast('Profile photo updated');
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    profileData.avatar === url
                      ? 'border-[#0552A2] ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={url} alt="Option" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CHANGE PASSWORD MODAL
          ========================================================================= */}
      {isChangePasswordOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsChangePasswordOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
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

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0552A2] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0552A2] hover:bg-[#044182] px-4 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: DELETE ACCOUNT CONFIRMATION
          ========================================================================= */}
      {isDeleteModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDeleteModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-inter p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-poppins text-base font-bold">Request Account Deletion</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to request account deletion? Per Nepal Tourism Board regulations, verified government permit records and official VAT tax invoices must remain on file for statutory audit periods.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  showToast('Deletion request submitted to data officer');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
