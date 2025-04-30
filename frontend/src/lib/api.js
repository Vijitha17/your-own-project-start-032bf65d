import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const login = (credentials) => api.post('/login', credentials).then(res => res.data);
export const logout = () => api.post('/logout').then(res => res.data);
export const getCurrentUser = () => api.get('/me').then(res => res.data);

// Profile API calls
export const getProfile = () => api.get('/profile').then(res => res.data);
export const updateProfile = (data) => api.put('/profile', data).then(res => res.data);
export const changePassword = (data) => api.put('/profile/password', data).then(res => res.data);

// User Management API calls
export const getUsers = () => api.get('/users').then(res => res.data);
export const createUser = (data) => api.post('/users', data).then(res => res.data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data).then(res => res.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then(res => res.data);
export const getUsersByCollege = (collegeId) => api.get(`/users/college/${collegeId}`).then(res => res.data);
export const getUsersByDepartment = (departmentId) => api.get(`/users/department/${departmentId}`).then(res => res.data);

// College API calls
export const getColleges = () => api.get('/colleges').then(res => res.data);
export const createCollege = (data) => api.post('/colleges', data).then(res => res.data);
export const updateCollege = (id, data) => api.put(`/colleges/${id}`, data).then(res => res.data);
export const deleteCollege = (id) => api.delete(`/colleges/${id}`).then(res => res.data);

// Department API calls
export const getDepartments = () => api.get('/departments').then(res => res.data);
export const createDepartment = (data) => api.post('/departments', data).then(res => res.data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data).then(res => res.data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`).then(res => res.data);

// Location API calls
export const getLocations = () => api.get('/locations').then(res => res.data);
export const createLocation = (data) => api.post('/locations', data).then(res => res.data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data).then(res => res.data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`).then(res => res.data);

export default api;