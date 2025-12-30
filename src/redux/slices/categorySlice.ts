import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../constants/routes";

// Define the interface for a single Category
export interface Category {
  c_id: number;
  c_name: string;
  c_created_at: string;
  c_updated_at: string;
}

// State interface
interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch categories
export const fetchCategoriesAsync = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/admin/category-list-api`
    );

    if (
      response.data &&
      response.data.success &&
      response.data.data &&
      response.data.data.data
    ) {
      return response.data.data.data as Category[];
    } else {
      return rejectWithValue("Invalid API response structure");
    }
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Failed to fetch categories";
    return rejectWithValue(message);
  }
});

// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoriesAsync.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.isLoading = false;
          state.categories = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch categories";
        state.categories = [];
      });
  },
});

export default categorySlice.reducer;
