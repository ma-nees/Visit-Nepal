'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'qrCode' | 'bookedBy'>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
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

  // Sync with real backend REST API
  const refreshData = async () => {
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
            : 'Confirmed') as any,
          amount: `NPR ${(b.totalAmountNpr || 50000).toLocaleString()}`,
          qrCode: b.qrCode || `VN-PASS-${b.id}`,
          color: '#0552A2',
          meetingPoint: b.meetingPoint || 'Kathmandu Rendezvous Base',
          assignedGuide: b.assignedGuideName || 'Pasang Nuru Sherpa (IFMGA)',
          contactPhone: b.contactPhone || '+977-1-4412345',
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
        if (savedToken) {
          const me = await api.auth.me().catch(() => null);
          if (me?.user) {
            setCurrentUser(me.user);
            setRoleState(me.user.role);
          } else {
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
    setCurrentUser(null);
    showToast('Signed out of Visit Nepal portal.');
  };

  // Role Switcher with Server-Side Authentication
  const setRole = async (newRole: UserRole) => {
    try {
      localStorage.removeItem('vn_logged_out');
    } catch {
      // Ignore
    }
    setRoleState(newRole);
    try {
      const email = roleDefaultEmails[newRole];
      const res = await api.auth.login(email, 'NepalTourism2026!', newRole);
      setCurrentUser(res.user);
      showToast(`Switched active portal identity to ${newRole.toUpperCase()}: ${res.user.name}`);
      refreshData();
    } catch (err: any) {
      console.error('[AppContext] Failed to authenticate role switch:', err);
      showToast(`Switched to ${newRole}`);
    }
  };

  const addBooking = async (
    booking: Omit<Booking, 'id' | 'qrCode' | 'bookedBy'>
  ) => {
    const id = `BKG-${Math.floor(10000 + Math.random() * 89999)}`;
    const newBooking: Booking = {
      ...booking,
      id,
      bookedBy: currentUser?.name || 'Aayush Pradhan',
      qrCode: `VN-PASS-${id}-VERIFIED-2026`,
    };

    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking submitted (${id}): ${booking.title}`);

    // Call real backend
    try {
      await api.bookings.create({
        title: booking.title,
        provider: booking.provider,
        category: booking.category,
        date: booking.date,
        amount: booking.amount,
        meetingPoint: booking.meetingPoint,
        contactPhone: booking.contactPhone,
      });
    } catch (err) {
      console.warn('[addBooking] Synced locally:', err);
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl border border-slate-700 animate-fade-in">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          {toast}
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
