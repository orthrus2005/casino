import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { addGameHistory } from '../../../store/slices/authSlice';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  IconButton,
  useTheme,
  CardActions
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Casino as CasinoIcon,
  CreditCard as CardIcon,
  TrendingUp as WinIcon,
  TrendingDown as LoseIcon
} from '@mui/icons-material';
import GameHistory from '../../common/GameHistory';
import CasinoService from '../../../api/casinoService';

const Blackjack = ({ balance, updateBalance }) => {
  const dispatch = useAppDispatch();
  
  const [bet, setBet] = useState(10);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameState, setGameState] = useState('betting');
  const [message, setMessage] = useState('Сделайте ставку!');
  const [history, setHistory] = useState([]);

  const theme = useTheme();
  const gameInfo = CasinoService.getGameInfo('blackjack');
  const deck = gameInfo?.deck || ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
    
    const validation = CasinoService.validateBet('blackjack', bet, balance);
    if (!validation.valid) {
      setMessage(validation.error);
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
      winAmount = 0;
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
    
    const gameRecord = {
      type: 'Блэкджек',
      bet: bet,
      win: winAmount,
      result: result,
      timestamp: new Date().toLocaleTimeString(),
      details: {
        playerScore: playerScore,
        dealerScore: dealerScore,
        balance: newBalance
      }
    };
    
    setHistory(prev => [gameRecord, ...prev.slice(0, 9)]);
    
    // Используем Redux dispatch вместо пропса
    dispatch(addGameHistory(gameRecord));
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

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 2 } }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: theme.palette.warning.main }}>
                ♠️ {gameInfo?.name || 'Блэкджек'}
              </Typography>
              
              {/* Дилер и игрок */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.warning.main }}>
                      Дилер: {dealerScore}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {dealerHand.map((card, index) => (
                        <Paper
                          key={index}
                          sx={{
                            width: 60,
                            height: 90,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            bgcolor: index === 1 && gameState === 'player-turn' ? theme.palette.error.main : 'white',
                            color: index === 1 && gameState === 'player-turn' ? 'transparent' : theme.palette.text.primary,
                            borderRadius: 1,
                            border: `2px solid ${theme.palette.warning.main}`,
                            position: 'relative'
                          }}
                        >
                          {index === 1 && gameState === 'player-turn' ? '?' : card}
                        </Paper>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                      Вы: {playerScore}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {playerHand.map((card, index) => (
                        <Paper
                          key={index}
                          sx={{
                            width: 60,
                            height: 90,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.8rem',
                            bgcolor: 'white',
                            borderRadius: 1,
                            border: `2px solid ${theme.palette.primary.main}`
                          }}
                        >
                          {card}
                        </Paper>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              {/* Управление ставкой */}
              {gameState === 'betting' && (
                <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                      Ставка
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
                      <IconButton onClick={decreaseBet} disabled={bet <= 10} color="error" size="large">
                        <RemoveIcon />
                      </IconButton>
                      <Chip
                        label={`$${bet}`}
                        color="primary"
                        sx={{ fontSize: '1.5rem', fontWeight: 'bold', px: 3, py: 2 }}
                      />
                      <IconButton
                        onClick={increaseBet}
                        disabled={bet >= Math.min(500, balance)}
                        color="success"
                        size="large"
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="textSecondary" textAlign="center">
                      Диапазон: $10 - ${Math.min(500, balance)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CasinoIcon />}
                      onClick={startGame}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Раздать карты
                    </Button>
                  </CardActions>
                </Card>
              )}
              
              {/* Игровые кнопки */}
              {gameState === 'player-turn' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={hit}
                    startIcon={<AddIcon />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Хит
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={stand}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Стэнд
                  </Button>
                </Box>
              )}
              
              {gameState === 'game-over' && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={resetGame}
                    startIcon={<CasinoIcon />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Новая игра
                  </Button>
                </Box>
              )}
              
              {/* Сообщение */}
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: message.includes('БЛЭКДЖЕК')
                    ? 'rgba(255, 215, 0, 0.1)'
                    : message.includes('выиграли')
                    ? 'rgba(46, 204, 113, 0.1)'
                    : 'rgba(231, 76, 60, 0.1)',
                  border: `2px solid ${
                    message.includes('БЛЭКДЖЕК')
                      ? theme.palette.warning.main
                      : message.includes('выиграли')
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }`,
                  borderRadius: 2
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: message.includes('БЛЭКДЖЕК')
                      ? theme.palette.warning.main
                      : message.includes('выиграли')
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }}
                >
                  {message}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        
        {/* История */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <GameHistory
                history={history}
                onClearHistory={clearHistory}
                title="История блэкджека"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Blackjack;