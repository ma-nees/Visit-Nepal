import { Router } from 'express';
import { db } from '../data/dbStore';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// ============================================================================
// 1. BUSINESS PORTAL ENDPOINTS
// ============================================================================

// GET /api/portals/business/dashboard
router.get('/business/dashboard', requireAuth, requireRole('business', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const userId = req.user!.id;
  const business = state.businesses.find((b) => b.ownerId === userId) || state.businesses[0];

  const packages = state.packages.filter((p) => p.businessId === business?.id);
  const bookings = state.bookings.filter(
    (b) => b.businessId === business?.id || b.provider.includes(business?.name || '')
  );

  const totalRevenueNpr = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + b.totalAmountNpr, 0);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const customPlans = state.customPlans || [];

  res.json({
    business,
    metrics: {
      activePackagesCount: packages.length,
      totalBookingsCount: bookings.length,
      pendingRequestsCount: pendingBookings.length,
      pendingCustomPlansCount: customPlans.filter((p) => p.status === 'PENDING_REVIEW').length,
      totalRevenueNpr,
    },
    packages,
    bookings,
    customPlans,
    availableGuides: state.guides.filter((g) => g.isAvailable && g.verificationStatus === 'verified'),
    availableButlers: state.butlers.filter((bt) => bt.isAvailable && bt.verificationStatus === 'verified'),
  });
});

// ============================================================================
// 2. GUIDE PORTAL ENDPOINTS
// ============================================================================

// GET /api/portals/guide/dashboard
router.get('/guide/dashboard', requireAuth, requireRole('guide', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const userId = req.user!.id;
  const guide = state.guides.find((g) => g.userId === userId) || state.guides[0];

  const assignments = state.bookings.filter(
    (b) => b.assignedGuideId === guide?.id || b.assignedGuideName?.includes(guide?.name || '')
  );

  const totalEarningsNpr = assignments
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .length * (guide?.dailyRateNpr || 8000) * 10;

  res.json({
    guide,
    assignments,
    metrics: {
      expeditionsCount: guide?.expeditionsCount || assignments.length,
      rating: guide?.rating || 5.0,
      reviewsCount: guide?.reviewsCount || 0,
      totalEarningsNpr,
      isAvailable: guide?.isAvailable ?? true,
      verificationStatus: guide?.verificationStatus || 'verified',
    },
  });
});

// PATCH /api/portals/guide/availability
router.patch('/guide/availability', requireAuth, requireRole('guide'), (req: AuthRequest, res) => {
  const { isAvailable } = req.body as { isAvailable?: boolean };
  const state = db.getState();
  const guide = state.guides.find((g) => g.userId === req.user!.id);

  if (!guide) {
    res.status(404).json({ error: 'Guide profile not found' });
    return;
  }

  guide.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : !guide.isAvailable;
  db.save();

  res.json({ success: true, isAvailable: guide.isAvailable });
});

// POST /api/portals/guide/expedition-report
router.post('/guide/expedition-report', requireAuth, requireRole('guide'), (req: AuthRequest, res) => {
  const { bookingId, summary, trailConditions, weatherNotes, safeCompletion } = req.body as {
    bookingId?: string;
    summary?: string;
    trailConditions?: string;
    weatherNotes?: string;
    safeCompletion?: boolean;
  };

  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === bookingId);
  if (booking && safeCompletion) {
    booking.status = 'completed';
  }

  state.auditLogs.unshift({
    id: `audit_${Date.now()}`,
    actorId: req.user!.id,
    actorName: req.user!.name,
    actorRole: 'guide',
    action: 'EXPEDITION_REPORT_SUBMITTED',
    targetType: 'booking',
    targetId: bookingId || 'General',
    details: { summary, trailConditions, weatherNotes },
    timestamp: new Date().toISOString(),
  });

  db.save();
  res.status(201).json({ success: true, message: 'Expedition report filed successfully' });
});

// ============================================================================
// 3. SHERPA BUTLER PORTAL ENDPOINTS
// ============================================================================

// GET /api/portals/butler/dashboard
router.get('/butler/dashboard', requireAuth, requireRole('butler', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const userId = req.user!.id;
  const butler = state.butlers.find((bt) => bt.userId === userId) || state.butlers[0];

  const assignedBookings = state.bookings.filter(
    (b) => b.assignedButlerId === butler?.id || b.assignedButlerName?.includes(butler?.name || '')
  );

  const schedules = state.schedules.filter((s) => s.userId === userId || s.role === 'butler');

  res.json({
    butler,
    assignedBookings,
    schedules,
    metrics: {
      completedTasksCount: butler?.completedTasksCount || 142,
      rating: butler?.rating || 4.96,
      dailyRateNpr: butler?.dailyRateNpr || 8500,
      isAvailable: butler?.isAvailable ?? true,
      verificationStatus: butler?.verificationStatus || 'verified',
    },
  });
});

// ============================================================================
// 4. ADMIN PORTAL ENDPOINTS (NTB / Government Desk)
// ============================================================================

// GET /api/portals/admin/dashboard
router.get('/admin/dashboard', requireAuth, requireRole('admin'), (_req, res) => {
  const state = db.getState();

  const totalTravelers = state.users.filter((u) => u.role === 'traveler').length;
  const registeredAgencies = state.businesses.length;
  const verifiedGuides = state.guides.filter((g) => g.verificationStatus === 'verified').length;
  const verifiedButlers = state.butlers.filter((bt) => bt.verificationStatus === 'verified').length;

  const pendingKyc =
    state.businesses.filter((b) => b.status === 'pending').length +
    state.guides.filter((g) => g.verificationStatus === 'submitted' || g.verificationStatus === 'under_review').length;

  const totalBookingsVolumeNpr = state.bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + b.totalAmountNpr, 0);

  res.json({
    metrics: {
      totalTravelers: 1420 + totalTravelers,
      registeredAgencies,
      verifiedGuides: 420 + verifiedGuides,
      verifiedButlers: 85 + verifiedButlers,
      totalBookingsCount: state.bookings.length,
      pendingBookingsCount: state.bookings.filter((b) => b.status === 'pending').length,
      pendingPermitsCount: state.permits.filter((p) => p.status === 'submitted' || p.status === 'under_review').length,
      pendingKycCount: pendingKyc,
      pendingCustomPlansCount: state.customPlans.filter((p) => p.status === 'PENDING_REVIEW').length,
      totalBookingsVolumeNpr,
    },
    verificationQueue: state.businesses.map((b) => ({
      id: b.id,
      name: b.name,
      type: b.businessType,
      pan: b.panNumber,
      status: b.status === 'verified' ? 'Approved' : 'Pending',
    })),
    customPlans: state.customPlans || [],
    permitOfficerQueue: state.permits.map((p) => ({
      id: p.id,
      applicant: p.travelerName,
      type: p.permitType,
      zone: p.route,
      status: p.status === 'approved' ? 'Approved' : p.status,
    })),
    recentAuditLogs: state.auditLogs.slice(0, 10),
  });
});

// GET /api/portals/admin/users
router.get('/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  const { role, q } = req.query as { role?: string; q?: string };
  const state = db.getState();

  let users = state.users;
  if (role && role !== 'All') {
    users = users.filter((u) => u.role.toLowerCase() === role.toLowerCase());
  }

  if (q) {
    const query = q.toLowerCase();
    users = users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
  }

  res.json({ count: users.length, users });
});

// PATCH /api/portals/admin/users/:id/status
router.patch('/admin/users/:id/status', requireAuth, requireRole('admin'), (req: AuthRequest, res) => {
  const { status } = req.body as { status: 'active' | 'suspended' | 'banned' };
  const state = db.getState();
  const target = state.users.find((u) => u.id === req.params.id);

  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  target.status = status;
  target.updatedAt = new Date().toISOString();

  state.auditLogs.unshift({
    id: `audit_${Date.now()}`,
    actorId: req.user!.id,
    actorName: req.user!.name,
    actorRole: 'admin',
    action: `USER_${status.toUpperCase()}`,
    targetType: 'user',
    targetId: target.id,
    details: { userEmail: target.email, newStatus: status },
    timestamp: new Date().toISOString(),
  });

  db.save();
  res.json({ success: true, user: target });
});

// PATCH /api/portals/admin/businesses/:id/approve
router.patch('/admin/businesses/:id/approve', requireAuth, requireRole('admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const business = state.businesses.find((b) => b.id === req.params.id);

  if (!business) {
    res.status(404).json({ error: 'Business verification item not found' });
    return;
  }

  business.status = 'verified';

  state.auditLogs.unshift({
    id: `audit_${Date.now()}`,
    actorId: req.user!.id,
    actorName: req.user!.name,
    actorRole: 'admin',
    action: 'BUSINESS_KYC_APPROVED',
    targetType: 'business',
    targetId: business.id,
    details: { businessName: business.name },
    timestamp: new Date().toISOString(),
  });

  db.save();
  res.json({ success: true, business });
});

// GET /api/portals/admin/audit-logs
router.get('/admin/audit-logs', requireAuth, requireRole('admin'), (_req, res) => {
  const state = db.getState();
  res.json({ logs: state.auditLogs });
});

export default router;
