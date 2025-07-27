import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API calls
export const adminAPI = {
  getAll: () => api.get('/admin'),
  getById: (id) => api.get(`/admin/${id}`),
  create: (data) => api.post('/admin', data),
  update: (id, data) => api.put(`/admin/${id}`, data),
  delete: (id) => api.delete(`/admin/${id}`),
};

// Doctor API calls
export const doctorAPI = {
  getAll: () => api.get('/doctor'),
  getById: (id) => api.get(`/doctor/${id}`),
  create: (data) => api.post('/doctor', data),
  update: (id, data) => api.put(`/doctor/${id}`, data),
  delete: (id) => api.delete(`/doctor/${id}`),
};

// Appointment API calls
export const appointmentAPI = {
  getAll: () => api.get('/appointment'),
  getById: (id) => api.get(`/appointment/${id}`),
  create: (data) => api.post('/appointment', data),
  update: (id, data) => api.put(`/appointment/${id}`, data),
  delete: (id) => api.delete(`/appointment/${id}`),
  getByUserId: (userId) => api.get(`/appointment/user/${userId}`),
  getByDoctorId: (doctorId) => api.get(`/appointment/doctor/${doctorId}`),
};

// Payment API calls
export const paymentAPI = {
  getAll: () => api.get('/payment'),
  getById: (id) => api.get(`/payment/${id}`),
  create: (data) => api.post('/payment', data),
  update: (id, data) => api.put(`/payment/${id}`, data),
  delete: (id) => api.delete(`/payment/${id}`),
  getByUserId: (userId) => api.get(`/payment/user/${userId}`),
  getByAppointmentId: (appointmentId) => api.get(`/payment/appointment/${appointmentId}`),
};

export default api; 