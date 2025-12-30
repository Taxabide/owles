import axiosInstance from './axiosInstance';

export interface Teacher {
  id: string;
  email: string;
  name: string;
  role: 'teacher';
  subjects: string[];
  classes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  attendance: number;
  grades: Record<string, number>;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  students: Student[];
  schedule: string;
}

export const teacherApi = {
  // Get teacher profile
  getProfile: async (): Promise<Teacher> => {
    const response = await axiosInstance.get('/teacher/profile');
    return response.data;
  },

  // Update teacher profile
  updateProfile: async (profileData: Partial<Teacher>): Promise<Teacher> => {
    const response = await axiosInstance.put('/teacher/profile', profileData);
    return response.data;
  },

  // Get teacher's classes
  getClasses: async (): Promise<Class[]> => {
    const response = await axiosInstance.get('/teacher/classes');
    return response.data;
  },

  // Get students in a class
  getClassStudents: async (classId: string): Promise<Student[]> => {
    const response = await axiosInstance.get(`/teacher/classes/${classId}/students`);
    return response.data;
  },

  // Update student attendance
  updateAttendance: async (studentId: string, attendance: number): Promise<void> => {
    await axiosInstance.put(`/teacher/students/${studentId}/attendance`, { attendance });
  },

  // Update student grade
  updateGrade: async (studentId: string, subject: string, grade: number): Promise<void> => {
    await axiosInstance.put(`/teacher/students/${studentId}/grades`, { subject, grade });
  },

  // Get teacher dashboard data
  getDashboardData: async () => {
    const response = await axiosInstance.get('/teacher/dashboard');
    return response.data;
  },

  // Create assignment
  createAssignment: async (assignmentData: any) => {
    const response = await axiosInstance.post('/teacher/assignments', assignmentData);
    return response.data;
  },

  // Get assignments
  getAssignments: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/teacher/assignments');
    return response.data;
  },
};
