import { Router } from 'express';
import { db, PermitApplication } from '../data/dbStore';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

export const officialPermitTypes = [
  {
    type: 'TIMS Card',
    authority: 'Nepal Tourism Board (NTB) & TAAN',
    feeNpr: 2000,
    description: 'Mandatory Trekkers Information Management System security pass for all trekking routes in Nepal.',
    requiredDocuments: ['Valid Passport Copy', 'PP Photo', 'Travel Insurance Policy', 'Emergency Contact Detail'],
    processingTime: '24 Hours',
  },
  {
    type: 'Sagarmatha National Park Entry',
    authority: 'Department of National Parks and Wildlife Conservation (DNPWC)',
    feeNpr: 3000,
    description: 'Official conservation entry pass for Khumbu, Everest Base Camp, and Gokyo Lakes.',
    requiredDocuments: ['Valid Passport Copy', 'Entry Date & Route'],
    processingTime: 'Immediate / Online',
  },
  {
    type: 'Annapurna Conservation Area (ACAP)',
    authority: 'National Trust for Nature Conservation (NTNC)',
    feeNpr: 3000,
    description: 'Entry pass for Annapurna Circuit, Base Camp, Poon Hill, and Mardi Himal.',
    requiredDocuments: ['Passport Copy', 'Entry Route'],
    processingTime: 'Immediate / Online',
  },
  {
    type: 'Upper Mustang Restricted Area',
    authority: 'Department of Immigration, Government of Nepal',
    feeNpr: 65000,
    description: 'Special restricted-area permit for entering the historic Kingdom of Lo north of Kagbeni. Minimum group size of 2 with certified guide required by Nepal Government law.',
    requiredDocuments: ['Valid Passport & Visa Copy', 'Licensed Agency Voucher', 'IFMGA/NMA Guide Assignment Certificate'],
    processingTime: '2 - 3 Working Days',
  },
  {
    type: 'Manaslu Circuit Restricted Area',
    authority: 'Department of Immigration, Government of Nepal',
    feeNpr: 15000,
    description: 'Restricted area permit for trekking around Mt. Manaslu (8,163m) through Larkya La Pass.',
    requiredDocuments: ['Passport Copy', 'Guide Verification', 'Expedition Roster'],
    processingTime: '2 - 3 Working Days',
  },
];

// GET /api/permits/types
router.get('/types', (_req, res) => {
  res.json({
    permitTypes: officialPermitTypes,
    disclaimer:
      'Official permits are processed in accordance with Nepal Ministry of Culture, Tourism & Civil Aviation (MoCTCA) regulations. Online applications receive an application receipt immediately; official permit issuance occurs upon authorized NTB or Department of Immigration verification.',
  });
});

// GET /api/permits/my-applications
router.get('/my-applications', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const applications = state.permits.filter((p) => p.userId === req.user?.id);
  res.json({ count: applications.length, permits: applications });
});

// POST /api/permits/apply (Submit Permit Application)
router.post('/apply', requireAuth, (req: AuthRequest, res) => {
  const {
    permitType,
    travelerName,
    passportNumber,
    nationality,
    route,
    startDate,
    endDate,
    emergencyContact,
    insurancePolicyNumber,
    supportingDocuments = [],
  } = req.body as {
    permitType?: PermitApplication['permitType'];
    travelerName?: string;
    passportNumber?: string;
    nationality?: string;
    route?: string;
    startDate?: string;
    endDate?: string;
    emergencyContact?: string;
    insurancePolicyNumber?: string;
    supportingDocuments?: Array<{ id: string; name: string; url: string }>;
  };

  if (!permitType || !passportNumber || !route) {
    res.status(400).json({ error: 'Permit type, passport number, and trekking route are required' });
    return;
  }

  const permitInfo = officialPermitTypes.find((p) => p.type === permitType);
  const feeNpr = permitInfo?.feeNpr || 2000;
  const state = db.getState();
  const user = req.user!;
  const appId = `PMT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;

  const newApplication: PermitApplication = {
    id: appId,
    userId: user.id,
    travelerName: travelerName || user.name,
    passportNumber,
    nationality: nationality || 'International',
    permitType: permitType as PermitApplication['permitType'],
    route,
    startDate: startDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 86400000 * 28).toISOString().split('T')[0],
    emergencyContact: emergencyContact || 'Not Specified',
    insurancePolicyNumber: insurancePolicyNumber || 'Mandatory Evacuation Covered',
    supportingDocuments,
    status: 'submitted',
    feeNpr,
    isReceipt: true, // Marked transparently as an application receipt until approved by authorized officer
    createdAt: new Date().toISOString(),
  };

  state.permits.unshift(newApplication);

  // Notify traveler
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: user.id,
    title: 'Permit Application Lodged',
    body: `Your application receipt #${appId} for ${permitType} is lodged for NTB review.`,
    type: 'permit',
    link: '/services',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  // Notify admin officers
  state.notifications.unshift({
    id: `notif_${Date.now() + 1}`,
    userId: 'usr_admin_1',
    title: 'New Permit Awaiting Review',
    body: `${newApplication.travelerName} submitted ${permitType} (${appId}).`,
    type: 'permit',
    link: '/portals/admin',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();

  res.status(201).json({
    permit: newApplication,
    receiptNotice:
      'Application receipt generated. This document acknowledges submission to the official NTB review queue. It does not replace the official verified permit until approved.',
  });
});

// GET /api/permits/admin/queue (NTB Officer Review Queue)
router.get('/admin/queue', requireAuth, requireRole('admin'), (_req, res) => {
  const state = db.getState();
  res.json({
    queue: state.permits,
    pendingCount: state.permits.filter((p) => p.status === 'submitted' || p.status === 'under_review').length,
  });
});

// PATCH /api/permits/admin/:id/decide (Authorized Officer Approval / Rejection)
router.patch('/admin/:id/decide', requireAuth, requireRole('admin'), (req: AuthRequest, res) => {
  const { decision, notes } = req.body as {
    decision: 'approved' | 'rejected' | 'additional_info_required';
    notes?: string;
  };

  if (!decision) {
    res.status(400).json({ error: 'Decision (approved, rejected, additional_info_required) is required' });
    return;
  }

  const state = db.getState();
  const permit = state.permits.find((p) => p.id === req.params.id);

  if (!permit) {
    res.status(404).json({ error: 'Permit application not found' });
    return;
  }

  const officer = req.user!;
  permit.status = decision;
  permit.decisionNotes = notes || `Processed by authorized NTB Officer ${officer.name}`;
  permit.decidedAt = new Date().toISOString();

  if (decision === 'approved') {
    permit.isReceipt = false;
    permit.permitOfficialNumber = `NTB-${permit.permitType.replace(/[^A-Z]/g, '')}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
    permit.issuedBy = `${officer.name} (Nepal Tourism Board)`;
  }

  // Audit record
  state.auditLogs.unshift({
    id: `audit_${Date.now()}`,
    actorId: officer.id,
    actorName: officer.name,
    actorRole: officer.role,
    action: `PERMIT_${decision.toUpperCase()}`,
    targetType: 'permit',
    targetId: permit.id,
    details: {
      permitType: permit.permitType,
      traveler: permit.travelerName,
      officialNumber: permit.permitOfficialNumber,
      notes,
    },
    timestamp: new Date().toISOString(),
  });

  // Notify traveler
  state.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: permit.userId,
    title: `Permit Decision: ${permit.permitType} (${decision.toUpperCase()})`,
    body:
      decision === 'approved'
        ? `Your official permit has been issued (Permit #${permit.permitOfficialNumber}).`
        : `Your application status is: ${decision}. Note: ${permit.decisionNotes}`,
    type: 'permit',
    link: '/services',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  db.save();

  res.json({
    permit,
    message: `Permit application #${permit.id} decision successfully recorded as ${decision}.`,
  });
});

export default router;
