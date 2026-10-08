import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let bootstrapPromise: Promise<string | null> | null = null;

const getOrBootstrapToken = async (): Promise<string | null> => {
  const token =
    localStorage.getItem('projectflow_jwt_token') ||
    localStorage.getItem('projectflow_auth_token');
  if (token) return token;

  if (!bootstrapPromise) {
    bootstrapPromise = axios
      .post(`${API_BASE_URL}/auth/login`, {
        email: 'alex.morgan@example.com',
        password: 'Password123!',
      })
      .then((res) => {
        const fetchedToken = res.data?.data?.token;
        if (fetchedToken) {
          localStorage.setItem('projectflow_jwt_token', fetchedToken);
          return fetchedToken;
        }
        return null;
      })
      .catch((err) => {
        console.warn('Bootstrap token fetch failed:', err.message);
        return null;
      })
      .finally(() => {
        bootstrapPromise = null;
      });
  }
  return bootstrapPromise;
};

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!config.url?.includes('/auth/login')) {
      const token = await getOrBootstrapToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('projectflow_jwt_token');
      localStorage.removeItem('projectflow_auth_token');
      localStorage.removeItem('projectflow_user_data');
      window.dispatchEvent(
        new CustomEvent('auth:session_expired', {
          detail: {
            message:
              error.response?.data?.message ||
              'Your session has expired. Please log in again.',
          },
        })
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
