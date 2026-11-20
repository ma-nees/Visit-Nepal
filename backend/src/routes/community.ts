import { Router } from 'express';
import { db, CommunityPost, PostComment, PostReply } from '../data/dbStore';
import { AuthRequest, requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

// Helper to extract hashtags from text
function extractHashtags(text: string): string[] {
  const matches = text.match(/#([a-zA-Z0-9_\u0900-\u097F]+)/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((t) => t.slice(1))));
}

// GET /api/community (Feed of travel posts with rich filtering)
router.get('/', optionalAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const currentUserId = req.user?.id;
  const { feed, destination, tag, q, authorId } = req.query as {
    feed?: string;
    destination?: string;
    tag?: string;
    q?: string;
    authorId?: string;
  };

  const currentUser = currentUserId ? state.users.find((u) => u.id === currentUserId) : null;
  let posts = [...state.communityPosts];

  // Feed filtering
  if (feed === 'following' && currentUser && currentUserId) {
    const followingIds = currentUser.following || [];
    posts = posts.filter((p) => followingIds.includes(p.userId) || p.userId === currentUserId);
  } else if (feed === 'saved' && currentUserId) {
    posts = posts.filter((p) => p.savedBy?.includes(currentUserId));
  } else if (feed === 'liked' && currentUserId) {
    posts = posts.filter((p) => p.likedBy?.includes(currentUserId));
  } else if (feed === 'my_posts' && currentUserId) {
    posts = posts.filter((p) => p.userId === currentUserId);
  }

  // Author filter
  if (authorId) {
    posts = posts.filter((p) => p.userId === authorId);
  }

  // Destination filter
  if (destination && destination !== 'All') {
    const destLower = destination.toLowerCase();
    posts = posts.filter(
      (p) =>
        (p.destinationTag && p.destinationTag.toLowerCase().includes(destLower)) ||
        (p.location && p.location.toLowerCase().includes(destLower))
    );
  }

  // Hashtag filter
  if (tag) {
    const cleanTag = tag.replace('#', '').toLowerCase();
    posts = posts.filter((p) => {
      const tags = (p.hashtags || []).map((t) => t.toLowerCase());
      const inContent = p.content.toLowerCase().includes(`#${cleanTag}`);
      return tags.includes(cleanTag) || inContent;
    });
  }

  // Search query
  if (q && q.trim()) {
    const term = q.toLowerCase().trim();
    posts = posts.filter(
      (p) =>
        p.content.toLowerCase().includes(term) ||
        p.authorName.toLowerCase().includes(term) ||
        (p.authorUsername && p.authorUsername.toLowerCase().includes(term)) ||
        p.location.toLowerCase().includes(term) ||
        (p.destinationTag && p.destinationTag.toLowerCase().includes(term)) ||
        (p.hashtags && p.hashtags.some((h) => h.toLowerCase().includes(term)))
    );
  }

  // Enrich with user status
  const enrichedPosts = posts.map((p) => {
    return {
      ...p,
      isLiked: currentUserId ? p.likedBy.includes(currentUserId) : false,
      isSaved: currentUserId ? (p.savedBy || []).includes(currentUserId) : false,
      isAuthor: currentUserId ? p.userId === currentUserId : false,
    };
  });

  res.json({
    count: enrichedPosts.length,
    posts: enrichedPosts,
  });
});

// GET /api/community/trending (Trending destinations, tags, suggested travelers)
router.get('/trending', optionalAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const currentUserId = req.user?.id;
  const currentUser = currentUserId ? state.users.find((u) => u.id === currentUserId) : null;
  const followingIds = currentUser?.following || [];

  // Trending destinations with counts
  const destCounts: Record<string, number> = {
    'Everest Region': 0,
    'Annapurna Circuit': 0,
    'Pokhara & Lakes': 0,
    'Upper Mustang': 0,
    'Langtang Valley': 0,
    'Kathmandu Valley': 0,
  };

  // Trending hashtags
  const tagCounts: Record<string, number> = {};

  state.communityPosts.forEach((p) => {
    if (p.destinationTag && destCounts[p.destinationTag] !== undefined) {
      destCounts[p.destinationTag]++;
    }
    const tags = p.hashtags || extractHashtags(p.content);
    tags.forEach((t) => {
      const normalized = t.toLowerCase();
      tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
    });
  });

  const trendingDestinations = Object.entries(destCounts).map(([name, count]) => ({
    name,
    count: count > 0 ? count : 12,
  }));

  const trendingHashtags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({
      tag: `#${tag}`,
      count: count + 5,
    }));

  // Suggested travelers
  const suggestedTravelers = state.users
    .filter((u) => u.id !== currentUserId)
    .slice(0, 5)
    .map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username || `@${u.name.toLowerCase().replace(/\s+/g, '_')}`,
      avatarUrl: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      bio: u.bio || 'Himalayan Explorer & Trekker',
      isFollowing: followingIds.includes(u.id),
      followersCount: (u.followers || []).length + 48,
    }));

  // Popular posts
  const popularPosts = [...state.communityPosts]
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      authorName: p.authorName,
      location: p.location,
      mediaUrl: p.mediaUrl,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
    }));

  res.json({
    trendingDestinations,
    trendingHashtags,
    suggestedTravelers,
    popularPosts,
  });
});

// GET /api/community/users/:userId (User community profile)
router.get('/users/:userId', optionalAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const targetUser = state.users.find((u) => u.id === req.params.userId);

  if (!targetUser) {
    res.status(404).json({ error: 'Traveler profile not found' });
    return;
  }

  const currentUserId = req.user?.id;
  const userPosts = state.communityPosts.filter((p) => p.userId === targetUser.id);
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likesCount, 0);

  const profile = {
    id: targetUser.id,
    name: targetUser.name,
    username: targetUser.username || `@${targetUser.name.toLowerCase().replace(/\s+/g, '_')}`,
    role: targetUser.role.charAt(0).toUpperCase() + targetUser.role.slice(1),
    avatarUrl: targetUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: targetUser.coverUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    bio: targetUser.bio || 'High-altitude trekker and nature photographer exploring the peaks of Nepal.',
    location: targetUser.location || 'Kathmandu, Nepal',
    kycStatus: targetUser.kycStatus,
    verified: targetUser.kycStatus === 'verified',
    travelInterests: targetUser.travelInterests || ['Everest Base Camp', 'Alpine Photography', 'Sherpa Culture', 'High Passes'],
    followersCount: (targetUser.followers || []).length,
    followingCount: (targetUser.following || []).length,
    postsCount: userPosts.length,
    totalLikesReceived: totalLikes,
    isFollowing: currentUserId ? (targetUser.followers || []).includes(currentUserId) : false,
    isSelf: currentUserId === targetUser.id,
    posts: userPosts,
  };

  res.json({ profile });
});

// PUT /api/community/users/profile (Update own community profile)
router.put('/users/profile', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const user = state.users.find((u) => u.id === req.user!.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { bio, location, travelInterests, avatarUrl, coverUrl, username } = req.body as {
    bio?: string;
    location?: string;
    travelInterests?: string[];
    avatarUrl?: string;
    coverUrl?: string;
    username?: string;
  };

  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (travelInterests !== undefined) user.travelInterests = travelInterests;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (coverUrl !== undefined) user.coverUrl = coverUrl;
  if (username !== undefined) user.username = username.startsWith('@') ? username : `@${username}`;

  // Propagate avatar & username update to user's posts
  state.communityPosts.forEach((p) => {
    if (p.userId === user.id) {
      if (user.avatarUrl) p.authorAvatar = user.avatarUrl;
      if (user.username) p.authorUsername = user.username;
    }
  });

  db.save();
  res.json({ user });
});

// POST /api/community/users/:userId/follow (Toggle follow)
router.post('/users/:userId/follow', requireAuth, (req: AuthRequest, res) => {
  const currentUserId = req.user!.id;
  const targetUserId = String(req.params.userId);

  if (currentUserId === targetUserId) {
    res.status(400).json({ error: 'You cannot follow yourself' });
    return;
  }

  const state = db.getState();
  const currentUser = state.users.find((u) => u.id === currentUserId);
  const targetUser = state.users.find((u) => u.id === targetUserId);

  if (!currentUser || !targetUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  currentUser.following = currentUser.following || [];
  targetUser.followers = targetUser.followers || [];

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    currentUser.following = currentUser.following.filter((id) => id !== targetUserId);
    targetUser.followers = targetUser.followers.filter((id) => id !== currentUserId);
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    // Notification to target user
    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: targetUserId,
      title: 'New Community Follower',
      body: `${currentUser.name} started following your Himalayan dispatches.`,
      type: 'message',
      link: '/community',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  db.save();
  res.json({
    isFollowing: !isFollowing,
    followersCount: targetUser.followers.length,
    followingCount: currentUser.following.length,
  });
});

// POST /api/community (Create new travel post)
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const { content, location, destinationTag, mediaUrls, mediaUrl, mediaType, hashtags } = req.body as {
    content?: string;
    location?: string;
    destinationTag?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    hashtags?: string[];
  };

  if (!content || !content.trim()) {
    res.status(400).json({ error: 'Post story content is required' });
    return;
  }

  const user = req.user!;
  const state = db.getState();
  const dbUser = state.users.find((u) => u.id === user.id);
  const postId = `post_${Date.now()}`;

  // Resolve multiple media URLs
  let resolvedMediaUrls: string[] = [];
  if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
    resolvedMediaUrls = mediaUrls;
  } else if (mediaUrl) {
    resolvedMediaUrls = [mediaUrl];
  } else {
    resolvedMediaUrls = ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80'];
  }

  const extractedTags = extractHashtags(content);
  const finalHashtags = Array.from(new Set([...(hashtags || []), ...extractedTags]));

  const newPost: CommunityPost = {
    id: postId,
    userId: user.id,
    authorName: user.name,
    authorUsername: dbUser?.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`,
    authorAvatar:
      dbUser?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    authorVerified: dbUser?.kycStatus === 'verified',
    location: location || 'Himalayan Ridge, Nepal',
    destinationTag: destinationTag || 'Everest Region',
    content: content.trim(),
    mediaUrl: resolvedMediaUrls[0],
    mediaUrls: resolvedMediaUrls,
    mediaType: mediaType || 'image',
    hashtags: finalHashtags,
    likesCount: 0,
    likedBy: [],
    savedBy: [],
    commentsCount: 0,
    comments: [],
    sharesCount: 0,
    createdAt: new Date().toISOString(),
  };

  state.communityPosts.unshift(newPost);

  // Scan for @mentions and notify mentioned users
  const mentions = (content.match(/@([a-zA-Z0-9_]+)/g) || []).map((m) => m.slice(1).toLowerCase());
  for (const handle of mentions) {
    const mentionedUser = state.users.find(
      (u) => (u.username || '').replace(/^@/, '').toLowerCase() === handle
    );
    if (mentionedUser && mentionedUser.id !== user.id) {
      state.notifications.unshift({
        id: `notif_${Date.now()}_mention_${mentionedUser.id}`,
        userId: mentionedUser.id,
        title: 'You were mentioned in a Dispatch',
        body: `${user.name} mentioned you in an expedition dispatch from ${newPost.location}.`,
        type: 'mention',
        link: `/community#${newPost.id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  db.save();

  res.status(201).json({ post: newPost });
});

// PUT /api/community/:id (Edit post - owner only)
router.put('/:id', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  if (post.userId !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'You are only authorized to edit your own posts' });
    return;
  }

  const { content, location, destinationTag, hashtags } = req.body as {
    content?: string;
    location?: string;
    destinationTag?: string;
    hashtags?: string[];
  };

  if (content !== undefined) {
    post.content = content.trim();
    const extracted = extractHashtags(post.content);
    post.hashtags = Array.from(new Set([...(hashtags || post.hashtags || []), ...extracted]));
  }
  if (location !== undefined) post.location = location;
  if (destinationTag !== undefined) post.destinationTag = destinationTag;
  post.updatedAt = new Date().toISOString();

  db.save();
  res.json({ post });
});

// DELETE /api/community/:id (Delete post - owner or admin)
router.delete('/:id', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const index = state.communityPosts.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const post = state.communityPosts[index];
  if (post.userId !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'You are only authorized to delete your own posts' });
    return;
  }

  state.communityPosts.splice(index, 1);
  db.save();

  res.json({ success: true, message: 'Post successfully deleted' });
});

// POST /api/community/:id/like (Toggle like on post)
router.post('/:id/like', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const userId = req.user!.id;
  const index = post.likedBy.indexOf(userId);

  if (index === -1) {
    post.likedBy.push(userId);
    post.likesCount += 1;

    // Notification to post owner
    if (post.userId !== userId) {
      state.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: post.userId,
        title: 'New Post Like',
        body: `${req.user!.name} liked your photo from ${post.location}.`,
        type: 'message',
        link: '/community',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  } else {
    post.likedBy.splice(index, 1);
    post.likesCount = Math.max(0, post.likesCount - 1);
  }

  db.save();
  res.json({
    liked: index === -1,
    likesCount: post.likesCount,
  });
});

// POST /api/community/:id/save (Toggle save/bookmark post)
router.post('/:id/save', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const userId = req.user!.id;
  post.savedBy = post.savedBy || [];
  const index = post.savedBy.indexOf(userId);

  const currentUser = state.users.find((u) => u.id === userId);
  if (currentUser) {
    currentUser.savedPosts = currentUser.savedPosts || [];
  }

  if (index === -1) {
    post.savedBy.push(userId);
    if (currentUser && !currentUser.savedPosts?.includes(post.id)) {
      currentUser.savedPosts?.push(post.id);
    }
  } else {
    post.savedBy.splice(index, 1);
    if (currentUser) {
      currentUser.savedPosts = currentUser.savedPosts?.filter((id) => id !== post.id);
    }
  }

  db.save();
  res.json({
    saved: index === -1,
    savedCount: post.savedBy.length,
  });
});

// POST /api/community/:id/comment (Add comment or threaded reply)
router.post('/:id/comment', requireAuth, (req: AuthRequest, res) => {
  const { text, parentId } = req.body as { text?: string; parentId?: string };
  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Comment text is required' });
    return;
  }

  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const user = req.user!;
  const dbUser = state.users.find((u) => u.id === user.id);
  const userAvatar = dbUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
  const username = dbUser?.username || `@${user.name.toLowerCase().replace(/\s+/g, '_')}`;

  // If threaded reply to an existing comment
  if (parentId) {
    const parentComment = post.comments.find((c) => c.id === parentId);
    if (!parentComment) {
      res.status(404).json({ error: 'Parent comment not found' });
      return;
    }

    parentComment.replies = parentComment.replies || [];
    const newReply: PostReply = {
      id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      authorName: user.name,
      authorUsername: username,
      authorAvatar: userAvatar,
      text: text.trim(),
      createdAt: 'Just now',
    };

    parentComment.replies.push(newReply);
    post.commentsCount += 1;

    // Notification to parent comment author
    if (parentComment.userId && parentComment.userId !== user.id) {
      state.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: parentComment.userId,
        title: 'New Reply to Your Comment',
        body: `${user.name} replied: "${text.trim().substring(0, 50)}..."`,
        type: 'message',
        link: '/community',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    db.save();
    res.status(201).json({ reply: newReply, commentsCount: post.commentsCount });
    return;
  }

  // Top-level comment
  const newComment: PostComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    authorName: user.name,
    authorUsername: username,
    authorAvatar: userAvatar,
    text: text.trim(),
    createdAt: 'Just now',
    likesCount: 0,
    likedBy: [],
    replies: [],
  };

  post.comments.push(newComment);
  post.commentsCount += 1;

  // Notification to post author
  if (post.userId !== user.id) {
    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: post.userId,
      title: 'New Comment on Your Expedition Story',
      body: `${user.name} commented: "${text.trim().substring(0, 50)}..."`,
      type: 'comment',
      link: `/community#${post.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Scan for @mentions in comment
  const commentMentions = (text.match(/@([a-zA-Z0-9_]+)/g) || []).map((m) => m.slice(1).toLowerCase());
  for (const handle of commentMentions) {
    const mentionedUser = state.users.find(
      (u) => (u.username || '').replace(/^@/, '').toLowerCase() === handle
    );
    if (mentionedUser && mentionedUser.id !== user.id) {
      state.notifications.unshift({
        id: `notif_${Date.now()}_mention_${mentionedUser.id}`,
        userId: mentionedUser.id,
        title: 'You were mentioned in a Comment',
        body: `${user.name} mentioned you in a comment on ${post.authorName}'s dispatch.`,
        type: 'mention',
        link: `/community#${post.id}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  db.save();
  res.status(201).json({ comment: newComment, commentsCount: post.commentsCount });
});

// PUT /api/community/:id/comment/:commentId (Edit comment - author only)
router.put('/:id/comment/:commentId', requireAuth, (req: AuthRequest, res) => {
  const { text } = req.body as { text?: string };
  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Comment text is required' });
    return;
  }

  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  // Check top-level comments
  let target = post.comments.find((c) => c.id === req.params.commentId);
  if (target) {
    if (target.userId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'You are only authorized to edit your own comment' });
      return;
    }
    target.text = text.trim();
    db.save();
    res.json({ success: true, comment: target });
    return;
  }

  // Check replies
  for (const c of post.comments) {
    const rep = (c.replies || []).find((r) => r.id === req.params.commentId);
    if (rep) {
      if (rep.userId !== req.user!.id && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'You are only authorized to edit your own reply' });
        return;
      }
      rep.text = text.trim();
      db.save();
      res.json({ success: true, reply: rep });
      return;
    }
  }

  res.status(404).json({ error: 'Comment or reply not found' });
});

// DELETE /api/community/:id/comment/:commentId (Delete comment)
router.delete('/:id/comment/:commentId', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const commentId = req.params.commentId;
  const cIndex = post.comments.findIndex((c) => c.id === commentId);

  if (cIndex !== -1) {
    const c = post.comments[cIndex];
    if (c.userId !== req.user!.id && post.userId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'You are not authorized to delete this comment' });
      return;
    }
    const repliesCount = (c.replies || []).length;
    post.comments.splice(cIndex, 1);
    post.commentsCount = Math.max(0, post.commentsCount - 1 - repliesCount);
    db.save();
    res.json({ success: true, commentsCount: post.commentsCount });
    return;
  }

  // Check in replies
  for (const c of post.comments) {
    const rIndex = (c.replies || []).findIndex((r) => r.id === commentId);
    if (rIndex !== -1) {
      const rep = c.replies![rIndex];
      if (rep.userId !== req.user!.id && post.userId !== req.user!.id && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'You are not authorized to delete this reply' });
        return;
      }
      c.replies!.splice(rIndex, 1);
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      db.save();
      res.json({ success: true, commentsCount: post.commentsCount });
      return;
    }
  }

  res.status(404).json({ error: 'Comment not found' });
});

// POST /api/community/:id/comment/:commentId/like (Toggle like on comment)
router.post('/:id/comment/:commentId/like', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const comment = post.comments.find((c) => c.id === req.params.commentId);
  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }

  comment.likedBy = comment.likedBy || [];
  const idx = comment.likedBy.indexOf(req.user!.id);
  if (idx === -1) {
    comment.likedBy.push(req.user!.id);
    comment.likesCount = (comment.likesCount || 0) + 1;
  } else {
    comment.likedBy.splice(idx, 1);
    comment.likesCount = Math.max(0, (comment.likesCount || 1) - 1);
  }

  db.save();
  res.json({ liked: idx === -1, likesCount: comment.likesCount });
});

// POST /api/community/:id/report (Report inappropriate post)
router.post('/:id/report', requireAuth, (req: AuthRequest, res) => {
  const { reason, details } = req.body as { reason?: string; details?: string };
  const state = db.getState();
  const post = state.communityPosts.find((p) => p.id === req.params.id);

  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  state.auditLogs.unshift({
    id: `audit_${Date.now()}`,
    actorId: req.user!.id,
    actorName: req.user!.name,
    actorRole: req.user!.role,
    action: 'POST_REPORTED',
    targetType: 'post',
    targetId: post.id,
    details: { reason: reason || 'Inappropriate content', details: details || 'None provided' },
    timestamp: new Date().toISOString(),
  });

  db.save();
  res.json({ success: true, message: 'Thank you. The report has been flagged for Nepal Tourism Board moderation.' });
});

export default router;
