// src/api/casinoService.js
// Сервис для работы с казино (можно расширить для бэкенда)
class CasinoService {
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

  // Симуляция выигрыша для слотов
  static calculateSlotsWin(reels, bet) {
    const [a, b, c] = reels;
    
    if (a === b && b === c) {
      return bet * 10; // Джекпот
    } else if (a === b || b === c || a === c) {
      return bet * 3; // Пара
    }
    
    return -bet; // Проигрыш
  }

  // Симуляция рулетки
  static spinRoulette() {
    const random = Math.random();
    if (random < 0.47) return 'red';
    if (random < 0.94) return 'black';
    return 'green';
  }

  // Расчет выигрыша в рулетке
  static calculateRouletteWin(selectedBet, result, bet) {
    if (selectedBet.type === result) {
      return bet * selectedBet.multiplier;
    }
    return -bet;
  }

  // Получить информацию об игре
  static getGameInfo(gameId) {
    return this.games[gameId] || null;
  }

  // Проверить валидность ставки
  static validateBet(gameId, bet, balance) {
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
  }
}

export default CasinoService;