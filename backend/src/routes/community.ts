import { Router } from 'express';
import { db, CommunityPost } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/community (Feed of travel posts)
router.get('/', (_req, res) => {
  const state = db.getState();
  res.json({ count: state.communityPosts.length, posts: state.communityPosts });
});

// POST /api/community (Create new travel post)
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const { content, location, mediaUrl } = req.body as {
    content?: string;
    location?: string;
    mediaUrl?: string;
  };

  if (!content) {
    res.status(400).json({ error: 'Post content is required' });
    return;
  }

  const user = req.user!;
  const state = db.getState();
  const postId = `post_${Date.now()}`;

  const newPost: CommunityPost = {
    id: postId,
    userId: user.id,
    authorName: user.name,
    authorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    location: location || 'Nepal Himalaya',
    content,
    mediaUrl:
      mediaUrl ||
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  state.communityPosts.unshift(newPost);
  db.save();

  res.status(201).json({ post: newPost });
});

// POST /api/community/:id/like
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

// POST /api/community/:id/comment
router.post('/:id/comment', requireAuth, (req: AuthRequest, res) => {
  const { text } = req.body as { text?: string };
  if (!text) {
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
  const comment = {
    id: `c_${Date.now()}`,
    authorName: user.name,
    authorAvatar: '',
    text,
    createdAt: 'Just now',
  };

  post.comments.push(comment);
  post.commentsCount = post.comments.length;
  db.save();

  res.status(201).json({ comment, commentsCount: post.commentsCount });
});

export default router;
