import { Router } from 'express';
import { db, Destination } from '../data/dbStore';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/destinations
router.get('/', (req, res) => {
  const { category, q, region } = req.query as {
    category?: string;
    q?: string;
    region?: string;
  };

  const state = db.getState();
  let results = state.destinations.filter((d) => d.status === 'published');

  if (category && category !== 'All') {
    results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }

  if (region && region !== 'All') {
    results = results.filter((d) => d.region.toLowerCase().includes(region.toLowerCase()));
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.region.toLowerCase().includes(query) ||
        d.tag.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
    );
  }

  res.json({ count: results.length, destinations: results });
});

// GET /api/destinations/:id
router.get('/:id', (req, res) => {
  const state = db.getState();
  const dest = state.destinations.find((d) => d.id === req.params.id);

  if (!dest) {
    res.status(404).json({ error: 'Destination not found' });
    return;
  }

  // Related packages
  const relatedPackages = state.packages.filter((p) => p.destinationId === dest.id);

  res.json({
    destination: dest,
    packages: relatedPackages,
  });
});

// POST /api/destinations (Admin only)
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const body = req.body as Partial<Destination>;
  if (!body.name || !body.category) {
    res.status(400).json({ error: 'Name and category are required' });
    return;
  }

  const id = body.id || `dest_${body.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const newDest: Destination = {
    id,
    name: body.name,
    category: body.category || 'High Himalaya',
    region: body.region || 'Nepal Himalaya',
    altitude: body.altitude || '1,400m',
    bestSeason: body.bestSeason || 'Spring & Autumn',
    duration: body.duration || '7 Days',
    image: body.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
    tag: body.tag || 'Himalayan Wonder',
    description: body.description || '',
    highlights: body.highlights || [],
    attractions: body.attractions || [],
    coordinates: body.coordinates || { lat: 28.0, lng: 85.0 },
    status: 'published',
    rating: 5.0,
    reviewsCount: 0,
  };

  const state = db.getState();
  state.destinations.push(newDest);
  db.save();

  res.status(201).json({ destination: newDest });
});

export default router;
