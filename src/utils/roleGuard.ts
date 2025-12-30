import { hasPermission, Role, ROLES } from '../constants/roles';

// Role-based access control
export class RoleGuard {
  private userRole: Role | null = null;

  constructor(userRole?: Role) {
    this.userRole = userRole || null;
  }

  setUserRole(role: Role): void {
    this.userRole = role;
  }

  clearUserRole(): void {
    this.userRole = null;
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    if (!this.userRole) return false;
    return hasPermission(this.userRole, permission);
  }

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: string[]): boolean {
    if (!this.userRole) return false;
    return permissions.some(permission => hasPermission(this.userRole!, permission));
  }

  // Check if user has all of the specified permissions
  hasAllPermissions(permissions: string[]): boolean {
    if (!this.userRole) return false;
    return permissions.every(permission => hasPermission(this.userRole!, permission));
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.userRole === ROLES.ADMIN;
  }

  // Check if user is teacher
  isTeacher(): boolean {
    return this.userRole === ROLES.TEACHER;
  }

  // Check if user is student
  isStudent(): boolean {
    return this.userRole === ROLES.STUDENT;
  }

  // Check if user is admin or teacher
  isAdminOrTeacher(): boolean {
    return this.isAdmin() || this.isTeacher();
  }

  // Check if user is teacher or student
  isTeacherOrStudent(): boolean {
    return this.isTeacher() || this.isStudent();
  }

  // Check if user can access admin features
  canAccessAdmin(): boolean {
    return this.isAdmin();
  }

  // Check if user can manage users
  canManageUsers(): boolean {
    return this.hasPermission('manage_users');
  }

  // Check if user can manage system settings
  canManageSystemSettings(): boolean {
    return this.hasPermission('manage_system_settings');
  }

  // Check if user can view all reports
  canViewAllReports(): boolean {
    return this.hasPermission('view_all_reports');
  }

  // Check if user can manage teachers
  canManageTeachers(): boolean {
    return this.hasPermission('manage_teachers');
  }

  // Check if user can manage students
  canManageStudents(): boolean {
    return this.hasPermission('manage_students');
  }

  // Check if user can manage own classes
  canManageOwnClasses(): boolean {
    return this.hasPermission('manage_own_classes');
  }

  // Check if user can manage students in classes
  canManageStudentsInClasses(): boolean {
    return this.hasPermission('manage_students_in_classes');
  }

  // Check if user can create assignments
  canCreateAssignments(): boolean {
    return this.hasPermission('create_assignments');
  }

  // Check if user can grade assignments
  canGradeAssignments(): boolean {
    return this.hasPermission('grade_assignments');
  }

  // Check if user can view student progress
  canViewStudentProgress(): boolean {
    return this.hasPermission('view_student_progress');
  }

  // Check if user can manage attendance
  canManageAttendance(): boolean {
    return this.hasPermission('manage_attendance');
  }

  // Check if user can view own assignments
  canViewOwnAssignments(): boolean {
    return this.hasPermission('view_own_assignments');
  }

  // Check if user can submit assignments
  canSubmitAssignments(): boolean {
    return this.hasPermission('submit_assignments');
  }

  // Check if user can view own grades
  canViewOwnGrades(): boolean {
    return this.hasPermission('view_own_grades');
  }

  // Check if user can view own attendance
  canViewOwnAttendance(): boolean {
    return this.hasPermission('view_own_attendance');
  }

  // Check if user can view schedule
  canViewSchedule(): boolean {
    return this.hasPermission('view_schedule');
  }

  // Check if user can view notifications
  canViewNotifications(): boolean {
    return this.hasPermission('view_notifications');
  }

  // Check if user can view dashboard
  canViewDashboard(): boolean {
    return this.hasPermission('view_dashboard');
  }

  // Get allowed routes for user role
  getAllowedRoutes(): string[] {
    if (!this.userRole) return [];

    const routeMap: Record<Role, string[]> = {
      [ROLES.ADMIN]: [
        '/admin/dashboard',
        '/admin/users',
        '/admin/settings',
        '/admin/reports',
        '/profile',
        '/settings',
      ],
      [ROLES.TEACHER]: [
        '/teacher/dashboard',
        '/teacher/classes',
        '/teacher/students',
        '/teacher/assignments',
        '/profile',
        '/settings',
      ],
      [ROLES.STUDENT]: [
        '/student/dashboard',
        '/student/assignments',
        '/student/grades',
        '/student/attendance',
        '/student/schedule',
        '/student/notifications',
        '/profile',
        '/settings',
      ],
    };

    return routeMap[this.userRole] || [];
  }

  // Check if user can access specific route
  canAccessRoute(route: string): boolean {
    const allowedRoutes = this.getAllowedRoutes();
    return allowedRoutes.includes(route);
  }

  // Get user's default route
  getDefaultRoute(): string {
    if (!this.userRole) return '/login';

    const defaultRoutes: Record<Role, string> = {
      [ROLES.ADMIN]: '/admin/dashboard',
      [ROLES.TEACHER]: '/teacher/dashboard',
      [ROLES.STUDENT]: '/student/dashboard',
    };

    return defaultRoutes[this.userRole];
  }
}

// Create a singleton instance
export const roleGuard = new RoleGuard();

// Higher-order component for role-based rendering
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string[],
  fallback?: React.ComponentType
) => {
  return (props: P) => {
    const hasRequiredPermissions = roleGuard.hasAllPermissions(requiredPermissions);
    
    if (!hasRequiredPermissions) {
      if (fallback) {
        return React.createElement(fallback);
      }
      return null;
    }
    
    return React.createElement(Component, props);
  };
};

// Hook for role-based access control
export const useRoleGuard = (userRole?: Role) => {
  const [guard] = React.useState(() => new RoleGuard(userRole));

  React.useEffect(() => {
    if (userRole) {
      guard.setUserRole(userRole);
    }
  }, [userRole, guard]);

  return guard;
};
