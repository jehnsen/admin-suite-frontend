import apiClient, { ApiResponse } from '../client';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.postRaw<any>('/auth/login', credentials);

    // The login endpoint returns token and user at root level, not inside data
    // Backend response: { message, token, user }
    // Not: { message, data: { token, user } }
    const loginResponse: LoginResponse = {
      token: response.token || response.data?.token,
      user: response.user || response.data?.user,
    };

    // Check if we got the required fields
    if (!loginResponse.token || !loginResponse.user) {
      throw new Error(response.message || 'Login failed - invalid response from server');
    }

    // Save token to client
    apiClient.setToken(loginResponse.token);

    return loginResponse;
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await apiClient.postRaw<any>('/auth/register', data);

    // The register endpoint returns token and user at root level, not inside data
    // Backend response: { message, token, user }
    // Not: { message, data: { token, user } }
    const loginResponse: LoginResponse = {
      token: response.token || response.data?.token,
      user: response.user || response.data?.user,
    };

    // Check if we got the required fields
    if (!loginResponse.token || !loginResponse.user) {
      throw new Error(response.message || 'Registration failed - invalid response from server');
    }

    // Save token to client
    apiClient.setToken(loginResponse.token);

    return loginResponse;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.postRaw('/auth/logout');
    } finally {
      // Always remove token, even if API call fails
      apiClient.removeToken();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/auth/user');
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return apiClient.getToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
