// frontend/src/services/api.js - FIXED VERSION
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lead-gen-ai-backend-595294038624.asia-south2.run.app/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Attach Authorization header if token exists
    try {
      const authRaw = localStorage.getItem('auth');
      if (authRaw) {
        const { access_token } = JSON.parse(authRaw);
        if (access_token) {
          config.headers['Authorization'] = `Bearer ${access_token}`;
        }
      }
    } catch (e) { void e; }

    try {
      console.log(`🔥 Making request to: ${url}`, config);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
        if (response.status === 401) {
          try { localStorage.removeItem('auth'); } catch(e) { void e; }
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.replace('/login');
          }
        }
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('text/csv')) {
        return await response.text();
      } else {
        return await response.blob();
      }
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  // Leads API methods
  async getLeads(limit = 100, skip = 0) {
    return this.get('/leads', { limit, skip });
  }

  async getLeadDetail(leadId) {
    return this.get(`/leads/${leadId}`);
  }

  async searchLeads(query, limit = 50) {
    return this.get('/leads/search', { query, limit });
  }

  async getLeadTracking(leadId) {
    return this.get(`/leads/${leadId}/tracking`);
  }

  async updateLeadTracking(leadId, data) {
    return this.request(`/leads/${leadId}/tracking`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Auth/User methods
  async getMe() {
    return this.get('/auth/me');
  }

  async updateMe(data) {
    return this.request('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Admin methods
  async listUsers() {
    return this.get('/auth/users');
  }

  async countUsers() {
    return this.get('/auth/users/count');
  }

  async createUser({ name, email, password }) {
    return this.post('/auth/users', { name, email, password });
  }

  async forceLogoutUser(userId) {
    return this.post(`/auth/users/${userId}/logout`, {});
  }
}

export const apiClient = new ApiClient();
export default apiClient;