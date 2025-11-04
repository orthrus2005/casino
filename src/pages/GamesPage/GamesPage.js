// src/pages/GamesPage/GamesPage.js
import React, { useState } from 'react';
import Slots from '../../components/Games/Slots/Slots';
import Roulette from '../../components/Games/Roulette/Roulette';
import Blackjack from '../../components/Games/Blackjack/Blackjack';
import './GamesPage.css';

const GamesPage = ({ balance, updateBalance }) => {
  const [activeGame, setActiveGame] = useState('slots');

  const games = [
    { id: 'slots', name: 'Слот-машина', icon: '🎰', component: Slots },
    { id: 'roulette', name: 'Рулетка', icon: '🎡', component: Roulette },
    { id: 'blackjack', name: 'Блэкджек', icon: '♠️', component: Blackjack }
  ];

  const ActiveGameComponent = games.find(game => game.id === activeGame)?.component;

  return (
    <div className="games-page">
      <div className="games-sidebar">
        <h3>Выберите игру</h3>
        {games.map(game => (
          <button
            key={game.id}
            className={`game-tab ${activeGame === game.id ? 'active' : ''}`}
            onClick={() => setActiveGame(game.id)}
          >
            <span className="game-icon">{game.icon}</span>
            <span className="game-name">{game.name}</span>
          </button>
        ))}
      </div>

      <div className="game-content">
        {ActiveGameComponent && (
          <ActiveGameComponent 
            balance={balance} 
            updateBalance={updateBalance} 
          />
        )}
      </div>
    </div>
  );
};

export default GamesPage;