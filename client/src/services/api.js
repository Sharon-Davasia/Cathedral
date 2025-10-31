import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.message || 'An error occurred'
    toast.error(message)
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
}

// Certificate API
export const certificateAPI = {
  getTemplates: (params) => api.get('/certificates/templates', { params }),
  getTemplate: (id) => api.get(`/certificates/templates/${id}`),
  createTemplate: (templateData) => api.post('/certificates/templates', templateData),
  updateTemplate: (id, templateData) => api.put(`/certificates/templates/${id}`, templateData),
  deleteTemplate: (id) => api.delete(`/certificates/templates/${id}`),
  uploadFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/certificates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  generateCertificate: (certificateData) => api.post('/certificates/generate', certificateData),
  getIssuedCertificates: (params) => api.get('/certificates/issued', { params }),
  downloadCertificate: (id) => api.get(`/certificates/download/${id}`, { responseType: 'blob' }),
}

// User API
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/dashboard'),
}

export default api
