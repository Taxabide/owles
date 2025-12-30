import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isMenuOpen: boolean;
  showLogin: boolean;
}

const initialState: UiState = {
  isMenuOpen: false,
  showLogin: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setMenuOpen: (state, action: { payload: boolean }) => {
      state.isMenuOpen = action.payload;
    },
    setShowLogin: (state, action: { payload: boolean }) => {
      state.showLogin = action.payload;
    },
  },
});

export const { toggleMenu, setMenuOpen, setShowLogin } = uiSlice.actions;
export default uiSlice.reducer;
