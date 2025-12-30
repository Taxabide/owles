import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { Assignment, Attendance, StudentProfile } from '../../api/studentApi';
import { API_ROUTES } from '../../constants/routes';

interface StudentState {
  profile: StudentProfile | null;
  adminProfile: any | null;
  assignments: Assignment[];
  grades: Record<string, number>;
  attendance: Attendance[];
  notifications: any[];
  isLoading: boolean;
  error: string | null;
  selectedAssignment: Assignment | null;
}

const initialState: StudentState = {
  profile: null,
  adminProfile: null,
  assignments: [],
  grades: {},
  attendance: [],
  notifications: [],
  isLoading: false,
  error: null,
  selectedAssignment: null,
};

// GET /api/admin/student-profile-ap?u_id=<id>
export const fetchStudentAdminProfile = createAsyncThunk(
  'student/fetchStudentAdminProfile',
  async (u_id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.admin.studentProfileAp, { params: { u_id } });
      return response.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch student profile';
      return rejectWithValue(message);
    }
  }
);

// Update profile - multipart; tries known admin update routes, falls back to POSTing to profile-ap
type UpdateStudentProfilePayload = {
  u_id: string;
  u_name?: string;
  u_email?: string;
  u_phone?: string;
  u_gender?: string;
  u_profile_photo?: any; // file or uri
  s_father_name?: string;
  s_date_of_birth?: string;
  s_address?: string;
  s_city?: string;
  s_country?: string;
  u_created_at?: string;
};

export const updateStudentAdminProfile = createAsyncThunk(
  'student/updateStudentAdminProfile',
  async (payload: UpdateStudentProfilePayload, { rejectWithValue }) => {
    try {
      const form = new FormData();

      // Handle each field properly for FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'u_profile_photo' && typeof value === 'object' && value.uri) {
            // File object with uri, name, type
            form.append(key, value as any);
          } else {
            // Regular string/number values
            form.append(key, String(value));
          }
        }
      });

      // Post to the exact update endpoint per spec
      const res = await axiosInstance.post(API_ROUTES.admin.studentProfileUpdateApi, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update student profile';
      return rejectWithValue(message);
    }
  }
);

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<StudentProfile>) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<StudentProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const index = state.assignments.findIndex(assignment => assignment.id === action.payload.id);
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    setGrades: (state, action: PayloadAction<Record<string, number>>) => {
      state.grades = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateGrade: (state, action: PayloadAction<{ subject: string; grade: number }>) => {
      state.grades[action.payload.subject] = action.payload.grade;
    },
    setAttendance: (state, action: PayloadAction<Attendance[]>) => {
      state.attendance = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addAttendance: (state, action: PayloadAction<Attendance>) => {
      state.attendance.push(action.payload);
    },
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    setSelectedAssignment: (state, action: PayloadAction<Assignment | null>) => {
      state.selectedAssignment = action.payload;
    },
    clearStudentData: (state) => {
      state.profile = null;
      state.assignments = [];
      state.grades = {};
      state.attendance = [];
      state.notifications = [];
      state.selectedAssignment = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.adminProfile = action.payload;
      })
      .addCase(fetchStudentAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch student profile';
      })
      .addCase(updateStudentAdminProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudentAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const next = action.payload as any;
        if (next?.user || next?.student) {
          state.adminProfile = next;
        }
      })
      .addCase(updateStudentAdminProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to update student profile';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setProfile,
  updateProfile,
  setAssignments,
  updateAssignment,
  setGrades,
  updateGrade,
  setAttendance,
  addAttendance,
  setNotifications,
  addNotification,
  markNotificationRead,
  setSelectedAssignment,
  clearStudentData,
} = studentSlice.actions;

export default studentSlice.reducer;
