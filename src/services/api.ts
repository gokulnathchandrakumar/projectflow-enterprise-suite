import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('projectflow_jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Session Expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('projectflow_jwt_token');
      localStorage.removeItem('projectflow_user_data');
      window.dispatchEvent(new CustomEvent('auth:session_expired', {
        detail: { message: error.response?.data?.message || 'Your session has expired. Please log in again.' }
      }));
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const authApi = {
  register: async (payload: { fullName: string; email: string; password: string }) => {
    const res = await apiClient.post('/auth/register', payload);
    return res.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', payload);
    return res.data;
  },
  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

// --- Projects Endpoints ---
export const projectApi = {
  getProjects: async (params?: { search?: string; status?: string }) => {
    const res = await apiClient.get('/projects', { params });
    return res.data;
  },
  getProjectById: async (id: string) => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data;
  },
  createProject: async (payload: {
    name: string;
    description?: string;
    status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    startDate: string;
    endDate: string;
  }) => {
    const res = await apiClient.post('/projects', payload);
    return res.data;
  },
  updateProject: async (id: string, payload: Partial<{
    name: string;
    description?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    startDate: string;
    endDate: string;
  }>) => {
    const res = await apiClient.put(`/projects/${id}`, payload);
    return res.data;
  },
  deleteProject: async (id: string) => {
    const res = await apiClient.delete(`/projects/${id}`);
    return res.data;
  },
};

// --- Tasks Endpoints ---
export const taskApi = {
  getTasks: async (params?: {
    projectId?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    search?: string;
  }) => {
    const res = await apiClient.get('/tasks', { params });
    return res.data;
  },
  getTaskById: async (id: string) => {
    const res = await apiClient.get(`/tasks/${id}`);
    return res.data;
  },
  createTask: async (payload: {
    projectId: string;
    name: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate: string;
  }) => {
    const res = await apiClient.post('/tasks', payload);
    return res.data;
  },
  updateTask: async (id: string, payload: Partial<{
    name: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate: string;
    projectId?: string;
  }>) => {
    const res = await apiClient.put(`/tasks/${id}`, payload);
    return res.data;
  },
  deleteTask: async (id: string) => {
    const res = await apiClient.delete(`/tasks/${id}`);
    return res.data;
  },
};

// --- Dashboard Endpoints ---
export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard');
    return res.data;
  },
};
