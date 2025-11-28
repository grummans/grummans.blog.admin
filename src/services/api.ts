import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 600000, // 10 minutes - increased for debugging
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from ApiResponse wrapper
    const apiResponse = response.data as ApiResponse
    
    // Return the data property if it's an ApiResponse
    if (apiResponse && typeof apiResponse === 'object' && 'code' in apiResponse) {
      return {
        ...response,
        data: apiResponse.data,
        apiCode: apiResponse.code,
        apiMessage: apiResponse.message,
      }
    }
    
    return response
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      const apiResponse = error.response.data as ApiResponse
      
      if (apiResponse && typeof apiResponse === 'object' && 'message' in apiResponse) {
        error.message = apiResponse.message || 'An error occurred'
      }
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      }
    } else if (error.request) {
      // Request made but no response
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. The server is taking too long to respond.'
      } else {
        error.message = 'Network error. Please check your connection.'
      }
    }
    
    return Promise.reject(error)
  }
)

// Generic API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config),
}

export default apiClient
