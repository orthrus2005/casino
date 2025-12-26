import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService';
import userService from '../../api/userService';

// Асинхронные thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(username, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка авторизации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

export const depositFunds = createAsyncThunk(
  'auth/deposit',
  async (amount, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.user;
      const response = await userService.deposit(userId, amount);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка пополнения');
    }
  }
);

export const withdrawFunds = createAsyncThunk(
  'auth/withdraw',
  async (amount, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.auth.user;
      const response = await userService.withdraw(userId, amount);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка вывода');
    }
  }
);

const loadFromLocalStorage = () => {
  try {
    const savedUser = localStorage.getItem('casino_user');
    const savedIsAdmin = localStorage.getItem('casino_isAdmin');
    const savedBalance = localStorage.getItem('casino_balance');
    const savedHistory = localStorage.getItem('casino_history');

    if (savedUser) {
      return {
        isLoggedIn: true,
        user: savedUser,
        isAdmin: savedIsAdmin === 'true',
        balance: savedBalance ? parseInt(savedBalance) : 1000,
        gameHistory: savedHistory ? JSON.parse(savedHistory) : [],
        loading: false,
        error: null
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  
  return null;
};

const initialState = loadFromLocalStorage() || {
  isLoggedIn: false,
  user: null,
  isAdmin: false,
  balance: 1000,
  gameHistory: [],
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Синхронные редьюсеры
    updateBalance: (state, action) => {
      const amount = action.payload;
      state.balance += amount;
      localStorage.setItem('casino_balance', state.balance.toString());
    },
    
    setBalance: (state, action) => {
      state.balance = action.payload;
      localStorage.setItem('casino_balance', action.payload.toString());
    },
    
    addGameHistory: (state, action) => {
      const gameRecord = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      state.gameHistory.unshift(gameRecord);
      
      if (state.gameHistory.length > 50) {
        state.gameHistory = state.gameHistory.slice(0, 50);
      }
      
      localStorage.setItem('casino_history', JSON.stringify(state.gameHistory));
    },
    
    clearGameHistory: (state) => {
      state.gameHistory = [];
      localStorage.removeItem('casino_history');
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.isAdmin;
        state.balance = action.payload.balance;
        state.error = null;
        
        localStorage.setItem('casino_user', action.payload.user);
        localStorage.setItem('casino_isAdmin', action.payload.isAdmin);
        localStorage.setItem('casino_balance', action.payload.balance.toString());
        localStorage.setItem('casino_token', action.payload.token || 'mock-token');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Логаут
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.isAdmin = false;
        state.balance = 1000;
        state.gameHistory = [];
        state.error = null;
      })
      
      // Пополнение
      .addCase(depositFunds.fulfilled, (state, action) => {
        state.balance = action.payload.newBalance;
        localStorage.setItem('casino_balance', action.payload.newBalance.toString());
      })
      
      // Вывод
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.balance = action.payload.newBalance;
        localStorage.setItem('casino_balance', action.payload.newBalance.toString());
      });
  }
});

export const { 
  updateBalance, 
  setBalance, 
  addGameHistory, 
  clearGameHistory,
  clearError
} = authSlice.actions;

// Селекторы
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectBalance = (state) => state.auth.balance;
export const selectGameHistory = (state) => state.auth.gameHistory;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;