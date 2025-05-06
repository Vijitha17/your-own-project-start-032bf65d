import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject({
        message: error.response.data?.message || 'Request failed',
        response: error.response
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server',
        request: error.request
      });
    }
    return Promise.reject({
      message: error.message || 'Unknown error'
    });
  }
);

// Auth API
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Profile API
export const getProfile = () => api.get('/auth/profile').then(res => res.data);
export const updateProfile = (data) => api.put('/auth/profile', data).then(res => res.data);
export const changePassword = (data) => api.put('/auth/profile/password', data).then(res => res.data);

// User Management API
export const getUsers = () => api.get('/auth/users').then(res => res.data);
export const createUser = (data) => api.post('/auth/users', data).then(res => res.data);
export const updateUser = (id, data) => api.put(`/auth/users/${id}`, data).then(res => res.data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`).then(res => res.data);

// College API
export const getColleges = async () => {
  try {
    const response = await api.get('/colleges');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Get colleges error:', error);
    throw error;
  }
};

export const createCollege = async (collegeData) => {
  try {
    const response = await api.post('/colleges', collegeData);
    return response.data;
  } catch (error) {
    console.error('Create college error:', error);
    throw error;
  }
};

export const updateCollege = async (id, collegeData) => {
  try {
    const response = await api.put(`/colleges/${id}`, collegeData);
    return response.data;
  } catch (error) {
    console.error('Update college error:', error);
    throw error;
  }
};

export const deleteCollege = async (id) => {
  try {
    const response = await api.delete(`/colleges/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete college error:', error);
    throw error;
  }
};

// Departments API
export const getDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Get departments error:', error);
    throw error;
  }
};

export const getDepartmentsByCollege = async (collegeId) => {
  const response = await api.get(`/departments/college/${collegeId}`);
  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await api.post('/departments', departmentData);
  return response;
};

export const updateDepartment = async (departmentId, departmentData) => {
  const response = await api.put(`/departments/${departmentId}`, departmentData);
  return response;
};

export const deleteDepartment = async (departmentId) => {
  const response = await api.delete(`/departments/${departmentId}`);
  return response;
};

// Location API
export const getLocations = () => api.get('/locations').then(res => res.data);
export const createLocation = (data) => api.post('/locations', data).then(res => res.data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data).then(res => res.data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`).then(res => res.data);

// Vendor API
export const getVendors = async () => {
  try {
    const response = await api.get('/vendors');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Get vendors error:', error);
    throw error;
  }
};

export const getVendorById = async (vendorId) => {
  try {
    const response = await api.get(`/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    throw error;
  }
};

export const createVendor = async (vendorData) => {
  try {
    const response = await api.post('/vendors', vendorData);
    return response.data;
  } catch (error) {
    console.error('Create vendor error:', error);
    throw error;
  }
};

export const updateVendor = async (vendorId, vendorData) => {
  try {
    const response = await api.put(`/vendors/${vendorId}`, vendorData);
    return response.data;
  } catch (error) {
    console.error('Update vendor error:', error);
    throw error;
  }
};

export const deleteVendor = async (vendorId) => {
  try {
    const response = await api.delete(`/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error('Delete vendor error:', error);
    throw error;
  }
};

export const searchVendors = async (query) => {
  try {
    const response = await api.get('/vendors/search', { params: { query } });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Search vendors error:', error);
    throw error;
  }
};

// Category API
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Create category error:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Update category error:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete category error:', error);
    throw error;
  }
};

export default api;