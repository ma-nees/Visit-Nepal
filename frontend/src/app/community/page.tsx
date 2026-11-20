'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  MapPin,
  Tag,
  MoreHorizontal,
  BadgeCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Compass,
  Flame,
  UserPlus,
  UserCheck,
  Flag,
  Edit3,
  Trash2,
  Mountain,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Smile,
  CornerDownRight,
  Camera,
  Layers,
  Check,
  ExternalLink,
  Plus,
  Users,
  Bell,
  CheckCheck,
  Play,
  Film,
  Compass as CompassIcon,
  Tent,
  Utensils,
  Footprints,
  Coffee,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

// Interface definitions matching backend
interface CommentReply {
  id: string;
  authorId?: string;
  author: string;
  authorUsername?: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  likedBy?: string[];
  createdAt?: string;
}

interface PostCommentItem {
  id: string;
  authorId?: string;
  author: string;
  authorUsername?: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  likedBy?: string[];
  parentId?: string | null;
  replies?: CommentReply[];
  createdAt?: string;
}

interface CommunityPostItem {
  id: string;
  authorId?: string;
  authorName: string;
  authorUsername?: string;
  authorAvatar: string;
  authorRole?: string;
  authorVerified?: boolean;
  authorLocation: string;
  timeAgo: string;
  verified: boolean;
  content: string;
  destinationTag?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  hashtags?: string[];
  likesCount: number;
  likedBy?: string[];
  isLiked?: boolean;
  savedBy?: string[];
  isSaved?: boolean;
  commentsCount: number;
  comments: PostCommentItem[];
  sharesCount?: number;
  createdAt?: string;
}

interface StoryItem {
  id: string;
  title: string;
  location: string;
  altitude: string;
  status: string;
  image: string;
  user: string;
  userAvatar: string;
  weather: string;
  timestamp: string;
}

interface TravelGroup {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  image: string;
  description: string;
  isJoined?: boolean;
}

interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

const STORY_DISPATCHES: StoryItem[] = [
  {
    id: 's1',
    title: 'Namche High Base',
    location: 'Namche Bazaar',
    altitude: '3,440m',
    status: 'Live Sun',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    user: 'Pasang Nuru',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    weather: 'Clear Skies • 9°C',
    timestamp: '15m ago',
  },
  {
    id: 's2',
    title: 'Annapurna Sanctuary',
    location: 'ABC Camp',
    altitude: '4,130m',
    status: 'Alpine Dawn',
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=800&q=80',
    user: 'Aayush P.',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    weather: 'Sunburst • -2°C',
    timestamp: '42m ago',
  },
  {
    id: 's3',
    title: 'Thorong La Ridge',
    location: 'Thorong Pass',
    altitude: '5,416m',
    status: 'Pass Open',
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    user: 'Pemba Butler',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    weather: 'Wind 25km/h • -11°C',
    timestamp: '1h ago',
  },
  {
    id: 's4',
    title: 'Gokyo Turquoise',
    location: 'Gokyo 3rd Lake',
    altitude: '4,750m',
    status: 'Frozen Edge',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    user: 'Maya Lama',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    weather: 'Glass Calm • 1°C',
    timestamp: '2h ago',
  },
  {
    id: 's5',
    title: 'Lo Manthang Clay',
    location: 'Upper Mustang',
    altitude: '3,840m',
    status: 'Golden Light',
    image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    user: 'NTB Officer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    weather: 'Dry Plateau • 14°C',
    timestamp: '3h ago',
  },
  {
    id: 's6',
    title: 'Phewa Sunset',
    location: 'Pokhara Lakeside',
    altitude: '820m',
    status: 'Calm Waters',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=800&q=80',
    user: 'Himalayan Expeditions',
    userAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    weather: 'Gentle Breeze • 21°C',
    timestamp: '4h ago',
  },
];

const PRESET_DESTINATIONS = [
  'Everest Region',
  'Annapurna Circuit',
  'Langtang Valley',
  'Upper Mustang',
  'Kathmandu Valley',
  'Pokhara & Lakes',
  'Manaslu Circuit',
  'Chitwan National Park',
  'Dolpo & Karnali',
  'Kanchenjunga',
];

const EXPLORE_CATEGORIES = [
  { id: 'all', label: 'All Dispatches', icon: Compass },
  { id: 'trekking', label: 'Trekking', icon: Mountain },
  { id: 'adventure', label: 'Adventure', icon: Flame },
  { id: 'culture', label: 'Culture', icon: Sparkles },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'wildlife', label: 'Wildlife', icon: Footprints },
  { id: 'photography', label: 'Photography', icon: Camera },
];

const INITIAL_GROUPS: TravelGroup[] = [
  {
    id: 'grp_1',
    name: 'Everest Base Camp & High Passes 2026',
    category: 'Trekking & Alpine',
    membersCount: 842,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    description: 'Active climbers, guides and solo hikers sharing Khumbu trail conditions, weather dispatches and tea house reviews.',
    isJoined: true,
  },
  {
    id: 'grp_2',
    name: 'Annapurna Circuit Independent Trekkers',
    category: 'Adventure',
    membersCount: 620,
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=600&q=80',
    description: 'For travelers tackling Thorong La Pass, Tilicho Lake, and Poon Hill without commercial agencies.',
    isJoined: false,
  },
  {
    id: 'grp_3',
    name: 'Upper Mustang & Lo Manthang Cultural Circle',
    category: 'Culture & Heritage',
    membersCount: 310,
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80',
    description: 'Exploring ancient Tibetan Buddhist monasteries, cave settlements, and sacred walled cities in the rain shadow.',
    isJoined: false,
  },
  {
    id: 'grp_4',
    name: 'Nepal Alpine Photographers Guild',
    category: 'Photography',
    membersCount: 495,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Astrophotography, dawn mountain vistas, telephoto framing, and golden hour tips across the eight-thousanders.',
    isJoined: true,
  },
  {
    id: 'grp_5',
    name: 'Kathmandu Valley Culinary & Street Walkers',
    category: 'Food & Culture',
    membersCount: 380,
    image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=600&q=80',
    description: 'Newari feasts, momo trails, choila hubs, and hidden teahouse basements across Patan, Bhaktapur, and Asan.',
    isJoined: false,
  },
];

const QUICK_HASHTAGS = [
  '#VisitNepal',
  '#NepalTravel',
  '#HimalayanAdventure',
  '#EverestBaseCamp',
  '#AnnapurnaCircuit',
  '#ExploreNepal',
  '#NepalDiaries',
];

export default function CommunityPage() {
  const { currentUser, showToast } = useApp();

  // Navigation View State (Left Sidebar 8 items)
  // 'home' | 'travelers' | 'profile' | 'my-posts' | 'saved' | 'liked' | 'groups' | 'destinations'
  const [activeNav, setActiveNav] = useState<
    'home' | 'travelers' | 'profile' | 'my-posts' | 'saved' | 'liked' | 'groups' | 'destinations'
  >('home');

  // Primary Feed States
  const [posts, setPosts] = useState<CommunityPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'following' | 'saved' | 'popular' | 'media'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Travel Groups State
  const [groups, setGroups] = useState<TravelGroup[]>(INITIAL_GROUPS);

  // Trending & Discovery States
  const [trending, setTrending] = useState<{
    trendingDestinations: { name: string; count: number; tag: string }[];
    trendingHashtags: { tag: string; count: number }[];
    suggestedTravelers: any[];
    popularPosts: any[];
  }>({
    trendingDestinations: [],
    trendingHashtags: [],
    suggestedTravelers: [],
    popularPosts: [],
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Carousel slider indices
  const [currentSlideIndex, setCurrentSlideIndex] = useState<Record<string, number>>({});

  // Bursting Heart Animation state
  const [heartBurstPostId, setHeartBurstPostId] = useState<string | null>(null);

  // Comments & Replies state
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // Dropdown menus
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);

  // Create Post Section State
  const [isCreateExpanded, setIsCreateExpanded] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDestination, setNewDestination] = useState('Everest Region');
  const [newMediaUrls, setNewMediaUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newMediaInput, setNewMediaInput] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newHashtagInput, setNewHashtagInput] = useState('');
  const [newHashtags, setNewHashtags] = useState<string[]>(['#VisitNepal', '#NepalTravel']);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // User Profile Modal States
  const [profileModalUserId, setProfileModalUserId] = useState<string | null>(null);
  const [profileModalData, setProfileModalData] = useState<{ user: any; posts: any[]; isFollowing: boolean } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Edit Post Modal
  const [editingPost, setEditingPost] = useState<CommunityPostItem | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostLocation, setEditPostLocation] = useState('');
  const [editPostDestination, setEditPostDestination] = useState('');
  const [isSavingPostEdit, setIsSavingPostEdit] = useState(false);

  // Report Modal
  const [reportingPost, setReportingPost] = useState<CommunityPostItem | null>(null);
  const [reportReason, setReportReason] = useState('Misleading trail or weather information');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Story Viewer Modal
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  // Fetch Posts from Backend API
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      let feedParam = activeFeedTab;
      if (activeNav === 'saved') feedParam = 'saved';
      if (activeNav === 'my-posts') feedParam = 'all';

      const res = await api.community.getPosts({
        feed: feedParam,
        q: searchQuery || (selectedCategory !== 'all' ? selectedCategory : undefined),
        tag: selectedTag || undefined,
        destination: selectedDestination || undefined,
        authorId: activeNav === 'my-posts' ? (currentUser?.id || 'usr-traveler') : undefined,
      });

      if (res && Array.isArray(res.posts)) {
        let list = res.posts as CommunityPostItem[];
        if (activeNav === 'liked') {
          list = list.filter((p) => p.isLiked);
        }
        setPosts(list);
      }
    } catch (err: any) {
      console.warn('[Community] Failed to fetch live posts:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrending = async () => {
    try {
      const data = await api.community.getTrending();
      if (data) {
        setTrending(data);
      }
    } catch (err: any) {
      console.warn('[Community] Failed to fetch trending:', err.message);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await api.notifications.list();
      if (res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications as NotificationData[]);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err: any) {
      // Offline fallback
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeFeedTab, selectedTag, selectedDestination, selectedCategory, activeNav]);

  useEffect(() => {
    loadTrending();
    loadNotifications();
  }, []);

  // Handle Search Input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuPostId(null);
      setIsNotifOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Carousel Navigation
  const getMediaList = (post: CommunityPostItem): string[] => {
    if (post.mediaUrls && post.mediaUrls.length > 0) return post.mediaUrls;
    if (post.mediaUrl) return [post.mediaUrl];
    return ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'];
  };

  const handlePrevSlide = (postId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => {
      const cur = prev[postId] || 0;
      return { ...prev, [postId]: cur > 0 ? cur - 1 : total - 1 };
    });
  };

  const handleNextSlide = (postId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlideIndex((prev) => {
      const cur = prev[postId] || 0;
      return { ...prev, [postId]: cur < total - 1 ? cur + 1 : 0 };
    });
  };

  // Toggle Like with Instant Optimistic UI + Server Sync
  const handleToggleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nowLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nowLiked,
          likesCount: nowLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      })
    );

    try {
      const res = await api.community.toggleLike(postId);
      if (res) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isLiked: res.liked, likesCount: res.likesCount } : p))
        );
      }
      loadNotifications();
    } catch (err: any) {
      showToast('Action saved locally.');
    }
  };

  // Double click photo to like with animated heart burst
  const handleImageDoubleClick = (postId: string) => {
    setHeartBurstPostId(postId);
    setTimeout(() => setHeartBurstPostId(null), 900);
    const post = posts.find((p) => p.id === postId);
    if (post && !post.isLiked) {
      handleToggleLike(postId);
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nowSaved = !p.isSaved;
        return {
          ...p,
          isSaved: nowSaved,
        };
      })
    );

    try {
      const res = await api.community.toggleSave(postId);
      if (res) {
        showToast(res.saved ? 'Post saved to your collection!' : 'Removed from saved collection.');
      }
    } catch (err: any) {
      showToast('Saved state updated.');
    }
  };

  // Share Post (Copy Link & Toast)
  const handleSharePost = (post: CommunityPostItem) => {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Dispatch link copied to clipboard!');
    } else {
      showToast('Shared: ' + url);
    }
  };

  // Add Comment Submit
  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const tempComment: PostCommentItem = {
      id: `c_temp_${Date.now()}`,
      author: currentUser?.name || 'Aayush Pradhan',
      authorUsername: 'aayush_trekker',
      avatar:
        currentUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text,
      timeAgo: 'Just now',
      likes: 0,
      replies: [],
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), tempComment],
        };
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

    try {
      const res = await api.community.addComment(postId, { text });
      if (res && res.post) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? (res.post as CommunityPostItem) : p)));
      }
      showToast('Comment posted!');
      loadNotifications();
    } catch (err: any) {
      showToast('Comment added.');
    }
  };

  // Add Reply Submit
  const handleAddReply = async (postId: string, commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = replyInputs[commentId]?.trim();
    if (!text) return;

    try {
      const res = await api.community.addComment(postId, { text, parentId: commentId });
      if (res && res.post) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? (res.post as CommunityPostItem) : p)));
      }
      setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
      setActiveReplyId(null);
      setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
      showToast('Reply published!');
      loadNotifications();
    } catch (err: any) {
      showToast('Reply added.');
    }
  };

  // Toggle Comment Like
  const handleToggleCommentLike = async (postId: string, commentId: string) => {
    try {
      const res = await api.community.toggleCommentLike(postId, commentId);
      if (res) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, likes: res.likesCount, likedBy: res.liked ? ['me'] : [] } : c
              ),
            };
          })
        );
      }
    } catch (err: any) {
      // Ignore
    }
  };

  // Delete Comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await api.community.deleteComment(postId, commentId);
      if (res && res.post) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? (res.post as CommunityPostItem) : p)));
      } else {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              commentsCount: Math.max(0, p.commentsCount - 1),
              comments: p.comments.filter((c) => c.id !== commentId),
            };
          })
        );
      }
      showToast('Comment deleted.');
    } catch (err: any) {
      showToast('Failed to delete comment.');
    }
  };

  // Quick Emoji Injector
  const handleInsertEmoji = (postId: string, emoji: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: (prev[postId] || '') + emoji,
    }));
  };

  // Create Post Submit
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      showToast('Please write your Nepal expedition dispatch story.');
      return;
    }

    setIsSubmittingPost(true);
    try {
      const finalMedia =
        newMediaType === 'video' && newVideoUrl.trim()
          ? [newVideoUrl.trim()]
          : newMediaUrls.filter((u) => u.trim().length > 0);

      const res = await api.community.createPost({
        content: newContent,
        location: newLocation || 'Kathmandu, Nepal',
        destinationTag: newDestination,
        mediaUrls: finalMedia,
        mediaType: newMediaType,
        hashtags: newHashtags,
      });

      if (res && res.post) {
        setPosts((prev) => [res.post as CommunityPostItem, ...prev]);
      }
      showToast('Your Himalayan dispatch has been published live!');
      // Reset form
      setNewContent('');
      setNewLocation('');
      setNewVideoUrl('');
      setIsCreateExpanded(false);
      loadTrending();
      loadNotifications();
    } catch (err: any) {
      showToast('Failed to publish post: ' + err.message);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Add photo URL to create post gallery
  const handleAddPhotoUrl = () => {
    if (!newMediaInput.trim()) return;
    setNewMediaUrls((prev) => [...prev, newMediaInput.trim()]);
    setNewMediaInput('');
  };

  const handleRemovePhotoUrl = (idx: number) => {
    setNewMediaUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddHashtag = (tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!newHashtags.includes(formatted)) {
      setNewHashtags((prev) => [...prev, formatted]);
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setNewHashtags((prev) => prev.filter((t) => t !== tag));
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to permanently delete this expedition dispatch?')) return;
    try {
      await api.community.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast('Dispatch deleted successfully.');
      loadTrending();
    } catch (err: any) {
      showToast('Failed to delete post: ' + err.message);
    }
  };

  // Open Edit Post
  const handleOpenEditPost = (post: CommunityPostItem) => {
    setEditingPost(post);
    setEditPostContent(post.content);
    setEditPostLocation(post.authorLocation || '');
    setEditPostDestination(post.destinationTag || 'Everest Region');
  };

  // Save Edit Post
  const handleSaveEditPost = async () => {
    if (!editingPost) return;
    setIsSavingPostEdit(true);
    try {
      const res = await api.community.editPost(editingPost.id, {
        content: editPostContent,
        location: editPostLocation,
        destinationTag: editPostDestination,
      });

      if (res && res.post) {
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? (res.post as CommunityPostItem) : p)));
      }
      showToast('Dispatch updated successfully.');
      setEditingPost(null);
    } catch (err: any) {
      showToast('Failed to update dispatch: ' + err.message);
    } finally {
      setIsSavingPostEdit(false);
    }
  };

  // Submit Report
  const handleSubmitReport = async () => {
    if (!reportingPost) return;
    setIsSubmittingReport(true);
    try {
      await api.community.reportPost(reportingPost.id, reportReason, reportDetails);
      showToast('Report submitted to Nepal Tourism Board moderation team.');
      setReportingPost(null);
      setReportDetails('');
    } catch (err: any) {
      showToast('Failed to submit report.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Open User Profile Modal
  const handleOpenUserProfile = async (userId: string) => {
    setProfileModalUserId(userId);
    setIsLoadingProfile(true);
    try {
      const data = await api.community.getUserProfile(userId);
      setProfileModalData(data);
    } catch (err: any) {
      console.warn('[Community] Profile fetch error:', err.message);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Toggle Follow
  const handleToggleFollow = async (userId: string) => {
    try {
      const res = await api.community.toggleFollow(userId);
      if (res) {
        showToast(res.following ? 'You are now following this traveler!' : 'Unfollowed.');
        if (profileModalData && profileModalData.user?.id === userId) {
          setProfileModalData((prev) => (prev ? { ...prev, isFollowing: res.following } : null));
        }
        setTrending((prev) => ({
          ...prev,
          suggestedTravelers: prev.suggestedTravelers.map((t) =>
            t.id === userId ? { ...t, isFollowing: res.following } : t
          ),
        }));
        loadNotifications();
      }
    } catch (err: any) {
      showToast('Follow state updated.');
    }
  };

  // Toggle Group Membership
  const handleToggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const joined = !g.isJoined;
        showToast(joined ? `Joined "${g.name}" circle!` : `Left "${g.name}".`);
        return {
          ...g,
          isJoined: joined,
          membersCount: joined ? g.membersCount + 1 : g.membersCount - 1,
        };
      })
    );
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read.');
    } catch (err: any) {
      // Ignore
    }
  };

  // Open Edit Profile Modal
  const handleOpenEditProfile = () => {
    if (profileModalData?.user) {
      setEditBio(profileModalData.user.bio || '');
      setEditLocation(profileModalData.user.location || '');
      setEditInterests((profileModalData.user.travelInterests || []).join(', '));
      setEditAvatarUrl(profileModalData.user.avatarUrl || '');
      setEditCoverUrl(profileModalData.user.coverUrl || '');
    }
    setIsEditProfileOpen(true);
  };

  // Save Edit Profile
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const interestsArray = editInterests
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const res = await api.community.updateProfile({
        bio: editBio,
        location: editLocation,
        travelInterests: interestsArray,
        avatarUrl: editAvatarUrl || undefined,
        coverUrl: editCoverUrl || undefined,
      });

      if (res && res.user) {
        setProfileModalData((prev) => (prev ? { ...prev, user: res.user } : null));
        showToast('Community profile updated successfully.');
      }
      setIsEditProfileOpen(false);
    } catch (err: any) {
      showToast('Failed to update profile: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Filter Reset
  const clearFilters = () => {
    setSelectedTag(null);
    setSelectedDestination(null);
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveFeedTab('all');
    setActiveNav('home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-800 antialiased">
      {/* =========================================================================
          TOP BANNER: Official Visit Nepal Community Header with Live Notification Bell
          ========================================================================= */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-shadow duration-200 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveNav('home');
                clearFilters();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0552A2] to-[#044182] text-white shadow-sm ring-2 ring-blue-100 hover:scale-105 transition-transform"
            >
              <Compass className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-poppins text-lg font-black tracking-tight text-slate-900">
                  Visit Nepal <span className="text-[#0552A2]">Social</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0552A2] ring-1 ring-blue-200/60">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live Dispatches 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Himalayan trail updates, high-altitude photo dispatches, and real traveler stories.
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Notification Bell & Create Dispatch */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotifOpen(!isNotifOpen);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EC1F27] text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {isNotifOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-11 z-40 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 animate-subtle-fade-up"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 px-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Bell className="h-3.5 w-3.5 text-[#0552A2]" />
                      <span>Community Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-semibold text-[#0552A2] hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto space-y-1.5 divide-y divide-slate-50">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                            !n.isRead ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[#0552A2] shrink-0 text-xs">
                            {n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : n.type === 'follow' ? '👤' : '🔔'}
                          </span>
                          <div className="flex-1 text-[11px] leading-snug">
                            <div className="font-bold text-slate-900">{n.title}</div>
                            <div className="text-slate-600 font-normal mt-0.5">{n.body}</div>
                            <div className="text-[9px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setActiveNav('home');
                setIsCreateExpanded(true);
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#044182] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Dispatch</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN 3-COLUMN LAYOUT
          ========================================================================= */}
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* =====================================================================
              LEFT SIDEBAR (col-span-3): Navigation & Traveler Profile Card
              ===================================================================== */}
          <aside className="lg:col-span-3 space-y-4">
            {/* User Mini-Profile Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              {/* Cover Banner */}
              <div className="h-20 w-full bg-gradient-to-r from-[#0552A2] via-[#0D9488] to-[#92C4EA] relative">
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Profile Details */}
              <div className="relative px-4 pb-4 pt-0">
                <div className="flex justify-between items-end -mt-10 mb-2">
                  <div className="relative">
                    <img
                      src={
                        currentUser?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={currentUser?.name || 'Aayush Pradhan'}
                      className="h-16 w-16 rounded-full border-3 border-white object-cover shadow-md ring-2 ring-blue-500/20"
                    />
                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenUserProfile(currentUser?.id || 'usr_traveler')}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
                  >
                    My Profile
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-poppins text-sm font-bold text-slate-900">
                      {currentUser?.name || 'Aayush Pradhan'}
                    </h3>
                    <BadgeCheck className="h-4 w-4 text-[#0552A2]" />
                  </div>
                  <p className="text-xs text-slate-500">@aayush_trekker</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">
                    Passionate Himalayan explorer, photographer & high pass enthusiast. Exploring Nepal 2026.
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="mt-3.5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-2 text-center">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      {posts.filter((p) => p.authorId === (currentUser?.id || 'usr_traveler')).length || 14}
                    </span>
                    <span className="text-[10px] text-slate-500">Dispatches</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">1.2k</span>
                    <span className="text-[10px] text-slate-500">Followers</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">482</span>
                    <span className="text-[10px] text-slate-500">Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Community Navigation Menu (8 Items as Specified) */}
            <nav className="rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xs">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Community Navigation
              </div>
              <ul className="space-y-0.5">
                {/* 1. Community Home */}
                <li>
                  <button
                    onClick={() => {
                      setActiveNav('home');
                      clearFilters();
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'home' && !selectedTag && !selectedDestination
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className="h-4 w-4" />
                      <span>Community Home</span>
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-2xs">
                      {posts.length}
                    </span>
                  </button>
                </li>

                {/* 2. Explore Travelers */}
                <li>
                  <button
                    onClick={() => setActiveNav('travelers')}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'travelers'
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="h-4 w-4 text-[#0D9488]" />
                      <span>Explore Travelers</span>
                    </div>
                  </button>
                </li>

                {/* 3. My Profile */}
                <li>
                  <button
                    onClick={() => handleOpenUserProfile(currentUser?.id || 'usr_traveler')}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="h-4 w-4 text-[#0552A2]" />
                      <span>My Profile</span>
                    </div>
                  </button>
                </li>

                {/* 4. My Posts */}
                <li>
                  <button
                    onClick={() => {
                      setActiveNav('my-posts');
                      setSelectedTag(null);
                      setSelectedDestination(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'my-posts'
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="h-4 w-4 text-[#0552A2]" />
                      <span>My Posts</span>
                    </div>
                  </button>
                </li>

                {/* 5. Saved Posts */}
                <li>
                  <button
                    onClick={() => {
                      setActiveNav('saved');
                      setSelectedTag(null);
                      setSelectedDestination(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'saved'
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="h-4 w-4 text-[#FDB716]" />
                      <span>Saved Posts</span>
                    </div>
                  </button>
                </li>

                {/* 6. Liked Posts */}
                <li>
                  <button
                    onClick={() => {
                      setActiveNav('liked');
                      setSelectedTag(null);
                      setSelectedDestination(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'liked'
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="h-4 w-4 text-[#EC1F27]" />
                      <span>Liked Posts</span>
                    </div>
                  </button>
                </li>

                {/* 7. Travel Groups */}
                <li>
                  <button
                    onClick={() => setActiveNav('groups')}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'groups'
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Tent className="h-4 w-4 text-[#16A34A]" />
                      <span>Travel Groups</span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      5 Active
                    </span>
                  </button>
                </li>

                {/* 8. Popular Destinations */}
                <li>
                  <button
                    onClick={() => setActiveNav('destinations')}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      activeNav === 'destinations'
                        ? 'bg-blue-50 text-[#0552A2]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Mountain className="h-4 w-4 text-[#9333EA]" />
                      <span>Popular Destinations</span>
                    </div>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Himalayan Trail Safety Widget */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0552A2]">
                <ShieldCheck className="h-4 w-4" />
                <span>NTB Mountain Watch</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                Live condition reports are cross-verified by IFMGA certified guides and Nepal Tourism Board checkposts.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-blue-200/60 pt-2.5 text-[11px]">
                <span className="font-semibold text-slate-700">High Passes Open</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700">7 of 8 Clear</span>
              </div>
            </div>
          </aside>

          {/* =====================================================================
              CENTER COLUMN (col-span-6): Story Highlights, Views & Social Feed
              ===================================================================== */}
          <section className="lg:col-span-6 space-y-4">
            {/* VIEW A: DEDICATED EXPLORE TRAVELERS DIRECTORY */}
            {activeNav === 'travelers' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-poppins text-base font-bold text-slate-900">
                        Explore Himalayan Travelers
                      </h2>
                      <p className="text-xs text-slate-500">
                        Connect with IFMGA guides, expedition organizers, solo trekkers, and local sherpas.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav('home')}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      Back to Feed
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(trending.suggestedTravelers.length > 0
                      ? trending.suggestedTravelers
                      : [
                          {
                            id: 'usr-guide',
                            name: 'Pasang Nuru Sherpa',
                            username: 'pasang_sherpa',
                            role: 'NMA Certified Guide',
                            bio: 'Lead mountain guide on Everest & Annapurna. 18 successful summits.',
                            avatarUrl:
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                            isFollowing: false,
                          },
                          {
                            id: 'usr-butler',
                            name: 'Pemba Butler',
                            username: 'pemba_sherpa',
                            role: 'High Camp Butler',
                            bio: 'Luxury mountain hospitality and helicopter rendezvous logistics.',
                            avatarUrl:
                              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                            isFollowing: false,
                          },
                          {
                            id: 'usr-business',
                            name: 'Himalayan Expeditions',
                            username: 'himalayan_expeditions',
                            role: 'Licensed Operator',
                            bio: 'Eco-certified mountaineering logistics and tea house trekking since 1998.',
                            avatarUrl:
                              'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
                            isFollowing: true,
                          },
                          {
                            id: 'usr-admin',
                            name: 'Nepal Tourism Board Desk',
                            username: 'officer_ntb',
                            role: 'Official Verification Officer',
                            bio: 'Official monitoring desk for TIMS permits, conservation passes & safety.',
                            avatarUrl:
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
                            isFollowing: true,
                          },
                        ]
                    ).map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-200/80 p-3.5 flex flex-col justify-between bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={t.avatarUrl}
                            alt={t.name}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-blue-100"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-bold text-xs text-slate-900 truncate">{t.name}</h4>
                              <BadgeCheck className="h-3.5 w-3.5 text-[#0552A2] shrink-0" />
                            </div>
                            <div className="text-[10px] text-slate-400">@{t.username}</div>
                            <div className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                              {t.bio || t.role}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleOpenUserProfile(t.id)}
                            className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => handleToggleFollow(t.id)}
                            className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold text-white transition-all ${
                              t.isFollowing
                                ? 'bg-slate-700 hover:bg-slate-800'
                                : 'bg-[#0552A2] hover:bg-[#044182]'
                            }`}
                          >
                            {t.isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: TRAVEL GROUPS & CIRCLES */}
            {activeNav === 'groups' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-poppins text-base font-bold text-slate-900">
                        Himalayan Travel Groups & Circles
                      </h2>
                      <p className="text-xs text-slate-500">
                        Join expedition groups, solo hiker forums, and regional cultural circles.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav('home')}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      Back to Feed
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {groups.map((grp) => (
                      <div
                        key={grp.id}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={grp.image}
                            alt={grp.name}
                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-[#0552A2] uppercase tracking-wider mb-1">
                              {grp.category}
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{grp.name}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2 max-w-md">
                              {grp.description}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                              <Users className="h-3 w-3" />
                              <span>{grp.membersCount} active travelers</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleJoinGroup(grp.id)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 w-full sm:w-auto ${
                            grp.isJoined
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-[#0552A2] text-white hover:bg-[#044182]'
                          }`}
                        >
                          {grp.isJoined ? 'Joined Group' : 'Join Circle'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW C: POPULAR DESTINATIONS DIRECTORY */}
            {activeNav === 'destinations' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-poppins text-base font-bold text-slate-900">
                        Popular Nepal Destinations
                      </h2>
                      <p className="text-xs text-slate-500">
                        Click any destination to filter live trail updates and traveler dispatches.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNav('home')}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                    >
                      Back to Feed
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'Everest Region', altitude: '8,848m', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', count: 48 },
                      { name: 'Annapurna Circuit', altitude: '5,416m', image: 'https://images.unsplash.com/photo-1582650625119-3a31f84183fe?auto=format&fit=crop&w=600&q=80', count: 35 },
                      { name: 'Upper Mustang', altitude: '3,840m', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80', count: 22 },
                      { name: 'Pokhara & Lakes', altitude: '820m', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=600&q=80', count: 19 },
                      { name: 'Langtang Valley', altitude: '4,984m', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', count: 15 },
                      { name: 'Kathmandu Valley', altitude: '1,400m', image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=600&q=80', count: 28 },
                    ].map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => {
                          setSelectedDestination(dest.name);
                          setActiveNav('home');
                        }}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900 text-left"
                      >
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                          <span className="text-[10px] text-white/80">{dest.altitude}</span>
                          <span className="font-bold text-xs">{dest.name}</span>
                          <span className="text-[9px] text-blue-300 font-semibold">{dest.count} dispatches</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DEFAULT SOCIAL FEED (For Home, My Posts, Saved, Liked) */}
            {(activeNav === 'home' || activeNav === 'my-posts' || activeNav === 'saved' || activeNav === 'liked') && (
              <>
                {/* 1. INSTAGRAM STORY HIGHLIGHTS */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Live Trail Stories
                    </span>
                    <span className="text-[10px] font-medium text-[#0552A2]">Updated real-time</span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                    {STORY_DISPATCHES.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => setActiveStory(story)}
                        className="group flex flex-col items-center gap-1.5 shrink-0 transition-transform hover:scale-105"
                      >
                        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FDB716] via-[#EC1F27] to-[#0552A2] shadow-sm">
                          <div className="rounded-full bg-white p-0.5">
                            <img
                              src={story.image}
                              alt={story.title}
                              className="h-14 w-14 rounded-full object-cover ring-1 ring-slate-100"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0552A2] text-white ring-1 ring-white">
                            <Mountain className="h-2 w-2" />
                          </span>
                        </div>
                        <span className="w-16 truncate text-center text-[10px] font-semibold text-slate-700 group-hover:text-[#0552A2]">
                          {story.location}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. PROMINENT CREATE POST SECTION */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        currentUser?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={currentUser?.name || 'Aayush Pradhan'}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        rows={isCreateExpanded ? 3 : 2}
                        value={newContent}
                        onFocus={() => setIsCreateExpanded(true)}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Share your Nepal adventure, trail report, or high pass conditions..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-[#0552A2] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0552A2]"
                      />

                      {/* Expanded Post Controls */}
                      {isCreateExpanded && (
                        <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                          {/* Media Type Switcher: Photo or Video */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setNewMediaType('image')}
                              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                newMediaType === 'image'
                                  ? 'bg-[#0552A2] text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                              <span>Photos Gallery</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewMediaType('video')}
                              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                newMediaType === 'video'
                                  ? 'bg-[#0552A2] text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <VideoIcon className="h-3.5 w-3.5" />
                              <span>Video Dispatch</span>
                            </button>
                          </div>

                          {/* Location & Destination Tag */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="relative">
                              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                              <input
                                type="text"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                placeholder="Location (e.g. Dingboche, 4,410m)"
                                className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-2.5 text-xs focus:border-[#0552A2] focus:outline-none"
                              />
                            </div>
                            <div className="relative">
                              <Mountain className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                              <select
                                value={newDestination}
                                onChange={(e) => setNewDestination(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-2.5 text-xs text-slate-700 focus:border-[#0552A2] focus:outline-none bg-white"
                              >
                                {PRESET_DESTINATIONS.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Video Link Option */}
                          {newMediaType === 'video' ? (
                            <div className="space-y-1.5 rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <VideoIcon className="h-3.5 w-3.5 text-[#0552A2]" />
                                Video URL (YouTube, Vimeo, MP4)
                              </label>
                              <input
                                type="text"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                placeholder="Paste video URL (e.g. https://www.youtube.com/watch?v=...)"
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-[#0552A2] focus:outline-none"
                              />
                            </div>
                          ) : (
                            /* Photo Gallery Manager */
                            <div className="space-y-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                  <ImageIcon className="h-3.5 w-3.5 text-[#0552A2]" />
                                  Attach Photographs ({newMediaUrls.length})
                                </span>
                                <span className="text-[10px] text-slate-400">Multiple photos supported</span>
                              </div>

                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={newMediaInput}
                                  onChange={(e) => setNewMediaInput(e.target.value)}
                                  placeholder="Paste direct image or Unsplash URL..."
                                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs focus:border-[#0552A2] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddPhotoUrl}
                                  className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                                >
                                  Add
                                </button>
                              </div>

                              {newMediaUrls.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {newMediaUrls.map((url, idx) => (
                                    <div
                                      key={idx}
                                      className="relative group h-14 w-14 rounded-lg overflow-hidden border border-slate-200"
                                    >
                                      <img
                                        src={url}
                                        alt={`Upload ${idx + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePhotoUrl(idx)}
                                        className="absolute top-0.5 right-0.5 rounded-full bg-black/70 p-0.5 text-white hover:bg-red-600 transition-colors"
                                      >
                                        <X className="h-2.5 w-2.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Hashtags Row */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                              <Tag className="h-3 w-3 text-[#0552A2]" />
                              <span>Add Hashtags:</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {QUICK_HASHTAGS.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() =>
                                    newHashtags.includes(tag) ? handleRemoveHashtag(tag) : handleAddHashtag(tag)
                                  }
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all ${
                                    newHashtags.includes(tag)
                                      ? 'bg-[#0552A2] text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions & Submit Bar */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateExpanded(true);
                              setNewMediaType('image');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-[#0552A2]" />
                            <span className="hidden sm:inline">Photos</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateExpanded(true);
                              setNewMediaType('video');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            <VideoIcon className="h-3.5 w-3.5 text-[#EC1F27]" />
                            <span className="hidden sm:inline">Video</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCreateExpanded && (
                            <button
                              type="button"
                              onClick={() => setIsCreateExpanded(false)}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleCreatePost}
                            disabled={isSubmittingPost || !newContent.trim()}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0552A2] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#044182] disabled:opacity-50 active:scale-95"
                          >
                            {isSubmittingPost ? (
                              <span>Publishing...</span>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                <span>Share Dispatch</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. EXPLORE CATEGORIES PILLS (Trekking, Adventure, Culture, Food, Wildlife, Photography) */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {EXPLORE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-[#0552A2] text-white shadow-2xs'
                            : 'bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 4. ACTIVE FILTER CHIPS */}
                {(selectedTag || selectedDestination || searchQuery || activeNav !== 'home') && (
                  <div className="flex items-center gap-2 rounded-xl bg-blue-50/80 px-3 py-1.5 text-xs text-[#0552A2] border border-blue-200/60">
                    <span className="font-semibold">Showing:</span>
                    {activeNav !== 'home' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-bold shadow-2xs capitalize">
                        {activeNav.replace('-', ' ')}
                      </span>
                    )}
                    {selectedTag && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-bold shadow-2xs">
                        #{selectedTag}
                        <button onClick={() => setSelectedTag(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedDestination && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-bold shadow-2xs">
                        {selectedDestination}
                        <button onClick={() => setSelectedDestination(null)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-bold shadow-2xs">
                        "{searchQuery}"
                        <button onClick={() => setSearchQuery('')}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="ml-auto text-[11px] font-bold underline hover:text-[#044182]"
                    >
                      Reset All
                    </button>
                  </div>
                )}

                {/* 5. POSTS FEED LIST */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-28 rounded bg-slate-200" />
                            <div className="h-2 w-16 rounded bg-slate-200" />
                          </div>
                        </div>
                        <div className="h-64 w-full rounded-xl bg-slate-200" />
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
                    <Mountain className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-2 text-sm font-bold text-slate-800">No dispatches found</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Be the first to share an expedition update or reset your filter parameters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 rounded-xl bg-[#0552A2] px-4 py-2 text-xs font-bold text-white hover:bg-[#044182]"
                    >
                      View All Dispatches
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {posts.map((post) => {
                      const mediaList = getMediaList(post);
                      const activeIndex = currentSlideIndex[post.id] || 0;
                      const isOwnPost =
                        post.authorId === (currentUser?.id || 'usr-traveler') ||
                        post.authorName === (currentUser?.name || 'Aayush Pradhan');

                      return (
                        <article
                          key={post.id}
                          id={post.id}
                          className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-shadow duration-200 hover:shadow-sm"
                        >
                          {/* Post Header */}
                          <div className="flex items-center justify-between p-3.5 sm:p-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleOpenUserProfile(post.authorId || 'usr_traveler')}
                                className="relative group focus:outline-none"
                              >
                                <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#0552A2] to-[#92C4EA]">
                                  <img
                                    src={post.authorAvatar}
                                    alt={post.authorName}
                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                  />
                                </div>
                              </button>

                              <div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenUserProfile(post.authorId || 'usr_traveler')}
                                    className="font-poppins text-xs sm:text-sm font-bold text-slate-900 hover:text-[#0552A2] transition-colors"
                                  >
                                    {post.authorName}
                                  </button>
                                  {post.verified && (
                                    <BadgeCheck className="h-4 w-4 text-[#0552A2] shrink-0" />
                                  )}
                                  {post.authorUsername && (
                                    <span className="text-xs text-slate-400 font-normal">
                                      @{post.authorUsername}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                  <MapPin className="h-3 w-3 text-[#EC1F27] shrink-0" />
                                  <span className="truncate max-w-[180px] sm:max-w-xs">{post.authorLocation}</span>
                                  <span>•</span>
                                  <span>{post.timeAgo}</span>
                                  {post.destinationTag && (
                                    <>
                                      <span>•</span>
                                      <span className="inline-flex items-center gap-0.5 text-[#0552A2] font-semibold">
                                        <Mountain className="h-2.5 w-2.5" />
                                        {post.destinationTag}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Post 3-Dots Menu */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id);
                                }}
                                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>

                              {activeMenuPostId === post.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
                                >
                                  <button
                                    onClick={() => {
                                      handleSharePost(post);
                                      setActiveMenuPostId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                                  >
                                    <Share2 className="h-3.5 w-3.5" />
                                    <span>Copy Link</span>
                                  </button>

                                  {isOwnPost ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          handleOpenEditPost(post);
                                          setActiveMenuPostId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                                      >
                                        <Edit3 className="h-3.5 w-3.5 text-[#0552A2]" />
                                        <span>Edit Dispatch</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleDeletePost(post.id);
                                          setActiveMenuPostId(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete Post</span>
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setReportingPost(post);
                                        setActiveMenuPostId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                                    >
                                      <Flag className="h-3.5 w-3.5" />
                                      <span>Report to NTB</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Post Description / Caption with Highlighted Hashtags */}
                          <div className="px-4 pb-3 text-xs sm:text-[13px] leading-relaxed text-slate-800">
                            <p className="whitespace-pre-line">{post.content}</p>

                            {/* Clickable Hashtags */}
                            {post.hashtags && post.hashtags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {post.hashtags.map((h, hIdx) => {
                                  const clean = h.replace(/^#/, '');
                                  return (
                                    <button
                                      key={hIdx}
                                      onClick={() => setSelectedTag(clean)}
                                      className="text-xs font-semibold text-[#0552A2] hover:underline"
                                    >
                                      {h.startsWith('#') ? h : `#${h}`}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Post Media: Photos Carousel or Video Player */}
                          {post.mediaType === 'video' && post.mediaUrl ? (
                            <div className="relative overflow-hidden bg-slate-950 aspect-[16/9]">
                              <iframe
                                src={
                                  post.mediaUrl.includes('youtube') || post.mediaUrl.includes('youtu.be')
                                    ? post.mediaUrl.replace('watch?v=', 'embed/')
                                    : post.mediaUrl
                                }
                                title="Nepal Video Dispatch"
                                className="h-full w-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : mediaList.length > 0 ? (
                            <div
                              onDoubleClick={() => handleImageDoubleClick(post.id)}
                              className="relative select-none overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[16/10]"
                            >
                              <img
                                src={mediaList[activeIndex]}
                                alt={post.destinationTag || 'Nepal dispatch'}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.01]"
                              />

                              {/* Bursting Heart Animation on Double Click */}
                              {heartBurstPostId === post.id && (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                  <Heart className="h-24 w-24 fill-[#EC1F27] text-[#EC1F27] animate-ping opacity-90 drop-shadow-xl" />
                                </div>
                              )}

                              {/* Multi-Photo Slide Counter */}
                              {mediaList.length > 1 && (
                                <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
                                  {activeIndex + 1}/{mediaList.length}
                                </div>
                              )}

                              {/* Prev / Next Arrows */}
                              {mediaList.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => handlePrevSlide(post.id, mediaList.length, e)}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition-all hover:bg-black/70 hover:scale-105"
                                  >
                                    <ChevronLeft className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleNextSlide(post.id, mediaList.length, e)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition-all hover:bg-black/70 hover:scale-105"
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                  </button>

                                  {/* Dot Indicators */}
                                  <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
                                    {mediaList.map((_, dotIdx) => (
                                      <span
                                        key={dotIdx}
                                        className={`h-1.5 rounded-full transition-all ${
                                          dotIdx === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : null}

                          {/* Post Action Bar (Like, Comment, Share, Save) */}
                          <div className="p-3.5 sm:p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Like Button */}
                                <button
                                  onClick={() => handleToggleLike(post.id)}
                                  className="group flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-colors"
                                >
                                  <Heart
                                    className={`h-5 w-5 transition-transform group-active:scale-125 ${
                                      post.isLiked
                                        ? 'fill-[#EC1F27] text-[#EC1F27]'
                                        : 'text-slate-600 hover:text-[#EC1F27]'
                                    }`}
                                  />
                                  <span className={post.isLiked ? 'text-[#EC1F27]' : ''}>
                                    {post.likesCount}
                                  </span>
                                </button>

                                {/* Comment Button */}
                                <button
                                  onClick={() =>
                                    setExpandedComments((prev) => ({
                                      ...prev,
                                      [post.id]: !prev[post.id],
                                    }))
                                  }
                                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0552A2] transition-colors"
                                >
                                  <MessageCircle className="h-5 w-5 text-slate-600 hover:text-[#0552A2]" />
                                  <span>{post.commentsCount}</span>
                                </button>

                                {/* Share Button */}
                                <button
                                  onClick={() => handleSharePost(post)}
                                  className="flex items-center gap-1 text-slate-600 hover:text-[#0552A2] transition-colors"
                                >
                                  <Share2 className="h-5 w-5" />
                                </button>
                              </div>

                              {/* Save / Bookmark Button */}
                              <button
                                onClick={() => handleToggleSave(post.id)}
                                className="flex items-center gap-1 text-slate-600 hover:text-[#0552A2] transition-colors"
                              >
                                <Bookmark
                                  className={`h-5 w-5 ${
                                    post.isSaved ? 'fill-[#0552A2] text-[#0552A2]' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Liked Summary */}
                            <div className="text-[11px] text-slate-500 font-medium">
                              Liked by{' '}
                              <span className="font-bold text-slate-800">
                                {post.likedBy && post.likedBy[0] ? post.likedBy[0] : 'pasang_sherpa'}
                              </span>{' '}
                              and{' '}
                              <span className="font-bold text-slate-800">
                                {Math.max(0, post.likesCount - 1)} others
                              </span>
                            </div>

                            {/* COMMENTS SECTION */}
                            <div className="border-t border-slate-100 pt-2 space-y-2">
                              {post.comments && post.comments.length > 2 && !expandedComments[post.id] && (
                                <button
                                  onClick={() =>
                                    setExpandedComments((prev) => ({ ...prev, [post.id]: true }))
                                  }
                                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                                >
                                  View all {post.comments.length} comments
                                </button>
                              )}

                              {/* Render Comments */}
                              {post.comments && post.comments.length > 0 && (
                                <div className="space-y-2.5">
                                  {(expandedComments[post.id] ? post.comments : post.comments.slice(-2)).map(
                                    (c) => (
                                      <div key={c.id} className="space-y-1.5 text-xs">
                                        <div className="flex items-start gap-2.5">
                                          <img
                                            src={c.avatar}
                                            alt={c.author}
                                            className="h-7 w-7 rounded-full object-cover shrink-0 mt-0.5"
                                          />
                                          <div className="flex-1 rounded-xl bg-slate-50 p-2 border border-slate-100">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-900 text-[11px]">
                                                  {c.author}
                                                </span>
                                                {c.authorUsername && (
                                                  <span className="text-[10px] text-slate-400">
                                                    @{c.authorUsername}
                                                  </span>
                                                )}
                                              </div>
                                              <span className="text-[10px] text-slate-400">{c.timeAgo}</span>
                                            </div>
                                            <p className="mt-1 text-slate-700 leading-relaxed text-xs">
                                              {c.text}
                                            </p>

                                            {/* Comment Actions: Like, Reply, Delete */}
                                            <div className="mt-2 flex items-center gap-3 text-[10px] font-semibold text-slate-500">
                                              <button
                                                onClick={() => handleToggleCommentLike(post.id, c.id)}
                                                className="flex items-center gap-1 hover:text-[#EC1F27]"
                                              >
                                                <Heart className="h-3 w-3" />
                                                <span>{c.likes || 0}</span>
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setActiveReplyId(activeReplyId === c.id ? null : c.id)
                                                }
                                                className="hover:text-[#0552A2]"
                                              >
                                                Reply
                                              </button>
                                              {c.author === (currentUser?.name || 'Aayush Pradhan') && (
                                                <button
                                                  onClick={() => handleDeleteComment(post.id, c.id)}
                                                  className="text-red-500 hover:text-red-700"
                                                >
                                                  Delete
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Nested Replies Drawer */}
                                        {c.replies && c.replies.length > 0 && (
                                          <div className="pl-9 space-y-1.5">
                                            {!expandedReplies[c.id] ? (
                                              <button
                                                onClick={() =>
                                                  setExpandedReplies((prev) => ({
                                                    ...prev,
                                                    [c.id]: true,
                                                  }))
                                                }
                                                className="flex items-center gap-1 text-[10px] font-bold text-[#0552A2]"
                                              >
                                                <CornerDownRight className="h-3 w-3" />
                                                <span>View {c.replies.length} replies</span>
                                              </button>
                                            ) : (
                                              <div className="space-y-1.5 border-l-2 border-slate-200 pl-2.5">
                                                {c.replies.map((rep) => (
                                                  <div key={rep.id} className="flex items-start gap-2">
                                                    <img
                                                      src={rep.avatar}
                                                      alt={rep.author}
                                                      className="h-5 w-5 rounded-full object-cover shrink-0"
                                                    />
                                                    <div className="rounded-lg bg-slate-50 p-1.5 flex-1 text-[11px]">
                                                      <div className="flex items-center justify-between">
                                                        <span className="font-bold text-slate-900">
                                                          {rep.author}
                                                        </span>
                                                        <span className="text-[9px] text-slate-400">
                                                          {rep.timeAgo}
                                                        </span>
                                                      </div>
                                                      <p className="text-slate-700">{rep.text}</p>
                                                    </div>
                                                  </div>
                                                ))}
                                                <button
                                                  onClick={() =>
                                                    setExpandedReplies((prev) => ({
                                                      ...prev,
                                                      [c.id]: false,
                                                    }))
                                                  }
                                                  className="text-[10px] text-slate-400 hover:underline"
                                                >
                                                  Hide replies
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* Inline Reply Form */}
                                        {activeReplyId === c.id && (
                                          <form
                                            onSubmit={(e) => handleAddReply(post.id, c.id, e)}
                                            className="pl-9 flex gap-1.5 pt-1"
                                          >
                                            <input
                                              type="text"
                                              value={replyInputs[c.id] || ''}
                                              onChange={(e) =>
                                                setReplyInputs((prev) => ({
                                                  ...prev,
                                                  [c.id]: e.target.value,
                                                }))
                                              }
                                              placeholder={`Reply to @${c.authorUsername || c.author}...`}
                                              className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs focus:border-[#0552A2] focus:outline-none"
                                            />
                                            <button
                                              type="submit"
                                              className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                                            >
                                              Reply
                                            </button>
                                          </form>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              {/* Quick Reaction Bar */}
                              <div className="flex items-center gap-1.5 pt-1">
                                <span className="text-[10px] text-slate-400">Quick reaction:</span>
                                {['❤️', '🏔️', '🥾', '🙏', '🇳🇵', '🔥'].map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleInsertEmoji(post.id, emoji)}
                                    className="rounded px-1 text-xs hover:bg-slate-100 transition-colors"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>

                              {/* Add Comment Input Form */}
                              <form
                                onSubmit={(e) => handleAddComment(post.id, e)}
                                className="flex items-center gap-2 pt-1"
                              >
                                <img
                                  src={
                                    currentUser?.avatarUrl ||
                                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                                  }
                                  alt="Current User"
                                  className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                />
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={commentInputs[post.id] || ''}
                                    onChange={(e) =>
                                      setCommentInputs((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Add a comment to this expedition dispatch..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-1.5 pl-3 pr-14 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0552A2] focus:bg-white focus:outline-none"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!commentInputs[post.id]?.trim()}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#0552A2] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#044182] disabled:opacity-40"
                                  >
                                    Post
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>

          {/* =====================================================================
              RIGHT SIDEBAR (col-span-3): Discover Nepal, Trending & Guidelines
              ===================================================================== */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Search Input Box */}
            <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dispatches, trails, #tags..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0552A2] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Trending Destinations (From Requirements) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[#EC1F27]" />
                  <h3 className="font-poppins text-xs font-bold text-slate-900">
                    Trending Destinations
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#0552A2]">Nepal 2026</span>
              </div>

              <div className="mt-3 space-y-1.5">
                {[
                  { name: 'Everest Region', count: 48, tag: 'Everest Region' },
                  { name: 'Annapurna Circuit', count: 35, tag: 'Annapurna Circuit' },
                  { name: 'Pokhara', count: 24, tag: 'Pokhara & Lakes' },
                  { name: 'Kathmandu', count: 21, tag: 'Kathmandu Valley' },
                  { name: 'Upper Mustang', count: 18, tag: 'Upper Mustang' },
                ].map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => {
                      setSelectedDestination(dest.tag);
                      setActiveNav('home');
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2 text-left transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{dest.name}</div>
                      <div className="text-[10px] text-slate-400">High Altitude Trekking</div>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0552A2]">
                      {dest.count} posts
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Hashtags (From Requirements) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Tag className="h-4 w-4 text-[#0552A2]" />
                <h3 className="font-poppins text-xs font-bold text-slate-900">
                  Trending Hashtags
                </h3>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  { tag: 'VisitNepal', count: 120 },
                  { tag: 'NepalTravel', count: 98 },
                  { tag: 'HimalayanAdventure', count: 74 },
                  { tag: 'ExploreNepal', count: 62 },
                  { tag: 'NepalDiaries', count: 45 },
                ].map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => {
                      setSelectedTag(item.tag);
                      setActiveNav('home');
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0552A2] hover:text-[#0552A2] transition-colors"
                  >
                    <span>#{item.tag}</span>
                    <span className="text-[9px] text-slate-400 font-normal">({item.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Travelers to Follow */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#0552A2]" />
                  <h3 className="font-poppins text-xs font-bold text-slate-900">
                    Suggested Travelers
                  </h3>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {(trending.suggestedTravelers.length > 0
                  ? trending.suggestedTravelers
                  : [
                      {
                        id: 'usr-guide',
                        name: 'Pasang Nuru Sherpa',
                        username: 'pasang_sherpa',
                        role: 'NMA Certified Guide',
                        avatarUrl:
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      },
                      {
                        id: 'usr-butler',
                        name: 'Pemba Butler',
                        username: 'pemba_sherpa',
                        role: 'High Camp Butler',
                        avatarUrl:
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                      },
                      {
                        id: 'usr-business',
                        name: 'Himalayan Expeditions',
                        username: 'himalayan_expeditions',
                        role: 'Licensed Operator',
                        avatarUrl:
                          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
                      },
                    ]
                ).map((traveler) => (
                  <div key={traveler.id} className="flex items-center justify-between">
                    <button
                      onClick={() => handleOpenUserProfile(traveler.id)}
                      className="flex items-center gap-2.5 text-left group"
                    >
                      <img
                        src={traveler.avatarUrl}
                        alt={traveler.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-[#0552A2]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#0552A2] transition-colors truncate max-w-[110px]">
                          {traveler.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                          @{traveler.username || 'traveler'}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleToggleFollow(traveler.id)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                        traveler.isFollowing
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-[#0552A2] text-white hover:bg-[#044182]'
                      }`}
                    >
                      {traveler.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Community Guidelines Footer Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 text-center text-slate-500 shadow-xs">
              <p className="text-[11px] leading-relaxed">
                © 2026 Visit Nepal Social • Official Tourism Desk
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                <a href="/explore" className="hover:text-slate-700">Safety Radar</a>
                <span>•</span>
                <a href="/services" className="hover:text-slate-700">TIMS Permits</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-slate-700">Privacy Policy</a>
                <span>•</span>
                <a href="/about" className="hover:text-slate-700">Guidelines</a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* =========================================================================
          MODAL 1: TRAVELER COMMUNITY PROFILE MODAL
          ========================================================================= */}
      {profileModalUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <button
              onClick={() => setProfileModalUserId(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>

            {isLoadingProfile ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading traveler profile...</div>
            ) : profileModalData?.user ? (
              <div>
                <div className="h-36 w-full bg-gradient-to-r from-[#0552A2] via-[#0D9488] to-[#92C4EA] relative">
                  {profileModalData.user.coverUrl && (
                    <img
                      src={profileModalData.user.coverUrl}
                      alt="Cover"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="flex justify-between items-end -mt-12 mb-3">
                    <img
                      src={
                        profileModalData.user.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={profileModalData.user.name}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                    />

                    <div>
                      {profileModalData.user.id === (currentUser?.id || 'usr-traveler') ? (
                        <button
                          onClick={handleOpenEditProfile}
                          className="rounded-xl border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleFollow(profileModalData.user.id)}
                          className={`rounded-xl px-5 py-1.5 text-xs font-bold text-white shadow-sm transition-all ${
                            profileModalData.isFollowing
                              ? 'bg-slate-700 hover:bg-slate-800'
                              : 'bg-[#0552A2] hover:bg-[#044182]'
                          }`}
                        >
                          {profileModalData.isFollowing ? 'Following' : 'Follow Traveler'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-poppins text-lg font-bold text-slate-900">
                        {profileModalData.user.name}
                      </h2>
                      <BadgeCheck className="h-5 w-5 text-[#0552A2]" />
                    </div>
                    <p className="text-xs text-slate-400">@{profileModalData.user.username || 'nepal_explorer'}</p>

                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                      {profileModalData.user.bio || 'Himalayan adventurer traversing Nepal trails and passes.'}
                    </p>

                    {profileModalData.user.location && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-[#EC1F27]" />
                        <span>{profileModalData.user.location}</span>
                      </div>
                    )}

                    {profileModalData.user.travelInterests && profileModalData.user.travelInterests.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {profileModalData.user.travelInterests.map((interest: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#0552A2] border border-blue-200/60"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex gap-6 border-t border-slate-100 pt-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">
                          {profileModalData.posts ? profileModalData.posts.length : 0}
                        </span>{' '}
                        <span className="text-slate-500">dispatches</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">
                          {profileModalData.user.followers ? profileModalData.user.followers.length : 1240}
                        </span>{' '}
                        <span className="text-slate-500">followers</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">
                          {profileModalData.user.following ? profileModalData.user.following.length : 482}
                        </span>{' '}
                        <span className="text-slate-500">following</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Published Dispatches
                    </h4>
                    {profileModalData.posts && profileModalData.posts.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {profileModalData.posts.map((userPost: any) => {
                          const img =
                            userPost.mediaUrls?.[0] ||
                            userPost.mediaUrl ||
                            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                          return (
                            <div
                              key={userPost.id}
                              onClick={() => {
                                setProfileModalUserId(null);
                                setActiveNav('home');
                                const el = document.getElementById(userPost.id);
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-900 cursor-pointer"
                            >
                              <img
                                src={img}
                                alt="User Post"
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3.5 w-3.5 fill-white" />
                                  {userPost.likesCount || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3.5 w-3.5 fill-white" />
                                  {userPost.commentsCount || 0}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No dispatches published yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">Traveler profile not found.</div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT PROFILE MODAL
          ========================================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Edit Community Profile
              </h3>
              <button onClick={() => setIsEditProfileOpen(false)}>
                <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell travelers about your Himalayan trekking experiences..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Travel Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={editInterests}
                  onChange={(e) => setEditInterests(e.target.value)}
                  placeholder="Alpine Trekking, Photography, Sherpa Culture"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Avatar Image URL</label>
                <input
                  type="text"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="Direct image URL..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="rounded-xl bg-[#0552A2] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#044182]"
              >
                {isSavingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: EDIT POST MODAL
          ========================================================================= */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Edit Expedition Dispatch
              </h3>
              <button onClick={() => setEditingPost(null)}>
                <X className="h-4 w-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Dispatch Content</label>
                <textarea
                  rows={4}
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={editPostLocation}
                    onChange={(e) => setEditPostLocation(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Destination Tag</label>
                  <select
                    value={editPostDestination}
                    onChange={(e) => setEditPostDestination(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none bg-white"
                  >
                    {PRESET_DESTINATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditPost}
                disabled={isSavingPostEdit}
                className="rounded-xl bg-[#0552A2] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#044182]"
              >
                {isSavingPostEdit ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: REPORT TO NEPAL TOURISM BOARD MODAL
          ========================================================================= */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Flag className="h-4 w-4 text-red-500" />
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Report Inappropriate Content
              </h3>
            </div>

            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Flagged posts are reviewed by the Nepal Tourism Board moderation desk for trail safety and environmental guidelines compliance.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Reason for Flagging</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none bg-white"
                >
                  <option value="Misleading trail or weather information">
                    Misleading trail or weather information
                  </option>
                  <option value="Environmental or sanctuary hazard">
                    Environmental or sanctuary hazard (e.g. littering)
                  </option>
                  <option value="Spam or unauthorized commercial promotion">
                    Spam or unauthorized commercial promotion
                  </option>
                  <option value="Inappropriate or offensive media">
                    Inappropriate or offensive media
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Additional Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context for our mountain safety desk..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-[#0552A2] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setReportingPost(null)}
                className="rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmittingReport}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: STORY VIEWER MODAL
          ========================================================================= */}
      {activeStory && (
        <div
          onClick={() => setActiveStory(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[85vh] w-full max-w-sm overflow-hidden rounded-3xl bg-slate-950 shadow-2xl flex flex-col justify-between"
          >
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[pulse_4s_ease-in-out_infinite] w-full" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.userAvatar}
                    alt={activeStory.user}
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{activeStory.user}</div>
                    <div className="text-[10px] text-white/70">{activeStory.timestamp}</div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="rounded-full bg-black/40 p-1.5 text-white hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <img
              src={activeStory.image}
              alt={activeStory.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-blue-500/80 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-xs">
                <Mountain className="h-3 w-3" />
                <span>
                  {activeStory.location} • {activeStory.altitude}
                </span>
              </div>
              <h3 className="font-poppins text-lg font-bold leading-tight">{activeStory.title}</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Weather: {activeStory.weather} • Status: {activeStory.status}
              </p>
              <button
                onClick={() => {
                  setSelectedDestination(activeStory.location);
                  setActiveStory(null);
                  setActiveNav('home');
                }}
                className="w-full mt-2 rounded-xl bg-white py-2 text-center text-xs font-bold text-slate-900 hover:bg-slate-100"
              >
                Explore {activeStory.location} Dispatches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
