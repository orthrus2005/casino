import { createSlice } from '@reduxjs/toolkit';

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
        gameHistory: savedHistory ? JSON.parse(savedHistory) : []
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
  gameHistory: []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, isAdmin } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.isAdmin = isAdmin;
      state.balance = 1000;
      
      // Сохраняем в localStorage
      localStorage.setItem('casino_user', user);
      localStorage.setItem('casino_isAdmin', isAdmin);
      localStorage.setItem('casino_balance', '1000');
    },
    
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isAdmin = false;
      state.balance = 1000;
      state.gameHistory = [];
      
      // Очищаем localStorage
      localStorage.removeItem('casino_user');
      localStorage.removeItem('casino_isAdmin');
      localStorage.removeItem('casino_balance');
      localStorage.removeItem('casino_history');
    },
    
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
      
      // Храним только последние 50 игр
      if (state.gameHistory.length > 50) {
        state.gameHistory = state.gameHistory.slice(0, 50);
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('casino_history', JSON.stringify(state.gameHistory));
    },
    
    clearGameHistory: (state) => {
      state.gameHistory = [];
      localStorage.removeItem('casino_history');
    }
  }
});

export const { 
  login, 
  logout, 
  updateBalance, 
  setBalance, 
  addGameHistory, 
  clearGameHistory 
} = authSlice.actions;

// Селекторы
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectBalance = (state) => state.auth.balance;
export const selectGameHistory = (state) => state.auth.gameHistory;

export default authSlice.reducer;