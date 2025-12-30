import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Class, Student, Teacher } from '../../api/teacherApi';

interface TeacherState {
  profile: Teacher | null;
  classes: Class[];
  students: Student[];
  assignments: any[];
  isLoading: boolean;
  error: string | null;
  selectedClass: Class | null;
  selectedStudent: Student | null;
}

const initialState: TeacherState = {
  profile: null,
  classes: [],
  students: [],
  assignments: [],
  isLoading: false,
  error: null,
  selectedClass: null,
  selectedStudent: null,
};

export const teacherSlice = createSlice({
  name: 'teacher',
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
    setProfile: (state, action: PayloadAction<Teacher>) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<Teacher>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.push(action.payload);
    },
    updateClass: (state, action: PayloadAction<Class>) => {
      const index = state.classes.findIndex(cls => cls.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    setAssignments: (state, action: PayloadAction<any[]>) => {
      state.assignments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addAssignment: (state, action: PayloadAction<any>) => {
      state.assignments.push(action.payload);
    },
    updateAssignment: (state, action: PayloadAction<any>) => {
      const index = state.assignments.findIndex(assignment => assignment.id === action.payload.id);
      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },
    setSelectedClass: (state, action: PayloadAction<Class | null>) => {
      state.selectedClass = action.payload;
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    clearTeacherData: (state) => {
      state.profile = null;
      state.classes = [];
      state.students = [];
      state.assignments = [];
      state.selectedClass = null;
      state.selectedStudent = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setProfile,
  updateProfile,
  setClasses,
  addClass,
  updateClass,
  setStudents,
  updateStudent,
  setAssignments,
  addAssignment,
  updateAssignment,
  setSelectedClass,
  setSelectedStudent,
  clearTeacherData,
} = teacherSlice.actions;

export default teacherSlice.reducer;
