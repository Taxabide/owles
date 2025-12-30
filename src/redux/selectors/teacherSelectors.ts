import { RootState } from '../store';

export const selectTeacher = (state: RootState) => state.teacher;
export const selectTeacherProfile = (state: RootState) => state.teacher.profile;
export const selectTeacherClasses = (state: RootState) => state.teacher.classes;
export const selectTeacherStudents = (state: RootState) => state.teacher.students;
export const selectTeacherAssignments = (state: RootState) => state.teacher.assignments;
export const selectTeacherLoading = (state: RootState) => state.teacher.isLoading;
export const selectTeacherError = (state: RootState) => state.teacher.error;
export const selectSelectedClass = (state: RootState) => state.teacher.selectedClass;
export const selectSelectedStudent = (state: RootState) => state.teacher.selectedStudent;

// Derived selectors
export const selectTotalClasses = (state: RootState) => state.teacher.classes.length;
export const selectTotalStudents = (state: RootState) => state.teacher.students.length;
export const selectTotalAssignments = (state: RootState) => state.teacher.assignments.length;
export const selectStudentsByClass = (classId: string) => (state: RootState) => 
  state.teacher.students.filter(student => student.classId === classId);
export const selectAssignmentsByClass = (classId: string) => (state: RootState) => 
  state.teacher.assignments.filter(assignment => assignment.classId === classId);
