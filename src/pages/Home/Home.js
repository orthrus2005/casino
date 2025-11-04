// src/pages/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user, balance, gameHistory } = useAuth();

  const totalGames = gameHistory.length;
  const totalWins = gameHistory.filter(game => game.win > 0).length;
  const totalProfit = gameHistory.reduce((sum, game) => sum + game.win, 0);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>Добро пожаловать, {user}! 🎰</h2>
        <p>Испытайте удачу в лучшем виртуальном казино</p>
        <div className="balance-display">
          Ваш баланс: <span className="balance-amount">${balance}</span>
        </div>
        <Link to="/games" className="cta-button">
          Начать играть
        </Link>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <h3>{totalGames}</h3>
            <p>Всего игр</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>{totalWins}</h3>
            <p>Побед</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${totalProfit}</h3>
            <p>Общий результат</p>
          </div>
        </div>
      </div>

      <div className="games-preview">
        <h3>Доступные игры</h3>
        <div className="games-grid">
          <Link to="/games" className="game-card" onClick={() => localStorage.setItem('activeGame', 'slots')}>
            <div className="game-icon">🎰</div>
            <h4>Слот-машина</h4>
            <p>Классические игровые автоматы с большими выигрышами</p>
            <div className="game-features">
              <span>Мин: $10</span>
              <span>Макс: $500</span>
              <span>Джекпот x10</span>
            </div>
          </Link>

          <Link to="/games" className="game-card" onClick={() => localStorage.setItem('activeGame', 'roulette')}>
            <div className="game-icon">🎡</div>
            <h4>Рулетка</h4>
            <p>Ставьте на цвет и выигрывайте до x14</p>
            <div className="game-features">
              <span>Мин: $10</span>
              <span>Макс: $500</span>
              <span>Коэф: x2-x14</span>
            </div>
          </Link>

          <Link to="/games" className="game-card" onClick={() => localStorage.setItem('activeGame', 'blackjack')}>
            <div className="game-icon">♠️</div>
            <h4>Блэкджек</h4>
            <p>Наберите 21 очко и обыграйте дилера</p>
            <div className="game-features">
              <span>Мин: $10</span>
              <span>Макс: $500</span>
              <span>Блэкджек x2.5</span>
            </div>
          </Link>
        </div>
      </div>

      {gameHistory.length > 0 && (
        <div className="recent-games">
          <h3>Последние игры</h3>
          <div className="games-history">
            {gameHistory.slice(0, 5).map((game, index) => (
              <div key={game.id || index} className="history-item">
                <span className="game-type">{game.type}</span>
                <span className={`game-result ${game.win > 0 ? 'win' : 'lose'}`}>
                  {game.win > 0 ? `+$${game.win}` : `-$${Math.abs(game.win)}`}
                </span>
                <span className="game-time">
                  {new Date(game.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;