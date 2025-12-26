import api from './index';

const userService = {
  // Получение профиля пользователя
  getProfile: async (userId) => {
    try {
      // В реальном приложении:
      // const response = await api.get(`/users/${userId}`);
      // return response.data;
      
      // Моковые данные
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedBalance = localStorage.getItem('casino_balance');
          resolve({
            id: userId,
            username: localStorage.getItem('casino_user'),
            isAdmin: localStorage.getItem('casino_isAdmin') === 'true',
            balance: savedBalance ? parseInt(savedBalance) : 1000,
            createdAt: new Date().toISOString()
          });
        }, 300);
      });
    } catch (error) {
      throw error;
    }
  },

  // Обновление профиля
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Пополнение баланса
  deposit: async (userId, amount) => {
    try {
      // В реальном приложении:
      // const response = await api.post(`/users/${userId}/deposit`, { amount });
      // return response.data;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const currentBalance = parseInt(localStorage.getItem('casino_balance') || '1000');
          const newBalance = currentBalance + amount;
          localStorage.setItem('casino_balance', newBalance.toString());
          
          resolve({
            success: true,
            newBalance,
            message: `Баланс успешно пополнен на $${amount}`
          });
        }, 500);
      });
    } catch (error) {
      throw error;
    }
  },

  // Вывод средств
  withdraw: async (userId, amount) => {
    try {
      // В реальном приложении:
      // const response = await api.post(`/users/${userId}/withdraw`, { amount });
      // return response.data;
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentBalance = parseInt(localStorage.getItem('casino_balance') || '1000');
          
          if (amount > currentBalance) {
            reject({
              success: false,
              error: 'Недостаточно средств на балансе'
            });
            return;
          }
          
          const newBalance = currentBalance - amount;
          localStorage.setItem('casino_balance', newBalance.toString());
          
          resolve({
            success: true,
            newBalance,
            message: `$${amount} успешно выведено`
          });
        }, 500);
      });
    } catch (error) {
      throw error;
    }
  },

  // Получение транзакций
  getTransactions: async (userId, limit = 10) => {
    try {
      // В реальном приложении:
      // const response = await api.get(`/users/${userId}/transactions?limit=${limit}`);
      // return response.data;
      
      // Моковые данные
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            transactions: [],
            total: 0
          });
        }, 300);
      });
    } catch (error) {
      throw error;
    }
  }
};

export default userService;