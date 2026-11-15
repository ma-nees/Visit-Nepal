import { Router } from 'express';
import { db, ServiceListing } from '../data/dbStore';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/services
router.get('/', (req, res) => {
  const { category, provider } = req.query as {
    category?: string;
    provider?: string;
  };

  const state = db.getState();
  let results = state.services;

  if (category && category !== 'All') {
    results = results.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (provider) {
    results = results.filter((s) => s.providerName.toLowerCase().includes(provider.toLowerCase()));
  }

  res.json({ count: results.length, services: results });
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const state = db.getState();
  const service = state.services.find((s) => s.id === req.params.id);

  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  res.json({ service });
});

// POST /api/services (Business, Guide, Butler, or Admin)
router.post(
  '/',
  requireAuth,
  requireRole('business', 'guide', 'butler', 'admin'),
  (req: AuthRequest, res) => {
    const body = req.body as Partial<ServiceListing>;
    if (!body.title || !body.category || !body.priceNpr) {
      res.status(400).json({ error: 'Title, category, and priceNpr are required' });
      return;
    }

    const state = db.getState();
    const newService: ServiceListing = {
      id: `srv_${Date.now()}`,
      businessId: req.user?.role === 'business' ? `biz_${req.user.id}` : undefined,
      providerName: body.providerName || req.user?.name || 'Verified Partner',
      category: body.category as ServiceListing['category'],
      title: body.title,
      description: body.description || '',
      location: body.location || 'Nepal',
      priceNpr: Number(body.priceNpr),
      duration: body.duration || 'Per Booking',
      rating: 5.0,
      reviewsCount: 0,
      imageUrl:
        body.imageUrl ||
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      availability: body.availability || ['Daily Availability'],
    };

    state.services.push(newService);
    db.save();

    res.status(201).json({ service: newService });
  }
);

// DELETE /api/services/:id (Admin or Provider)
router.delete('/:id', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const index = state.services.findIndex((s) => s.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  state.services.splice(index, 1);
  db.save();

  res.json({ success: true, message: 'Service removed successfully' });
});

export default router;
