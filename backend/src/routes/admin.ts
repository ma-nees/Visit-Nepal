import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { db, UserAccount, HotelListing, TrekkingPackage, Destination, AuditLog, PayoutTransaction, RefundRecord } from '../data/dbStore';
import { AuthRequest, AuthUser, requireAuth, requireRole, requirePermission } from '../middleware/auth';

const router = Router();

// Helper to record audit log
function recordAudit(
  actor: AuthUser,
  action: string,
  targetType: string,
  targetId: string,
  details: Record<string, any>,
  options: { reason?: string; previousValue?: any; newValue?: any } = {}
) {
  const state = db.getState();
  const log: AuditLog = {
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    targetType,
    targetId,
    details,
    reason: options.reason,
    previousValue: options.previousValue,
    newValue: options.newValue,
    timestamp: new Date().toISOString(),
  };
  state.auditLogs.unshift(log);
  // Keep latest 500 audit logs
  if (state.auditLogs.length > 500) {
    state.auditLogs.pop();
  }
}

// ============================================================================
// 1. OVERVIEW & REAL-TIME ANALYTICS
// ============================================================================
router.get('/overview', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const isSuperAdmin = req.user?.role === 'super_admin';

  // Counts
  const totalUsers = state.users.length;
  const activeTravelers = state.users.filter((u) => u.role === 'traveler').length;
  const verifiedGuides = state.guides.filter((g) => g.verificationStatus === 'verified').length;
  const registeredButlers = state.butlers.length;
  const registeredAgencies = state.businesses.length;
  const registeredHotels = state.hotels.length;
  const totalPackages = state.packages.length;

  // Bookings metrics
  const activeBookings = state.bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress').length;
  const pendingBookings = state.bookings.filter((b) => b.status === 'pending' || b.status === 'awaiting_payment').length;
  const completedTrips = state.bookings.filter((b) => b.status === 'completed').length;
  const cancelledBookings = state.bookings.filter((b) => b.status === 'cancelled' || b.status === 'refunded').length;

  // Financial calculations
  const grossBookingValueNpr = state.bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + (b.totalAmountNpr || 0), 0);

  const platformCommissionPercent = state.platformSettings?.commissions?.agencyCommissionPercent || 12;
  const platformCommissionsNpr = Math.round((grossBookingValueNpr * platformCommissionPercent) / 100);

  const pendingPayoutsNpr = (state.payouts || [])
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amountNpr, 0);

  const refundsVolumeNpr = (state.refunds || [])
    .filter((r) => r.status === 'approved')
    .reduce((acc, r) => acc + r.amountNpr, 0);

  // Verifications pending
  const pendingAgencyKyc = state.businesses.filter((b) => b.status === 'pending').length;
  const pendingGuideKyc = state.guides.filter((g) => g.verificationStatus === 'submitted' || g.verificationStatus === 'under_review').length;
  const pendingButlerKyc = state.butlers.filter((bt) => bt.verificationStatus === 'submitted' || bt.verificationStatus === 'under_review').length;
  const pendingPermits = state.permits.filter((p) => p.status === 'submitted' || p.status === 'under_review').length;
  const pendingVerificationsCount = pendingAgencyKyc + pendingGuideKyc + pendingButlerKyc + pendingPermits;

  // Recent platform activity
  const recentAudit = state.auditLogs.slice(0, 8);

  res.json({
    analytics: {
      totalUsers,
      activeTravelers,
      verifiedGuides,
      registeredButlers,
      registeredAgencies,
      registeredHotels,
      totalPackages,
      activeBookings,
      pendingBookings,
      completedTrips,
      cancelledBookings,
      pendingVerificationsCount,
      // Restrict full financial overview from NTB Admin if not super_admin
      ...(isSuperAdmin
        ? {
            grossBookingValueNpr,
            platformCommissionsNpr,
            pendingPayoutsNpr,
            refundsVolumeNpr,
            netRevenueNpr: platformCommissionsNpr - refundsVolumeNpr,
          }
        : {
            grossBookingValueNpr: null,
            platformCommissionsNpr: null,
            pendingPayoutsNpr: null,
            refundsVolumeNpr: null,
          }),
    },
    verificationBreakdown: {
      agencies: pendingAgencyKyc,
      guides: pendingGuideKyc,
      butlers: pendingButlerKyc,
      permits: pendingPermits,
    },
    recentActivity: recentAudit,
  });
});

// ============================================================================
// 2. USER & ROLE MANAGEMENT
// ============================================================================
router.get('/users', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req, res) => {
  const { role, status, q } = req.query as { role?: string; status?: string; q?: string };
  const state = db.getState();
  let users = state.users;

  if (role && role !== 'All') {
    users = users.filter((u) => u.role.toLowerCase() === role.toLowerCase());
  }
  if (status && status !== 'All') {
    users = users.filter((u) => u.status === status);
  }
  if (q) {
    const query = q.toLowerCase().trim();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query)) ||
        u.id.toLowerCase().includes(query)
    );
  }

  // Strip password hash from returned records
  const sanitized = users.map(({ passwordHash, ...rest }) => rest);
  res.json({ count: sanitized.length, users: sanitized });
});

// POST /api/admin/users - Create User
router.post('/users', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { name, email, password, role, phone, kycStatus } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const state = db.getState();
  const lowerEmail = email.toLowerCase().trim();
  if (state.users.some((u) => u.email.toLowerCase() === lowerEmail)) {
    res.status(409).json({ error: 'User with this email already exists' });
    return;
  }

  const newUserId = `usr_${Date.now()}`;
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(password || 'NepalTourism2026!', 10);

  const newUser: UserAccount = {
    id: newUserId,
    name: name.trim(),
    email: lowerEmail,
    passwordHash,
    role: role || 'traveler',
    status: 'active',
    phone: phone || '',
    kycStatus: kycStatus || 'not_submitted',
    createdAt: now,
    updatedAt: now,
  };

  state.users.push(newUser);
  recordAudit(req.user!, 'USER_CREATED', 'user', newUser.id, { email: newUser.email, role: newUser.role });
  db.save();

  const { passwordHash: _, ...sanitized } = newUser;
  res.status(201).json({ success: true, user: sanitized });
});

// PATCH /api/admin/users/:id - Edit details, assign role, suspend, reactivate
router.patch('/users/:id', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const target = state.users.find((u) => u.id === req.params.id);
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { name, role, status, kycStatus, phone, bio } = req.body;
  const isSuperAdmin = req.user?.role === 'super_admin';

  // Security: Only Super Admin can assign 'super_admin' or change roles
  if (role && role !== target.role) {
    if (!isSuperAdmin) {
      res.status(403).json({ error: 'Only Super Admin can reassign user roles' });
      return;
    }
    // Prevent target from elevating to super_admin unless authorized
    recordAudit(req.user!, 'USER_ROLE_CHANGED', 'user', target.id, { from: target.role, to: role });
    target.role = role;
  }

  if (status && status !== target.status) {
    recordAudit(req.user!, `USER_${status.toUpperCase()}`, 'user', target.id, { from: target.status, to: status });
    target.status = status;
  }

  if (kycStatus) target.kycStatus = kycStatus;
  if (name) target.name = name;
  if (phone) target.phone = phone;
  if (bio) target.bio = bio;
  target.updatedAt = new Date().toISOString();

  db.save();
  const { passwordHash: _, ...sanitized } = target;
  res.json({ success: true, user: sanitized });
});

// POST /api/admin/users/:id/impersonate - Super Admin Impersonation for audited customer support
router.post('/users/:id/impersonate', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const target = state.users.find((u) => u.id === req.params.id);
  if (!target) {
    res.status(404).json({ error: 'User to impersonate not found' });
    return;
  }

  recordAudit(req.user!, 'USER_IMPERSONATED', 'user', target.id, {
    impersonator: req.user!.email,
    targetEmail: target.email,
    targetRole: target.role,
  });

  const impersonatedAuthUser: AuthUser = {
    id: target.id,
    email: target.email,
    name: target.name,
    role: target.role,
    impersonatedBy: req.user!.email,
  };

  const impersonationToken = jwt.sign(impersonatedAuthUser, env.jwtSecret, { expiresIn: '2h' });

  res.json({
    success: true,
    message: `Impersonation token created for ${target.name}. All actions are strictly audited.`,
    token: impersonationToken,
    user: impersonatedAuthUser,
  });
});

// ============================================================================
// 3. HOTEL MANAGEMENT
// ============================================================================
router.get('/hotels', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (_req, res) => {
  const state = db.getState();
  res.json({ count: state.hotels.length, hotels: state.hotels });
});

router.post('/hotels', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const hotelData = req.body as Partial<HotelListing>;
  if (!hotelData.name || !hotelData.location) {
    res.status(400).json({ error: 'Hotel name and location are required' });
    return;
  }

  const state = db.getState();
  const newHotel: HotelListing = {
    id: hotelData.id || `htl_${Date.now()}`,
    name: hotelData.name,
    tagline: hotelData.tagline || 'Verified Himalayan Luxury Property',
    description: hotelData.description || 'Authentic Nepalese stay with verified high alpine standards.',
    location: hotelData.location,
    district: hotelData.district || 'Kathmandu Valley',
    region: hotelData.region || 'Central Nepal',
    address: hotelData.address || hotelData.location,
    coordinates: hotelData.coordinates || { lat: 27.7172, lng: 85.324 },
    rating: hotelData.rating || 4.8,
    reviewsCount: hotelData.reviewsCount || 0,
    starRating: hotelData.starRating || 5,
    category: hotelData.category || 'Luxury Heritage',
    basePriceNpr: hotelData.basePriceNpr || 18000,
    basePriceUsd: hotelData.basePriceUsd || 135,
    heroImage: hotelData.heroImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: hotelData.images || ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
    amenities: hotelData.amenities || ['Free High-Speed Wi-Fi', 'Heated Bedding', 'Ayurvedic Spa'],
    propertyHighlights: hotelData.propertyHighlights || ['Panoramic Views', '24/7 Mountain Desk'],
    checkInTime: hotelData.checkInTime || '14:00',
    checkOutTime: hotelData.checkOutTime || '12:00',
    policies: hotelData.policies || {
      cancellation: 'Free cancellation up to 48 hours prior to check-in.',
      childPolicy: 'Children under 6 stay free.',
      pets: 'Pets not permitted.',
      smoking: 'Designated outdoor terraces only.',
    },
    contactPhone: hotelData.contactPhone || '+977 1 4410000',
    contactEmail: hotelData.contactEmail || 'reservations@visitnepal.com',
    rooms: hotelData.rooms || [],
    reviews: hotelData.reviews || [],
  };

  state.hotels.unshift(newHotel);
  recordAudit(req.user!, 'HOTEL_CREATED', 'hotel', newHotel.id, { name: newHotel.name });
  db.save();

  res.status(201).json({ success: true, hotel: newHotel });
});

router.patch('/hotels/:id', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const hotel = state.hotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  Object.assign(hotel, req.body);
  recordAudit(req.user!, 'HOTEL_UPDATED', 'hotel', hotel.id, { changes: Object.keys(req.body) });
  db.save();

  res.json({ success: true, hotel });
});

router.delete('/hotels/:id', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const idx = state.hotels.findIndex((h) => h.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }

  const removed = state.hotels.splice(idx, 1)[0];
  recordAudit(req.user!, 'HOTEL_DELETED', 'hotel', removed.id, { name: removed.name });
  db.save();

  res.json({ success: true, message: `Hotel ${removed.name} removed from active catalog` });
});

// ============================================================================
// 4. PACKAGES & TOUR MANAGEMENT
// ============================================================================
router.get('/packages', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (_req, res) => {
  const state = db.getState();
  res.json({ count: state.packages.length, packages: state.packages });
});

router.post('/packages', requireAuth, requireRole('super_admin', 'agency', 'business'), (req: AuthRequest, res) => {
  const state = db.getState();
  const data = req.body;
  if (!data.title || !data.destinationId) {
    res.status(400).json({ error: 'Package title and destination are required' });
    return;
  }

  const newPackage: TrekkingPackage = {
    id: data.id || `pkg_${Date.now()}`,
    businessId: req.user!.role === 'super_admin' ? (data.businessId || 'biz_1') : (state.businesses.find(b => b.ownerId === req.user!.id)?.id || 'biz_1'),
    businessName: data.businessName || 'Himalayan Sherpa Expeditions',
    title: data.title,
    destinationId: data.destinationId,
    difficulty: data.difficulty || 'Moderate',
    durationDays: data.durationDays || 12,
    maxElevationM: data.maxElevationM || 5364,
    priceNpr: data.priceNpr || 185000,
    groupSizeMax: data.groupSizeMax || 12,
    bestSeasons: data.bestSeasons || ['Mar - May', 'Oct - Dec'],
    inclusions: data.inclusions || ['TIMS Permits', 'Certified Guide', 'Lodge Accommodation'],
    exclusions: data.exclusions || ['Personal gear', 'International flights', 'Travel insurance'],
    requiredGear: data.requiredGear || ['Down Jacket', 'Thermal Layers', 'Sturdy Trekking Boots'],
    safetyGuidelines: data.safetyGuidelines || ['Acclimatize gradually', 'Stay hydrated'],
    itinerary: data.itinerary || [{ day: 1, title: 'Arrival & Briefing', elevation: '1400m', desc: 'Kathmandu pre-trip meeting' }],
    availableDates: data.availableDates || ['2026-04-01', '2026-05-01', '2026-10-01'],
  };

  state.packages.unshift(newPackage);
  recordAudit(req.user!, 'PACKAGE_CREATED', 'package', newPackage.id, { title: newPackage.title, priceNpr: newPackage.priceNpr });
  db.save();

  res.status(201).json({ success: true, package: newPackage });
});

router.patch('/packages/:id', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const pkg = state.packages.find((p) => p.id === req.params.id);
  if (!pkg) {
    res.status(404).json({ error: 'Package not found' });
    return;
  }

  Object.assign(pkg, req.body);
  recordAudit(req.user!, 'PACKAGE_UPDATED', 'package', pkg.id, { changes: Object.keys(req.body) });
  db.save();

  res.json({ success: true, package: pkg });
});

router.delete('/packages/:id', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const idx = state.packages.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Package not found' });
    return;
  }

  const removed = state.packages.splice(idx, 1)[0];
  recordAudit(req.user!, 'PACKAGE_DELETED', 'package', removed.id, { title: removed.title });
  db.save();

  res.json({ success: true, message: `Package ${removed.title} deleted` });
});

// ============================================================================
// 5. BOOKINGS & OPERATIONS
// ============================================================================
router.get('/bookings', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req, res) => {
  const { status, q } = req.query as { status?: string; q?: string };
  const state = db.getState();
  let bookings = state.bookings;

  if (status && status !== 'All') {
    bookings = bookings.filter((b) => b.status === status);
  }
  if (q) {
    const query = q.toLowerCase();
    bookings = bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(query) ||
        (b.userName && b.userName.toLowerCase().includes(query)) ||
        (b.title && b.title.toLowerCase().includes(query)) ||
        (b.hotelName && b.hotelName.toLowerCase().includes(query))
    );
  }

  res.json({ count: bookings.length, bookings });
});

// PATCH /api/admin/bookings/:id - Reassign staff, reschedule, change status
router.patch('/bookings/:id', requireAuth, requireRole('super_admin', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const { status, assignedGuideId, assignedGuideName, assignedButlerId, assignedButlerName, meetingPoint } = req.body;
  const previousStatus = booking.status;

  if (status) booking.status = status;
  if (assignedGuideId) booking.assignedGuideId = assignedGuideId;
  if (assignedGuideName) booking.assignedGuideName = assignedGuideName;
  if (assignedButlerId) booking.assignedButlerId = assignedButlerId;
  if (assignedButlerName) booking.assignedButlerName = assignedButlerName;
  if (meetingPoint) booking.meetingPoint = meetingPoint;
  booking.updatedAt = new Date().toISOString();

  recordAudit(req.user!, 'BOOKING_MODIFIED', 'booking', booking.id, {
    previousStatus,
    newStatus: booking.status,
    assignedGuide: booking.assignedGuideName,
    assignedButler: booking.assignedButlerName,
  });

  db.save();
  res.json({ success: true, booking });
});

// POST /api/admin/bookings/:id/refund - Process Refund
router.post('/bookings/:id/refund', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { amountNpr, reason } = req.body;
  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const refundAmount = amountNpr || booking.totalAmountNpr;
  booking.status = 'refunded';
  booking.paymentStatus = 'refunded';
  booking.refundAmountNpr = refundAmount;
  booking.refundStatus = 'processed';
  booking.updatedAt = new Date().toISOString();

  const refundEntry: RefundRecord = {
    id: `REF_${Date.now()}`,
    bookingId: booking.id,
    travelerId: booking.userId,
    travelerName: booking.userName || 'Verified Traveler',
    amountNpr: refundAmount,
    reason: reason || 'Authorized Super Admin cancellation settlement',
    status: 'approved',
    processedBy: req.user!.id,
    processedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  state.refunds.unshift(refundEntry);
  recordAudit(req.user!, 'BOOKING_REFUND_PROCESSED', 'booking', booking.id, {
    refundAmount,
    traveler: booking.userName || 'Verified Traveler',
    reason: refundEntry.reason,
  });

  db.save();
  res.json({ success: true, message: `Refund of NPR ${refundAmount.toLocaleString()} processed successfully`, refund: refundEntry });
});

// ============================================================================
// 6. FINANCIALS, COMMISSIONS & PAYOUTS
// ============================================================================
router.get('/finances', requireAuth, requireRole('super_admin'), (_req, res) => {
  const state = db.getState();

  const totalGrossBookingValueNpr = state.bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, b) => acc + (b.totalAmountNpr || 0), 0);

  const commissionPercent = state.platformSettings?.commissions?.agencyCommissionPercent || 12;
  const platformCommissionNpr = Math.round((totalGrossBookingValueNpr * commissionPercent) / 100);

  const completedPayoutsNpr = (state.payouts || [])
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amountNpr, 0);

  const pendingPayoutsNpr = (state.payouts || [])
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amountNpr, 0);

  const refundsTotalNpr = (state.refunds || [])
    .filter((r) => r.status === 'approved')
    .reduce((acc, r) => acc + r.amountNpr, 0);

  res.json({
    metrics: {
      totalGrossBookingValueNpr,
      platformCommissionNpr,
      netPlatformRevenueNpr: platformCommissionNpr - refundsTotalNpr,
      completedPayoutsNpr,
      pendingPayoutsNpr,
      refundsTotalNpr,
    },
    commissionRules: state.platformSettings.commissions,
    taxSettings: state.platformSettings.taxes,
    payouts: state.payouts || [],
    refunds: state.refunds || [],
    transactions: state.payments || [],
  });
});

router.patch('/finances/commission-rules', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { agencyCommissionPercent, hotelCommissionPercent, guideCommissionPercent, butlerDailyCompensationNpr } = req.body;
  const state = db.getState();

  if (!state.platformSettings.commissions) {
    state.platformSettings.commissions = {
      agencyCommissionPercent: 12,
      hotelCommissionPercent: 10,
      guideCommissionPercent: 5,
      butlerDailyCompensationNpr: 6000,
    };
  }

  const prev = { ...state.platformSettings.commissions };
  if (typeof agencyCommissionPercent === 'number') state.platformSettings.commissions.agencyCommissionPercent = agencyCommissionPercent;
  if (typeof hotelCommissionPercent === 'number') state.platformSettings.commissions.hotelCommissionPercent = hotelCommissionPercent;
  if (typeof guideCommissionPercent === 'number') state.platformSettings.commissions.guideCommissionPercent = guideCommissionPercent;
  if (typeof butlerDailyCompensationNpr === 'number') state.platformSettings.commissions.butlerDailyCompensationNpr = butlerDailyCompensationNpr;

  recordAudit(req.user!, 'COMMISSION_RULES_UPDATED', 'finance', 'commissions', {
    previous: prev,
    updated: state.platformSettings.commissions,
  });

  db.save();
  res.json({ success: true, commissions: state.platformSettings.commissions });
});

router.post('/finances/payouts/:id/process', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { decision, notes } = req.body as { decision: 'completed' | 'rejected'; notes?: string };
  const state = db.getState();
  const payout = (state.payouts || []).find((p) => p.id === req.params.id);

  if (!payout) {
    res.status(404).json({ error: 'Payout record not found' });
    return;
  }

  payout.status = decision === 'completed' ? 'completed' : 'rejected';
  payout.processedBy = req.user!.id;
  payout.processedAt = new Date().toISOString();
  if (notes) payout.notes = notes;

  recordAudit(req.user!, `PAYOUT_${decision.toUpperCase()}`, 'payout', payout.id, {
    recipient: payout.recipientName,
    amountNpr: payout.amountNpr,
  });

  db.save();
  res.json({ success: true, payout });
});

// CSV Financial Statement Export
router.get('/finances/export-csv', requireAuth, requireRole('super_admin'), (_req, res) => {
  const state = db.getState();
  const rows = [
    ['Transaction ID', 'Booking ID', 'Amount (NPR)', 'Payment Gateway', 'Status', 'Date'],
    ...state.payments.map((p) => [
      p.id,
      p.bookingId,
      p.amountNpr.toString(),
      p.provider,
      p.status,
      p.createdAt,
    ]),
  ];

  const csvContent = rows.map((e) => e.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="visitnepal-transactions-2026.csv"');
  res.send(csvContent);
});

// ============================================================================
// 7. CONTENT MANAGEMENT SYSTEM (CMS)
// ============================================================================
router.get('/cms', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (_req, res) => {
  const state = db.getState();
  res.json({ cms: state.cmsContent });
});

router.patch('/cms', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const { heroBanner, announcements, travelAdvisories } = req.body;

  if (heroBanner) state.cmsContent.heroBanner = { ...state.cmsContent.heroBanner, ...heroBanner };
  if (announcements) state.cmsContent.announcements = announcements;
  if (travelAdvisories) state.cmsContent.travelAdvisories = travelAdvisories;

  recordAudit(req.user!, 'CMS_CONTENT_UPDATED', 'cms', 'homepage_and_advisories', {
    updatedSections: Object.keys(req.body),
  });

  db.save();
  res.json({ success: true, cms: state.cmsContent });
});

// ============================================================================
// 8. ROLE PERMISSION MATRIX
// ============================================================================
router.get('/permissions', requireAuth, requireRole('super_admin', 'ntb_admin', 'admin'), (_req, res) => {
  const state = db.getState();
  res.json({ permissions: state.rolePermissions });
});

router.patch('/permissions', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const { role, permissions } = req.body as { role: string; permissions: string[] };
  if (!role || !Array.isArray(permissions)) {
    res.status(400).json({ error: 'Role name and permissions array are required' });
    return;
  }

  const state = db.getState();
  const previous = state.rolePermissions[role] || [];
  state.rolePermissions[role] = permissions;

  recordAudit(req.user!, 'PERMISSIONS_MATRIX_UPDATED', 'role_permissions', role, {
    role,
    previousCount: previous.length,
    newCount: permissions.length,
  });

  db.save();
  res.json({ success: true, role, permissions: state.rolePermissions[role] });
});

// ============================================================================
// 9. PLATFORM SETTINGS
// ============================================================================
router.get('/settings', requireAuth, requireRole('super_admin'), (_req, res) => {
  const state = db.getState();
  res.json({ settings: state.platformSettings });
});

router.patch('/settings', requireAuth, requireRole('super_admin'), (req: AuthRequest, res) => {
  const state = db.getState();
  const { general, taxes, commissions } = req.body;

  if (general) state.platformSettings.general = { ...state.platformSettings.general, ...general };
  if (taxes) state.platformSettings.taxes = { ...state.platformSettings.taxes, ...taxes };
  if (commissions) state.platformSettings.commissions = { ...state.platformSettings.commissions, ...commissions };

  recordAudit(req.user!, 'PLATFORM_SETTINGS_UPDATED', 'settings', 'global', {
    updatedSections: Object.keys(req.body),
  });

  db.save();
  res.json({ success: true, settings: state.platformSettings });
});

// ============================================================================
// 10. AUDIT LOGS & SYSTEM HEALTH
// ============================================================================
router.get('/audit-logs', requireAuth, requireRole('super_admin'), (req, res) => {
  const { action, actorRole, q } = req.query as { action?: string; actorRole?: string; q?: string };
  const state = db.getState();
  let logs = state.auditLogs;

  if (action && action !== 'All') {
    logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
  }
  if (actorRole && actorRole !== 'All') {
    logs = logs.filter((l) => l.actorRole.toLowerCase() === actorRole.toLowerCase());
  }
  if (q) {
    const query = q.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.actorName.toLowerCase().includes(query) ||
        l.action.toLowerCase().includes(query) ||
        l.targetType.toLowerCase().includes(query) ||
        l.targetId.toLowerCase().includes(query)
    );
  }

  res.json({ count: logs.length, logs });
});

router.get('/system-health', requireAuth, requireRole('super_admin'), (_req, res) => {
  const state = db.getState();
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeHours: (uptimeSeconds / 3600).toFixed(2),
    memoryRssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
    heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
    database: {
      usersCount: state.users.length,
      bookingsCount: state.bookings.length,
      hotelsCount: state.hotels.length,
      packagesCount: state.packages.length,
      auditLogsCount: state.auditLogs.length,
    },
    notificationsDeliveryStatus: 'active',
  });
});

export default router;
