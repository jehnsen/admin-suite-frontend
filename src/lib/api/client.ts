import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// Error Response Type
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

class ApiClient {
  private client: AxiosInstance;
  private tokenKey = 'auth_token';

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        // Handle network errors (backend not running, CORS issues, etc.)
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
          const apiError: ApiError = {
            message: 'Cannot connect to the server. Please ensure the backend API is running at ' +
                     (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'),
            status: 0,
          };
          return Promise.reject(apiError);
        }

        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          errors: error.response?.data?.errors,
          status: error.response?.status || 500,
        };

        // Handle 401 Unauthorized
        if (apiError.status === 401) {
          this.removeToken();
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data as T;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data as T;
  }

  async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
    const response = await this.client.get<PaginatedResponse<T>>(url, config);
    return response.data;
  }

  // Raw response methods (for when you need full response with message)
  async getRaw<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async postRaw<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async putRaw<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async deleteRaw<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
