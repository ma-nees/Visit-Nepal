import { Router } from 'express';
import { db, CustomPlan, Booking, Quotation, CustomItineraryDay } from '../data/dbStore';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Helper to detect required permits based on route/regions
function detectRequiredPermits(destinations: string[]): Array<{ id: string; name: string; feeNpr: number; authority: string; required: boolean }> {
  const permits = [
    {
      id: 'TIMS-CARD',
      name: 'Trekkers’ Information Management System (TIMS Card)',
      feeNpr: 2000,
      authority: 'Nepal Tourism Board (NTB) & TAAN',
      required: true,
    },
  ];

  const destStr = destinations.join(' ').toLowerCase();

  if (destStr.includes('everest') || destStr.includes('khumbu') || destStr.includes('gokyo')) {
    permits.push({
      id: 'SNP-ENTRY',
      name: 'Sagarmatha National Park Entry Permit',
      feeNpr: 3000,
      authority: 'Department of National Parks & Wildlife Conservation (DNPWC)',
      required: true,
    });
    permits.push({
      id: 'KPR-LOCAL',
      name: 'Khumbu Pasang Lhamu Rural Municipality Entry Tax',
      feeNpr: 2000,
      authority: 'Khumbu Pasang Lhamu Local Government',
      required: true,
    });
  }

  if (destStr.includes('annapurna') || destStr.includes('pokhara') || destStr.includes('poon')) {
    permits.push({
      id: 'ACAP-ENTRY',
      name: 'Annapurna Conservation Area Entry Permit (ACAP)',
      feeNpr: 3000,
      authority: 'National Trust for Nature Conservation (NTNC)',
      required: true,
    });
  }

  if (destStr.includes('mustang') || destStr.includes('lo manthang')) {
    permits.push({
      id: 'RAP-MUSTANG',
      name: 'Upper Mustang Special Restricted Area Permit (RAP)',
      feeNpr: 65000,
      authority: 'Department of Immigration, Government of Nepal',
      required: true,
    });
    permits.push({
      id: 'ACAP-MUSTANG',
      name: 'Annapurna Conservation Area Entry Permit (ACAP)',
      feeNpr: 3000,
      authority: 'National Trust for Nature Conservation (NTNC)',
      required: true,
    });
  }

  if (destStr.includes('manaslu')) {
    permits.push({
      id: 'RAP-MANASLU',
      name: 'Manaslu Circuit Restricted Area Permit (MRAP)',
      feeNpr: 18000,
      authority: 'Department of Immigration, Government of Nepal',
      required: true,
    });
    permits.push({
      id: 'MCAP-ENTRY',
      name: 'Manaslu Conservation Area Permit (MCAP)',
      feeNpr: 3000,
      authority: 'National Trust for Nature Conservation (NTNC)',
      required: true,
    });
  }

  if (destStr.includes('langtang') || destStr.includes('gosainkunda')) {
    permits.push({
      id: 'LNP-ENTRY',
      name: 'Langtang National Park Entry Permit',
      feeNpr: 3000,
      authority: 'Department of National Parks & Wildlife Conservation (DNPWC)',
      required: true,
    });
  }

  return permits;
}

// POST /api/custom-plans/calculate (Dynamic 7-Step Estimates calculator)
router.post('/calculate', (req, res) => {
  const {
    destinations = [],
    durationDays = 7,
    travelersCount = 2,
    adultsCount = 2,
    childrenCount = 0,
    guideRequested = true,
    porterRequested = true,
    transportRequested = true,
    butlerRequested = false,
    accommodationTier = 'Boutique Comfort',
    transportType = 'Private 4WD Scorpio',
    mealsPlan = 'All-Inclusive (3 Meals/Day)',
    equipmentRental = [],
    emergencyServices = ['Helicopter Rescue Authorization'],
  } = req.body as {
    destinations?: string[];
    durationDays?: number;
    travelersCount?: number;
    adultsCount?: number;
    childrenCount?: number;
    guideRequested?: boolean;
    porterRequested?: boolean;
    transportRequested?: boolean;
    butlerRequested?: boolean;
    accommodationTier?: string;
    transportType?: string;
    mealsPlan?: string;
    equipmentRental?: string[];
    emergencyServices?: string[];
  };

  const days = Math.max(1, Number(durationDays) || 7);
  const adults = Math.max(1, Number(adultsCount) || Number(travelersCount) || 1);
  const children = Math.max(0, Number(childrenCount) || 0);
  const totalTravelers = adults + children;

  // 1. Accommodation
  const dailyAccom =
    accommodationTier === 'Ultra-Luxury Heritage'
      ? 22000
      : accommodationTier === 'Boutique Comfort'
      ? 9500
      : accommodationTier === 'Alpine Expedition Camp'
      ? 6000
      : 3500; // Authentic Teahouse
  const accommodationNpr = dailyAccom * days * Math.ceil(totalTravelers / 2);

  // 2. Guide
  const guideNpr = guideRequested ? 8000 * days : 0;

  // 3. Porter (1 porter per 2 travelers recommended)
  const porterCount = Math.ceil(totalTravelers / 2);
  const porterNpr = porterRequested ? 3500 * days * porterCount : 0;

  // 4. Sherpa Butler
  const butlerNpr = butlerRequested ? 8500 * days : 0;

  // 5. Transport
  let transportNpr = 0;
  if (transportRequested) {
    if (transportType.includes('Flight')) {
      transportNpr = 25000 * totalTravelers; // Return mountain flights approx NPR 25,000 per person
    } else if (transportType.includes('Scorpio') || transportType.includes('Private')) {
      transportNpr = 14000 * Math.min(days, 3);
    } else {
      transportNpr = 4000 * totalTravelers; // Tourist coach
    }
  }

  // 6. Meals
  let dailyMealsPerPerson = 0;
  if (mealsPlan.includes('All-Inclusive')) {
    dailyMealsPerPerson = 3800; // Breakfast, Lunch, Dinner, hot tea
  } else if (mealsPlan.includes('Breakfast')) {
    dailyMealsPerPerson = 1200;
  }
  const mealsNpr = dailyMealsPerPerson * days * totalTravelers;

  // 7. Equipment Rental
  const equipmentNpr = (equipmentRental?.length || 0) * 800 * days;

  // 8. Detected Permits
  const detectedPermits = detectRequiredPermits(destinations);
  const permitsNpr = detectedPermits.reduce((acc, p) => acc + p.feeNpr, 0) * totalTravelers;

  // 9. Emergency Services
  const emergencyNpr = (emergencyServices?.length || 0) * 4500 * totalTravelers;

  // Subtotal
  const subtotalNpr =
    accommodationNpr +
    guideNpr +
    porterNpr +
    butlerNpr +
    transportNpr +
    mealsNpr +
    equipmentNpr +
    permitsNpr +
    emergencyNpr;

  // 10. Service Charge (10%) and Government VAT (13%)
  const serviceChargeNpr = Math.round(subtotalNpr * 0.05);
  const taxVatNpr = Math.round((subtotalNpr + serviceChargeNpr) * 0.13);
  const estimatedBudgetNpr = subtotalNpr + serviceChargeNpr + taxVatNpr;

  res.json({
    estimatedBudgetNpr,
    subtotalNpr,
    taxVatNpr,
    serviceChargeNpr,
    budgetBreakdown: {
      accommodationNpr,
      guideNpr,
      porterNpr,
      butlerNpr,
      transportNpr,
      mealsNpr,
      equipmentNpr,
      permitsNpr,
      emergencyNpr,
      activitiesNpr: 0,
      serviceChargeNpr,
      taxVatNpr,
    },
    detectedPermits,
    currency: 'NPR',
    disclaimer:
      'Official estimate formulated under Nepal Tourism Board registered operator tariff guidelines. Government permits are issued under official verification by the Department of Immigration & NTB. Quotations become binding upon agency review and mutual confirmation.',
  });
});

// GET /api/custom-plans
router.get('/', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const userId = req.user?.id;
  const userRole = req.user?.role;

  let plans: CustomPlan[] = [];
  if (userRole === 'admin' || userRole === 'business') {
    // Agencies and admins can view all custom plans for quotation and review
    plans = state.customPlans;
  } else {
    plans = state.customPlans.filter((p) => p.userId === userId);
  }

  res.json({ count: plans.length, customPlans: plans });
});

// GET /api/custom-plans/:id
router.get('/:id', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const plan = state.customPlans.find((p) => p.id === req.params.id);

  if (!plan) {
    res.status(404).json({ error: 'Custom trip plan not found' });
    return;
  }

  res.json({ customPlan: plan });
});

// POST /api/custom-plans (Submit Custom Trip Booking Request)
router.post('/', requireAuth, (req: AuthRequest, res) => {
  const body = req.body as Partial<CustomPlan>;
  if (!body.title || !body.destinations || body.destinations.length === 0) {
    res.status(400).json({ error: 'Trip title and at least one destination are required.' });
    return;
  }

  const state = db.getState();
  const days = Math.max(1, Number(body.durationDays) || 7);
  const planId = `VN-TRIP-${Date.now().toString().slice(-6)}`;
  const detectedPermits = detectRequiredPermits(body.destinations);

  const newPlan: CustomPlan = {
    id: planId,
    userId: req.user!.id,
    userName: req.user!.name,
    userEmail: req.user!.email,
    title: body.title,
    destinations: body.destinations,
    startDate: body.startDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    endDate: body.endDate,
    durationDays: days,
    travelersCount: body.travelersCount || 2,
    adultsCount: body.adultsCount || 2,
    childrenCount: body.childrenCount || 0,
    experienceLevel: body.experienceLevel || 'Intermediate',
    travelStyle: body.travelStyle || 'Boutique Comfort',
    trekkingDifficulty: body.trekkingDifficulty || 'Moderate',
    estimatedBudgetNpr: Number(body.estimatedBudgetNpr || 180000),
    budgetBreakdown: body.budgetBreakdown || {
      accommodationNpr: 45000,
      guideNpr: 56000,
      porterNpr: 24500,
      permitsNpr: 15000,
      transportNpr: 30000,
      activitiesNpr: 0,
      mealsNpr: 28000,
      equipmentNpr: 6000,
      butlerNpr: 0,
      serviceChargeNpr: 10000,
      taxVatNpr: 25000,
    },
    accommodationPreference: body.accommodationPreference || 'Boutique Heritage Lodges',
    guideRequested: body.guideRequested !== false,
    porterRequested: body.porterRequested !== false,
    transportRequested: body.transportRequested !== false,
    butlerRequested: !!body.butlerRequested,
    mealsPlan: body.mealsPlan || 'All-Inclusive (3 Meals/Day)',
    equipmentRental: body.equipmentRental || [],
    emergencyServices: body.emergencyServices || ['Helicopter Rescue Authorization'],
    detectedPermits: body.detectedPermits || detectedPermits,
    itinerary: body.itinerary || [
      { day: 1, title: 'Arrival & Welcome Briefing', destination: body.destinations[0], activity: 'Arrival & acclimatization in Kathmandu', elevation: '1,400m', distanceKm: 0, walkingHours: 0, isRestDay: true },
    ],
    travelerContact: body.travelerContact || {
      fullName: req.user!.name,
      email: req.user!.email,
      phone: (req.user as any).phone || '+977-9801234567',
      nationality: 'International / Nepal',
    },
    quotations: [],
    status: body.status === 'DRAFT' ? 'DRAFT' : 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.customPlans.unshift(newPlan);

  // Notify traveler
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: req.user!.id,
    title: 'Custom Trip Request Submitted',
    body: `Your custom itinerary "${newPlan.title}" (#${newPlan.id}) has been submitted to authorized Himalayan agencies for quotation.`,
    type: 'booking',
    link: '/dashboard',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  // Notify all tour operator businesses
  const agencyUsers = state.users.filter((u) => u.role === 'business' || u.role === 'admin');
  agencyUsers.forEach((agency, idx) => {
    state.notifications.unshift({
      id: `notif_${Date.now() + idx + 1}`,
      userId: agency.id,
      title: 'New Custom Trip Request Pending Review',
      body: `Traveler ${newPlan.userName} submitted custom expedition "${newPlan.title}" (${newPlan.durationDays} Days, ${newPlan.destinations.join(', ')}).`,
      type: 'booking',
      link: '/portals/business',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  });

  db.save();
  res.status(201).json({ success: true, customPlan: newPlan });
});

// POST /api/custom-plans/:id/quote (Agency submits revised quotation)
router.post('/:id/quote', requireAuth, requireRole('business', 'admin'), (req: AuthRequest, res) => {
  const {
    quotedAmountNpr,
    breakdown,
    agencyNotes,
    alternativeRoutesSuggested,
  } = req.body as {
    quotedAmountNpr?: number;
    breakdown?: any;
    agencyNotes?: string;
    alternativeRoutesSuggested?: string;
  };

  const state = db.getState();
  const plan = state.customPlans.find((p) => p.id === req.params.id);

  if (!plan) {
    res.status(404).json({ error: 'Custom plan not found' });
    return;
  }

  const agencyUser = req.user!;
  const business = state.businesses.find((b) => b.ownerId === agencyUser.id) || state.businesses[0];
  const quoteId = `QUO-${Date.now().toString().slice(-6)}`;

  const newQuote: Quotation = {
    id: quoteId,
    customTripId: plan.id,
    agencyId: business?.id || 'biz_1',
    agencyName: business?.name || agencyUser.name,
    quotedAmountNpr: Number(quotedAmountNpr) || plan.estimatedBudgetNpr,
    breakdown: breakdown || plan.budgetBreakdown,
    agencyNotes: agencyNotes || 'Official agency itinerary review completed with certified lead guide assignment.',
    alternativeRoutesSuggested: alternativeRoutesSuggested || '',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  if (!plan.quotations) plan.quotations = [];
  plan.quotations.unshift(newQuote);
  plan.status = 'QUOTED';
  plan.updatedAt = new Date().toISOString();

  // Notify traveler
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: plan.userId,
    title: `Official Quotation Received for "${plan.title}"`,
    body: `${newQuote.agencyName} sent an official quotation of NPR ${newQuote.quotedAmountNpr.toLocaleString()} for trip #${plan.id}. Review and accept to confirm.`,
    type: 'booking',
    link: '/dashboard',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();
  res.json({ success: true, quotation: newQuote, customPlan: plan });
});

// POST /api/custom-plans/:id/quotations/:quoteId/accept (Traveler accepts quotation)
router.post('/:id/quotations/:quoteId/accept', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const plan = state.customPlans.find((p) => p.id === req.params.id);

  if (!plan) {
    res.status(404).json({ error: 'Custom plan not found' });
    return;
  }

  if (plan.userId !== req.user!.id && req.user!.role !== 'admin') {
    res.status(403).json({ error: 'Only the requesting traveler may accept this quotation.' });
    return;
  }

  const quote = plan.quotations?.find((q) => q.id === req.params.quoteId);
  if (!quote) {
    res.status(404).json({ error: 'Quotation not found on this trip' });
    return;
  }

  quote.status = 'ACCEPTED';
  quote.respondedAt = new Date().toISOString();
  plan.status = 'CONFIRMED';
  plan.updatedAt = new Date().toISOString();

  // Create corresponding confirmed Booking
  const bookingId = `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`;
  const invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 89999)}`;
  const now = new Date().toISOString();

  const newBooking: Booking = {
    id: bookingId,
    bookingType: 'custom',
    customTripId: plan.id,
    invoiceNumber: invoiceNum,
    userId: plan.userId,
    userName: plan.userName,
    userEmail: plan.userEmail || req.user!.email,
    businessId: quote.agencyId,
    title: `Custom Expedition: ${plan.title}`,
    provider: quote.agencyName,
    category: 'Custom Expedition',
    date: `${plan.startDate} (${plan.durationDays} Days)`,
    participantsCount: plan.travelersCount || 2,
    participants: [
      { fullName: plan.travelerContact?.fullName || plan.userName, nationality: plan.travelerContact?.nationality || 'Nepal / International', passportNumber: plan.travelerContact?.passportNumber },
    ],
    travelerDetails: plan.travelerContact,
    totalAmountNpr: quote.quotedAmountNpr,
    priceBreakdown: {
      basePriceNpr: Math.round(quote.quotedAmountNpr * 0.8),
      addOnsNpr: Math.round(quote.quotedAmountNpr * 0.1),
      serviceChargeNpr: Math.round(quote.quotedAmountNpr * 0.03),
      taxVatNpr: Math.round(quote.quotedAmountNpr * 0.07),
      totalAmountNpr: quote.quotedAmountNpr,
    },
    status: 'CONFIRMED',
    paymentStatus: 'unpaid',
    qrCode: `VN-PASS-${bookingId}-CONFIRMED-2026`,
    meetingPoint: 'Kathmandu International Airport or Hotel Rendezvous',
    contactPhone: '+977-1-4412345',
    createdAt: now,
    updatedAt: now,
  };

  plan.bookingId = bookingId;
  state.bookings.unshift(newBooking);

  // Notify agency
  const agencyUser = state.users.find((u) => u.role === 'business');
  if (agencyUser) {
    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: agencyUser.id,
      title: 'Quotation Accepted by Traveler!',
      body: `${plan.userName} accepted your quotation of NPR ${quote.quotedAmountNpr.toLocaleString()} for #${plan.id}. Booking #${bookingId} confirmed.`,
      type: 'booking',
      link: '/portals/business',
      isRead: false,
      createdAt: now,
    });
  }

  db.save();
  res.json({
    success: true,
    message: 'Quotation accepted and booking successfully confirmed!',
    booking: newBooking,
    customPlan: plan,
  });
});

// POST /api/custom-plans/:id/quotations/:quoteId/reject (Traveler rejects quotation)
router.post('/:id/quotations/:quoteId/reject', requireAuth, (req: AuthRequest, res) => {
  const { reason } = req.body as { reason?: string };
  const state = db.getState();
  const plan = state.customPlans.find((p) => p.id === req.params.id);

  if (!plan) {
    res.status(404).json({ error: 'Custom plan not found' });
    return;
  }

  const quote = plan.quotations?.find((q) => q.id === req.params.quoteId);
  if (!quote) {
    res.status(404).json({ error: 'Quotation not found' });
    return;
  }

  quote.status = 'REJECTED';
  quote.respondedAt = new Date().toISOString();
  plan.status = 'PENDING_REVIEW'; // Back to pending review for potential re-quote
  plan.rejectionReason = reason || 'Traveler requested quotation adjustment';
  plan.updatedAt = new Date().toISOString();

  db.save();
  res.json({ success: true, message: 'Quotation declined. Agency notified for revision.', customPlan: plan });
});

// POST /api/custom-plans/:id/reject (Agency rejects custom trip)
router.post('/:id/reject', requireAuth, requireRole('business', 'admin'), (req: AuthRequest, res) => {
  const { reason } = req.body as { reason?: string };
  const state = db.getState();
  const plan = state.customPlans.find((p) => p.id === req.params.id);

  if (!plan) {
    res.status(404).json({ error: 'Custom plan not found' });
    return;
  }

  plan.status = 'REJECTED';
  plan.rejectionReason = reason || 'Permit quota unavailable or extreme seasonal weather constraints.';
  plan.updatedAt = new Date().toISOString();

  // Notify traveler
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: plan.userId,
    title: `Update on Custom Trip "${plan.title}"`,
    body: `Your custom expedition request #${plan.id} could not be confirmed: ${plan.rejectionReason}`,
    type: 'alert',
    link: '/dashboard',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();
  res.json({ success: true, customPlan: plan });
});

export default router;
