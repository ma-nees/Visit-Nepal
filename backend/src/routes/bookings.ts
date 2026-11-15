import { Router } from 'express';
import { db, Booking } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/bookings (Role-aware listing)
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const { status } = req.query as { status?: string };
  const user = req.user!;
  const state = db.getState();

  let results: Booking[] = [];

  if (user.role === 'admin') {
    results = state.bookings;
  } else if (user.role === 'traveler') {
    results = state.bookings.filter((b) => b.userId === user.id);
  } else if (user.role === 'business') {
    const business = state.businesses.find((b) => b.ownerId === user.id);
    results = state.bookings.filter((b) => b.businessId === business?.id || b.provider.includes(user.name));
  } else if (user.role === 'guide') {
    const guide = state.guides.find((g) => g.userId === user.id);
    results = state.bookings.filter((b) => b.assignedGuideId === guide?.id || b.assignedGuideName?.includes(user.name));
  } else if (user.role === 'butler') {
    const butler = state.butlers.find((bt) => bt.userId === user.id);
    results = state.bookings.filter((b) => b.assignedButlerId === butler?.id || b.assignedButlerName?.includes(user.name));
  }

  if (status && status !== 'All') {
    results = results.filter((b) => b.status.toLowerCase() === status.toLowerCase());
  }

  res.json({ count: results.length, bookings: results });
});

// GET /api/bookings/:id
router.get('/:id', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const user = req.user!;
  // Check authorization
  if (
    user.role !== 'admin' &&
    booking.userId !== user.id &&
    !booking.provider.includes(user.name) &&
    !booking.assignedGuideName?.includes(user.name) &&
    !booking.assignedButlerName?.includes(user.name)
  ) {
    res.status(403).json({ error: 'Unauthorized to view this booking' });
    return;
  }

  res.json({ booking });
});

// POST /api/bookings (Create booking)
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const {
    title,
    provider,
    category,
    date,
    amount,
    participants = [],
    participantsCount = 1,
    serviceId,
    businessId,
    meetingPoint,
    contactPhone,
  } = req.body as {
    title?: string;
    provider?: string;
    category?: Booking['category'];
    date?: string;
    amount?: number | string;
    participants?: Array<{ fullName: string; nationality: string; passportNumber?: string }>;
    participantsCount?: number;
    serviceId?: string;
    businessId?: string;
    meetingPoint?: string;
    contactPhone?: string;
  };

  if (!title) {
    res.status(400).json({ error: 'Title is required for booking' });
    return;
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) || 50000 : Number(amount) || 50000;
  const bookingId = `BKG-${Math.floor(10000 + Math.random() * 89999)}`;
  const user = req.user!;
  const state = db.getState();

  // Availability & double booking check
  const existingConflict = state.bookings.find(
    (b) =>
      b.userId === user.id &&
      b.serviceId === serviceId &&
      b.date === date &&
      b.status !== 'cancelled' &&
      b.status !== 'rejected'
  );

  if (existingConflict) {
    res.status(409).json({
      error: 'You already have an active reservation for this service and date.',
      existingBookingId: existingConflict.id,
    });
    return;
  }

  const now = new Date().toISOString();
  const newBooking: Booking = {
    id: bookingId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    businessId: businessId || 'biz_1',
    serviceId,
    title,
    provider: provider || 'Himalayan Sherpa Expeditions',
    category: category || 'Trek',
    date: date || 'Spring Expedition 2026',
    participantsCount: Math.max(1, participantsCount),
    participants: participants.length > 0 ? participants : [{ fullName: user.name, nationality: 'Nepal' }],
    totalAmountNpr: numericAmount,
    status: 'pending',
    paymentStatus: 'unpaid',
    qrCode: `VN-PASS-${bookingId}-PENDING`,
    meetingPoint: meetingPoint || 'Kathmandu Departure Base',
    contactPhone: contactPhone || '+977-1-4412345',
    createdAt: now,
    updatedAt: now,
  };

  state.bookings.unshift(newBooking);

  // Notify traveler
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: user.id,
    title: 'Booking Request Received',
    body: `Your reservation request #${bookingId} for "${title}" has been submitted to the provider.`,
    type: 'booking',
    link: '/bookings',
    isRead: false,
    createdAt: now,
  });

  // Notify provider
  const businessUser = state.users.find((u) => u.role === 'business');
  if (businessUser) {
    state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      userId: businessUser.id,
      title: 'Incoming Booking Request',
      body: `New booking request #${bookingId} received from ${user.name} for ${title}.`,
      type: 'booking',
      link: '/portals/business',
      isRead: false,
      createdAt: now,
    });
  }

  db.save();
  res.status(201).json({ booking: newBooking });
});

// PATCH /api/bookings/:id/status (Accept / Reject / Confirm / Complete)
router.patch('/:id/status', requireAuth, (req: AuthRequest, res) => {
  const { status, reason } = req.body as { status: Booking['status']; reason?: string };
  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const user = req.user!;
  // Only business owner, assigned guide/butler, or admin can change operational status
  if (user.role === 'traveler' && status !== 'cancelled' && status !== 'refund_requested') {
    res.status(403).json({ error: 'Travelers may only request cancellation or refunds' });
    return;
  }

  const prevStatus = booking.status;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();

  if (status === 'confirmed') {
    booking.paymentStatus = 'successful';
    booking.qrCode = `VN-PASS-${booking.id}-VERIFIED-2026`;
  } else if (status === 'cancelled') {
    booking.cancellationReason = reason || 'Cancelled by user';
    booking.qrCode = `VN-PASS-${booking.id}-REVOKED`;
  }

  // Audit log
  state.auditLogs.unshift({
    id: `audit_${Date.now()}`,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: `BOOKING_STATUS_${status.toUpperCase()}`,
    targetType: 'booking',
    targetId: booking.id,
    details: { previousStatus: prevStatus, newStatus: status, reason },
    timestamp: new Date().toISOString(),
  });

  // Notify traveler of status update
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: booking.userId,
    title: `Booking Update: #${booking.id}`,
    body: `Your booking for "${booking.title}" is now marked as ${status.toUpperCase()}.`,
    type: 'booking',
    link: '/bookings',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();
  res.json({ booking });
});

// PATCH /api/bookings/:id/assign (Assign Guide or Butler)
router.patch('/:id/assign', requireAuth, (req: AuthRequest, res) => {
  const { guideId, butlerId } = req.body as { guideId?: string; butlerId?: string };
  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (req.user?.role !== 'business' && req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Only business managers or administrators can assign staff' });
    return;
  }

  if (guideId) {
    const guide = state.guides.find((g) => g.id === guideId);
    if (guide) {
      booking.assignedGuideId = guide.id;
      booking.assignedGuideName = guide.name;

      // Notify Guide
      state.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: guide.userId,
        title: 'New Expedition Assignment',
        body: `You have been assigned to lead Booking #${booking.id}: ${booking.title}.`,
        type: 'assignment',
        link: '/portals/guide',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  if (butlerId) {
    const butler = state.butlers.find((bt) => bt.id === butlerId);
    if (butler) {
      booking.assignedButlerId = butler.id;
      booking.assignedButlerName = butler.name;

      // Notify Butler
      state.notifications.unshift({
        id: `notif_${Date.now() + 1}`,
        userId: butler.userId,
        title: 'New Concierge Assignment',
        body: `You have been assigned to Booking #${booking.id}: ${booking.title}.`,
        type: 'assignment',
        link: '/portals/butler',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  booking.updatedAt = new Date().toISOString();
  db.save();

  res.json({ booking });
});

// POST /api/bookings/:id/cancel
router.post('/:id/cancel', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  booking.status = 'cancelled';
  booking.qrCode = `VN-PASS-${booking.id}-CANCELLED`;
  booking.updatedAt = new Date().toISOString();
  db.save();

  res.json({ success: true, booking });
});

// GET /api/bookings/verify/:qrCode (Public Checkpoint & Ranger Pass Verification)
router.get('/verify/:qrCode', (req, res) => {
  const { qrCode } = req.params;
  const state = db.getState();
  const booking = state.bookings.find((b) => b.qrCode === qrCode);

  if (!booking) {
    res.status(404).json({
      valid: false,
      status: 'INVALID_PASS',
      message: 'No active booking record matches this QR pass verification token.',
    });
    return;
  }

  const isValid = booking.status === 'confirmed' || booking.status === 'in_progress';

  res.json({
    valid: isValid,
    status: booking.status.toUpperCase(),
    passToken: qrCode,
    bookingId: booking.id,
    expeditionTitle: booking.title,
    leadTraveler: booking.userName,
    participantsCount: booking.participantsCount,
    provider: booking.provider,
    assignedGuide: booking.assignedGuideName || 'Independent / Self-Guided',
    assignedButler: booking.assignedButlerName || 'None',
    dates: booking.date,
    verificationAgency: 'Nepal Tourism Board (NTB) Digital Verification System',
    timestamp: new Date().toISOString(),
  });
});

export default router;
