import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddTeacherPayload, adminApi, AdminStats, AdminUser } from '../../api/adminApi';

interface AdminState {
  users: AdminUser[];
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  selectedUser: AdminUser | null;
  isAddingTeacher: boolean; // New state for adding teacher
  addTeacherError: string | null; // New state for add teacher error
  teachersList: any[]; // normalized rows for UI
  studentsList: any[]; // normalized rows for UI
}

const initialState: AdminState = {
  users: [],
  stats: null,
  isLoading: false,
  error: null,
  selectedUser: null,
  isAddingTeacher: false,
  addTeacherError: null,
  teachersList: [],
  studentsList: [],
};

// Async thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getDashboardStats();
      console.log("Raw dashboard stats API response:", response); // Log the raw response
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// Async thunk: fetch teachers list
export const fetchTeachersList = createAsyncThunk(
  'admin/fetchTeachersList',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await adminApi.getTeachersList();
      // API returns { success: true, data: { data: [...], ...pagination } }
      const rows = response?.data?.data ?? [];
      // map to the table's expected shape without changing UI logic keys
      return rows.map((r: any) => ({
        id: String(r.u_id),
        name: r.u_name,
        email: r.u_email,
        phone: r.u_phone,
        gender: r.u_gender ?? '',
        profile: r.u_profile_photo ? `${r.u_profile_photo}` : null,
        subject: r.t_subject ?? '',
        addDate: r.u_created_at,
      }));
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

// Async thunk: fetch students list
export const fetchStudentsList = createAsyncThunk(
  'admin/fetchStudentsList',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await adminApi.getStudentsList();
      // API returns { status: true, message: "Student list fetched successfully", data: { data: [...], ...pagination } }
      const rows = response?.data?.data ?? [];
      // map to the table's expected shape without changing UI logic keys
      return rows.map((r: any) => ({
        id: String(r.s_id),
        name: r.u_name,
        fatherName: r.s_father_name ?? '',
        email: r.u_email,
        phone: r.u_phone,
        gender: r.u_gender ?? '',
        profile: r.u_profile_photo ? `${r.u_profile_photo}` : null,
        dob: r.s_date_of_birth,
        address: r.s_address ?? '',
        city: r.s_city ?? '',
        country: r.s_country ?? '',
        createdAt: r.u_created_at,
      }));
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// Async thunk to add a new teacher
export const addTeacher = createAsyncThunk(
  'admin/addTeacher',
  async (teacherData: AddTeacherPayload, { rejectWithValue }) => {
    try {
      const response = await adminApi.addTeacher(teacherData);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add teacher');
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
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
    setUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addUser: (state, action: PayloadAction<AdminUser>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<AdminUser>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setStats: (state, action: PayloadAction<AdminStats>) => {
      state.stats = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<AdminUser | null>) => {
      state.selectedUser = action.payload;
    },
    clearAdminData: (state) => {
      state.users = [];
      state.stats = null;
      state.selectedUser = null;
      state.error = null;
      state.isLoading = false;
      state.teachersList = [];
      state.studentsList = [];
    },
    clearAddTeacherError: (state) => {
      state.addTeacherError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<AdminStats>) => {
        state.isLoading = false;
        state.error = null;
        state.stats = action.payload;
        console.log("Dashboard stats fetched successfully:", action.payload);
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch dashboard stats';
      })
      .addCase(addTeacher.pending, (state) => {
        state.isAddingTeacher = true;
        state.addTeacherError = null;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.isAddingTeacher = false;
        state.addTeacherError = null;
        // Optionally, you might want to add the new teacher to a list of teachers in the state
        // state.teachers.push(action.payload);
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.isAddingTeacher = false;
        state.addTeacherError = (action.payload as string) || 'Failed to add teacher';
      })
      .addCase(fetchTeachersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeachersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.teachersList = action.payload as any[];
      })
      .addCase(fetchTeachersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch teachers';
      })
      .addCase(fetchStudentsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.studentsList = action.payload as any[];
      })
      .addCase(fetchStudentsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch students';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setStats,
  setSelectedUser,
  clearAdminData,
  clearAddTeacherError,
} = adminSlice.actions;

export default adminSlice.reducer;
