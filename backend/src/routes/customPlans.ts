import { Router } from 'express';
import { db, CustomPlan, Booking } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/custom-plans/calculate (Estimates calculator)
router.post('/calculate', (req, res) => {
  const {
    destinations = [],
    durationDays = 7,
    guideRequested = false,
    transportRequested = false,
    butlerRequested = false,
    accommodationTier = 'Standard',
  } = req.body as {
    destinations?: string[];
    durationDays?: number;
    guideRequested?: boolean;
    transportRequested?: boolean;
    butlerRequested?: boolean;
    accommodationTier?: string;
  };

  const days = Math.max(1, Number(durationDays) || 7);

  // Daily base accommodation rate based on tier
  const dailyAccom = accommodationTier === 'Luxury Heritage' ? 18000 : accommodationTier === 'Boutique' ? 8500 : 4500;
  const accommodationNpr = dailyAccom * days;

  // Guide cost
  const guideNpr = guideRequested ? 8000 * days : 0;

  // Sherpa Butler cost
  const butlerNpr = butlerRequested ? 6000 * days : 0;

  // Transport estimate
  const transportNpr = transportRequested ? 10000 * Math.min(days, 4) : 0;

  // Permits estimate based on destinations
  let permitsNpr = 5000; // Base TIMS + conservation
  if (destinations.includes('mustang-kingdom') || destinations.includes('mustang')) {
    permitsNpr += 65000; // Restricted area permit
  }
  if (destinations.includes('manaslu-circuit') || destinations.includes('manaslu')) {
    permitsNpr += 15000;
  }

  // Activities estimate
  const activitiesNpr = destinations.length * 4000;

  const estimatedBudgetNpr =
    accommodationNpr + guideNpr + butlerNpr + transportNpr + permitsNpr + activitiesNpr;

  res.json({
    estimatedBudgetNpr,
    budgetBreakdown: {
      accommodationNpr,
      guideNpr,
      permitsNpr,
      transportNpr,
      activitiesNpr,
      butlerNpr,
    },
    currency: 'NPR',
    disclaimer:
      'This estimated calculation is generated based on standard seasonal rates and selected service preferences. It is not a binding financial quotation until reviewed and confirmed by service providers.',
  });
});

// GET /api/custom-plans
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const userId = req.user?.id;

  const plans =
    req.user?.role === 'admin'
      ? state.customPlans
      : state.customPlans.filter((p) => p.userId === userId);

  res.json({ count: plans.length, customPlans: plans });
});

// POST /api/custom-plans (Save draft or submit plan)
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const body = req.body as Partial<CustomPlan>;
  if (!body.title || !body.destinations || body.destinations.length === 0) {
    res.status(400).json({ error: 'Title and at least one destination are required' });
    return;
  }

  const state = db.getState();
  const days = Math.max(1, Number(body.durationDays) || 7);
  const planId = `PLN-${Date.now().toString().slice(-6)}`;

  const newPlan: CustomPlan = {
    id: planId,
    userId: req.user!.id,
    userName: req.user!.name,
    title: body.title,
    destinations: body.destinations,
    startDate: body.startDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    durationDays: days,
    trekkingDifficulty: body.trekkingDifficulty || 'Moderate',
    estimatedBudgetNpr: Number(body.estimatedBudgetNpr || 120000),
    budgetBreakdown: body.budgetBreakdown || {
      accommodationNpr: 35000,
      guideNpr: 40000,
      permitsNpr: 15000,
      transportNpr: 20000,
      activitiesNpr: 10000,
      butlerNpr: 0,
    },
    accommodationPreference: body.accommodationPreference || 'Standard Tea Houses',
    guideRequested: !!body.guideRequested,
    transportRequested: !!body.transportRequested,
    butlerRequested: !!body.butlerRequested,
    itinerary: body.itinerary || [
      { day: 1, destination: body.destinations[0], activity: 'Arrival & acclimatization', elevation: '1,400m' },
    ],
    status: (body.status as CustomPlan['status']) || 'submitted',
    createdAt: new Date().toISOString(),
  };

  state.customPlans.unshift(newPlan);

  // Add notification
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: req.user!.id,
    title: 'Custom Expedition Plan Saved',
    body: `Your custom itinerary "${newPlan.title}" has been saved.`,
    type: 'booking',
    link: '/custom-plan',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();
  res.status(201).json({ customPlan: newPlan });
});

// POST /api/custom-plans/:id/convert-booking (Convert approved custom plan into a real booking)
router.post('/:id/convert-booking', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const plan = state.customPlans.find((p) => p.id === req.params.id);

  if (!plan) {
    res.status(404).json({ error: 'Custom plan not found' });
    return;
  }

  const bookingId = `BKG-${Math.floor(10000 + Math.random() * 89999)}`;
  const newBooking: Booking = {
    id: bookingId,
    userId: plan.userId,
    userName: plan.userName,
    userEmail: req.user!.email,
    businessId: 'biz_1',
    title: `Custom Expedition: ${plan.title}`,
    provider: 'Himalayan Sherpa Expeditions',
    category: 'Custom Expedition',
    date: `${plan.startDate} (${plan.durationDays} Days)`,
    participantsCount: 1,
    participants: [{ fullName: plan.userName, nationality: 'Nepal / International' }],
    totalAmountNpr: plan.estimatedBudgetNpr,
    status: 'pending',
    paymentStatus: 'unpaid',
    qrCode: `VN-PASS-${bookingId}-PENDING`,
    meetingPoint: 'Tribhuvan International Airport or Kathmandu Hotel',
    contactPhone: '+977-1-4412345',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  plan.status = 'converted_to_booking';
  state.bookings.unshift(newBooking);

  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: plan.userId,
    title: 'Custom Plan Converted to Booking',
    body: `Booking #${bookingId} has been created from your custom plan.`,
    type: 'booking',
    link: '/bookings',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();

  res.status(201).json({
    success: true,
    message: 'Custom plan converted to booking request successfully',
    booking: newBooking,
  });
});

export default router;
