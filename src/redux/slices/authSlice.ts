import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { signUp } from '../../api/adminAuthApi'; // Import the signUp API function
import { Role } from '../../constants/roles';
import { API_BASE_URL, API_ROUTES } from '../../constants/routes';
import { storageService } from '../../services/storageService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  profileImage?: string; // Added optional profileImage property
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token?: string | null;
  isSignUpSuccess: boolean; // Add state to track sign-up success
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  isSignUpSuccess: false, // Initialize sign-up success state
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await signUp(formData);
      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Sign up failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for admin sign-in (u_email, u_password)
export const loginAdminAsync = createAsyncThunk(
  'auth/loginAdminAsync',
  async (
    { u_email, u_password }: { u_email: string; u_password: string },
    { rejectWithValue }
  ) => {
    try {
      // Build a permissive payload containing both common and backend-specific keys
      const payload: Record<string, string> = {
        u_email,
        u_password,
        email: u_email,
        password: u_password,
      };

      // 1) Try application/x-www-form-urlencoded
      const urlencoded = new URLSearchParams(payload);
      try {
        const response = await axios.post(
          `${API_BASE_URL}${API_ROUTES.admin.signIn}`,
          urlencoded.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
            timeout: 15000,
          }
        );
        console.log('>>>>>>>>>>response', response.data);
        return response.data as any;
      } catch (firstErr: any) {
        // 2) Fallback to multipart/form-data
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
        try {
          const response = await axios.post(
            `${API_BASE_URL}${API_ROUTES.admin.signIn}`,
            fd,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
              },
              timeout: 15000,
            }
          );
          console.log('>>>>>>>>>>response', response.data);
          return response.data as any;
        } catch (secondErr: any) {
          // 3) As a last resort, try JSON
          try {
            const response = await axios.post(
              `${API_BASE_URL}${API_ROUTES.admin.signIn}`,
              payload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                timeout: 15000,
              }
            );
            console.log('>>>>>>>>>>response', response.data);
            return response.data as any;
          } catch (thirdErr: any) {
            const status = thirdErr?.response?.status ?? secondErr?.response?.status ?? firstErr?.response?.status;
            const data = thirdErr?.response?.data ?? secondErr?.response?.data ?? firstErr?.response?.data;
            const message = thirdErr?.message || secondErr?.message || firstErr?.message;
            // If no response object, it's likely a network/SSL/CORS issue on device
            if (!status && !data) {
              console.log('Login network error:', message, {
                isAxiosError: !!thirdErr?.isAxiosError,
              });
            } else {
              console.log('Login error:', status, data);
            }
            const errMsg = data?.message || data?.error || message || 'Login failed';
            return rejectWithValue(errMsg);
          }
        }
      }
    } catch (err: any) {
      console.log('Login error (unexpected):', err?.message);
      return rejectWithValue('Login failed');
    }
  }
);

// Async thunk to load auth data from storage
export const loadAuthDataAsync = createAsyncThunk(
  'auth/loadAuthDataAsync',
  async (_, { dispatch }) => {
    const { user, token } = await storageService.getAuthData();
    if (user && token) {
      dispatch(setUser(user));
      dispatch(setToken(token));
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.token = null;
      storageService.clearAuthData();
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload } as User;
      }
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    clearSignUpSuccess: (state) => {
      state.isSignUpSuccess = false; // Add reducer to clear sign-up success
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdminAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdminAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Normalize various possible API shapes
        const r: any = action.payload || {};
        const maybeData = r.data || r.user || r.profile || r.result || r;
        const token = r.token || r.access_token || r.data?.token || null;

        // Extract user info from multiple shapes
        const userLike = {
          id: (maybeData?.u_id ?? maybeData?.id ?? maybeData?.user_id ?? '')?.toString?.() ?? '',
          email: maybeData?.u_email ?? maybeData?.email ?? '',
          name: maybeData?.u_name ?? maybeData?.name ?? '',
          role: (maybeData?.u_role ?? maybeData?.role ?? 'admin') as Role,
          createdAt: maybeData?.u_created_at ?? maybeData?.createdAt ?? '',
          updatedAt: maybeData?.u_updated_at ?? maybeData?.updatedAt ?? '',
          profileImage: maybeData?.u_profile_photo ?? maybeData?.avatar ?? undefined,
        };

        // Consider success if server flagged ok or returned expected fields
        const serverOk = r.success === true || r.status === true || !!userLike.email;
        if (serverOk) {
          state.isAuthenticated = true;
          state.token = token;
          state.user = userLike as User;
          if (state.user && state.token) {
            storageService.setAuthData(state.user, state.token);
          }
          state.error = null;
        } else {
          // Treat as failure if structure not recognized
          state.isAuthenticated = false;
          state.error = r?.message || 'Login failed';
        }
      })
      .addCase(loginAdminAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = (action.payload as string) || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSignUpSuccess = false; // Reset on pending
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isSignUpSuccess = true; // Set success to true
        // Optionally, if the sign-up response includes user data, you can set it here.
        // For now, we'll just indicate success.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Sign up failed';
        state.isSignUpSuccess = false; // Ensure false on rejection
      });
  },
});

export const {
  login,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearUser,
  setError,
  clearError,
  updateUser,
  setToken,
  clearSignUpSuccess, // Export the new action
} = authSlice.actions;

export default authSlice.reducer;
