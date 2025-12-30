import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { lectureApi } from '../../api/lectureApi';

export interface LectureItem {
  id?: number | string;
  title?: string;
  name?: string;
  lecture_no?: number | string;
  description?: string;
  link?: string;
  status?: string;
  created_at?: string;
  // API l_* fields
  l_id?: number;
  l_course_id?: number;
  l_course_link?: string;
  l_course_status?: string;
  l_course_description?: string;
  l_created_at?: string;
}

interface ViewLectureState {
  listLoading: boolean;
  listError: string | null;
  lectures: LectureItem[];
}

const initialState: ViewLectureState = {
  listLoading: false,
  listError: null,
  lectures: [],
};

export const fetchLecturesByCourse = createAsyncThunk(
  'viewLecture/fetchByCourse',
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      const data = await lectureApi.getLecturesByCourse(courseId);
      const list = Array.isArray(data?.html)
        ? data.html
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      return list as LectureItem[];
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch lectures';
      return rejectWithValue(msg);
    }
  }
);

const viewLectureSlice = createSlice({
  name: 'viewLecture',
  initialState,
  reducers: {
    clearLectures(state) { state.lectures = []; state.listError = null; },
  },
  extraReducers: (builder) => {
    builder
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

export const { clearLectures } = viewLectureSlice.actions;
export default viewLectureSlice.reducer;


