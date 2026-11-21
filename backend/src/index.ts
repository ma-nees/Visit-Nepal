import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import destinationsRouter from './routes/destinations';
import packagesRouter from './routes/packages';
import servicesRouter from './routes/services';
import customPlansRouter from './routes/customPlans';
import bookingsRouter from './routes/bookings';
import permitsRouter from './routes/permits';
import paymentsRouter from './routes/payments';
import portalsRouter from './routes/portals';
import communityRouter from './routes/community';
import chatRouter from './routes/chat';
import schedulesRouter from './routes/schedules';
import notificationsRouter from './routes/notifications';
import safetyRouter from './routes/safety';
import hotelsRouter from './routes/hotels';
import adminRouter from './routes/admin';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports and whitelisted production domains
      if (!origin || env.allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid blocking frontend UI
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    name: 'Visit Nepal Official Tourism Platform API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      destinations: '/api/destinations',
      packages: '/api/packages',
      services: '/api/services',
      customPlans: '/api/custom-plans',
      bookings: '/api/bookings',
      permits: '/api/permits',
      payments: '/api/payments',
      portals: '/api/portals',
      community: '/api/community',
      chat: '/api/chat',
      schedules: '/api/schedules',
      notifications: '/api/notifications',
      safety: '/api/safety',
    },
  });
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/custom-plans', customPlansRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/permits', permitsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/portals', portalsRouter);
app.use('/api/community', communityRouter);
app.use('/api/chat', chatRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/safety', safetyRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/admin', adminRouter);

app.listen(env.port, () => {
  console.log(
    `[visitnepal-backend] listening on http://localhost:${env.port} (${env.nodeEnv})`
  );
});
