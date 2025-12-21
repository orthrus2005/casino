// src/components/games/slots/Slots.js
import React, { useState, useEffect } from 'react';
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
  TextField,
  Alert,
  useTheme
} from '@mui/material';
import {
  AddCircleOutline as IncreaseIcon,
  RemoveCircleOutline as DecreaseIcon,
  Casino as SpinIcon,
  History as HistoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const Slots = ({ balance, updateBalance }) => {
  const [bet, setBet] = useState(10);
  const [betInput, setBetInput] = useState('10');
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [message, setMessage] = useState('Сделайте ставку и крутите!');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const theme = useTheme();

  const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
  const MIN_BET = 10;
  const MAX_BET = 500;

  // Синхронизация betInput с bet
  useEffect(() => {
    setBetInput(bet.toString());
  }, [bet]);

  // Валидация ввода ставки
  const validateBetInput = (value) => {
    // Удаляем все символы кроме цифр
    const numericValue = value.replace(/[^\d]/g, '');
    
    if (numericValue === '') {
      setBetInput('');
      setError('Введите сумму ставки');
      return;
    }
    
    const numValue = parseInt(numericValue, 10);
    
    if (isNaN(numValue)) {
      setError('Введите корректное число');
      return;
    }
    
    if (numValue < MIN_BET) {
      setError(`Минимальная ставка: $${MIN_BET}`);
    } else if (numValue > MAX_BET) {
      setError(`Максимальная ставка: $${MAX_BET}`);
    } else if (numValue > balance) {
      setError('Недостаточно средств на балансе');
    } else {
      setError('');
    }
    
    setBetInput(numericValue);
  };

  // Обработка изменения ввода
  const handleBetInputChange = (e) => {
    const value = e.target.value;
    validateBetInput(value);
  };

  // Установка ставки из ввода
  const handleBetInputBlur = () => {
    if (betInput === '') {
      setBet(MIN_BET);
      setBetInput(MIN_BET.toString());
      setError('');
      return;
    }
    
    const numValue = parseInt(betInput, 10);
    
    if (!isNaN(numValue)) {
      if (numValue < MIN_BET) {
        setBet(MIN_BET);
        setBetInput(MIN_BET.toString());
        setError('');
      } else if (numValue > MAX_BET) {
        setBet(MAX_BET);
        setBetInput(MAX_BET.toString());
        setError('');
      } else if (numValue > balance) {
        setBet(Math.min(balance, MAX_BET));
        setBetInput(Math.min(balance, MAX_BET).toString());
        setError('');
      } else {
        setBet(numValue);
      }
    } else {
      setBet(MIN_BET);
      setBetInput(MIN_BET.toString());
      setError('');
    }
  };

  // Быстрая установка ставки
  const setQuickBet = (amount) => {
    if (amount >= MIN_BET && amount <= MAX_BET && amount <= balance) {
      setBet(amount);
      setError('');
    }
  };

  const spinReels = () => {
    if (spinning) return;
    
    // Проверка валидации
    if (error && error !== '') {
      setMessage(error);
      return;
    }
    
    if (bet > balance) {
      setMessage('Недостаточно средств!');
      return;
    }
    
    if (bet < MIN_BET) {
      setMessage(`Минимальная ставка: $${MIN_BET}!`);
      return;
    }
    
    if (bet > MAX_BET) {
      setMessage(`Максимальная ставка: $${MAX_BET}!`);
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
    const newBet = bet + 10;
    if (newBet <= MAX_BET && newBet <= balance) {
      setBet(newBet);
      setError('');
    } else if (newBet > balance) {
      setError('Недостаточно средств на балансе');
    }
  };

  const decreaseBet = () => {
    const newBet = bet - 10;
    if (newBet >= MIN_BET) {
      setBet(newBet);
      setError('');
    }
  };

  // Быстрые ставки
  const quickBets = [10, 50, 100, 250, 500];

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
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Управление ставкой
              </Typography>
              
              {/* Поле ввода ставки */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                  Введите сумму ставки:
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  inputMode="numeric"
                  value={betInput}
                  onChange={handleBetInputChange}
                  onBlur={handleBetInputBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleBetInputBlur();
                    }
                  }}
                  disabled={spinning}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 1, color: theme.palette.text.secondary }}>$</Typography>
                    ),
                    sx: {
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                    }
                  }}
                />
                
                {error && (
                  <Alert 
                    severity="error" 
                    icon={<WarningIcon />}
                    sx={{ mt: 1 }}
                  >
                    {error}
                  </Alert>
                )}
              </Box>

              {/* Быстрые кнопки изменения ставки */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 3 }}>
                <IconButton 
                  onClick={decreaseBet} 
                  disabled={spinning || bet <= MIN_BET}
                  color="error"
                  size="large"
                  sx={{
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  <DecreaseIcon fontSize="large" />
                </IconButton>
                
                <Chip
                  label={`Текущая ставка: $${bet}`}
                  color="primary"
                  sx={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    px: 3,
                    py: 2,
                    border: `2px solid ${theme.palette.primary.main}`
                  }}
                />
                
                <IconButton 
                  onClick={increaseBet} 
                  disabled={spinning || bet >= Math.min(MAX_BET, balance)}
                  color="success"
                  size="large"
                  sx={{
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  <IncreaseIcon fontSize="large" />
                </IconButton>
              </Box>
              
              {/* Быстрые ставки */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom sx={{ textAlign: 'center' }}>
                  Быстрые ставки:
                </Typography>
                <Grid container spacing={1} justifyContent="center">
                  {quickBets.map((quickBet) => (
                    <Grid item key={quickBet}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setQuickBet(quickBet)}
                        disabled={spinning || quickBet > balance || quickBet > MAX_BET}
                        sx={{
                          minWidth: '60px',
                          borderColor: bet === quickBet ? theme.palette.success.main : theme.palette.divider,
                          bgcolor: bet === quickBet ? theme.palette.success.main + '20' : 'transparent',
                          '&:hover': {
                            borderColor: theme.palette.primary.main
                          }
                        }}
                      >
                        ${quickBet}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Typography variant="body2" color="textSecondary" textAlign="center">
                Минимальная ставка: ${MIN_BET} | Максимальная ставка: ${MAX_BET}
              </Typography>
            </CardContent>
          </Card>

          {/* Кнопка вращения */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              onClick={spinReels}
              disabled={spinning || bet > balance || bet < MIN_BET || bet > MAX_BET || error !== ''}
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
                  bgcolor: theme.palette.action.disabled,
                  transform: 'none'
                }
              }}
            >
              {spinning ? 'Крутим...' : 'Крутить!'}
            </Button>
            
            {/* Информация о балансе */}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Доступный баланс: <span style={{ color: theme.palette.success.main, fontWeight: 'bold' }}>${balance}</span>
            </Typography>
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