import { Router } from 'express';
import { db, TrekkingPackage } from '../data/dbStore';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/packages
router.get('/', (req, res) => {
  const { destinationId, difficulty, maxDays } = req.query as {
    destinationId?: string;
    difficulty?: string;
    maxDays?: string;
  };

  const state = db.getState();
  let results = state.packages;

  if (destinationId) {
    results = results.filter((p) => p.destinationId === destinationId);
  }

  if (difficulty && difficulty !== 'All') {
    results = results.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (maxDays) {
    const limit = Number(maxDays);
    if (!isNaN(limit)) {
      results = results.filter((p) => p.durationDays <= limit);
    }
  }

  res.json({ count: results.length, packages: results });
});

// GET /api/packages/:id
router.get('/:id', (req, res) => {
  const state = db.getState();
  const pkg = state.packages.find((p) => p.id === req.params.id);

  if (!pkg) {
    res.status(404).json({ error: 'Trekking package not found' });
    return;
  }

  const destination = state.destinations.find((d) => d.id === pkg.destinationId);
  res.json({ package: pkg, destination });
});

// POST /api/packages (Business or Admin)
router.post('/', requireAuth, requireRole('business', 'admin'), (req: AuthRequest, res) => {
  const body = req.body as Partial<TrekkingPackage>;
  if (!body.title || !body.destinationId || !body.priceNpr) {
    res.status(400).json({ error: 'Title, destinationId, and priceNpr are required' });
    return;
  }

  const state = db.getState();
  const business = state.businesses.find((b) => b.ownerId === req.user?.id);

  const newPkg: TrekkingPackage = {
    id: `pkg_${Date.now()}`,
    businessId: business?.id || 'biz_1',
    businessName: business?.name || req.user?.name || 'Visit Nepal Verified Partner',
    title: body.title,
    destinationId: body.destinationId,
    difficulty: body.difficulty || 'Moderate',
    durationDays: Number(body.durationDays || 7),
    maxElevationM: Number(body.maxElevationM || 4000),
    priceNpr: Number(body.priceNpr),
    groupSizeMax: Number(body.groupSizeMax || 10),
    bestSeasons: body.bestSeasons || ['Autumn', 'Spring'],
    inclusions: body.inclusions || ['Permits included', 'Licensed mountain guide', 'Lodge accommodations'],
    exclusions: body.exclusions || ['Personal gear', 'Travel insurance'],
    requiredGear: body.requiredGear || ['Trekking boots', 'Thermal layers'],
    safetyGuidelines: body.safetyGuidelines || ['Acclimatization compliance', 'Daily hydration monitoring'],
    itinerary: body.itinerary || [
      { day: 1, title: 'Arrival and Orientation', elevation: '1,400m', desc: 'Briefing and preparation.' },
    ],
    availableDates: body.availableDates || ['2026-04-15', '2026-05-01'],
  };

  state.packages.push(newPkg);
  db.save();

  res.status(201).json({ package: newPkg });
});

export default router;
