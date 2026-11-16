/**
 * Visit Nepal Platform - Centralized Production API Client
 * Connects frontend UI components to the Express + TypeScript REST API.
 */

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:8080/api`;
  }
  return 'http://localhost:8080/api';
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('vn_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(
        errBody.error || `API error ${res.status}: ${res.statusText}`
      );
    }
    return (await res.json()) as T;
  } catch (err: any) {
    // Graceful offline fallback: suppress noisy console warning when backend is offline or unauthenticated
    if (process.env.NODE_ENV === 'development' && err.message !== 'Failed to fetch' && !err.message.includes('401')) {
      console.debug(`[API Info] ${endpoint}:`, err.message);
    }
    throw err;
  }
}

// ============================================================================
// AUTHENTICATION & SESSIONS
// ============================================================================

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'traveler' | 'business' | 'guide' | 'butler' | 'admin';
    status: string;
    phone?: string;
    avatarUrl?: string;
    bio?: string;
    kycStatus: string;
  };
}

export const api = {
  auth: {
    async login(email: string, password?: string, role?: string): Promise<AuthResponse> {
      const res = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      if (typeof window !== 'undefined' && res.token) {
        localStorage.setItem('vn_auth_token', res.token);
        localStorage.setItem('vn_user', JSON.stringify(res.user));
      }
      return res;
    },

    async register(data: {
      email: string;
      password?: string;
      name: string;
      role?: string;
      phone?: string;
    }): Promise<AuthResponse> {
      const res = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (typeof window !== 'undefined' && res.token) {
        localStorage.setItem('vn_auth_token', res.token);
        localStorage.setItem('vn_user', JSON.stringify(res.user));
      }
      return res;
    },

    async me(): Promise<{ user: any; roleDetails?: any; unreadNotificationsCount: number }> {
      return request('/auth/me');
    },

    logout(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vn_auth_token');
        localStorage.removeItem('vn_user');
      }
    },
  },

  // ============================================================================
  // DESTINATIONS & PACKAGES
  // ============================================================================

  destinations: {
    async list(params?: { category?: string; q?: string; region?: string }): Promise<{ count: number; destinations: any[] }> {
      const query = new URLSearchParams(params as any).toString();
      return request(`/destinations${query ? `?${query}` : ''}`);
    },

    async get(id: string): Promise<{ destination: any; packages: any[] }> {
      return request(`/destinations/${id}`);
    },

    async create(data: any): Promise<{ destination: any }> {
      return request('/destinations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  packages: {
    async list(params?: { destinationId?: string; difficulty?: string; maxDays?: number }): Promise<{ count: number; packages: any[] }> {
      const query = new URLSearchParams(params as any).toString();
      return request(`/packages${query ? `?${query}` : ''}`);
    },

    async get(id: string): Promise<{ package: any; destination?: any }> {
      return request(`/packages/${id}`);
    },

    async create(data: any): Promise<{ package: any }> {
      return request('/packages', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  services: {
    async list(params?: { category?: string; provider?: string }): Promise<{ count: number; services: any[] }> {
      const query = new URLSearchParams(params as any).toString();
      return request(`/services${query ? `?${query}` : ''}`);
    },

    async create(data: any): Promise<{ service: any }> {
      return request('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async delete(id: string): Promise<{ success: boolean }> {
      return request(`/services/${id}`, { method: 'DELETE' });
    },
  },

  // ============================================================================
  // CUSTOM EXPEDITION PLANNER
  // ============================================================================

  customPlans: {
    async calculate(data: any): Promise<{ estimatedBudgetNpr: number; budgetBreakdown: any; detectedPermits?: any[]; currency: string; disclaimer: string }> {
      return request('/custom-plans/calculate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async list(): Promise<{ count: number; customPlans: any[] }> {
      return request('/custom-plans');
    },

    async get(id: string): Promise<{ customPlan: any }> {
      return request(`/custom-plans/${id}`);
    },

    async save(data: any): Promise<{ customPlan: any }> {
      return request('/custom-plans', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async quote(id: string, quotationData: {
      quotedAmountNpr: number;
      remarks?: string;
      alternativeRouteNotes?: string;
      itemizedBreakdown?: any;
    }): Promise<{ quotation: any; customPlan: any }> {
      return request(`/custom-plans/${id}/quote`, {
        method: 'POST',
        body: JSON.stringify(quotationData),
      });
    },

    async acceptQuote(id: string, quoteId: string): Promise<{ success: boolean; customPlan: any; booking: any }> {
      return request(`/custom-plans/${id}/quotations/${quoteId}/accept`, {
        method: 'POST',
      });
    },

    async rejectQuote(id: string, quoteId: string, feedback?: string): Promise<{ success: boolean; customPlan: any }> {
      return request(`/custom-plans/${id}/quotations/${quoteId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ feedback }),
      });
    },

    async reject(id: string, reason?: string): Promise<{ success: boolean; customPlan: any }> {
      return request(`/custom-plans/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },

    async convertToBooking(id: string): Promise<{ success: boolean; booking: any }> {
      return request(`/custom-plans/${id}/convert-booking`, {
        method: 'POST',
      });
    },
  },

  // ============================================================================
  // BOOKINGS & QR PASSES
  // ============================================================================

  bookings: {
    async list(params?: { status?: string; bookingType?: string; q?: string } | string): Promise<{ count: number; bookings: any[] }> {
      if (typeof params === 'string') {
        return request(`/bookings?status=${encodeURIComponent(params)}`);
      }
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.bookingType) query.append('bookingType', params.bookingType);
      if (params?.q) query.append('q', params.q);
      const qs = query.toString();
      return request(`/bookings${qs ? `?${qs}` : ''}`);
    },

    async get(id: string): Promise<{ booking: any }> {
      return request(`/bookings/${id}`);
    },

    async create(data: {
      title: string;
      provider?: string;
      category?: string;
      date?: string;
      amount?: number | string;
      participants?: Array<{ fullName: string; nationality: string; passportNumber?: string }>;
      participantsCount?: number;
      serviceId?: string;
      businessId?: string;
      meetingPoint?: string;
      contactPhone?: string;
      bookingType?: 'standard' | 'custom';
      customTripId?: string;
      optionsAndAddons?: Array<{ name: string; priceNpr?: number; costNpr?: number; note?: string }>;
      priceBreakdown?: {
        baseAmountNpr: number;
        addonsAmountNpr?: number;
        serviceChargeNpr: number;
        vatNpr: number;
        totalNpr: number;
      };
      travelerDetails?: {
        leadTravelerName: string;
        leadEmail: string;
        leadPhone: string;
        leadNationality?: string;
        passportNumber?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        dietaryOrMedicalNotes?: string;
      };
      initialStatus?: string;
    }): Promise<{ booking: any }> {
      return request('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updateStatus(id: string, status: string, reason?: string): Promise<{ booking: any }> {
      return request(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
      });
    },

    async assignStaff(id: string, staff: { guideId?: string; butlerId?: string }): Promise<{ booking: any }> {
      return request(`/bookings/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify(staff),
      });
    },

    async cancel(id: string): Promise<{ success: boolean; booking: any }> {
      return request(`/bookings/${id}/cancel`, {
        method: 'POST',
      });
    },

    async verifyPass(qrCode: string): Promise<{
      valid: boolean;
      status: string;
      passToken: string;
      bookingId: string;
      expeditionTitle: string;
      leadTraveler: string;
      participantsCount: number;
      provider: string;
      assignedGuide: string;
      assignedButler: string;
      dates: string;
      verificationAgency: string;
      timestamp: string;
    }> {
      return request(`/bookings/verify/${encodeURIComponent(qrCode)}`);
    },
  },

  // ============================================================================
  // PERMITS & VERIFICATIONS
  // ============================================================================

  permits: {
    async getTypes(): Promise<{ permitTypes: any[]; disclaimer: string }> {
      return request('/permits/types');
    },

    async getMyApplications(): Promise<{ count: number; permits: any[] }> {
      return request('/permits/my-applications');
    },

    async apply(data: {
      permitType: string;
      travelerName?: string;
      passportNumber: string;
      nationality?: string;
      route: string;
      startDate?: string;
      endDate?: string;
      emergencyContact?: string;
      insurancePolicyNumber?: string;
      supportingDocuments?: any[];
    }): Promise<{ permit: any; receiptNotice: string }> {
      return request('/permits/apply', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getAdminQueue(): Promise<{ queue: any[]; pendingCount: number }> {
      return request('/permits/admin/queue');
    },

    async decide(id: string, decision: 'approved' | 'rejected' | 'additional_info_required', notes?: string): Promise<{ permit: any }> {
      return request(`/permits/admin/${id}/decide`, {
        method: 'PATCH',
        body: JSON.stringify({ decision, notes }),
      });
    },
  },

  // ============================================================================
  // PAYMENTS (NPR Sandbox & Live Verify)
  // ============================================================================

  payments: {
    async initiate(bookingId: string, provider: 'Khalti' | 'eSewa' | 'Stripe' | 'Bank Transfer'): Promise<any> {
      return request('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({ bookingId, provider }),
      });
    },

    async verify(transactionId: string, status: 'successful' | 'failed' = 'successful'): Promise<any> {
      return request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ transactionId, status }),
      });
    },

    async getReceipt(id: string): Promise<any> {
      return request(`/payments/receipt/${id}`);
    },
  },

  // ============================================================================
  // PORTALS (Business, Guide, Butler, Admin)
  // ============================================================================

  portals: {
    async getBusinessDashboard(): Promise<any> {
      return request('/portals/business/dashboard');
    },

    async getGuideDashboard(): Promise<any> {
      return request('/portals/guide/dashboard');
    },

    async toggleGuideAvailability(isAvailable?: boolean): Promise<{ success: boolean; isAvailable: boolean }> {
      return request('/portals/guide/availability', {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable }),
      });
    },

    async submitGuideReport(data: any): Promise<{ success: boolean }> {
      return request('/portals/guide/expedition-report', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getButlerDashboard(): Promise<any> {
      return request('/portals/butler/dashboard');
    },

    async getAdminDashboard(): Promise<any> {
      return request('/portals/admin/dashboard');
    },

    async getAdminUsers(params?: { role?: string; q?: string }): Promise<{ count: number; users: any[] }> {
      const query = new URLSearchParams(params as any).toString();
      return request(`/portals/admin/users${query ? `?${query}` : ''}`);
    },

    async updateUserStatus(id: string, status: 'active' | 'suspended' | 'banned'): Promise<any> {
      return request(`/portals/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    async approveBusinessKyc(id: string): Promise<any> {
      return request(`/portals/admin/businesses/${id}/approve`, {
        method: 'PATCH',
      });
    },

    async getAuditLogs(): Promise<{ logs: any[] }> {
      return request('/portals/admin/audit-logs');
    },
  },

  // ============================================================================
  // COMMUNITY & MESSAGING
  // ============================================================================

  community: {
    async getPosts(): Promise<{ count: number; posts: any[] }> {
      return request('/community');
    },

    async createPost(data: { content: string; location?: string; mediaUrl?: string }): Promise<{ post: any }> {
      return request('/community', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async toggleLike(id: string): Promise<{ liked: boolean; likesCount: number }> {
      return request(`/community/${id}/like`, { method: 'POST' });
    },

    async addComment(id: string, text: string): Promise<{ comment: any; commentsCount: number }> {
      return request(`/community/${id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
    },
  },

  chat: {
    async getConversations(): Promise<{ count: number; conversations: any[] }> {
      return request('/chat/conversations');
    },

    async getMessages(conversationId: string): Promise<{ conversation: any; messages: any[] }> {
      return request(`/chat/conversations/${conversationId}/messages`);
    },

    async sendMessage(conversationId: string, content: string): Promise<{ message: any }> {
      return request(`/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },

    async startConversation(data: {
      recipientUserId?: string;
      recipientName?: string;
      recipientRole?: string;
      initialMessage?: string;
    }): Promise<{ conversation: any }> {
      return request('/chat/start', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  schedules: {
    async list(): Promise<{ count: number; schedules: any[] }> {
      return request('/schedules');
    },

    async create(data: { title: string; date: string; time?: string; location?: string }): Promise<{ schedule: any }> {
      return request('/schedules', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async toggle(id: string): Promise<{ schedule: any }> {
      return request(`/schedules/${id}/toggle`, { method: 'PATCH' });
    },
  },

  notifications: {
    async list(): Promise<{ count: number; unreadCount: number; notifications: any[] }> {
      return request('/notifications');
    },

    async markAllRead(): Promise<{ success: boolean }> {
      return request('/notifications/mark-all-read', { method: 'PATCH' });
    },
  },

  safety: {
    async getRadar(): Promise<{ radar: any[]; emergencyHotlines: any; disclaimer: string }> {
      return request('/safety/radar');
    },

    async sendSos(data: {
      location?: string;
      latitude?: number;
      longitude?: number;
      altitudeM?: number;
      emergencyType?: string;
      details?: string;
    }): Promise<any> {
      return request('/safety/sos', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};
