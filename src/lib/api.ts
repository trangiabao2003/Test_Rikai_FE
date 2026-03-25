import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/profile'),
};

// Stories
export const storiesApi = {
  getAll: () => api.get('/stories'),
  getOne: (id: number) => api.get(`/stories/${id}`),
  create: (data: unknown) => api.post('/stories', data),
  update: (id: number, data: unknown) => api.patch(`/stories/${id}`, data),
  delete: (id: number) => api.delete(`/stories/${id}`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: unknown) => api.patch(`/users/${id}`, data),
  updateRole: (id: number, role: string) => api.patch(`/users/${id}/role`, { role }),
  delete: (id: number) => api.delete(`/users/${id}`),
};
