import { RootState } from '../store';

export const selectAdmin = (state: RootState) => state.admin;
export const selectAdminUsers = (state: RootState) => state.admin.users;
export const selectAdminStats = (state: RootState) => state.admin.stats;
export const selectAdminLoading = (state: RootState) => state.admin.isLoading;
export const selectAdminError = (state: RootState) => state.admin.error;
export const selectSelectedUser = (state: RootState) => state.admin.selectedUser;

// Derived selectors
export const selectTotalUsers = (state: RootState) => state.admin.users.length;
export const selectUsersByRole = (role: string) => (state: RootState) => 
  state.admin.users.filter(user => user.role === role);
export const selectActiveUsers = (state: RootState) => 
  state.admin.users.filter(user => user.updatedAt); // Assuming updatedAt indicates active user
