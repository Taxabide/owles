import { API_ROUTES } from '../constants/routes'; // Import API_ROUTES
import axiosInstance from './axiosInstance';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AddTeacherPayload {
  t_name: string;
  t_email: string;
  t_phone: string;
  t_password: string;
  t_gender: string;
  t_subject: string;
  t_profile_photo?: string; // Made optional
}

export interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  activeUsers: number;
}

export const adminApi = {
  // Get admin dashboard stats
  getDashboardStats: async (): Promise<AdminStats> => {
    try {
      const response = await axiosInstance.get(API_ROUTES.admin.dashboardStats);
      return response.data as AdminStats;
    } catch (err: any) {
      // If the configured route is missing (404), try known API fallback used elsewhere
      if (err?.response?.status === 404) {
        try {
          const fallback = await axiosInstance.get('/api/admin/dashboard-stats-api');
          const data = fallback.data as any;
          // Normalize to AdminStats shape if fields differ
          return {
            totalUsers: Number(data?.totalUsers ?? data?.data?.totalUsers ?? 0),
            totalTeachers: Number(data?.totalTeachers ?? data?.data?.totalTeachers ?? 0),
            totalStudents: Number(data?.totalStudents ?? data?.data?.totalStudents ?? 0),
            activeUsers: Number(data?.activeUsers ?? data?.data?.activeUsers ?? 0),
          } as AdminStats;
        } catch (_) {
          // fall through to defaults
        }
      }
      // Return safe defaults to avoid crashing UI
      return {
        totalUsers: 0,
        totalTeachers: 0,
        totalStudents: 0,
        activeUsers: 0,
      } as AdminStats;
    }
  },

  // Get all users
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },

  // Create new user
  createUser: async (userData: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await axiosInstance.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/admin/users/${userId}`);
  },

  // Get system settings
  getSystemSettings: async () => {
    const response = await axiosInstance.get('/admin/settings');
    return response.data;
  },

  // Update system settings
  updateSystemSettings: async (settings: any) => {
    const response = await axiosInstance.put('/admin/settings', settings);
    return response.data;
  },

  // Add new teacher (supports multipart when local file URI is provided)
  addTeacher: async (teacherData: AddTeacherPayload): Promise<any> => {
    const { t_profile_photo, ...rest } = teacherData;

    const isLocalFile = typeof t_profile_photo === 'string' && t_profile_photo.startsWith('file://');

    if (t_profile_photo && isLocalFile) {
      const formData = new FormData();
      // Append text fields
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append image file
      const fileName = t_profile_photo.split('/').pop() || 'photo.jpg';
      const ext = fileName.split('.').pop()?.toLowerCase();
      const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';

      const file: any = { uri: t_profile_photo, name: fileName, type: mime };
      formData.append('t_profile_photo', file);

      const response = await axiosInstance.post(API_ROUTES.admin.teachersAddApi, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: undefined,
      });
      return response.data;
    }

    // Fallback to JSON if no local file provided (URL or empty)
    const response = await axiosInstance.post(API_ROUTES.admin.teachersAddApi, {
      ...rest,
      ...(t_profile_photo ? { t_profile_photo } : {}),
    });
    return response.data;
  },

  // Get teachers list (paginated)
  getTeachersList: async () => {
    const response = await axiosInstance.get(API_ROUTES.admin.teachersListApi);
    return response.data; // raw API shape
  },

  // Get students list (paginated)
  getStudentsList: async () => {
    const response = await axiosInstance.get(API_ROUTES.admin.studentsListApi);
    return response.data; // raw API shape
  },

  // Fetch student profile via admin endpoint using exact key `u_id`
  getStudentProfileByUId: async (u_id: string): Promise<any> => {
    // Primary: exact endpoint and FormData with `u_id`
    try {
      const form = new FormData();
      form.append('u_id', u_id);
      const response = await axiosInstance.post(API_ROUTES.admin.studentProfileAp, form);
      return response.data;
    } catch (err: any) {
      // Fallbacks for compatibility with other deployments
      const candidates = [
        API_ROUTES.admin.studentProfileApi, // '/api/admin/student-profile-api'
        '/api/student-profile-ap',          // without 'admin'
        '/api/student-profile-api',
      ];
      for (const path of candidates) {
        try {
          const form = new FormData();
          form.append('u_id', u_id);
          const response = await axiosInstance.post(path, form);
          return response.data;
        } catch (e: any) {
          if (e?.response?.status !== 404) {
            throw e;
          }
        }
      }
      throw err;
    }
  },
};
