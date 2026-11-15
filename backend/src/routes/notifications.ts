import { Router } from 'express';
import { db } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const state = db.getState();

  const userNotifs = state.notifications.filter((n) => n.userId === userId || userId === 'usr_admin_1');
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  res.json({
    count: userNotifs.length,
    unreadCount,
    notifications: userNotifs,
  });
});

// PATCH /api/notifications/mark-all-read
router.patch('/mark-all-read', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const state = db.getState();

  state.notifications.forEach((n) => {
    if (n.userId === userId || (req.user?.role === 'admin' && n.userId === 'usr_admin_1')) {
      n.isRead = true;
    }
  });

  db.save();
  res.json({ success: true, message: 'All notifications marked as read' });
});

export default router;
