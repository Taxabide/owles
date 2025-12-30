// API Routes
export const API_BASE_URL = "https://owles.tulyarthdigiweb.com";

export const API_ROUTES = {
  // Auth routes
  auth: {
    login: '/auth/login',
    register: '/api/sign-up-api',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  
  // Admin routes
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    settings: '/admin/settings',
    reports: '/admin/reports',
    signIn: '/api/sign-in-api',
    dashboardStats: '/admin/dashboard/stats', // Added dashboard stats API route
    teachersAddApi: '/api/admin/teachers-add-api',
    teachersListApi: '/api/admin/teachers-list-api',
    lecturesListApi: '/api/admin/view-lecture-api',
    studentProfileApi: '/api/admin/student-profile-api',
    studentProfileAp: '/api/admin/student-profile-ap',
    studentsListApi: '/api/admin/student-list-api',
    studentProfileUpdateApi: '/api/admin/student-profile-update-api',
    attendanceUsersApi: '/api/admin/attendance-users',
    attendanceListApi: '/api/attendance-list-api',
    attendanceUpdateApi: '/api/admin/attendance/update',
  },
  
  // Teacher routes
  teacher: {
    profile: '/teacher/profile',
    dashboard: '/teacher/dashboard',
    classes: '/teacher/classes',
    students: '/teacher/students',
    assignments: '/teacher/assignments',
  },
  
  // Student routes
  student: {
    profile: '/student/profile',
    dashboard: '/student/dashboard',
    assignments: '/student/assignments',
    grades: '/student/grades',
    attendance: '/student/attendance',
    schedule: '/student/schedule',
    notifications: '/student/notifications',
  },

  // Category routes
  category: {
    categoryCourses: '/api/category-courses',
  },
} as const;

// App Routes (for navigation)
export const APP_ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_TEACHERS: "/admin/teachers",
  ADMIN_ADD_TEACHER: "/admin/add-teacher",
  ADMIN_VIEW_LECTURES:"/admin/lecture/view",
  ADMIN_CATEGORY_LIST: "/admin/categories",
  ADMIN_ADD_COURSE:"/admin/add-course",
  ADMIN_STUDENTS: "/admin/students",
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_PROFILE: "/admin/profile",
  
  // Teacher routes
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_PROFILE: '/teacher/profile',
  TEACHER_CLASSES: '/teacher/classes',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_ASSIGNMENTS: '/teacher/assignments',
  
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_ASSIGNMENTS: '/student/assignments',
  STUDENT_GRADES: '/student/grades',
  STUDENT_ATTENDANCE: '/student/attendance',
  STUDENT_SCHEDULE: '/student/schedule',
  STUDENT_NOTIFICATIONS: '/student/notifications',
  
  // Category routes
  CATEGORY_COURSES: "/category/[id]",


  // Common routes
  HOME: '/',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type AppRoute = keyof typeof APP_ROUTES;
