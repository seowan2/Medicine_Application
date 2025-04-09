// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// API 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// 의약품 관련 API
export const medicationAPI = {
  search: (params) => api.get('/medications/search', { params }),
  getById: (id) => api.get(`/medications/${id}`),
  getAll: (page = 1, limit = 10) => api.get('/medications', { params: { page, limit } }),
};

// 사용자 의약품 관련 API
export const userMedicationAPI = {
  getMyMedications: () => api.get('/user/medications'),
  addMedication: (data) => api.post('/user/medications', data),
  removeMedication: (medicationId) => api.delete(`/user/medications/${medicationId}`),
};

export default api;