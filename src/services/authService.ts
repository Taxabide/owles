import axiosInstance from '../api/axiosInstance';
import { Role } from '../constants/roles';
import { API_ROUTES } from '../constants/routes';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'userData';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ROUTES.auth.login, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(API_ROUTES.auth.register, registerData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ROUTES.auth.logout);
    } catch (error) {
      // Even if server logout fails, we should still clear local data
      console.error('Logout error:', error);
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await axiosInstance.post(API_ROUTES.auth.refresh);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axiosInstance.post(API_ROUTES.auth.forgotPassword, { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axiosInstance.post(API_ROUTES.auth.resetPassword, {
        token,
        password: newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  // Token management
  async storeToken(token: string): Promise<void> {
    try {
      // For React Native, use AsyncStorage
      // await AsyncStorage.setItem(this.TOKEN_KEY, token);
      
      // For web, use localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      // For React Native, use AsyncStorage
      // return await AsyncStorage.getItem(this.TOKEN_KEY);
      
      // For web, use localStorage
      if (typeof window !== 'undefined') {
        return localStorage.getItem(this.TOKEN_KEY);
      }
      return null;
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  async removeStoredToken(): Promise<void> {
    try {
      // For React Native, use AsyncStorage
      // await AsyncStorage.removeItem(this.TOKEN_KEY);
      
      // For web, use localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch (error) {
      console.error('Failed to remove stored token:', error);
    }
  }

  // User data management
  async storeUserData(userData: any): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  async getStoredUserData(): Promise<any | null> {
    try {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    } catch (error) {
      console.error('Failed to get stored user data:', error);
      return null;
    }
  }

  async removeStoredUserData(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (error) {
      console.error('Failed to remove stored user data:', error);
    }
  }
}

export const authService = new AuthService();
