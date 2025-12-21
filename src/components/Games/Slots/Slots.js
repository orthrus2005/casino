// src/components/games/slots/Slots.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  AddCircleOutline as IncreaseIcon,
  RemoveCircleOutline as DecreaseIcon,
  Casino as SpinIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const Slots = ({ balance, updateBalance }) => {
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [message, setMessage] = useState('Сделайте ставку и крутите!');
  const [history, setHistory] = useState([]);
  const theme = useTheme();

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, md: 2 } }}>
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: theme.palette.warning.main }}>
            🎰 Слот-машина
          </Typography>
          
          {/* Игровые барабаны */}
          <Paper
            elevation={6}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
              border: `2px solid ${theme.palette.warning.main}`,
              borderRadius: 3
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              {reels.map((reel, index) => (
                <Grid item key={index}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      bgcolor: 'white',
                      borderRadius: 2,
                      border: `3px solid ${theme.palette.warning.main}`,
                      animation: spinning ? 'spin 0.1s infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'translateY(-10px)' },
                        '50%': { transform: 'translateY(10px)' },
                        '100%': { transform: 'translateY(-10px)' },
                      }
                    }}
                  >
                    {reel}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Управление ставкой */}
          <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Управление ставкой
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
                <IconButton 
                  onClick={decreaseBet} 
                  disabled={spinning || bet <= 10}
                  color="error"
                  size="large"
                >
                  <DecreaseIcon fontSize="large" />
                </IconButton>
                
                <Chip
                  label={`Ставка: $${bet}`}
                  color="primary"
                  sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    px: 3,
                    py: 2
                  }}
                />
                
                <IconButton 
                  onClick={increaseBet} 
                  disabled={spinning || bet >= Math.min(500, balance)}
                  color="success"
                  size="large"
                >
                  <IncreaseIcon fontSize="large" />
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="textSecondary" textAlign="center">
                Минимальная ставка: $10 | Максимальная ставка: $500
              </Typography>
            </CardContent>
          </Card>

          {/* Кнопка вращения */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              onClick={spinReels}
              disabled={spinning || bet > balance}
              startIcon={<SpinIcon />}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                background: `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 10
                },
                '&:disabled': {
                  bgcolor: theme.palette.action.disabled
                }
              }}
            >
              {spinning ? 'Крутим...' : 'Крутить!'}
            </Button>
          </Box>

          {/* Сообщение о результате */}
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              textAlign: 'center',
              bgcolor: message.includes('ДЖЕКПОТ') 
                ? theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)'
                : message.includes('Пара')
                ? theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)'
                : theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(231, 76, 60, 0.1)',
              border: `1px solid ${
                message.includes('ДЖЕКПОТ') 
                  ? theme.palette.warning.main 
                  : message.includes('Пара')
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
                color: message.includes('ДЖЕКПОТ') 
                  ? theme.palette.warning.main 
                  : message.includes('Пара')
                  ? theme.palette.success.main
                  : theme.palette.error.main
              }}
            >
              {message}
            </Typography>
          </Paper>

          {/* История игр */}
          {history.length > 0 && (
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon /> История игр
                </Typography>
                
                <Grid container spacing={1}>
                  {history.map((game, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                          borderLeft: `4px solid ${
                            game.win > 0 ? theme.palette.success.main : theme.palette.error.main
                          }`
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h5">
                            {game.reels.join(' ')}
                          </Typography>
                          <Chip
                            label={`Ставка: $${game.bet}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: game.win > 0 ? theme.palette.success.main : theme.palette.error.main,
                              fontWeight: 'bold'
                            }}
                          >
                            {game.win > 0 ? `+$${game.win}` : `-$${Math.abs(game.win)}`}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {game.timestamp}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Правила игры */}
      <Card sx={{ bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Правила игры
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" sx={{ color: theme.palette.warning.main, mb: 1 }}>
                  3 одинаковых
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Джекпот x10
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Три одинаковых символа
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" sx={{ color: theme.palette.success.main, mb: 1 }}>
                  2 одинаковых
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Выигрыш x3
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Два одинаковых символа
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" sx={{ color: theme.palette.error.main, mb: 1 }}>
                  Все разные
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Проигрыш
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Все символы разные
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Slots;