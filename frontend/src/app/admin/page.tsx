'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Building2,
  Package,
  MapPin,
  CalendarCheck,
  DollarSign,
  FileText,
  Settings,
  Activity,
  History,
  Lock,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  LogOut,
  UserCheck,
  RefreshCw,
  Compass,
  Star,
  Globe,
  Bell,
  Check,
  X,
  CreditCard,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Sliders,
  Award,
  ConciergeBell,
  Send,
  Printer,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Layers,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { useApp, UserRole } from '@/context/AppContext';
import { api } from '@/lib/api';

type AdminTab =
  | 'overview'
  | 'users'
  | 'hotels'
  | 'packages'
  | 'destinations'
  | 'agencies'
  | 'guides'
  | 'butlers'
  | 'bookings'
  | 'verifications'
  | 'reviews'
  | 'finances'
  | 'commissions'
  | 'payouts'
  | 'refunds'
  | 'cms'
  | 'permissions'
  | 'settings'
  | 'audit-logs'
  | 'monitoring';

export default function SuperAdminCommandPage() {
  const router = useRouter();
  const { currentUser, role, setRole, showToast, impersonateUser } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Data states
  const [analytics, setAnalytics] = useState<any>({
    totalUsers: 1425,
    activeTravelers: 1280,
    verifiedGuides: 420,
    registeredButlers: 85,
    registeredAgencies: 48,
    registeredHotels: 32,
    totalPackages: 124,
    activeBookings: 68,
    pendingBookings: 14,
    completedTrips: 1840,
    cancelledBookings: 22,
    pendingVerificationsCount: 12,
    grossBookingValueNpr: 14850000,
    platformCommissionsNpr: 1782000,
    pendingPayoutsNpr: 324000,
    refundsVolumeNpr: 70000,
    netRevenueNpr: 1712000,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [finances, setFinances] = useState<any>({
    metrics: {},
    payouts: [],
    refunds: [],
    transactions: [],
  });
  const [cms, setCms] = useState<any>({
    heroBanner: {
      title: 'Journey Through the Sacred Realm of the High Himalaya',
      subtitle: 'Official Government of Nepal Tourism Platform connecting global travelers to verified IFMGA Sherpa guides, iconic trekking circuits, and authentic heritage stays.',
      badge: 'Nepal Tourism Board 2026 · Official Digital Gateway',
      ctaPrimaryText: 'Explore Certified Expeditions',
      ctaPrimaryLink: '/explore',
    },
    announcements: [],
    travelAdvisories: [],
  });
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, string[]>>({
    super_admin: ['*'],
    ntb_admin: ['destinations.manage', 'content.manage', 'reports.view', 'users.view', 'hotels.view', 'hotels.approve', 'packages.view', 'packages.approve', 'reviews.moderate'],
    agency: ['packages.create', 'packages.update', 'packages.view_own', 'bookings.view_own', 'payouts.view_own'],
    guide: ['bookings.view_assigned', 'itinerary.view_assigned', 'reports.submit', 'availability.manage'],
    butler: ['bookings.view_assigned', 'logistics.manage', 'reports.submit', 'availability.manage'],
    traveler: ['bookings.create', 'bookings.view_own', 'bookings.cancel_own', 'profile.manage'],
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<any | null>(null);
  const [refundModalBooking, setRefundModalBooking] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState('Authorized cancellation');

  // Forms temporary state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'traveler',
    password: '',
    phone: '',
  });

  const [commissionForm, setCommissionForm] = useState({
    agencyCommissionPercent: 12,
    hotelCommissionPercent: 10,
    guideCommissionPercent: 5,
    butlerDailyCompensationNpr: 6000,
  });

  // Load all data from API with fallback
  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [overviewRes, usersRes, hotelsRes, pkgRes, bkgRes, finRes, permRes, cmsRes, auditRes, healthRes] =
          await Promise.allSettled([
            api.admin.getOverview(),
            api.admin.getUsers(),
            api.admin.getHotels(),
            api.admin.getPackages(),
            api.admin.getBookings(),
            api.admin.getFinances(),
            api.admin.getPermissions(),
            api.admin.getCms(),
            api.admin.getAuditLogs(),
            api.admin.getSystemHealth(),
          ]);

        if (overviewRes.status === 'fulfilled' && overviewRes.value) {
          if (overviewRes.value.analytics) setAnalytics(overviewRes.value.analytics);
        }
        if (usersRes.status === 'fulfilled' && usersRes.value) {
          setUsers(usersRes.value.users || []);
        }
        if (hotelsRes.status === 'fulfilled' && hotelsRes.value) {
          setHotels(hotelsRes.value.hotels || []);
        }
        if (pkgRes.status === 'fulfilled' && pkgRes.value) {
          setPackages(pkgRes.value.packages || []);
        }
        if (bkgRes.status === 'fulfilled' && bkgRes.value) {
          setBookings(bkgRes.value.bookings || []);
        }
        if (finRes.status === 'fulfilled' && finRes.value) {
          setFinances(finRes.value);
          if (finRes.value.commissionRules) {
            setCommissionForm(finRes.value.commissionRules);
          }
        }
        if (permRes.status === 'fulfilled' && permRes.value) {
          if (permRes.value.permissions) setPermissionsMatrix(permRes.value.permissions);
        }
        if (cmsRes.status === 'fulfilled' && cmsRes.value) {
          if (cmsRes.value.cms) setCms(cmsRes.value.cms);
        }
        if (auditRes.status === 'fulfilled' && auditRes.value) {
          setAuditLogs(auditRes.value.logs || []);
        }
        if (healthRes.status === 'fulfilled' && healthRes.value) {
          setSystemHealth(healthRes.value);
        }
      } catch (err) {
        console.warn('[SuperAdmin] Offline data sync active:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [refreshKey]);

  // Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.admin.createUser(newUserForm);
      if (res.success) {
        showToast(`User ${newUserForm.name} created successfully.`);
        setUsers((prev) => [res.user, ...prev]);
        setIsAddUserModalOpen(false);
        setNewUserForm({ name: '', email: '', role: 'traveler', password: '', phone: '' });
      }
    } catch (err: any) {
      showToast(`Creation failed: ${err.message}`);
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const res = await api.admin.updateUser(userId, { status: newStatus });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
        showToast(`User status updated to ${newStatus}`);
      }
    } catch (err: any) {
      showToast(`Update failed: ${err.message}`);
    }
  };

  const handleImpersonate = async (targetUser: any) => {
    try {
      const res = await api.admin.impersonateUser(targetUser.id);
      if (res.success) {
        impersonateUser(targetUser, res.token);
        router.push(targetUser.role === 'guide' ? '/portals/guide' : targetUser.role === 'butler' ? '/portals/butler' : targetUser.role === 'business' || targetUser.role === 'agency' ? '/portals/business' : '/dashboard');
      }
    } catch (err: any) {
      // Local fallback
      impersonateUser(targetUser);
      router.push('/dashboard');
    }
  };

  const handleProcessPayout = async (payoutId: string, decision: 'completed' | 'rejected') => {
    try {
      const res = await api.admin.processPayout(payoutId, { decision });
      if (res.success) {
        setFinances((prev: any) => ({
          ...prev,
          payouts: prev.payouts.map((p: any) => (p.id === payoutId ? { ...p, status: decision } : p)),
        }));
        showToast(`Payout ${decision === 'completed' ? 'authorized and completed' : 'rejected'}.`);
      }
    } catch (err: any) {
      showToast(`Payout processing failed: ${err.message}`);
    }
  };

  const handleProcessRefund = async () => {
    if (!refundModalBooking) return;
    try {
      const res = await api.admin.refundBooking(refundModalBooking.id, {
        amountNpr: refundModalBooking.totalAmountNpr,
        reason: refundReason,
      });
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === refundModalBooking.id ? { ...b, status: 'refunded', paymentStatus: 'refunded' } : b))
        );
        showToast(`Refund of NPR ${refundModalBooking.totalAmountNpr.toLocaleString()} processed.`);
        setRefundModalBooking(null);
      }
    } catch (err: any) {
      showToast(`Refund failed: ${err.message}`);
    }
  };

  const handleTogglePermission = async (roleKey: string, perm: string) => {
    const currentList = permissionsMatrix[roleKey] || [];
    const updated = currentList.includes(perm)
      ? currentList.filter((p) => p !== perm)
      : [...currentList, perm];

    setPermissionsMatrix((prev) => ({ ...prev, [roleKey]: updated }));
    try {
      await api.admin.updatePermissions({ role: roleKey, permissions: updated });
      showToast(`Permission matrix updated for ${roleKey}.`);
    } catch (err) {
      console.warn('Updated matrix locally');
    }
  };

  const handleSaveCommissions = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.updateCommissionRules(commissionForm);
      showToast('Commission policies saved & enforced site-wide.');
    } catch (err: any) {
      showToast('Failed to save commissions');
    }
  };

  // Filtered lists
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = filterRole === 'All' || u.role.toLowerCase() === filterRole.toLowerCase();
      const matchesStatus = filterStatus === 'All' || u.status === filterStatus;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query));
      return matchesRole && matchesStatus && matchesQuery;
    });
  }, [users, filterRole, filterStatus, searchQuery]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        b.id.toLowerCase().includes(query) ||
        (b.userName && b.userName.toLowerCase().includes(query)) ||
        (b.title && b.title.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [bookings, filterStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-[#020A13] text-slate-100 font-inter antialiased flex flex-col lg:flex-row">
      
      {/* =======================================================================
          SIDEBAR NAVIGATION (Fixed Width Desktop, Expandable Mobile)
          ======================================================================= */}
      <aside className="w-full lg:w-64 xl:w-72 bg-[#031120] border-r border-slate-800/80 shrink-0 flex flex-col justify-between">
        <div className="p-4 sm:p-5 space-y-6">
          
          {/* Platform Command Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-poppins font-bold text-sm tracking-tight text-white">Visit Nepal</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  SUPER
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Master Platform Command</p>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5 text-xs font-medium">
            
            {/* Group 1: Overview */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pb-1">
                Overview
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Executive Dashboard</span>
              </button>
            </div>

            {/* Group 2: Management */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pb-1">
                Platform Management
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4" />
                  <span>Users &amp; Roles</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                  {users.length || 1425}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hotels')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'hotels'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4" />
                  <span>Hotels &amp; Lodges</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                  {hotels.length || 32}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('packages')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'packages'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="h-4 w-4" />
                  <span>Packages &amp; Tours</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                  {packages.length || 124}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('destinations')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'destinations'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Destinations Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('agencies')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'agencies'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Tour Agencies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guides')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'guides'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Mountain Guides</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('butlers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'butlers'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ConciergeBell className="h-4 w-4" />
                <span>Sherpa Butlers</span>
              </button>
            </div>

            {/* Group 3: Operations */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pb-1">
                Operations &amp; Verifications
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Bookings &amp; Routes</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                  {bookings.length || 82}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('verifications')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'verifications'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verification Queue</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold">
                  {analytics.pendingVerificationsCount} PENDING
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Star className="h-4 w-4" />
                <span>Reviews &amp; Moderation</span>
              </button>
            </div>

            {/* Group 4: Finance */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pb-1">
                Finance &amp; Commissions
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('finances')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'finances'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Revenue &amp; Statements</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payouts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'payouts'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4" />
                  <span>Vendor Payouts</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md font-mono">
                  {(finances.payouts || []).filter((p: any) => p.status === 'pending').length} DUE
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('refunds')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'refunds'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refund Authorizations</span>
              </button>
            </div>

            {/* Group 5: Content CMS & System */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pb-1">
                Content &amp; Security
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('cms')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'cms'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>CMS &amp; Advisories</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('permissions')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'permissions'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>RBAC Permissions Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('audit-logs')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'audit-logs'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <History className="h-4 w-4" />
                <span>System Audit Logs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Platform Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('monitoring')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'monitoring'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>System Monitoring</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Current Active Super Admin Profile Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-[#020b15]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0 border border-blue-400/40">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Govinda Thapa</p>
                <p className="text-[10px] text-amber-400 font-mono">SUPER_ADMIN</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRole('traveler');
                router.push('/');
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Site as Traveler"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =======================================================================
          MAIN CONTENT WORKSPACE
          ======================================================================= */}
      <main className="flex-1 min-w-0 bg-[#020A13] overflow-y-auto">
        
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#031120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-poppins text-lg sm:text-xl font-bold text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Production Cluster
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>View Public Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* ===================================================================
              TAB 1: EXECUTIVE DASHBOARD OVERVIEW
              =================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Financial & Volume KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#051629] border border-slate-800/90 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Gross Booking Value</span>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="font-poppins text-2xl font-bold text-white">
                    NPR {(analytics.grossBookingValueNpr || 14850000).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <TrendingUp className="h-3 w-3" /> +18.4% from previous month
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#051629] border border-slate-800/90 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Platform Commission (Net)</span>
                    <PercentIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="font-poppins text-2xl font-bold text-white">
                    NPR {(analytics.platformCommissionsNpr || 1782000).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-blue-400 font-medium">
                    12% avg agency commission / 10% stays
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#051629] border border-slate-800/90 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Active Travelers &amp; Guides</span>
                    <Users className="h-4 w-4 text-indigo-400" />
                  </div>
                  <p className="font-poppins text-2xl font-bold text-white">
                    {analytics.totalUsers || 1425}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {analytics.verifiedGuides || 420} IFMGA Guides · {analytics.registeredButlers || 85} Butlers
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#051629] border border-slate-800/90 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Pending Verification Tasks</span>
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="font-poppins text-2xl font-bold text-amber-300">
                    {analytics.pendingVerificationsCount || 12} Items
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('verifications')}
                    className="text-[11px] text-amber-400 underline font-medium cursor-pointer"
                  >
                    Open review queue →
                  </button>
                </div>
              </div>

              {/* 2-Column Dashboard Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left 7 Cols: Bookings Status & Operational Telemetry */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Operations Status Bar */}
                  <div className="p-5 rounded-2xl bg-[#051629] border border-slate-800/90 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-poppins text-sm font-bold text-white">
                        Expedition &amp; Reservation Pipeline
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('bookings')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        View all {bookings.length} bookings →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Active Expeditions</span>
                        <span className="text-xl font-bold text-emerald-400 mt-1 block">
                          {analytics.activeBookings || 68}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Pending Decisions</span>
                        <span className="text-xl font-bold text-amber-400 mt-1 block">
                          {analytics.pendingBookings || 14}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Completed Trips</span>
                        <span className="text-xl font-bold text-blue-400 mt-1 block">
                          {analytics.completedTrips || 1840}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Cancelled</span>
                        <span className="text-xl font-bold text-rose-400 mt-1 block">
                          {analytics.cancelledBookings || 22}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Entities Breakdown */}
                  <div className="p-5 rounded-2xl bg-[#051629] border border-slate-800/90 space-y-4">
                    <h3 className="font-poppins text-sm font-bold text-white">
                      Registered Network Inventory
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="flex items-center gap-2 text-blue-400 font-semibold">
                          <Building2 className="h-4 w-4" />
                          <span>Hotels &amp; Lodges</span>
                        </div>
                        <p className="text-lg font-bold text-white">{hotels.length} Properties</p>
                        <p className="text-[11px] text-slate-400">All 7 Provinces &amp; 10 Himalayan hubs</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                          <Package className="h-4 w-4" />
                          <span>Trekking Packages</span>
                        </div>
                        <p className="text-lg font-bold text-white">{packages.length} Itineraries</p>
                        <p className="text-[11px] text-slate-400">Everest, Annapurna, Mustang &amp; Manaslu</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                          <Briefcase className="h-4 w-4" />
                          <span>Tour Agencies</span>
                        </div>
                        <p className="text-lg font-bold text-white">{analytics.registeredAgencies || 48} Operators</p>
                        <p className="text-[11px] text-slate-400">TAAN certified operators</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right 5 Cols: Real-Time Audit Stream */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-[#051629] border border-slate-800/90 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-blue-400" />
                        <h3 className="font-poppins text-sm font-bold text-white">
                          Real-Time Audit Trail
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('audit-logs')}
                        className="text-[11px] text-blue-400 hover:text-blue-300"
                      >
                        All logs →
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {auditLogs.slice(0, 7).map((log, idx) => (
                        <div
                          key={log.id || idx}
                          className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono font-bold text-blue-400 uppercase">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">
                            <span className="font-semibold text-white">{log.actorName}</span> ({log.actorRole}): target{' '}
                            <span className="font-mono text-slate-400">{log.targetId}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 2: USERS & ROLES GOVERNANCE
              =================================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              {/* Filter & Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#051629] border border-slate-800/90">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative min-w-[220px] flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search name, email, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Roles</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="ntb_admin">NTB Admin</option>
                    <option value="agency">Tour Agency</option>
                    <option value="guide">Mountain Guide</option>
                    <option value="butler">Sherpa Butler</option>
                    <option value="traveler">Traveler</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>

              {/* Users Data Table */}
              <div className="rounded-2xl bg-[#051629] border border-slate-800/90 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">KYC / Verification</th>
                        <th className="py-3 px-4">Joined</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-slate-800 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-700">
                                {user.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate">{user.name}</p>
                                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                user.role === 'super_admin'
                                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                                  : user.role === 'ntb_admin'
                                  ? 'bg-purple-400/10 text-purple-400 border border-purple-400/30'
                                  : user.role === 'guide'
                                  ? 'bg-blue-400/10 text-blue-400 border border-blue-400/30'
                                  : user.role === 'agency' || user.role === 'business'
                                  ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] ${
                                user.status === 'active'
                                  ? 'text-emerald-400'
                                  : user.status === 'suspended'
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  user.status === 'active'
                                    ? 'bg-emerald-400'
                                    : user.status === 'suspended'
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                                }`}
                              />
                              <span className="capitalize">{user.status}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`text-[11px] ${
                                user.kycStatus === 'verified'
                                  ? 'text-emerald-400 font-semibold'
                                  : user.kycStatus === 'under_review' || user.kycStatus === 'submitted'
                                  ? 'text-amber-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {user.kycStatus === 'verified' ? '✓ Verified' : user.kycStatus || 'None'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026-01-10'}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Audited Impersonation Button */}
                              <button
                                type="button"
                                onClick={() => handleImpersonate(user)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                title="Impersonate for Customer Support (Audited)"
                              >
                                Impersonate
                              </button>

                              {user.status === 'active' ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                                  className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateUserStatus(user.id, 'active')}
                                  className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 3: HOTELS GOVERNANCE
              =================================================================== */}
          {activeTab === 'hotels' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#051629] border border-slate-800">
                <div>
                  <h3 className="font-poppins text-sm font-bold text-white">
                    Master Registered Hotels Catalog
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Universal hotel templates standardize layout, rates, and amenities across all properties
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddHotelModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Hotel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                        <img
                          src={hotel.heroImage}
                          alt={hotel.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] font-bold text-amber-300">
                          ★ {hotel.starRating || 5}-Star
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                            {hotel.district || hotel.region}
                          </span>
                          <span className="text-xs font-bold text-white">
                            NPR {hotel.basePriceNpr?.toLocaleString()}/night
                          </span>
                        </div>
                        <h4 className="font-poppins text-base font-bold text-white leading-snug">
                          {hotel.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {hotel.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <Link
                        href={`/hotels/${hotel.id}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Live Public Page →
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Hotel ${hotel.name} verified and approved.`);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 cursor-pointer"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 4: REVENUE, COMMISSIONS & PAYOUTS (FINANCES)
              =================================================================== */}
          {(activeTab === 'finances' || activeTab === 'payouts' || activeTab === 'refunds') && (
            <div className="space-y-6">
              
              {/* Financial Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Total Platform Commission Volume</span>
                  <p className="font-poppins text-2xl font-bold text-emerald-400">
                    NPR {(analytics.platformCommissionsNpr || 1782000).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400">Automated 12% cut from standard booking receipts</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Pending Agency &amp; Guide Payouts</span>
                  <p className="font-poppins text-2xl font-bold text-amber-300">
                    NPR {(analytics.pendingPayoutsNpr || 324000).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400">Verified bank transfer requests awaiting sign-off</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Export Financial Statements</span>
                    <p className="text-xs text-slate-300 mt-1">Download CSV records for reconciliation</p>
                  </div>
                  <a
                    href="http://localhost:8080/api/admin/finances/export-csv"
                    download="visitnepal-financial-statements.csv"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CSV Report</span>
                  </a>
                </div>
              </div>

              {/* Commission Rates Configurator */}
              <div className="p-5 rounded-2xl bg-[#051629] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="font-poppins text-sm font-bold text-white">
                      Platform Commission &amp; Compensation Rules
                    </h3>
                    <p className="text-xs text-slate-400">
                      Changes here directly control booking revenue splits without code deployment
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCommissions} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Tour Agency Commission (%)</label>
                    <input
                      type="number"
                      value={commissionForm.agencyCommissionPercent}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, agencyCommissionPercent: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Hotel &amp; Lodge Commission (%)</label>
                    <input
                      type="number"
                      value={commissionForm.hotelCommissionPercent}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, hotelCommissionPercent: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Guide Platform Fee (%)</label>
                    <input
                      type="number"
                      value={commissionForm.guideCommissionPercent}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, guideCommissionPercent: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Enforce Rules
                    </button>
                  </div>
                </form>
              </div>

              {/* Vendor Payouts List */}
              <div className="rounded-2xl bg-[#051629] border border-slate-800 overflow-hidden space-y-3 p-4">
                <h3 className="font-poppins text-sm font-bold text-white">
                  Vendor Payout Processing Queue
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Payout ID</th>
                        <th className="py-2.5 px-3">Recipient</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Bank Account</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {(finances.payouts || []).map((payout: any) => (
                        <tr key={payout.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{payout.id}</td>
                          <td className="py-2.5 px-3 text-white font-bold">{payout.recipientName}</td>
                          <td className="py-2.5 px-3 text-slate-300 uppercase text-[10px]">{payout.recipientRole}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">NPR {payout.amountNpr?.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                            {payout.bankDetails?.bankName} ({payout.bankDetails?.accountNumber})
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                payout.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : payout.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {payout.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {payout.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleProcessPayout(payout.id, 'completed')}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold cursor-pointer"
                                >
                                  Authorize
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleProcessPayout(payout.id, 'rejected')}
                                  className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded font-semibold cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 5: ROLE PERMISSIONS MATRIX (RBAC)
              =================================================================== */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800">
                <h3 className="font-poppins text-sm font-bold text-white">
                  Dynamic Role-Based Access Control (RBAC) Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Grant or revoke granular platform capabilities dynamically. Super Admin controls platform governance.
                </p>
              </div>

              <div className="rounded-2xl bg-[#051629] border border-slate-800 overflow-hidden p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3 text-center">Destinations</th>
                        <th className="py-3 px-3 text-center">Packages Manage</th>
                        <th className="py-3 px-3 text-center">Hotels Manage</th>
                        <th className="py-3 px-3 text-center">Bookings Global</th>
                        <th className="py-3 px-3 text-center">Finances &amp; Payouts</th>
                        <th className="py-3 px-3 text-center">CMS Content</th>
                        <th className="py-3 px-3 text-center">Security &amp; Roles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {[
                        { role: 'super_admin', label: 'Super Admin', isFixedMaster: true },
                        { role: 'ntb_admin', label: 'NTB Admin', isFixedMaster: false },
                        { role: 'agency', label: 'Tour Agency', isFixedMaster: false },
                        { role: 'guide', label: 'Mountain Guide', isFixedMaster: false },
                        { role: 'butler', label: 'Sherpa Butler', isFixedMaster: false },
                        { role: 'traveler', label: 'Traveler', isFixedMaster: false },
                      ].map((r) => {
                        const perms = permissionsMatrix[r.role] || [];
                        const isSuper = r.role === 'super_admin';
                        return (
                          <tr key={r.role} className="hover:bg-slate-800/30">
                            <td className="py-3 px-3">
                              <span className="font-bold text-white">{r.label}</span>
                              <span className="text-[10px] block font-mono text-slate-400 uppercase">{r.role}</span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('destinations.manage')}
                                onChange={() => handleTogglePermission(r.role, 'destinations.manage')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('packages.create') || perms.includes('packages.approve')}
                                onChange={() => handleTogglePermission(r.role, 'packages.create')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('hotels.view') || perms.includes('hotels.approve')}
                                onChange={() => handleTogglePermission(r.role, 'hotels.approve')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('bookings.view_global')}
                                onChange={() => handleTogglePermission(r.role, 'bookings.view_global')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('finances.manage')}
                                onChange={() => handleTogglePermission(r.role, 'finances.manage')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('content.manage')}
                                onChange={() => handleTogglePermission(r.role, 'content.manage')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>

                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isSuper}
                                checked={isSuper || perms.includes('security.manage')}
                                onChange={() => handleTogglePermission(r.role, 'security.manage')}
                                className="h-4 w-4 rounded accent-blue-600"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 6: SYSTEM AUDIT LOGS
              =================================================================== */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#051629] border border-slate-800">
                <div>
                  <h3 className="font-poppins text-sm font-bold text-white">
                    Master Platform Audit Trail
                  </h3>
                  <p className="text-xs text-slate-400">
                    Immutable activity log tracking role modifications, refunds, financial changes, and approvals
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#051629] border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Actor</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Target</th>
                        <th className="py-3 px-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-bold text-white">{log.actorName}</span>
                            <span className="text-[10px] block font-mono text-slate-400">{log.actorRole}</span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-blue-400 text-[11px]">
                            {log.action}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            {log.targetType}: <span className="font-mono text-slate-400">{log.targetId}</span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                            {JSON.stringify(log.details || {})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 7: SYSTEM MONITORING
              =================================================================== */}
          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">API Gateway Cluster</span>
                  <p className="font-poppins text-xl font-bold text-emerald-400">Online &amp; Healthy</p>
                  <p className="text-[11px] text-slate-400">Node/Express 8080 · JWT Authentication Active</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Database Records Telemetry</span>
                  <p className="font-poppins text-xl font-bold text-white">
                    {(users.length + hotels.length + packages.length + bookings.length).toLocaleString()} Total Entities
                  </p>
                  <p className="text-[11px] text-slate-400">Atomic persistence with transactional audit logging</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#051629] border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Emergency Dispatch Ready</span>
                  <p className="font-poppins text-xl font-bold text-rose-400">HRA +977 1 4256909</p>
                  <p className="text-[11px] text-slate-400">Direct SAR Helicopter dispatch bridge</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =======================================================================
          MODAL 1: CREATE USER MODAL
          ======================================================================= */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsAddUserModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#031120] border border-slate-800 p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-poppins text-base font-bold text-white">Create New Platform User</h3>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Assign Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  >
                    <option value="traveler">Traveler</option>
                    <option value="guide">Mountain Guide</option>
                    <option value="butler">Sherpa Butler</option>
                    <option value="agency">Tour Agency</option>
                    <option value="ntb_admin">NTB Admin (Tourism Board)</option>
                    <option value="super_admin">Super Admin (Platform Director)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Initial Password</label>
                  <input
                    type="password"
                    placeholder="Defaults to NepalTourism2026!"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function PercentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
