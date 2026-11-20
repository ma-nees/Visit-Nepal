import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthUser {
  id: string;
  email: string;
  role: 'traveler' | 'business' | 'guide' | 'butler' | 'admin';
  name: string;
  username?: string;
  avatarUrl?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

const personaMap: Record<string, AuthUser> = {
  traveler: { id: 'usr_traveler_1', email: 'aayush.traveler@visitnepal.com', name: 'Aayush Pradhan', role: 'traveler', username: 'aayush_pradhan' },
  business: { id: 'usr_business_1', email: 'partner@himalayanexpeditions.com', name: 'Himalayan Sherpa Expeditions', role: 'business', username: 'himalayan_expeditions' },
  guide: { id: 'usr_guide_1', email: 'pasang.sherpa@visitnepal.com', name: 'Pasang Nuru Sherpa', role: 'guide', username: 'pasang_sherpa' },
  butler: { id: 'usr_butler_1', email: 'sherpa.butler@visitnepal.com', name: 'Pemba Tenzing Sherpa', role: 'butler', username: 'pemba_butler' },
  admin: { id: 'usr_admin_1', email: 'officer@ntb.gov.np', name: 'Kritish Shrestha (NTB Officer)', role: 'admin', username: 'ntb_official' },
};

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = header.slice(7);

  // Support local dev tokens
  if (token.startsWith('token-')) {
    const roleKey = token.replace('token-', '');
    req.user = personaMap[roleKey] || personaMap.traveler;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = header.slice(7);

  if (token.startsWith('token-')) {
    const roleKey = token.replace('token-', '');
    req.user = personaMap[roleKey] || personaMap.traveler;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser;
    req.user = decoded;
  } catch {
    // Ignore invalid token on optional auth
  }
  next();
}

export function requireRole(...roles: AuthUser['role'][]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient role permissions' });
      return;
    }
    next();
  };
}
