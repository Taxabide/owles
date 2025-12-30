import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddLecturePayload, lectureApi } from '../../api/lectureApi';

export interface LectureItem {
  id?: number | string;
  title?: string;
  name?: string;
  lecture_no?: number | string;
  description?: string;
  link?: string;
  status?: string;
  created_at?: string;
}

interface LectureState {
  creating: boolean;
  error: string | null;
  lastCreatedId?: number | string;
  listLoading: boolean;
  listError: string | null;
  lectures: LectureItem[];
}

const initialState: LectureState = {
  creating: false,
  error: null,
  listLoading: false,
  listError: null,
  lectures: [],
};

export const addLectureThunk = createAsyncThunk(
  'lectures/addLecture',
  async (payload: AddLecturePayload, { rejectWithValue }) => {
    try {
      const data = await lectureApi.addLecture(payload);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to add lecture';
      return rejectWithValue(msg);
    }
  }
);

export const fetchLecturesByCourse = createAsyncThunk(
  'lectures/fetchByCourse',
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      const data = await lectureApi.getLecturesByCourse(courseId);
      // Normalize: backend may return { html: [...] } like category API
      const list = Array.isArray(data?.html) ? data.html : Array.isArray(data) ? data : [];
      return list as LectureItem[];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch lectures';
      return rejectWithValue(msg);
    }
  }
);

const lectureSlice = createSlice({
  name: 'lectures',
  initialState,
  reducers: {
    clearLectureError(state) { state.error = null; },
    clearLectures(state) { state.lectures = []; state.listError = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLectureThunk.pending, (state) => { state.creating = true; state.error = null; })
      .addCase(addLectureThunk.fulfilled, (state, action) => {
        state.creating = false;
        const id = action.payload?.id || action.payload?.data?.id;
        if (id !== undefined) state.lastCreatedId = id;
      })
      .addCase(addLectureThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) || 'Failed to add lecture';
      })
      .addCase(fetchLecturesByCourse.pending, (state) => {
        state.listLoading = true; state.listError = null; state.lectures = [];
      })
      .addCase(fetchLecturesByCourse.fulfilled, (state, action: PayloadAction<LectureItem[]>) => {
        state.listLoading = false; state.lectures = action.payload;
      })
      .addCase(fetchLecturesByCourse.rejected, (state, action) => {
        state.listLoading = false; state.listError = (action.payload as string) || 'Failed to fetch lectures';
      });
  },
});

export const { clearLectureError, clearLectures } = lectureSlice.actions;
export default lectureSlice.reducer;


