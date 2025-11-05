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

// Auth API (minimal)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
}

// Removed template/generic certificate APIs

// Removed user management APIs

// Baptism Certificate API
export const baptismAPI = {
  getCertificates: (params) => api.get('/baptism', { params }),
  getCertificate: (id) => api.get(`/baptism/${id}`),
  createCertificate: (data) => api.post('/baptism', data),
  updateCertificate: (id, data) => api.put(`/baptism/${id}`, data),
  deleteCertificate: (id) => api.delete(`/baptism/${id}`),
}

// Death Certificate API
export const deathAPI = {
  getCertificates: (params) => api.get('/death', { params }),
  getCertificate: (id) => api.get(`/death/${id}`),
  createCertificate: (data) => api.post('/death', data),
  updateCertificate: (id, data) => api.put(`/death/${id}`, data),
  deleteCertificate: (id) => api.delete(`/death/${id}`),
}

// Marriage Certificate API
export const marriageAPI = {
  getCertificates: (params) => api.get('/marriage', { params }),
  getCertificate: (id) => api.get(`/marriage/${id}`),
  createCertificate: (data) => api.post('/marriage', data),
  updateCertificate: (id, data) => api.put(`/marriage/${id}`, data),
  deleteCertificate: (id) => api.delete(`/marriage/${id}`),
}

export default api
