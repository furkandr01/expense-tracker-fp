import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Budget services
export const budgetService = {
  getBudgets: () => api.get('/budget'),
  createBudget: (budgetData) => api.post('/budget', budgetData),
  updateBudget: (id, budgetData) => api.put(`/budget/${id}`, budgetData),
  deleteBudget: (id) => api.delete(`/budget/${id}`),
};

// Financial advice services
export const financialService = {
  getAdvice: () => api.get('/financial'),
  createAdvice: (adviceData) => api.post('/financial', adviceData),
  updateAdvice: (id, adviceData) => api.put(`/financial/${id}`, adviceData),
  deleteAdvice: (id) => api.delete(`/financial/${id}`),
};

export default api; 