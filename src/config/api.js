const API_BASE_URL = "https://api.agri-oras.com/v1";

export const API_ENDPOINTS = {
  // Dashboard endpoints
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  WEATHER: `${API_BASE_URL}/weather/current`,
  NODE_STATUS: `${API_BASE_URL}/nodes/status`,
  ALERTS: `${API_BASE_URL}/alerts`,

  // Rover endpoints
  ROVER_STATUS: `${API_BASE_URL}/rover/status`,
  ROVER_ZONES: `${API_BASE_URL}/rover/zones`,
  ROVER_PHOTOS: `${API_BASE_URL}/rover/photos`,

  // History endpoints
  HISTORY_DATA: `${API_BASE_URL}/history`,
  HISTORY_AGGREGATE: `${API_BASE_URL}/history/aggregate`,

  // Settings endpoints
  DEVICE_STATUS: `${API_BASE_URL}/devices/status`,
  APP_SETTINGS: `${API_BASE_URL}/settings`,
  EXPORT_DATA: `${API_BASE_URL}/data/export`,

  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  USER_PROFILE: `${API_BASE_URL}/auth/profile`,

  // Real-time
  REAL_TIME_UPDATES: "wss://api.agri-oras.com/realtime"
};
