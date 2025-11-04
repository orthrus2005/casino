// src/components/UserProfile/UserProfile.js
import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, balance, gameHistory }) => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>👤 Профиль пользователя</h2>
      </div>

      <div className="profile-info">
        <div className="info-card">
          <h3>Основная информация</h3>
          <div className="info-item">
            <span className="label">Имя пользователя:</span>
            <span className="value">{user}</span>
          </div>
          <div className="info-item">
            <span className="label">Текущий баланс:</span>
            <span className="value balance-amount">${balance}</span>
          </div>
          <div className="info-item">
            <span className="label">Статус:</span>
            <span className="value status">{user === 'admin' ? 'Администратор' : 'Игрок'}</span>
          </div>
        </div>

        <div className="stats-card">
          <h3>Статистика игр</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Всего игр</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Побед</span>
            </div>
            <div className="stat">
              <span className="stat-number">$0</span>
              <span className="stat-label">Общий выигрыш</span>
            </div>
          </div>
        </div>

        {gameHistory && gameHistory.length > 0 ? (
          <div className="history-card">
            <h3>История последних игр</h3>
            <div className="history-list">
              {gameHistory.slice(0, 5).map((game, index) => (
                <div key={index} className="history-item">
                  <span className="game-type">{game.type}</span>
                  <span className={`game-result ${game.win > 0 ? 'win' : 'lose'}`}>
                    {game.win > 0 ? `+$${game.win}` : `-$${Math.abs(game.win)}`}
                  </span>
                  <span className="game-time">{game.time}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-history">
            <p>История игр пуста. Сыграйте в казино, чтобы увидеть статистику!</p>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button className="action-btn deposit-btn">
          Пополнить баланс
        </button>
        <button className="action-btn withdraw-btn">
          Вывести средства
        </button>
      </div>
    </div>
  );
};

export default UserProfile;