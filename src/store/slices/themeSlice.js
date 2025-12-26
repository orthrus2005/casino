import { createSlice } from '@reduxjs/toolkit';

const loadThemeFromLocalStorage = () => {
  return localStorage.getItem('casino_theme') || 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: loadThemeFromLocalStorage(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('casino_theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('casino_theme', action.payload);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;

// Селекторы
export const selectThemeMode = (state) => state.theme.mode;

export default themeSlice.reducer;