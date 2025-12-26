import axios from 'axios';

// Базовый URL для API (можно настроить под ваш бэкенд)
const API_BASE_URL = 'http://localhost:5000/api'; // или ваш URL бэкенда

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('casino_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден
      localStorage.removeItem('casino_token');
      localStorage.removeItem('casino_user');
      localStorage.removeItem('casino_isAdmin');
      localStorage.removeItem('casino_balance');
      localStorage.removeItem('casino_history');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;