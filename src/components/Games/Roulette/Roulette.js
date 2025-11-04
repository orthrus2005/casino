// src/components/games/roulette/Roulette.js
import React, { useState } from 'react';
import './Roulette.css';

const Roulette = ({ balance, updateBalance }) => {
  const [bet, setBet] = useState(10);
  const [selectedBet, setSelectedBet] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('Сделайте ставку!');
  const [history, setHistory] = useState([]);

  const bets = [
    { type: 'red', label: 'Красное', multiplier: 2, color: '#e74c3c' },
    { type: 'black', label: 'Черное', multiplier: 2, color: '#2c3e50' },
    { type: 'green', label: 'Зеленое', multiplier: 14, color: '#2ecc71' }
  ];

  const spinWheel = () => {
    if (!selectedBet) {
      setMessage('Выберите ставку!');
      return;
    }
    if (bet > balance) {
      setMessage('Недостаточно средств!');
      return;
    }

    setSpinning(true);
    setMessage('Крутим рулетку...');

    // Анимация вращения
    setTimeout(() => {
      const random = Math.random();
      let winColor;
      
      if (random < 0.47) {
        winColor = 'red';
      } else if (random < 0.94) {
        winColor = 'black';
      } else {
        winColor = 'green';
      }

      setResult(winColor);
      
      let winAmount = 0;
      if (selectedBet.type === winColor) {
        winAmount = bet * selectedBet.multiplier;
        setMessage(`Поздравляем! Вы выиграли $${winAmount}`);
      } else {
        winAmount = -bet;
        setMessage(`Выпало ${winColor}. Попробуйте еще!`);
      }

      const newBalance = updateBalance(winAmount);
      
      setHistory(prev => [{
        bet: selectedBet.label,
        amount: bet,
        result: winColor,
        win: winAmount,
        balance: newBalance,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);

      setSpinning(false);
    }, 2000);
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
    <div className="roulette-game">
      <h2>🎡 Рулетка</h2>
      
      <div className="roulette-container">
        <div className={`roulette-wheel ${spinning ? 'spinning' : ''}`}>
          <div className="wheel">
            <div className={`result ${result}`}>
              {result === 'red' && '🔴'}
              {result === 'black' && '⚫'}
              {result === 'green' && '🟢'}
            </div>
          </div>
        </div>

        <div className="betting-area">
          <h3>Сделайте ставку:</h3>
          <div className="bets-grid">
            {bets.map((betOption) => (
              <button
                key={betOption.type}
                className={`bet-option ${selectedBet?.type === betOption.type ? 'selected' : ''}`}
                style={{ backgroundColor: betOption.color }}
                onClick={() => setSelectedBet(betOption)}
                disabled={spinning}
              >
                <span>{betOption.label}</span>
                <span>x{betOption.multiplier}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="roulette-controls">
          <div className="bet-controls">
            <button onClick={decreaseBet} disabled={spinning}>-</button>
            <span>Ставка: ${bet}</span>
            <button onClick={increaseBet} disabled={spinning}>+</button>
          </div>

          <button 
            onClick={spinWheel} 
            disabled={spinning || !selectedBet}
            className="spin-btn"
          >
            {spinning ? 'Крутим...' : 'Крутить!'}
          </button>
        </div>

        <div className="message">{message}</div>

        {selectedBet && (
          <div className="current-bet">
            Текущая ставка: <strong>{selectedBet.label}</strong> 
            (x{selectedBet.multiplier})
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="game-history">
          <h3>История игр:</h3>
          <div className="history-list">
            {history.map((game, index) => (
              <div key={index} className="history-item">
                <span>Ставка: {game.bet}</span>
                <span>${game.amount}</span>
                <span>Результат: {game.result}</span>
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

export default Roulette;