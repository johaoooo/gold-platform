import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer l'expiration du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          if (typeof window !== 'undefined') {
            window.location.href = '/connexion';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data: { username: string; email: string; password: string; role: string; phone?: string }) =>
  api.post('/auth/register/', data);

export const login = (username: string, password: string) =>
  api.post('/auth/connexion/', { username, password });

export const getProfile = () => api.get('/auth/profile/');

// Projets
export const getProjects = (filters?: { secteur?: string; localisation?: string; montant_min?: number; montant_max?: number }) =>
  api.get('/projects/', { params: filters });

export const getProject = (id: number) => api.get(`/projects/${id}/`);

export const createProject = (data: any) => api.post('/projects/', data);

// Investissements
export const createInvestment = (projet_id: number, montant: number, message?: string) =>
  api.post('/investments/create/', { projet_id, montant, message });

export const getMyInvestments = () => api.get('/investments/my/');

export const acceptInvestment = (id: number) => api.post(`/investments/${id}/accept/`);

export const rejectInvestment = (id: number) => api.post(`/investments/${id}/reject/`);

export default api;
