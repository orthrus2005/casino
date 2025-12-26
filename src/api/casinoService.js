import api from './index';

class CasinoService {
  // Статическая конфигурация игр
  static games = {
    slots: {
      name: 'Слот-машина',
      minBet: 10,
      maxBet: 500,
      symbols: ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣']
    },
    roulette: {
      name: 'Рулетка',
      minBet: 10,
      maxBet: 500,
      bets: [
        { type: 'red', label: 'Красное', multiplier: 2, color: '#e74c3c' },
        { type: 'black', label: 'Черное', multiplier: 2, color: '#2c3e50' },
        { type: 'green', label: 'Зеленое', multiplier: 14, color: '#2ecc71' }
      ]
    },
    blackjack: {
      name: 'Блэкджек',
      minBet: 10,
      maxBet: 500,
      deck: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    }
  };

  // Моковые методы для симуляции API
  static calculateSlotsWin(reels, bet) {
    const [a, b, c] = reels;
   
    if (a === b && b === c) {
      return bet * 10; // Джекпот
    } else if (a === b || b === c || a === c) {
      return bet * 3; // Пара
    }
   
    return -bet; // Проигрыш
  }

  static spinRoulette() {
    const random = Math.random();
    if (random < 0.47) return 'red';
    if (random < 0.94) return 'black';
    return 'green';
  }

  static calculateRouletteWin(selectedBet, result, bet) {
    if (selectedBet.type === result) {
      return bet * selectedBet.multiplier;
    }
    return -bet;
  }

  // Методы для работы с API (если будет бэкенд)
  static async getGameInfo(gameId) {
    try {
      // В реальном приложении:
      // const response = await api.get(`/games/${gameId}`);
      // return response.data;
      
      // Моковые данные
      return this.games[gameId] || null;
    } catch (error) {
      console.error('Error fetching game info:', error);
      return null;
    }
  }

  static async validateBet(gameId, bet, balance) {
    try {
      // В реальном приложении:
      // const response = await api.post('/games/validate-bet', { gameId, bet, balance });
      // return response.data;
      
      const game = this.games[gameId];
      if (!game) return { valid: false, error: 'Игра не найдена' };
     
      if (bet < game.minBet) {
        return { valid: false, error: `Минимальная ставка: ${game.minBet}` };
      }
     
      if (bet > game.maxBet) {
        return { valid: false, error: `Максимальная ставка: ${game.maxBet}` };
      }
     
      if (bet > balance) {
        return { valid: false, error: 'Недостаточно средств' };
      }
     
      return { valid: true };
    } catch (error) {
      console.error('Error validating bet:', error);
      return { valid: false, error: 'Ошибка сервера' };
    }
  }

  static async playGame(gameId, bet, gameData) {
    try {
      // В реальном приложении:
      // const response = await api.post('/games/play', { gameId, bet, gameData });
      // return response.data;
      
      // Моковая логика
      let result, winAmount;
      
      switch (gameId) {
        case 'slots':
          const reels = gameData?.reels || [
            this.games.slots.symbols[Math.floor(Math.random() * this.games.slots.symbols.length)],
            this.games.slots.symbols[Math.floor(Math.random() * this.games.slots.symbols.length)],
            this.games.slots.symbols[Math.floor(Math.random() * this.games.slots.symbols.length)]
          ];
          winAmount = this.calculateSlotsWin(reels, bet);
          result = { reels, winAmount };
          break;
          
        case 'roulette':
          const winColor = this.spinRoulette();
          const selectedBet = gameData?.selectedBet;
          winAmount = selectedBet 
            ? this.calculateRouletteWin(selectedBet, winColor, bet)
            : -bet;
          result = { color: winColor, winAmount };
          break;
          
        case 'blackjack':
          // Упрощенная логика блэкджека
          const playerScore = gameData?.playerScore || 0;
          const dealerScore = gameData?.dealerScore || 0;
          
          if (playerScore > 21) {
            winAmount = -bet;
          } else if (dealerScore > 21 || playerScore > dealerScore) {
            winAmount = bet * 2;
          } else if (playerScore < dealerScore) {
            winAmount = -bet;
          } else {
            winAmount = 0; // Ничья
          }
          
          if (gameData?.isBlackjack) {
            winAmount = bet * 2.5;
          }
          
          result = { playerScore, dealerScore, winAmount };
          break;
          
        default:
          winAmount = -bet;
          result = { winAmount };
      }
      
      return {
        success: true,
        result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error playing game:', error);
      return { success: false, error: 'Ошибка при игре' };
    }
  }

  // Получение истории игр с сервера
  static async getGameHistory(userId) {
    try {
      // В реальном приложении:
      // const response = await api.get(`/users/${userId}/history`);
      // return response.data;
      
      // Моковые данные
      const savedHistory = localStorage.getItem('casino_history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Error fetching game history:', error);
      return [];
    }
  }

  // Сохранение игры на сервере
  static async saveGameResult(gameData) {
    try {
      // В реальном приложении:
      // const response = await api.post('/games/save', gameData);
      // return response.data;
      
      // Локальное сохранение
      return { success: true, message: 'Игра сохранена' };
    } catch (error) {
      console.error('Error saving game result:', error);
      return { success: false, error: 'Ошибка сохранения' };
    }
  }

  // Получение статистики
  static async getUserStats(userId) {
    try {
      // В реальном приложении:
      // const response = await api.get(`/users/${userId}/stats`);
      // return response.data;
      
      const history = await this.getGameHistory(userId);
      const totalGames = history.length;
      const totalWins = history.filter(game => game.win > 0).length;
      const totalProfit = history.reduce((sum, game) => sum + (game.win || 0), 0);
      
      return {
        totalGames,
        totalWins,
        totalProfit,
        winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { totalGames: 0, totalWins: 0, totalProfit: 0, winRate: 0 };
    }
  }
}

export default CasinoService;