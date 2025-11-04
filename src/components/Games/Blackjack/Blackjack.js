// src/components/games/blackjack/Blackjack.js
import React, { useState, useEffect } from 'react';
import './Blackjack.css';

const Blackjack = ({ balance, updateBalance }) => {
  const [bet, setBet] = useState(10);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameState, setGameState] = useState('betting'); // betting, player-turn, dealer-turn, game-over
  const [message, setMessage] = useState('Сделайте ставку!');
  const [history, setHistory] = useState([]);

  const deck = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const getCardValue = (card) => {
    if (card === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card)) return 10;
    return parseInt(card);
  };

  const calculateScore = (hand) => {
    let score = hand.reduce((total, card) => total + getCardValue(card), 0);
    let aces = hand.filter(card => card === 'A').length;
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const dealCard = () => {
    return deck[Math.floor(Math.random() * deck.length)];
  };

  const startGame = () => {
    if (bet > balance) {
      setMessage('Недостаточно средств!');
      return;
    }

    const newPlayerHand = [dealCard(), dealCard()];
    const newDealerHand = [dealCard(), dealCard()];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    
    const playerScore = calculateScore(newPlayerHand);
    const dealerScore = calculateScore([newDealerHand[0]]);
    
    setPlayerScore(playerScore);
    setDealerScore(dealerScore);
    setGameState('player-turn');
    setMessage('Ваш ход! Хит или Стэнд?');

    // Блэкджек при раздаче
    if (playerScore === 21) {
      endGame('blackjack');
    }
  };

  const hit = () => {
    if (gameState !== 'player-turn') return;

    const newCard = dealCard();
    const newPlayerHand = [...playerHand, newCard];
    const newPlayerScore = calculateScore(newPlayerHand);

    setPlayerHand(newPlayerHand);
    setPlayerScore(newPlayerScore);

    if (newPlayerScore > 21) {
      endGame('bust');
    } else if (newPlayerScore === 21) {
      stand();
    }
  };

  const stand = () => {
    setGameState('dealer-turn');
    setMessage('Ход дилера...');

    // Дилер берет карты до 17
    setTimeout(() => {
      let newDealerHand = [...dealerHand];
      let newDealerScore = calculateScore(newDealerHand);

      while (newDealerScore < 17) {
        const newCard = dealCard();
        newDealerHand.push(newCard);
        newDealerScore = calculateScore(newDealerHand);
      }

      setDealerHand(newDealerHand);
      setDealerScore(newDealerScore);

      setTimeout(() => {
        determineWinner(newDealerScore);
      }, 1000);
    }, 1500);
  };

  const determineWinner = (finalDealerScore) => {
    let result;
    let winAmount = 0;

    if (playerScore > 21) {
      result = 'bust';
      winAmount = -bet;
    } else if (finalDealerScore > 21) {
      result = 'dealer_bust';
      winAmount = bet * 2;
    } else if (playerScore > finalDealerScore) {
      result = 'win';
      winAmount = bet * 2;
    } else if (playerScore < finalDealerScore) {
      result = 'lose';
      winAmount = -bet;
    } else {
      result = 'push';
      winAmount = 0; // Возврат ставки
    }

    endGame(result, winAmount);
  };

  const endGame = (result, winAmount = -bet) => {
    setGameState('game-over');
    
    let resultMessage = '';
    switch (result) {
      case 'blackjack':
        winAmount = bet * 2.5;
        resultMessage = `БЛЭКДЖЕК! Вы выиграли $${winAmount}`;
        break;
      case 'bust':
        resultMessage = 'Перебор! Вы проиграли';
        break;
      case 'dealer_bust':
        resultMessage = `Дилер перебрал! Вы выиграли $${winAmount}`;
        break;
      case 'win':
        resultMessage = `Вы выиграли! $${winAmount}`;
        break;
      case 'lose':
        resultMessage = 'Дилер выиграл';
        break;
      case 'push':
        resultMessage = 'Ничья! Ставка возвращена';
        break;
      default:
        resultMessage = 'Игра завершена';
    }

    const newBalance = updateBalance(winAmount);
    setMessage(resultMessage);

    setHistory(prev => [{
      playerHand: [...playerHand],
      dealerHand: [...dealerHand],
      playerScore: playerScore,
      dealerScore: dealerScore,
      bet: bet,
      win: winAmount,
      balance: newBalance,
      result: result,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev.slice(0, 9)]);
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameState('betting');
    setMessage('Сделайте ставку!');
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

  const getCardSymbol = (card) => {
    const symbols = {
      '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
      '8': '8', '9': '9', '10': '10', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'
    };
    return symbols[card];
  };

  return (
    <div className="blackjack-game">
      <h2>♠️ Блэкджек</h2>
      
      <div className="blackjack-container">
        {/* Дилер */}
        <div className="dealer-area">
          <h3>Дилер: {dealerScore}</h3>
          <div className="hand">
            {dealerHand.map((card, index) => (
              <div 
                key={index} 
                className={`card ${index === 1 && gameState === 'player-turn' ? 'hidden' : ''}`}
              >
                {index === 1 && gameState === 'player-turn' ? '?' : getCardSymbol(card)}
              </div>
            ))}
          </div>
        </div>

        {/* Игрок */}
        <div className="player-area">
          <h3>Вы: {playerScore}</h3>
          <div className="hand">
            {playerHand.map((card, index) => (
              <div key={index} className="card">
                {getCardSymbol(card)}
              </div>
            ))}
          </div>
        </div>

        {/* Управление */}
        <div className="blackjack-controls">
          {gameState === 'betting' && (
            <>
              <div className="bet-controls">
                <button onClick={decreaseBet}>-</button>
                <span>Ставка: ${bet}</span>
                <button onClick={increaseBet}>+</button>
              </div>
              <button onClick={startGame} className="deal-btn">
                Раздать карты
              </button>
            </>
          )}

          {gameState === 'player-turn' && (
            <div className="game-buttons">
              <button onClick={hit} className="hit-btn">
                Хит
              </button>
              <button onClick={stand} className="stand-btn">
                Стэнд
              </button>
            </div>
          )}

          {gameState === 'game-over' && (
            <button onClick={resetGame} className="new-game-btn">
              Новая игра
            </button>
          )}
        </div>

        <div className="message">{message}</div>

        {/* Правила */}
        <div className="rules">
          <h4>Правила:</h4>
          <ul>
            <li>Цель: набрать 21 очко или больше дилера</li>
            <li>Блэкджек (21 с двумя картами) = x2.5</li>
            <li>Дилер берет карты до 17</li>
            <li>Перебор = проигрыш</li>
          </ul>
        </div>
      </div>

      {history.length > 0 && (
        <div className="game-history">
          <h3>История игр:</h3>
          <div className="history-list">
            {history.map((game, index) => (
              <div key={index} className="history-item">
                <span>Игрок: {game.playerScore}</span>
                <span>Дилер: {game.dealerScore}</span>
                <span>Ставка: ${game.bet}</span>
                <span className={game.win > 0 ? 'win' : game.win < 0 ? 'lose' : 'push'}>
                  {game.win > 0 ? `+$${game.win}` : game.win < 0 ? `-$${Math.abs(game.win)}` : 'Ничья'}
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

export default Blackjack;