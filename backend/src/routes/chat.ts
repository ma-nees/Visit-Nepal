import { Router } from 'express';
import { db, Conversation, Message } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/chat/conversations
router.get('/conversations', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const state = db.getState();

  const userConversations = state.conversations.filter(
    (c) => c.participants.some((p) => p.userId === userId) || req.user?.role === 'admin'
  );

  res.json({ count: userConversations.length, conversations: userConversations });
});

// GET /api/chat/conversations/:id/messages
router.get('/conversations/:id/messages', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const conv = state.conversations.find((c) => c.id === req.params.id);

  if (!conv) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }

  // Check user is participant or admin
  const isParticipant =
    req.user?.role === 'admin' || conv.participants.some((p) => p.userId === req.user?.id);

  if (!isParticipant) {
    res.status(403).json({ error: 'Unauthorized to view this conversation' });
    return;
  }

  const messages = state.messages.filter((m) => m.conversationId === conv.id);

  // Mark messages as read
  messages.forEach((m) => {
    if (m.senderId !== req.user?.id) {
      m.isRead = true;
    }
  });
  db.save();

  res.json({ conversation: conv, messages });
});

// POST /api/chat/conversations/:id/messages
router.post('/conversations/:id/messages', requireAuth, (req: AuthRequest, res) => {
  const { content } = req.body as { content?: string };
  if (!content) {
    res.status(400).json({ error: 'Message content is required' });
    return;
  }

  const state = db.getState();
  const conv = state.conversations.find((c) => c.id === req.params.id);

  if (!conv) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }

  const user = req.user!;
  const now = new Date().toISOString();
  const newMsg: Message = {
    id: `msg_${Date.now()}`,
    conversationId: conv.id,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    content,
    timestamp: now,
    isRead: false,
  };

  state.messages.push(newMsg);
  conv.lastMessage = content;
  conv.lastMessageAt = now;

  // Notify other participant
  const otherParticipant = conv.participants.find((p) => p.userId !== user.id);
  if (otherParticipant) {
    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: otherParticipant.userId,
      title: `Message from ${user.name}`,
      body: content.slice(0, 100),
      type: 'message',
      link: '/chat',
      isRead: false,
      createdAt: now,
    });
  }

  db.save();
  res.status(201).json({ message: newMsg });
});

// POST /api/chat/start
router.post('/start', requireAuth, (req: AuthRequest, res) => {
  const { recipientUserId, recipientName, recipientRole, initialMessage } = req.body as {
    recipientUserId?: string;
    recipientName?: string;
    recipientRole?: string;
    initialMessage?: string;
  };

  const user = req.user!;
  const targetId = recipientUserId || 'usr_guide_1';
  const state = db.getState();

  // Find existing conversation
  let conv = state.conversations.find(
    (c) =>
      c.participants.some((p) => p.userId === user.id) &&
      c.participants.some((p) => p.userId === targetId)
  );

  const now = new Date().toISOString();

  if (!conv) {
    const convId = `conv_${Date.now()}`;
    conv = {
      id: convId,
      participants: [
        { userId: user.id, name: user.name, role: user.role },
        {
          userId: targetId,
          name: recipientName || 'Pasang Nuru Sherpa (IFMGA)',
          role: recipientRole || 'guide',
        },
      ],
      lastMessage: initialMessage || 'Conversation initiated.',
      lastMessageAt: now,
    };
    state.conversations.unshift(conv);
  }

  if (initialMessage) {
    state.messages.push({
      id: `msg_${Date.now()}`,
      conversationId: conv.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: initialMessage,
      timestamp: now,
      isRead: false,
    });
  }

  db.save();
  res.status(201).json({ conversation: conv });
});

export default router;
