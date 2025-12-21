// src/theme/casinoTheme.js
import { createTheme } from '@mui/material/styles';

// Кастомная светлая тема для казино
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9c27b0', // Фиолетовый для казино
      light: '#af52bf',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9800', // Оранжевый
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#000000',
    },
    success: {
      main: '#2ecc71', // Зеленый для выигрышей
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#e74c3c', // Красный для проигрышей
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ffd700', // Золотой
      light: '#ffeb3b',
      dark: '#ffa000',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
    casino: {
      gold: '#ffd700',
      purple: '#764ba2',
      red: '#e74c3c',
      green: '#2ecc71',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h3: {
      fontWeight: 600,
      color: '#2c3e50',
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 15,
        },
      },
    },
  },
});

// Кастомная темная тема для казино
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc', // Светло-фиолетовый
      light: '#cfb7ff',
      dark: '#9a67ea',
      contrastText: '#000000',
    },
    secondary: {
      main: '#03dac6', // Бирюзовый
      light: '#66fff9',
      dark: '#00a896',
      contrastText: '#000000',
    },
    success: {
      main: '#00e676', // Неоново-зеленый
      light: '#69f0ae',
      dark: '#00c853',
    },
    error: {
      main: '#ff5252', // Ярко-красный
      light: '#ff867f',
      dark: '#c50e29',
    },
    warning: {
      main: '#ffd700', // Золотой
      light: '#ffff52',
      dark: '#c7a500',
    },
    background: {
      default: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      paper: 'rgba(30, 30, 46, 0.9)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    casino: {
      gold: '#ffd700',
      purple: '#9c27b0',
      red: '#ff5252',
      green: '#00e676',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h2: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h3: {
      fontWeight: 600,
      color: '#ffffff',
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 15,
        },
      },
    },
  },
});