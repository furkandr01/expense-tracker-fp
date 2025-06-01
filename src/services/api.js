import axios from 'axios';

// API URL (can be modified based on development environment)
const API_URL = 'http://localhost:5001/api';

// Axios interceptors for error handling
const setupAxiosInterceptors = () => {
  // Simple request to check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL.split('/api')[0]}/health-check`, { 
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch (error) {
      console.error('Unable to connect to API server:', error);
      return false;
    }
  };

  // Check API connection
  checkApiStatus();

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      console.error('Failed to send API request:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('Failed to receive API response:', error);
      if (error.message === 'Network Error') {
        console.error('Unable to connect to backend server. Make sure the server is running.');
        error.displayMessage = 'Cannot connect to server. Please make sure the backend server is running.';
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors
setupAxiosInterceptors();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  uploadProfileImage: (imageData) => {
    const formData = new FormData();
    formData.append('profileImage', imageData);
    
    console.log('Uploading profile image:', imageData);
    
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    return api.post('/auth/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(error => {
      console.error('Profile image upload error details:', error.response?.data || error.message);
      throw error;
    });
  },
  updateTheme: (theme) => api.put('/auth/theme', { theme }),
  updateNotificationSettings: (settings) => api.put('/auth/notifications', settings),
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

// Transactions services
export const transactionService = {
  getTransactions: () => api.get('/transactions'),
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  updateTransaction: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
};

// Savings services
export const savingsService = {
  getSavings: () => api.get('/savings'),
  createSavings: (savingsData) => api.post('/savings', savingsData),
  updateSavings: (id, savingsData) => api.put(`/savings/${id}`, savingsData),
  deleteSavings: (id) => api.delete(`/savings/${id}`),
  addToSavings: (id, amount) => api.put(`/savings/${id}/add`, { amount }),
};

// Loans services
export const loanService = {
  getLoans: () => api.get('/loans'),
  createLoan: (loanData) => api.post('/loans', loanData),
  updateLoan: (id, loanData) => api.put(`/loans/${id}`, loanData),
  deleteLoan: (id) => api.delete(`/loans/${id}`),
  addPayment: (id, paymentData) => api.put(`/loans/${id}/payment`, paymentData),
};

// Cards services
export const cardService = {
  getCards: () => api.get('/cards'),
  createCard: (cardData) => api.post('/cards', cardData),
  updateCard: (id, cardData) => api.put(`/cards/${id}`, cardData),
  deleteCard: (id) => api.delete(`/cards/${id}`),
};

// Investments services
export const investmentService = {
  getInvestments: () => api.get('/investments'),
  createInvestment: (investmentData) => api.post('/investments', investmentData),
  updateInvestment: (id, investmentData) => api.put(`/investments/${id}`, investmentData),
  deleteInvestment: (id) => api.delete(`/investments/${id}`),
  addReturn: (id, returnData) => api.put(`/investments/${id}/return`, returnData),
};

// Subscription services
export const subscriptionService = {
  getSubscriptions: () => api.get('/subscriptions'),
  createSubscription: (subscriptionData) => api.post('/subscriptions', subscriptionData),
  updateSubscription: (id, subscriptionData) => api.put(`/subscriptions/${id}`, subscriptionData),
  deleteSubscription: (id) => api.delete(`/subscriptions/${id}`),
};

// Wallet services
export const walletService = {
  getTransactions: () => api.get('/wallet/transactions'),
  createTransaction: (transactionData) => api.post('/wallet/transactions', transactionData),
  updateTransaction: (id, transactionData) => api.put(`/wallet/transactions/${id}`, transactionData),
  deleteTransaction: (id) => api.delete(`/wallet/transactions/${id}`),
  getBalance: () => api.get('/wallet/balance'),
  updateBalance: (amount) => api.put('/wallet/balance', { amount }),
  addToBalance: (amount) => api.post('/wallet/balance/add', { amount }),
  subtractFromBalance: (amount) => api.post('/wallet/balance/subtract', { amount }),
};

export default api; 