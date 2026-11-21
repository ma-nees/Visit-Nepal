import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type UserRole =
  | 'super_admin'
  | 'ntb_admin'
  | 'admin'
  | 'agency'
  | 'business'
  | 'guide'
  | 'butler'
  | 'traveler';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  username?: string;
  avatarUrl?: string;
  impersonatedBy?: string; // Audit trail when Super Admin impersonates a user
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Default Role Permissions Matrix
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['*'], // Full platform control
  ntb_admin: [
    'destinations.manage',
    'content.manage',
    'reports.view',
    'users.view',
    'hotels.view',
    'hotels.approve',
    'packages.view',
    'packages.approve',
    'reviews.moderate',
  ],
  admin: [
    'destinations.manage',
    'content.manage',
    'reports.view',
    'users.view',
    'hotels.view',
    'hotels.approve',
    'packages.view',
    'packages.approve',
    'reviews.moderate',
  ],
  agency: [
    'packages.create',
    'packages.update',
    'packages.view_own',
    'bookings.view_own',
    'bookings.update_own',
    'payouts.view_own',
  ],
  business: [
    'packages.create',
    'packages.update',
    'packages.view_own',
    'bookings.view_own',
    'bookings.update_own',
    'payouts.view_own',
  ],
  guide: [
    'bookings.view_assigned',
    'itinerary.view_assigned',
    'reports.submit',
    'availability.manage',
  ],
  butler: [
    'bookings.view_assigned',
    'logistics.manage',
    'reports.submit',
    'availability.manage',
  ],
  traveler: [
    'bookings.create',
    'bookings.view_own',
    'bookings.cancel_own',
    'profile.manage',
  ],
};

const personaMap: Record<string, AuthUser> = {
  super_admin: {
    id: 'usr_super_admin_1',
    email: 'superadmin@visitnepal.com',
    name: 'Govinda Thapa (Platform Director)',
    role: 'super_admin',
    username: 'super_admin',
  },
  ntb_admin: {
    id: 'usr_ntb_admin_1',
    email: 'officer@ntb.gov.np',
    name: 'Kritish Shrestha (NTB Officer)',
    role: 'ntb_admin',
    username: 'ntb_official',
  },
  admin: {
    id: 'usr_ntb_admin_1',
    email: 'officer@ntb.gov.np',
    name: 'Kritish Shrestha (NTB Officer)',
    role: 'ntb_admin',
    username: 'ntb_official',
  },
  agency: {
    id: 'usr_business_1',
    email: 'partner@himalayanexpeditions.com',
    name: 'Himalayan Sherpa Expeditions',
    role: 'agency',
    username: 'himalayan_expeditions',
  },
  business: {
    id: 'usr_business_1',
    email: 'partner@himalayanexpeditions.com',
    name: 'Himalayan Sherpa Expeditions',
    role: 'agency',
    username: 'himalayan_expeditions',
  },
  guide: {
    id: 'usr_guide_1',
    email: 'pasang.sherpa@visitnepal.com',
    name: 'Pasang Nuru Sherpa',
    role: 'guide',
    username: 'pasang_sherpa',
  },
  butler: {
    id: 'usr_butler_1',
    email: 'sherpa.butler@visitnepal.com',
    name: 'Mingma Sherpa',
    role: 'butler',
    username: 'mingma_butler',
  },
  traveler: {
    id: 'usr_traveler_1',
    email: 'aayush.traveler@visitnepal.com',
    name: 'Aayush Pradhan',
    role: 'traveler',
    username: 'aayush_pradhan',
  },
};

export function hasPermission(
  userRole: UserRole,
  permission: string,
  dynamicMatrix?: Record<string, string[]>
): boolean {
  const matrix = dynamicMatrix || DEFAULT_ROLE_PERMISSIONS;
  const permissions = matrix[userRole] || [];
  if (permissions.includes('*')) return true;
  return permissions.includes(permission);
}

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

/**
 * Require specific role or normalized alias
 */
export function requireRole(...roles: (UserRole | string)[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRole = req.user.role;
    // Super Admin has access to everything
    if (userRole === 'super_admin') {
      next();
      return;
    }

    // Normalize aliases: 'admin' matches 'ntb_admin'; 'business' matches 'agency'
    const isMatched = roles.some((r) => {
      if (r === userRole) return true;
      if (r === 'admin' && userRole === 'ntb_admin') return true;
      if (r === 'ntb_admin' && userRole === 'admin') return true;
      if ((r === 'business' || r === 'agency') && (userRole === 'business' || userRole === 'agency')) return true;
      return false;
    });

    if (!isMatched) {
      res.status(403).json({ error: 'Insufficient role permissions' });
      return;
    }
    next();
  };
}

/**
 * Require specific granular permission
 */
export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (hasPermission(req.user.role, permission)) {
      next();
      return;
    }

    res.status(403).json({
      error: `Permission denied: Missing '${permission}' capability`,
    });
  };
}
