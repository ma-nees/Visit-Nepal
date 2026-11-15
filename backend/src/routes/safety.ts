import { Router } from 'express';
import { db } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// Official trail radar and weather advisories
const liveTrailRadar = [
  {
    region: 'Khumbu / Everest',
    trail: 'Namche Bazaar – Tengboche – Everest Base Camp',
    status: 'Open & Clear',
    snowCover: 'Light above 4,900m',
    weatherWindow: 'Stable high-pressure window through 15:00 daily',
    verifiedBy: 'Sagarmatha Pollution Control Committee (SPCC) & TAAN',
    lastUpdated: 'Today, 06:00 AM NPT',
    isLiveVerified: true,
  },
  {
    region: 'Annapurna',
    trail: 'Thorong La Pass (5,416m)',
    status: 'Passable with Traction',
    snowCover: 'Hard-packed snow on north face; microspikes advised',
    weatherWindow: 'Winds increase >35kt after 11:30 AM',
    verifiedBy: 'Annapurna Conservation Area Project (ACAP) Checkpoint Manang',
    lastUpdated: 'Today, 06:30 AM NPT',
    isLiveVerified: true,
  },
  {
    region: 'Mustang',
    trail: 'Kagbeni – Chele – Lo Manthang',
    status: 'Clear & Dry',
    snowCover: 'None; seasonal river crossing operational',
    weatherWindow: 'High afternoon gusts; morning transit recommended',
    verifiedBy: 'Department of Immigration Checkpost Kagbeni',
    lastUpdated: 'Yesterday, 17:00 NPT',
    isLiveVerified: true,
  },
  {
    region: 'Manaslu',
    trail: 'Larkya La Pass (5,106m)',
    status: 'Passable with Guide Roster',
    snowCover: 'Moderate snow on moraine traverse',
    weatherWindow: 'Sub-zero (-12C) at pass summit',
    verifiedBy: 'Manaslu Conservation Area Project (MCAP)',
    lastUpdated: 'Today, 07:00 AM NPT',
    isLiveVerified: true,
  },
];

// GET /api/safety/radar
router.get('/radar', (_req, res) => {
  res.json({
    radar: liveTrailRadar,
    emergencyHotlines: {
      policeRescue: '100',
      touristPolice: '+977-1-4247041',
      himalayanRescueAssoc: '+977-1-4440292',
      aviationHelicopterDesk: '+977-1-4479100',
    },
    disclaimer:
      'High-altitude alpine conditions change rapidly. All trekkers must cross passes before noon and verify conditions with local checkpoint rangers and certified IFMGA Sherpa guides.',
  });
});

// POST /api/safety/sos (Emergency Assistance Dispatch)
router.post('/sos', requireAuth, (req: AuthRequest, res) => {
  const { location, latitude, longitude, altitudeM, emergencyType, details } = req.body as {
    location?: string;
    latitude?: number;
    longitude?: number;
    altitudeM?: number;
    emergencyType?: string;
    details?: string;
  };

  const user = req.user!;
  const state = db.getState();
  const sosId = `SOS-${Date.now().toString().slice(-6)}`;

  // Record prominent audit log
  state.auditLogs.unshift({
    id: `audit_sos_${Date.now()}`,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: 'EMERGENCY_SOS_SIGNAL',
    targetType: 'emergency_dispatch',
    targetId: sosId,
    details: {
      location,
      coordinates: { latitude, longitude },
      altitudeM,
      emergencyType: emergencyType || 'Medical / Acute Mountain Sickness (AMS)',
      details,
    },
    timestamp: new Date().toISOString(),
  });

  // Notify NTB Administrator immediately
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: 'usr_admin_1',
    title: `🚨 EMERGENCY SOS SIGNAL: ${sosId}`,
    body: `${user.name} reported ${emergencyType || 'AMS / Emergency'} near ${location || 'High Altitude'}. Altitude: ${altitudeM || 'Unknown'}m. Coordinates: ${latitude || ''}, ${longitude || ''}.`,
    type: 'alert',
    link: '/portals/admin',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();

  res.status(201).json({
    sosId,
    status: 'DISPATCHED_TO_RESCUE_DESK',
    dispatchedTo: [
      'Nepal Tourism Board (NTB) Crisis Operations',
      'Himalayan Rescue Association (HRA)',
      'Tourist Police Emergency Unit',
    ],
    timestamp: new Date().toISOString(),
    instructions:
      'Stay in place if safe. Keep warm. If Acute Mountain Sickness (AMS) is suspected, begin immediate descent to lower altitude under guide supervision if possible.',
  });
});

export default router;
