import CONFIG from '../config.js';
import SecureStorage from '../storage.js';

class APIClient {
  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
    this.timeout = CONFIG.API.TIMEOUT;
  }

  /**
   * Get authorization headers
   */
  getHeaders() {
    const token = SecureStorage.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  /**
   * Make HTTP request with error handling
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        method: options.method || 'GET',
        headers: this.getHeaders(),
        timeout: this.timeout,
        ...options
      };

      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new APIError(
          error.error?.message || response.statusText || 'Request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(error.message, 500, { error });
    }
  }

  // Auth Endpoints
  async register(data) {
    return this.request('/auth/register', {
      method: 'POST',
      body: data
    });
  }

  async login(phone, pin) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { phone, pin }
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async verifyEmail(email, code) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: { email, code }
    });
  }

  async resendOtp(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: { email }
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Participant Endpoints
  async getProfile() {
    return this.request('/participants/profile');
  }

  async updateProfile(data) {
    return this.request('/participants/profile', {
      method: 'PUT',
      body: data
    });
  }

  async getPaymentStatus() {
    return this.request('/participants/payment-status');
  }

  // Payment Endpoints
  async submitPayment(formData) {
    const token = SecureStorage.getAuthToken();
    return fetch(`${this.baseURL}/payments/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(res => {
      if (!res.ok) throw new Error('Payment submission failed');
      return res.json();
    });
  }

  async getPaymentHistory(limit = 10, offset = 0) {
    return this.request(`/payments/history?limit=${limit}&offset=${offset}`);
  }

  // Admin Endpoints
  async getAllParticipants(page = 1, limit = 10, status = null) {
    let url = `/participants?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return this.request(url);
  }

  async updateParticipantStatus(participantId, status, notes = '', rejectionReason = '') {
    return this.request(`/participants/${participantId}/status`, {
      method: 'PUT',
      body: { status, notes, rejectionReason }
    });
  }

  async getAllPayments(page = 1, limit = 10, status = null) {
    let url = `/payments?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return this.request(url);
  }

  async verifyPayment(paymentId, notes = '') {
    return this.request(`/payments/${paymentId}/verify`, {
      method: 'PUT',
      body: { verificationNotes: notes }
    });
  }

  async rejectPayment(paymentId, reason) {
    return this.request(`/payments/${paymentId}/reject`, {
      method: 'PUT',
      body: { rejectionReason: reason }
    });
  }
}

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

export default new APIClient();
