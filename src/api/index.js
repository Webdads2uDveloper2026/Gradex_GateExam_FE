import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerStudent = (data) => API.post('/register', data);
export const sendOTP = (phone) => API.post('/send-otp', { phone });
export const verifyOTP = (phone, otp) => API.post('/verify-otp', { phone, otp });
export const getQuestions = (phone, language) => API.get(`/questions?phone=${phone}&language=${language}`);
export const submitAssessment = (phone, answers) => API.post('/submit-assessment', { phone, answers });

export const getAdminResults = () => API.get('/admin/results');
export const getAdminQuestions = () => API.get('/admin/questions');
export const addQuestion = (data) => API.post('/admin/questions', data);
export const updateQuestion = (id, data) => API.put(`/admin/questions/${id}`, data);
export const deleteQuestion = (id) => API.delete(`/admin/questions/${id}`);
export const adminLogin = (data) => API.post('/admin/login', data);
export const deleteStudent = (id) => API.delete(`/admin/students/${id}`);
export const addBulkQuestions = (data) => API.post('/admin/questions/bulk', data);

export default API;
