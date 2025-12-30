import { configureStore } from '@reduxjs/toolkit';
import addCourseReducer from './slices/AddCourseSlice';
import { adminSlice } from './slices/adminSlice';
import attendanceReducer from './slices/attendanceSlice';
import { authSlice } from './slices/authSlice';
import categoryCoursesReducer from './slices/categoryCoursesSlice';
import categoryReducer from './slices/categorySlice'; // Import the new reducer
import lectureReducer from './slices/lectureSlice';
import { studentSlice } from './slices/studentSlice';
import { teacherSlice } from './slices/teacherSlice';
import uiReducer from './slices/uiSlice'; // Import the new uiSlice
import viewLectureReducer from './slices/viewLectureSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    admin: adminSlice.reducer,
    teacher: teacherSlice.reducer,
    student: studentSlice.reducer,
    categories: categoryReducer, // Add the categories reducer
    categoryCourses: categoryCoursesReducer,
    ui: uiReducer, // Add the ui reducer
    addCourse: addCourseReducer,
    lectures: lectureReducer,
    viewLecture: viewLectureReducer,
    attendance: attendanceReducer,
    // courses: courseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export action creators
export const authActions = authSlice.actions;
export const adminActions = adminSlice.actions;
export const teacherActions = teacherSlice.actions;
export const studentActions = studentSlice.actions;
