import { Router } from 'express';
import { db, ScheduleEvent } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/schedules
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const state = db.getState();

  const userEvents =
    req.user?.role === 'admin'
      ? state.schedules
      : state.schedules.filter((s) => s.userId === userId || s.role === req.user?.role);

  res.json({ count: userEvents.length, schedules: userEvents });
});

// POST /api/schedules
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const { title, date, time, location } = req.body as {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
  };

  if (!title || !date) {
    res.status(400).json({ error: 'Title and date are required' });
    return;
  }

  const user = req.user!;
  const state = db.getState();

  const newEvent: ScheduleEvent = {
    id: `sch_${Date.now()}`,
    userId: user.id,
    role: user.role as ScheduleEvent['role'],
    title,
    date,
    time: time || '08:00 AM',
    location: location || 'Nepal',
    status: 'upcoming',
  };

  state.schedules.unshift(newEvent);
  db.save();

  res.status(201).json({ schedule: newEvent });
});

// PATCH /api/schedules/:id/toggle
router.patch('/:id/toggle', requireAuth, (req, res) => {
  const state = db.getState();
  const event = state.schedules.find((s) => s.id === req.params.id);

  if (!event) {
    res.status(404).json({ error: 'Schedule event not found' });
    return;
  }

  event.status = event.status === 'completed' ? 'upcoming' : 'completed';
  db.save();

  res.json({ schedule: event });
});

export default router;
