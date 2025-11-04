// src/components/Slots.js
import React, { useState } from 'react';
import './Slots.css';

const Slots = ({ balance, updateBalance }) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [message, setMessage] = useState('Сделайте ставку и крутите!');
  const [history, setHistory] = useState([]);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];

  const spinReels = () => {
    if (spinning) return;
    if (bet > balance) {
      setMessage('Недостаточно средств!');
      return;
    }
    if (bet < 10) {
      setMessage('Минимальная ставка: 10!');
      return;
    }

    setSpinning(true);
    setMessage('Крутим...');
    
    // Спин анимация
    const spins = 10;
    let spinCount = 0;

    const spinInterval = setInterval(() => {
      const newReels = reels.map(() => 
        symbols[Math.floor(Math.random() * symbols.length)]
      );
      setReels(newReels);
      spinCount++;

      if (spinCount >= spins) {
        clearInterval(spinInterval);
        
        // Финальный результат
        const finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        setReels(finalReels);
        checkWin(finalReels);
        setSpinning(false);
      }
    }, 100);
  };

  const checkWin = (finalReels) => {
    const [a, b, c] = finalReels;
    let winAmount = 0;
    let winMessage = '';

    if (a === b && b === c) {
      // Джекпот - три одинаковых символа
      winAmount = bet * 10;
      winMessage = `ДЖЕКПОТ! Вы выиграли $${winAmount}`;
    } else if (a === b || b === c || a === c) {
      // Два одинаковых символа
      winAmount = bet * 3;
      winMessage = `Пара! Вы выиграли $${winAmount}`;
    } else {
      winAmount = -bet;
      winMessage = 'Повезет в следующий раз!';
    }

    const newBalance = updateBalance(winAmount);
    setMessage(winMessage);
    
    // Добавляем в историю
    setHistory(prev => [{
      reels: [...finalReels],
      bet: bet,
      win: winAmount,
      balance: newBalance,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 9)]);
  };

  const increaseBet = () => {
    if (bet + 10 <= 500 && bet + 10 <= balance) {
      setBet(bet + 10);
    }
  };

  const decreaseBet = () => {
    if (bet - 10 >= 10) {
      setBet(bet - 10);
    }
  };

  return (
    <div className="slots-game">
      <h2>🎰 Слот-машина</h2>
      
      <div className="slots-container">
        <div className="reels">
          {reels.map((reel, index) => (
            <div key={index} className={`reel ${spinning ? 'spinning' : ''}`}>
              {reel}
            </div>
          ))}
        </div>

        <div className="slots-controls">
          <div className="bet-controls">
            <button onClick={decreaseBet} disabled={spinning}>-</button>
            <span>Ставка: ${bet}</span>
            <button onClick={increaseBet} disabled={spinning}>+</button>
          </div>

          <button 
            onClick={spinReels} 
            disabled={spinning}
            className="spin-btn"
          >
            {spinning ? 'Крутим...' : 'Крутить!'}
          </button>
        </div>

        <div className="message">{message}</div>
      </div>

      {history.length > 0 && (
        <div className="game-history">
          <h3>История игр:</h3>
          <div className="history-list">
            {history.map((game, index) => (
              <div key={index} className="history-item">
                <span>{game.reels.join(' ')}</span>
                <span>Ставка: ${game.bet}</span>
                <span className={game.win > 0 ? 'win' : 'lose'}>
                  {game.win > 0 ? `+$${game.win}` : `-$${Math.abs(game.win)}`}
                </span>
                <span>{game.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;