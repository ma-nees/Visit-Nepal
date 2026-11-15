import { Router } from 'express';
import { db, PaymentTransaction } from '../data/dbStore';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/payments/initiate
router.post('/initiate', requireAuth, (req: AuthRequest, res) => {
  const { bookingId, provider = 'Khalti' } = req.body as {
    bookingId?: string;
    provider?: PaymentTransaction['provider'];
  };

  if (!bookingId) {
    res.status(400).json({ error: 'bookingId is required' });
    return;
  }

  const state = db.getState();
  const booking = state.bookings.find((b) => b.id === bookingId);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const txnId = `TXN-${provider.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const amountNpr = booking.totalAmountNpr;

  const newTxn: PaymentTransaction = {
    id: txnId,
    bookingId: booking.id,
    userId: req.user!.id,
    amountNpr,
    currency: 'NPR',
    provider: provider || 'Khalti',
    status: 'pending',
    receiptUrl: `/receipts/${txnId}.pdf`,
    createdAt: new Date().toISOString(),
  };

  state.payments.unshift(newTxn);
  db.save();

  // Return sandbox checkout payload
  res.json({
    transaction: newTxn,
    checkoutMode: 'sandbox',
    currency: 'NPR',
    amountNpr,
    provider,
    paymentGatewayUrl: `https://test-pay.visitnepal.gov.np/checkout?txn=${txnId}&amount=${amountNpr}&curr=NPR`,
    note: 'In sandbox test mode, submit payment token to /api/payments/verify to complete verification.',
  });
});

// POST /api/payments/verify (Verify transaction and confirm booking)
router.post('/verify', requireAuth, (req: AuthRequest, res) => {
  const { transactionId, providerTxnId, status = 'successful' } = req.body as {
    transactionId?: string;
    providerTxnId?: string;
    status?: PaymentTransaction['status'];
  };

  if (!transactionId) {
    res.status(400).json({ error: 'transactionId is required for verification' });
    return;
  }

  const state = db.getState();
  const txn = state.payments.find((t) => t.id === transactionId);

  if (!txn) {
    res.status(404).json({ error: 'Payment transaction record not found' });
    return;
  }

  const isSuccess = status === 'successful';
  txn.status = isSuccess ? 'successful' : 'failed';
  txn.providerTxnId = providerTxnId || `GATEWAY-${Date.now()}`;

  const booking = state.bookings.find((b) => b.id === txn.bookingId);
  if (booking && isSuccess) {
    booking.paymentStatus = 'successful';
    booking.status = 'confirmed';
    booking.paymentId = txn.id;
    booking.paymentMethod = `${txn.provider} (NPR)`;
    booking.qrCode = `VN-PASS-${booking.id}-VERIFIED-2026`;
    booking.updatedAt = new Date().toISOString();

    // Create schedule item
    state.schedules.unshift({
      id: `sch_${Date.now()}`,
      userId: booking.userId,
      role: 'traveler',
      title: `Confirmed: ${booking.title}`,
      date: booking.date.split(' to ')[0] || new Date().toISOString().split('T')[0],
      time: '07:00 AM',
      location: booking.meetingPoint,
      status: 'upcoming',
      bookingId: booking.id,
    });

    // Notify user
    state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: booking.userId,
      title: 'Payment Confirmed & Pass Issued',
      body: `Payment of NPR ${txn.amountNpr.toLocaleString()} for "${booking.title}" verified. Your digital QR pass is ready.`,
      type: 'payment',
      link: '/bookings',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  db.save();

  res.json({
    verified: isSuccess,
    transaction: txn,
    booking,
    receipt: {
      receiptNumber: `REC-${txn.id}`,
      payerName: booking?.userName || req.user?.name,
      amountNpr: txn.amountNpr,
      currency: 'NPR',
      date: txn.createdAt,
      paymentMethod: txn.provider,
      status: txn.status,
    },
  });
});

// GET /api/payments/receipt/:id
router.get('/receipt/:id', requireAuth, (req: AuthRequest, res) => {
  const state = db.getState();
  const txn = state.payments.find((t) => t.id === req.params.id);

  if (!txn) {
    res.status(404).json({ error: 'Receipt not found' });
    return;
  }

  const booking = state.bookings.find((b) => b.id === txn.bookingId);

  res.json({
    receiptNumber: `REC-${txn.id}`,
    transactionId: txn.id,
    providerReference: txn.providerTxnId,
    bookingId: txn.bookingId,
    serviceTitle: booking?.title || 'Nepal Tourism Service',
    payer: booking?.userName,
    amountNpr: txn.amountNpr,
    currency: 'NPR',
    date: txn.createdAt,
    status: txn.status,
    authorizedBy: 'Nepal Tourism Board Settlement Desk',
  });
});

export default router;
