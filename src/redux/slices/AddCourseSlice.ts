import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AddCoursePayload, courseApi } from '../../api/courseApi';

export interface CourseState {
  creating: boolean;
  error: string | null;
  lastCreatedId?: string | number;
}

const initialState: CourseState = {
  creating: false,
  error: null,
};

export const addCourseThunk = createAsyncThunk(
  'courses/addCourse',
  async (payload: AddCoursePayload, { rejectWithValue }) => {
    try {
      const response = await courseApi.addCourse(payload);
      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to add course';
      return rejectWithValue(message);
    }
  }
);

const addCourseSlice = createSlice({
  name: 'addCourse',
  initialState,
  reducers: {
    clearCourseError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCourseThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(addCourseThunk.fulfilled, (state, action) => {
        state.creating = false;
        // Try to capture id
        const id = action.payload?.id || action.payload?.data?.id;
        if (id !== undefined) state.lastCreatedId = id;
      })
      .addCase(addCourseThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) || 'Failed to add course';
      });
  },
});

export const { clearCourseError } = addCourseSlice.actions;
export default addCourseSlice.reducer;


