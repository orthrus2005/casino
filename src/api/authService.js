import api from './index';

const authService = {
  // Авторизация пользователя
  login: async (username, password) => {
    try {
      // Для демо используем моковые данные
      // В реальном приложении здесь будет запрос к бэкенду:
      // const response = await api.post('/auth/login', { username, password });
      // return response.data;
      
      // Моковая авторизация (как было)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if ((username === 'admin' && password === 'admin') || 
              (username === 'user' && password === 'user')) {
            resolve({
              success: true,
              user: username,
              isAdmin: username === 'admin',
              token: 'mock-jwt-token-' + username,
              balance: 1000
            });
          } else {
            reject({
              success: false,
              message: 'Неверный логин или пароль'
            });
          }
        }, 500); // Имитация задержки сети
      });
    } catch (error) {
      throw error;
    }
  },

  // Регистрация (если будет нужна)
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Выход из системы
  logout: async () => {
    try {
      // Очищаем локальное хранилище
      localStorage.removeItem('casino_token');
      localStorage.removeItem('casino_user');
      localStorage.removeItem('casino_isAdmin');
      localStorage.removeItem('casino_balance');
      localStorage.removeItem('casino_history');
      
      // В реальном приложении можно отправить запрос на сервер
      // await api.post('/auth/logout');
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Проверка токена
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('casino_token');
      if (!token) {
        return { isValid: false };
      }
      
      // В реальном приложении:
      // const response = await api.post('/auth/verify', { token });
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            isValid: true,
            user: localStorage.getItem('casino_user'),
            isAdmin: localStorage.getItem('casino_isAdmin') === 'true'
          });
        }, 300);
      });
    } catch (error) {
      throw error;
    }
  }
};

export default authService;