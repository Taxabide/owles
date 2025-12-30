import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Role } from '../constants/roles';
import { clearUser, login, logout, setUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { authService } from '../services/authService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await authService.getStoredToken();
        if (token) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            dispatch(setUser(userData));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await authService.removeStoredToken();
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const loginUser = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      dispatch(login());
      
      const response = await authService.login(credentials);
      const { user: userData, token } = response;
      
      await authService.storeToken(token);
      dispatch(setUser(userData));
      
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Login failed');
      dispatch(logout());
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  const registerUser = useCallback(async (registerData: RegisterData) => {
    try {
      setError(null);
      dispatch(login());
      
      const response = await authService.register(registerData);
      const { user: userData, token } = response;
      
      await authService.storeToken(token);
      dispatch(setUser(userData));
      
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      dispatch(logout());
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
      await authService.removeStoredToken();
      dispatch(clearUser());
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      dispatch(clearUser());
    }
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      const { token } = response;
      
      await authService.storeToken(token);
      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logoutUser();
      return { success: false };
    }
  }, [logoutUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    refreshToken,
    clearError,
  };
};
