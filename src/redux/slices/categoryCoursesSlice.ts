import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL, API_ROUTES } from '../../constants/routes';

interface Course {
  course_id: number;
  course_name: string;
  course_description: string;
  course_image: string;
}
interface CategoryCoursesState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryCoursesState = {
  courses: [],
  isLoading: false,
  error: null,
};

export const fetchCategoryCoursesAsync = createAsyncThunk(
  'categoryCourses/fetchCategoryCourses',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ROUTES.category.categoryCourses}?id=${categoryId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("Category courses API response:", response.data);
      // Ensure we are extracting the 'html' array which contains the courses
      if (response.data && Array.isArray(response.data.html)) {
        return response.data.html as Course[];
      } else {
        return rejectWithValue('Invalid response format');
      }
    } catch (error: any) {
      console.error('Category courses API Error:', error);
      const message = error.response?.data?.message || 'Failed to fetch category courses';
      return rejectWithValue(message);
    }
  }
);

const categoryCoursesSlice = createSlice({
  name: 'categoryCourses',
  initialState,
  reducers: {
    clearCategoryCourses: (state) => {
      state.courses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryCoursesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryCoursesAsync.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.isLoading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryCoursesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.courses = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryCourses } = categoryCoursesSlice.actions;
export default categoryCoursesSlice.reducer;
