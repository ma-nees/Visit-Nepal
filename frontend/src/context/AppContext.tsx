'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  Booking,
  CommunityPost,
  Conversation,
  NotificationItem,
  ScheduleDay,
  initialBookings,
  initialCommunityPosts,
  initialConversations,
  initialScheduleDays,
  notifications as initialNotifications,
} from '@/data/mockData';
import { api } from '@/lib/api';
import { resetGlobalAuth } from '@/store/useTravelStore';

export type UserRole = 'traveler' | 'business' | 'guide' | 'butler' | 'admin';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  kycStatus?: string;
}

const roleDefaultEmails: Record<UserRole, string> = {
  traveler: 'aayush.traveler@visitnepal.com',
  business: 'partner@himalayanexpeditions.com',
  guide: 'pasang.sherpa@visitnepal.com',
  butler: 'sherpa.butler@visitnepal.com',
  admin: 'officer@ntb.gov.np',
};

export const personaDefaults: Record<UserRole, { name: string; email: string; title: string }> = {
  traveler: {
    name: 'Aayush Pradhan',
    email: 'aayush.traveler@visitnepal.com',
    title: 'Verified Himalayan Trekker',
  },
  business: {
    name: 'Himalayan Expeditions Partner',
    email: 'partner@himalayanexpeditions.com',
    title: 'Licensed Tour Operator Agency',
  },
  guide: {
    name: 'Pasang Nuru Sherpa',
    email: 'pasang.sherpa@visitnepal.com',
    title: 'NMA & IFMGA Certified Lead Mountain Guide',
  },
  butler: {
    name: 'Mingma Sherpa',
    email: 'sherpa.butler@visitnepal.com',
    title: 'VIP Sherpa Butler & Concierge',
  },
  admin: {
    name: 'Ministry Tourism Officer',
    email: 'officer@ntb.gov.np',
    title: 'Nepal Tourism Board (NTB) Government Admin Desk',
  },
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'qrCode' | 'bookedBy'> & Partial<Booking>) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  customPlans: any[];
  refreshCustomPlans: () => Promise<void>;
  createCustomTrip: (data: any) => Promise<any>;
  acceptQuotation: (planId: string, quoteId: string) => Promise<any>;
  rejectQuotation: (planId: string, quoteId: string, feedback?: string) => Promise<any>;
  posts: CommunityPost[];
  addPost: (content: string, location: string, mediaUrl?: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  conversations: Conversation[];
  sendMessage: (chatId: string, text: string) => Promise<void>;
  scheduleDays: ScheduleDay[];
  toggleDayComplete: (dayNumber: number) => void;
  notificationsList: NotificationItem[];
  markAllRead: () => Promise<void>;
  toast: string | null;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('traveler');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [customPlans, setCustomPlans] = useState<any[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [scheduleDays, setScheduleDays] =
    useState<ScheduleDay[]>(initialScheduleDays);
  const [notificationsList, setNotificationsList] =
    useState<NotificationItem[]>(initialNotifications);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const refreshCustomPlans = async () => {
    try {
      const res = await api.customPlans.list();
      if (res && Array.isArray(res.customPlans)) {
        setCustomPlans(res.customPlans);
      }
    } catch (err) {
      console.debug('[AppContext] Custom plans offline fallback');
    }
  };

  // Sync with real backend REST API
  const refreshData = async () => {
    refreshCustomPlans();
    try {
      // 1. Fetch bookings
      const bRes = await api.bookings.list().catch(() => null);
      if (bRes && Array.isArray(bRes.bookings) && bRes.bookings.length > 0) {
        const mappedBookings: Booking[] = bRes.bookings.map((b: any) => ({
          id: b.id,
          title: b.title,
          provider: b.provider || 'Himalayan Sherpa Expeditions',
          category: (b.category as any) || 'Trek',
          date: b.date || 'Spring 2026',
          bookedBy: b.userName || 'Aayush Pradhan',
          status: (b.status === 'confirmed'
            ? 'Confirmed'
            : b.status === 'completed'
              ? 'Completed'
              : b.status === 'cancelled'
                ? 'Cancelled'
                : b.status === 'paid'
                  ? 'Paid'
                  : b.status === 'quoted'
                    ? 'Quoted'
                    : 'Confirmed') as any,
          amount: `NPR ${(b.totalAmountNpr || 50000).toLocaleString()}`,
          qrCode: b.qrCode || `VN-PASS-${b.id}`,
          color: '#0552A2',
          meetingPoint: b.meetingPoint || 'Kathmandu Rendezvous Base',
          assignedGuide: b.assignedGuideName || 'Pasang Nuru Sherpa (IFMGA)',
          contactPhone: b.contactPhone || '+977-1-4412345',
          bookingType: b.bookingType || 'standard',
          customTripId: b.customTripId,
          invoiceNumber: b.invoiceNumber,
          optionsAndAddons: b.optionsAndAddons,
          priceBreakdown: b.priceBreakdown,
          travelerDetails: b.travelerDetails,
        }));
        setBookings(mappedBookings);
      }

      // 2. Fetch community posts
      const pRes = await api.community.getPosts().catch(() => null);
      if (pRes && Array.isArray(pRes.posts) && pRes.posts.length > 0) {
        const mappedPosts: CommunityPost[] = pRes.posts.map((p: any) => ({
          id: p.id,
          authorName: p.authorName,
          authorAvatar: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          authorLocation: p.location,
          timeAgo: 'Recent',
          verified: true,
          content: p.content,
          mediaUrl: p.mediaUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
          likesCount: p.likesCount,
          userReaction: p.likedBy?.includes(currentUser?.id) ? 'like' : null,
          commentsCount: p.commentsCount,
          comments: (p.comments || []).map((c: any) => ({
            id: c.id,
            author: c.authorName,
            avatar: c.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            text: c.text,
            timeAgo: c.createdAt || 'Just now',
            likes: 0,
          })),
        }));
        setPosts(mappedPosts);
      }

      // 3. Fetch notifications
      const nRes = await api.notifications.list().catch(() => null);
      if (nRes && Array.isArray(nRes.notifications) && nRes.notifications.length > 0) {
        const mappedNotifs: NotificationItem[] = nRes.notifications.map((n: any) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          time: 'Recent',
          color: n.type === 'alert' ? '#EC1F27' : n.type === 'permit' ? '#FDB716' : '#0552A2',
          read: n.isRead,
        }));
        setNotificationsList(mappedNotifs);
      }
    } catch (err) {
      console.warn('[AppContext] Offline/local fallback active:', err);
    }
  };

  // Initial load
  useEffect(() => {
    // Check saved token or authenticate from session
    const initAuth = async () => {
      try {
        const isLoggedOut = typeof window !== 'undefined' && localStorage.getItem('vn_logged_out') === 'true';
        if (isLoggedOut) {
          setCurrentUser(null);
          return;
        }

        const savedToken = typeof window !== 'undefined' ? localStorage.getItem('vn_auth_token') : null;
        const savedUserStr = typeof window !== 'undefined' ? localStorage.getItem('vn_user') : null;

        if (savedToken) {
          const me = await api.auth.me().catch(() => null);
          if (me?.user) {
            setCurrentUser(me.user);
            setRoleState(me.user.role);
          } else if (savedUserStr) {
            try {
              const parsed = JSON.parse(savedUserStr);
              setCurrentUser(parsed);
              setRoleState(parsed.role || 'traveler');
            } catch {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        } else if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setCurrentUser(parsed);
            setRoleState(parsed.role || 'traveler');
          } catch {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('[AppContext] Init auth error:', err);
      }
      refreshData();
    };

    initAuth();
  }, []);

  // Logout method for any user
  const logout = () => {
    try {
      localStorage.removeItem('vn_auth_token');
      localStorage.removeItem('vn_user');
      localStorage.setItem('vn_logged_out', 'true');
    } catch {
      // Ignore
    }
    resetGlobalAuth();
    setCurrentUser(null);
    showToast('Signed out of Visit Nepal portal.');
  };

  // Role Switcher with Server-Side & Local Fallback Authentication
  const setRole = async (newRole: UserRole) => {
    const persona = personaDefaults[newRole];
    const localUser: CurrentUser = {
      id: `usr-${newRole}`,
      email: persona.email,
      name: persona.name,
      role: newRole,
    };

    try {
      localStorage.removeItem('vn_logged_out');
      localStorage.setItem('vn_user', JSON.stringify(localUser));
      localStorage.setItem('vn_auth_token', `token-${newRole}`);
    } catch {
      // Ignore
    }

    setRoleState(newRole);
    setCurrentUser(localUser);

    try {
      const email = roleDefaultEmails[newRole];
      const res = await api.auth.login(email, 'NepalTourism2026!', newRole);
      setCurrentUser(res.user);
      try {
        localStorage.setItem('vn_user', JSON.stringify(res.user));
        localStorage.setItem('vn_auth_token', res.token);
      } catch {
        // Ignore
      }
      showToast(`Switched active user to ${persona.name} (${newRole.toUpperCase()})`);
      refreshData();
    } catch (err: any) {
      console.warn('[AppContext] Offline/local role switch:', err.message);
      showToast(`Switched active user to ${persona.name} (${newRole.toUpperCase()})`);
    }
  };

  const addBooking = async (
    booking: Omit<Booking, 'id' | 'qrCode' | 'bookedBy'> & Partial<Booking>
  ): Promise<Booking> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 89999);
    const id = booking.id || `VN-BKG-2026-${randomSuffix}`;
    const invoiceNumber = booking.invoiceNumber || `VN-INV-2026-${randomSuffix}`;
    const isConfirmed = booking.status === 'Confirmed' || booking.status === 'Paid';

    const newBooking: Booking = {
      ...booking,
      id,
      bookedBy: booking.bookedBy || currentUser?.name || 'Aayush Pradhan',
      qrCode: booking.qrCode || (isConfirmed ? `VN-PASS-${id}-VERIFIED-2026` : `VN-PASS-${id}-PENDING`),
      invoiceNumber,
      status: booking.status || 'Confirmed',
      color: booking.color || '#0552A2',
      category: booking.category || 'Trek',
      provider: booking.provider || 'Himalayan Sherpa Expeditions',
      meetingPoint: booking.meetingPoint || 'Kathmandu Rendezvous Base (TIA Terminal 2)',
      assignedGuide: booking.assignedGuide || 'Pasang Nuru Sherpa (IFMGA)',
      contactPhone: booking.contactPhone || '+977-1-4412345',
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking submitted (${id}): ${booking.title}`);

    // Call real backend
    try {
      const res = await api.bookings.create({
        title: booking.title,
        provider: booking.provider,
        category: booking.category,
        date: booking.date,
        amount: booking.amount,
        meetingPoint: booking.meetingPoint,
        contactPhone: booking.contactPhone,
        bookingType: booking.bookingType || 'standard',
        customTripId: booking.customTripId,
        optionsAndAddons: booking.optionsAndAddons,
        priceBreakdown: booking.priceBreakdown,
        travelerDetails: booking.travelerDetails,
        initialStatus: isConfirmed ? 'confirmed' : 'pending',
      });
      if (res?.booking) {
        return {
          ...newBooking,
          id: res.booking.id,
          invoiceNumber: res.booking.invoiceNumber || newBooking.invoiceNumber,
          qrCode: res.booking.qrCode || newBooking.qrCode,
        };
      }
    } catch (err) {
      console.warn('[addBooking] Synced locally:', err);
    }
    return newBooking;
  };

  const createCustomTrip = async (data: any) => {
    try {
      const res = await api.customPlans.save(data);
      if (res?.customPlan) {
        setCustomPlans((prev) => [res.customPlan, ...prev]);
        showToast(`Custom trip #${res.customPlan.id} submitted for agency review.`);
        return res.customPlan;
      }
    } catch (err: any) {
      const id = `VN-TRIP-${Math.floor(10000 + Math.random() * 89999)}`;
      const newPlan = {
        ...data,
        id,
        userId: currentUser?.id || 'usr-traveler',
        userName: currentUser?.name || 'Aayush Pradhan',
        status: 'PENDING_REVIEW',
        createdAt: new Date().toISOString(),
      };
      setCustomPlans((prev) => [newPlan, ...prev]);
      showToast(`Custom trip #${id} submitted for review.`);
      return newPlan;
    }
  };

  const acceptQuotation = async (planId: string, quoteId: string) => {
    try {
      const res = await api.customPlans.acceptQuote(planId, quoteId);
      showToast(`Quotation accepted! Reservation #${res.booking?.id || ''} confirmed.`);
      refreshData();
      refreshCustomPlans();
      return res;
    } catch (err: any) {
      showToast(`Failed to accept quotation: ${err.message}`);
      throw err;
    }
  };

  const rejectQuotation = async (planId: string, quoteId: string, feedback?: string) => {
    try {
      const res = await api.customPlans.rejectQuote(planId, quoteId, feedback);
      showToast(`Quotation declined. Feedback transmitted to operator.`);
      refreshCustomPlans();
      return res;
    } catch (err: any) {
      showToast(`Failed: ${err.message}`);
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
            ...b,
            status: 'Cancelled',
            qrCode: `VN-PASS-${id}-VOID`,
            color: '#EF4444',
          }
          : b
      )
    );
    showToast(`Booking ${id} cancelled and refund initiated.`);

    // Call real backend
    try {
      await api.bookings.cancel(id);
    } catch (err) {
      console.warn('[cancelBooking] Synced locally:', err);
    }
  };

  const addPost = async (content: string, location: string, mediaUrl?: string) => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: currentUser?.name || 'Aayush Pradhan',
      authorAvatar:
        currentUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      authorLocation: location || 'Kathmandu, Nepal',
      timeAgo: 'Just now',
      verified: true,
      content,
      mediaUrl:
        mediaUrl ||
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
      likesCount: 0,
      userReaction: null,
      commentsCount: 0,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    showToast('Your expedition story has been published to the community feed!');

    // Call real backend
    try {
      await api.community.createPost({
        content,
        location,
        mediaUrl: newPost.mediaUrl,
      });
    } catch (err) {
      console.warn('[addPost] Synced locally:', err);
    }
  };

  const toggleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = Boolean(p.userReaction);
        return {
          ...p,
          userReaction: liked ? null : 'love',
          likesCount: liked ? p.likesCount - 1 : p.likesCount + 1,
        };
      })
    );

    // Call real backend
    try {
      await api.community.toggleLike(postId);
    } catch (err) {
      console.warn('[toggleLike] Synced locally:', err);
    }
  };

  const addComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                author: currentUser?.name || 'Aayush Pradhan',
                avatar:
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                text,
                timeAgo: 'Just now',
                likes: 0,
              },
            ],
          }
          : p
      )
    );

    // Call real backend
    try {
      await api.community.addComment(postId, text);
    } catch (err) {
      console.warn('[addComment] Synced locally:', err);
    }
  };

  const sendMessage = async (chatId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
            ...c,
            lastMessage: text,
            lastTime: now,
            unread: 0,
            messages: [
              ...c.messages,
              {
                id: `m_${Date.now()}`,
                sender: currentUser?.name.split(' ')[0] || 'Me',
                text,
                time: now,
                isMe: true,
              },
            ],
          }
          : c
      )
    );

    // Call real backend
    try {
      await api.chat.sendMessage(chatId, text);
    } catch (err) {
      console.warn('[sendMessage] Synced locally:', err);
    }
  };

  const toggleDayComplete = (dayNumber: number) => {
    setScheduleDays((prev) =>
      prev.map((d) =>
        d.day === dayNumber ? { ...d, completed: !d.completed } : d
      )
    );
  };

  const markAllRead = async () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.notifications.markAllRead();
    } catch (err) {
      console.warn('[markAllRead] Synced locally:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        bookings,
        addBooking,
        cancelBooking,
        customPlans,
        refreshCustomPlans,
        createCustomTrip,
        acceptQuotation,
        rejectQuotation,
        posts,
        addPost,
        toggleLike,
        addComment,
        conversations,
        sendMessage,
        scheduleDays,
        toggleDayComplete,
        notificationsList,
        markAllRead,
        toast,
        showToast,
        refreshData,
        logout,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[100] animate-fade-in pointer-events-auto">
          <div className="rounded-2xl bg-[#031526]/95 backdrop-blur-md text-white p-3.5 sm:p-4 shadow-2xl border border-white/15 flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {toast.includes(': ') ? (
                <>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    {toast.split(': ')[0]}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug mt-0.5 break-words">
                    {toast.split(': ').slice(1).join(': ')}
                  </div>
                </>
              ) : (
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug break-words">
                  {toast}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
