export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage_users',
    'manage_system_settings',
    'view_all_reports',
    'manage_teachers',
    'manage_students',
    'view_dashboard',
  ],
  [ROLES.TEACHER]: [
    'manage_own_classes',
    'manage_students_in_classes',
    'create_assignments',
    'grade_assignments',
    'view_student_progress',
    'manage_attendance',
    'view_dashboard',
  ],
  [ROLES.STUDENT]: [
    'view_own_assignments',
    'submit_assignments',
    'view_own_grades',
    'view_own_attendance',
    'view_schedule',
    'view_notifications',
    'view_dashboard',
  ],
} as const;

export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.TEACHER]: 'Teacher',
  [ROLES.STUDENT]: 'Student',
} as const;

export const ROLE_COLORS = {
  [ROLES.ADMIN]: '#8B5CF6',
  [ROLES.TEACHER]: '#06B6D4',
  [ROLES.STUDENT]: '#10B981',
} as const;

export type Permission = typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS][number];

// Helper functions
export const hasPermission = (userRole: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const getRoleDisplayName = (role: Role): string => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

export const getRoleColor = (role: Role): string => {
  return ROLE_COLORS[role] || '#6B7280';
};
