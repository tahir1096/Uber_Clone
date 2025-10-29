import axios from 'axios';

const API_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User endpoints
export const userAPI = {
  register: (data) => api.post('/user/register', data),
  login: (data) => api.post('/user/login', data),
  logout: () => api.post('/user/logout'),
  getProfile: () => api.get('/user/profile'),
};

// Captain endpoints
export const captainAPI = {
  register: (data) => api.post('/captain/register', data),
  login: (data) => api.post('/captain/login', data),
  logout: () => api.post('/captain/logout'),
  getProfile: () => api.get('/captain/profile'),
};

// Ride endpoints
export const rideAPI = {
  bookRide: (data) => api.post('/ride/book', data),
  getUserRides: () => api.get('/ride/user-rides'),
  getRideById: (rideId) => api.get(`/ride/${rideId}`),
  cancelRide: (rideId) => api.post('/ride/cancel', { rideId }),
  rateRide: (data) => api.post('/ride/rate', data),
  acceptRide: (rideId) => api.post('/ride/accept', { rideId }),
  completeRide: (rideId, otp) => api.post('/ride/complete', { rideId, otp }),
  getCaptainRides: () => api.get('/ride/captain-rides'),
  getAvailableRides: () => api.get('/ride/available-rides'),
  getCaptainRating: (captainId) => api.get(`/ride/captain/${captainId}/rating`),
};

export default api;
