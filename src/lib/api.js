import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vigyaan_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vigyaan_token');
      localStorage.removeItem('vigyaan_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// TODO: Replace mock implementations with real API calls
export const authAPI = {
  studentSignup: (data) => api.post('/auth/student/signup', data),
  studentLogin: (data) => api.post('/auth/student/login', data),
  adminSignup: (data) => api.post('/auth/admin/signup', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
};

export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  search: (query) => api.get(`/books/search?q=${query}`),
  issue: (bookId) => api.post(`/books/${bookId}/issue`),
  returnBook: (bookId) => api.post(`/books/${bookId}/return`),
};

export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  recommend: (preferences) => api.post('/ai/recommend', { preferences }),
};

export const slotsAPI = {
  getAll: () => api.get('/slots'),
  book: (slotId) => api.post(`/slots/${slotId}/book`),
  cancel: (slotId) => api.post(`/slots/${slotId}/cancel`),
  getOccupancy: () => api.get('/slots/occupancy'),
};

export default api;
