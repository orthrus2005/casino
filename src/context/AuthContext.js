// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Состояние по умолчанию
const initialState = {
  isLoggedIn: false,
  user: null,
  isAdmin: false,
  balance: 1000,
  gameHistory: []
};

// Типы действий
const ACTION_TYPES = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  UPDATE_BALANCE: 'UPDATE_BALANCE',
  ADD_GAME_HISTORY: 'ADD_GAME_HISTORY'
};

// Редуктор
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      const { user, isAdmin } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        user,
        isAdmin,
        balance: 1000
      };

    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState
      };

    case ACTION_TYPES.UPDATE_BALANCE:
      return {
        ...state,
        balance: action.payload
      };

    case ACTION_TYPES.ADD_GAME_HISTORY:
      return {
        ...state,
        gameHistory: [action.payload, ...state.gameHistory.slice(0, 49)] // Храним последние 50 игр
      };

    default:
      return state;
  }
};

// Создание контекста
const AuthContext = createContext();

// Провайдер
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Загрузка состояния из localStorage при монтировании
  useEffect(() => {
    const savedUser = localStorage.getItem('casino_user');
    const savedIsAdmin = localStorage.getItem('casino_isAdmin');
    const savedBalance = localStorage.getItem('casino_balance');
    const savedHistory = localStorage.getItem('casino_history');

    if (savedUser) {
      dispatch({
        type: ACTION_TYPES.LOGIN,
        payload: {
          user: savedUser,
          isAdmin: savedIsAdmin === 'true'
        }
      });

      if (savedBalance) {
        dispatch({
          type: ACTION_TYPES.UPDATE_BALANCE,
          payload: parseInt(savedBalance)
        });
      }

      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          history.forEach(game => {
            dispatch({
              type: ACTION_TYPES.ADD_GAME_HISTORY,
              payload: game
            });
          });
        } catch (error) {
          console.error('Error parsing game history:', error);
        }
      }
    }
  }, []);

  // Сохранение в localStorage при изменении состояния
  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem('casino_user', state.user);
      localStorage.setItem('casino_isAdmin', state.isAdmin);
      localStorage.setItem('casino_balance', state.balance);
      localStorage.setItem('casino_history', JSON.stringify(state.gameHistory));
    } else {
      localStorage.removeItem('casino_user');
      localStorage.removeItem('casino_isAdmin');
      localStorage.removeItem('casino_balance');
      localStorage.removeItem('casino_history');
    }
  }, [state]);

  // Действия
  const login = (user, isAdmin) => {
    dispatch({
      type: ACTION_TYPES.LOGIN,
      payload: { user, isAdmin }
    });
  };

  const logout = () => {
    dispatch({ type: ACTION_TYPES.LOGOUT });
  };

  const updateBalance = (amount) => {
    const newBalance = state.balance + amount;
    dispatch({
      type: ACTION_TYPES.UPDATE_BALANCE,
      payload: newBalance
    });
    return newBalance;
  };

  const addGameHistory = (gameData) => {
    dispatch({
      type: ACTION_TYPES.ADD_GAME_HISTORY,
      payload: {
        ...gameData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      }
    });
  };

  const value = {
    ...state,
    login,
    logout,
    updateBalance,
    addGameHistory
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;