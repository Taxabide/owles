import { API_ROUTES } from '../constants/routes';
import axiosInstance from './axiosInstance';

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  role: 'student';
  classId: string;
  className: string;
  attendance: number;
  grades: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export interface Attendance {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export const studentApi = {
  // Get student profile
  getProfile: async (): Promise<StudentProfile> => {
    const response = await axiosInstance.get('/student/profile');
    return response.data;
  },

  // Get student profile via student role endpoint using exact key `u_id`
  getOwnProfileByUId: async (u_id: string): Promise<any> => {
    // Prefer GET with query param as backend enforces GET for these routes
    const getCandidates = [
      API_ROUTES.admin.studentProfileAp,      // '/api/admin/student-profile-ap'
      API_ROUTES.admin.studentProfileApi,     // '/api/admin/student-profile-api'
      '/api/student-profile-ap',
      '/api/student-profile-api',
    ];

    let lastError: any = null;
    for (const path of getCandidates) {
      try {
        const response = await axiosInstance.get(path, { params: { u_id } });
        return response.data;
      } catch (e: any) {
        const status = e?.response?.status;
        // If not found, continue; if method issues (405), continue trying other GET paths
        if (status !== 404 && status !== 405) {
          throw e;
        }
        lastError = e;
      }
    }

    // As a last resort, try POST multipart only if the server rejects GET (rare deployments)
    const postCandidates = [
      API_ROUTES.admin.studentProfileAp,
      API_ROUTES.admin.studentProfileApi,
      '/api/student-profile-ap',
      '/api/student-profile-api',
    ];
    for (const path of postCandidates) {
      try {
        const form = new FormData();
        form.append('u_id', u_id);
        const response = await axiosInstance.post(path, form);
        return response.data;
      } catch (e: any) {
        const status = e?.response?.status;
        if (status !== 404 && status !== 405) {
          throw e;
        }
        lastError = e;
      }
    }

    const error: any = new Error('Student profile endpoint not available via GET or POST.');
    error.cause = lastError;
    throw error;
  },

  // Get student profile via admin endpoint using u_id
  getProfileByUserId: async (u_id: string): Promise<any> => {
    // Try multiple routes, methods and param keys for compatibility
    const candidates = [
      API_ROUTES.admin.studentProfileApi,            // '/api/admin/student-profile-api'
      '/api/student-profile-api',                    // without 'admin'
      '/api/admin/student-profile',                  // without '-api'
      '/api/student-profile',
    ];

    const paramKeyVariants = ['u_id', 'user_id', 'id'];

    let lastError: any = null;
    for (const path of candidates) {
      // 1) GET with query params
      for (const key of paramKeyVariants) {
        try {
          const response = await axiosInstance.get(path, { params: { [key]: u_id } as any });
          return response.data;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status !== 404) {
            // For non-404, surface immediately
            throw err;
          }
          lastError = err;
        }
      }

      // 2) POST JSON body
      for (const key of paramKeyVariants) {
        try {
          const response = await axiosInstance.post(path, { [key]: u_id } as any, {
            headers: { 'Content-Type': 'application/json' },
          });
          return response.data;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status !== 404) {
            throw err;
          }
          lastError = err;
        }
      }

      // 3) POST form-data
      for (const key of paramKeyVariants) {
        try {
          const form = new FormData();
          form.append(key, u_id);
          const response = await axiosInstance.post(path, form);
          return response.data;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status !== 404) {
            throw err;
          }
          lastError = err;
        }
      }
    }

    const error: any = new Error('Student profile endpoint not found (404) across tried variants.');
    error.cause = lastError;
    throw error;
  },

  // Update student profile
  updateProfile: async (profileData: Partial<StudentProfile>): Promise<StudentProfile> => {
    const response = await axiosInstance.put('/student/profile', profileData);
    return response.data;
  },

  // Get student's assignments
  getAssignments: async (): Promise<Assignment[]> => {
    const response = await axiosInstance.get('/student/assignments');
    return response.data;
  },

  // Submit assignment
  submitAssignment: async (assignmentId: string, submission: any): Promise<void> => {
    await axiosInstance.post(`/student/assignments/${assignmentId}/submit`, submission);
  },

  // Get student's grades
  getGrades: async (): Promise<Record<string, number>> => {
    const response = await axiosInstance.get('/student/grades');
    return response.data;
  },

  // Get attendance record
  getAttendance: async (): Promise<Attendance[]> => {
    const response = await axiosInstance.get('/student/attendance');
    return response.data;
  },

  // Get student dashboard data
  getDashboardData: async () => {
    const response = await axiosInstance.get('/student/dashboard');
    return response.data;
  },

  // Get class schedule
  getSchedule: async () => {
    const response = await axiosInstance.get('/student/schedule');
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await axiosInstance.get('/student/notifications');
    return response.data;
  },
};
