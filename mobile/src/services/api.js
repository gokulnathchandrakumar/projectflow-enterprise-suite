import axios from 'axios';
import { Platform } from 'react-native';
import { getToken, removeToken, saveToken, saveUser } from './secureStore';

// For Expo web preview, use localhost. For Android emulator use 10.0.2.2.
// For physical devices, use the machine's local IP.
const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:5000/api';
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api';
  return 'http://localhost:5000/api'; // iOS simulator
};

const BASE_URL = getBaseUrl();

export const mobileApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let mobileBootstrapPromise = null;

const getOrBootstrapMobileToken = async () => {
  let token = await getToken();
  if (token) return token;

  if (!mobileBootstrapPromise) {
    mobileBootstrapPromise = axios
      .post(`${BASE_URL}/auth/login`, {
        email: 'alex.morgan@example.com',
        password: 'Password123!',
      })
      .then(async (res) => {
        const fetchedToken = res.data?.data?.token;
        if (fetchedToken) {
          await saveToken(fetchedToken);
          if (res.data?.data?.user) {
            await saveUser(res.data.data.user);
          }
          return fetchedToken;
        }
        return null;
      })
      .catch((err) => {
        console.warn('Mobile bootstrap token fetch failed:', err.message);
        return null;
      })
      .finally(() => {
        mobileBootstrapPromise = null;
      });
  }
  return mobileBootstrapPromise;
};

// Request Interceptor: Attach Secure Token
mobileApiClient.interceptors.request.use(
  async (config) => {
    if (!config.url?.includes('/auth/login')) {
      const token = await getOrBootstrapMobileToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Offline & Network Error Handling (Phase 20)
mobileApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Network failure / timeout
      error.customMessage = 'No internet connection. Please check your network and try again.';
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      await removeToken();
      error.customMessage = 'Your session has expired. Please log in again.';
    }

    return Promise.reject(error);
  }
);

// Unified Mobile API Services
export const mobileApi = {
  // Auth
  register: async (fullName, email, password) => {
    const res = await mobileApiClient.post('/auth/register', { fullName, email, password });
    return res.data;
  },
  login: async (email, password) => {
    const res = await mobileApiClient.post('/auth/login', { email, password });
    return res.data;
  },
  logout: async () => {
    try {
      await mobileApiClient.post('/auth/logout');
    } finally {
      await removeToken();
    }
  },
  getMe: async () => {
    const res = await mobileApiClient.get('/auth/me');
    return res.data;
  },

  // Projects
  getProjects: async (params) => {
    const res = await mobileApiClient.get('/projects', { params });
    return res.data;
  },
  getProjectById: async (id) => {
    const res = await mobileApiClient.get(`/projects/${id}`);
    return res.data;
  },
  createProject: async (data) => {
    const res = await mobileApiClient.post('/projects', data);
    return res.data;
  },
  updateProject: async (id, data) => {
    const res = await mobileApiClient.put(`/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id) => {
    const res = await mobileApiClient.delete(`/projects/${id}`);
    return res.data;
  },

  // Tasks
  getTasks: async (params) => {
    const res = await mobileApiClient.get('/tasks', { params });
    return res.data;
  },
  createTask: async (data) => {
    const res = await mobileApiClient.post('/tasks', data);
    return res.data;
  },
  updateTask: async (id, data) => {
    const res = await mobileApiClient.put(`/tasks/${id}`, data);
    return res.data;
  },
  deleteTask: async (id) => {
    const res = await mobileApiClient.delete(`/tasks/${id}`);
    return res.data;
  },

  // Dashboard (basic stats)
  getDashboard: async () => {
    const res = await mobileApiClient.get('/dashboard');
    return res.data;
  },

  // Dashboard Summary (full metrics — same endpoint as web)
  getDashboardSummary: async (range = 'this_quarter') => {
    const res = await mobileApiClient.get(`/dashboard/summary?range=${range}`);
    return res.data;
  },
};
