'use client';

import { useState, useEffect } from 'react';

export interface TravelUser {
  id: string;
  name: string;
  role: string;
  email: string;
  loggedIn: boolean;
  otpVerified: boolean;
  avatarUrl?: string;
}

const DEFAULT_USER: TravelUser = {
  id: 'usr_traveler_1',
  name: 'Aayush Pradhan',
  role: 'Traveler',
  email: 'aayush.traveler@visitnepal.com',
  loggedIn: false,
  otpVerified: false,
};

// Global state singleton for components using useTravelStore
let globalUser: TravelUser = { ...DEFAULT_USER, loggedIn: false, otpVerified: false };
const listeners = new Set<(user: TravelUser) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...globalUser }));
}

export function resetGlobalAuth() {
  globalUser = { ...DEFAULT_USER, loggedIn: false, otpVerified: false };
  try {
    localStorage.removeItem('vn_user');
    localStorage.removeItem('vn_auth_token');
    localStorage.setItem('vn_logged_out', 'true');
  } catch {
    // Ignore
  }
  notify();
}

export function useTravelStore() {
  const [currentUser, setCurrentUser] = useState<TravelUser>(() => {
    if (typeof window === 'undefined') return globalUser;
    try {
      const isLoggedOut = localStorage.getItem('vn_logged_out') === 'true';
      if (isLoggedOut) {
        globalUser = { ...DEFAULT_USER, loggedIn: false, otpVerified: false };
        return globalUser;
      }
      const stored = localStorage.getItem('vn_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        globalUser = {
          id: parsed.id || 'usr_traveler_1',
          name: parsed.name || 'Explorer',
          role: parsed.role || 'Traveler',
          email: parsed.email || '',
          loggedIn: true,
          otpVerified: true,
          avatarUrl: parsed.avatarUrl,
        };
        return globalUser;
      }
    } catch {
      // LocalStorage unavailable
    }
    return globalUser;
  });

  useEffect(() => {
    const listener = (user: TravelUser) => setCurrentUser(user);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const loginUser = (name: string, role: string = 'Traveler', email: string = '') => {
    globalUser = {
      ...globalUser,
      name,
      role,
      email,
      loggedIn: true,
      otpVerified: true,
    };
    try {
      localStorage.setItem('vn_user', JSON.stringify(globalUser));
      localStorage.setItem('vn_auth_token', 'mock_jwt_token_' + Date.now());
    } catch {
      // Ignore
    }
    notify();
  };

  const verifyOtp = () => {
    globalUser = {
      ...globalUser,
      otpVerified: true,
    };
    try {
      localStorage.setItem('vn_user', JSON.stringify(globalUser));
    } catch {
      // Ignore
    }
    notify();
  };

  const logoutUser = () => {
    globalUser = {
      ...DEFAULT_USER,
      loggedIn: false,
      otpVerified: false,
    };
    try {
      localStorage.removeItem('vn_user');
      localStorage.removeItem('vn_auth_token');
    } catch {
      // Ignore
    }
    notify();
  };

  return {
    currentUser,
    loginUser,
    verifyOtp,
    logoutUser,
  };
}
