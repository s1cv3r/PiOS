import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add authentication interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API methods
export default {
  // Dashboard data
  async getDashboardData() {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD);
    return response.data;
  },

  // Rover status
  async getRoverStatus() {
    const response = await apiClient.get(API_ENDPOINTS.ROVER_STATUS);
    return response.data;
  },

  async getRoverZones() {
    const response = await apiClient.get(API_ENDPOINTS.ROVER_ZONES);
    return response.data;
  },

  // Historical data
  async getHistoryData(params = {}) {
    const response = await apiClient.get(API_ENDPOINTS.HISTORY_DATA, { params });
    return response.data;
  },

  // Settings
  async getDeviceStatus() {
    const response = await apiClient.get(API_ENDPOINTS.DEVICE_STATUS);
    return response.data;
  },

  async getSettings() {
    const response = await apiClient.get(API_ENDPOINTS.APP_SETTINGS);
    return response.data;
  },

  async saveSettings(settings) {
    const response = await apiClient.post(API_ENDPOINTS.APP_SETTINGS, settings);
    return response.data;
  },

  async exportData(format = 'csv') {
    const response = await apiClient.get(API_ENDPOINTS.EXPORT_DATA, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // Authentication
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  async getUserProfile() {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  // Real-time updates
  connectToRealtime(callback) {
    const socket = new WebSocket(API_ENDPOINTS.REAL_TIME_UPDATES);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  }
};
