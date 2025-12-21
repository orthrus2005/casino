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
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import {
  AddCircleOutline as IncreaseIcon,
  RemoveCircleOutline as DecreaseIcon,
  Casino as SpinIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';
import GameHistory from '../../common/GameHistory';
import CasinoService from '../../../api/casinoService';

const Slots = ({ balance, updateBalance, addGameHistory }) => {
  const [bet, setBet] = useState(10);
  const [betInput, setBetInput] = useState('10');
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [message, setMessage] = useState('Сделайте ставку и крутите!');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [quickBetMode, setQuickBetMode] = useState('manual'); // 'manual' или 'preset'
  const theme = useTheme();

  const gameInfo = CasinoService.getGameInfo('slots');
  const symbols = gameInfo?.symbols || ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
  const MIN_BET = gameInfo?.minBet || 10;
  const MAX_BET = gameInfo?.maxBet || 500;

  // Предустановленные ставки
  const presetBets = [10, 25, 50, 100, 250, 500];
  const betSteps = [
    { value: 10, label: '$10' },
    { value: 50, label: '$50' },
    { value: 100, label: '$100' },
    { value: 250, label: '$250' },
    { value: 500, label: '$500' }
  ];

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
    setQuickBetMode('manual');
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

  // Быстрая установка предустановленной ставки
  const handlePresetBet = (presetValue) => {
    setQuickBetMode('preset');
    if (presetValue >= MIN_BET && presetValue <= MAX_BET && presetValue <= balance) {
      setBet(presetValue);
      setError('');
    } else if (presetValue > balance) {
      setError('Недостаточно средств на балансе');
    }
  };

  // Обработка изменения слайдера
  const handleSliderChange = (event, newValue) => {
    setQuickBetMode('manual');
    setBet(newValue);
    setError('');
  };

  const spinReels = () => {
    if (spinning) return;
    
    // Проверка валидации
    if (error && error !== '') {
      setMessage(error);
      return;
    }
    
    const validation = CasinoService.validateBet('slots', bet, balance);
    if (!validation.valid) {
      setMessage(validation.error);
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
    const winAmount = CasinoService.calculateSlotsWin(finalReels, bet);
    let winMessage = '';
    
    const [a, b, c] = finalReels;
    if (a === b && b === c) {
      winMessage = `ДЖЕКПОТ! Вы выиграли $${winAmount}`;
    } else if (a === b || b === c || a === c) {
      winMessage = `Пара! Вы выиграли $${winAmount}`;
    } else {
      winMessage = 'Повезет в следующий раз!';
    }

    const newBalance = updateBalance(winAmount);
    setMessage(winMessage);
    
    // Создаем запись об игре
    const gameRecord = {
      type: 'Слот-машина',
      bet: bet,
      win: winAmount,
      result: finalReels.join(' '),
      timestamp: new Date().toLocaleTimeString(),
      details: {
        reels: finalReels,
        balance: newBalance
      }
    };
    
    // Добавляем в локальную историю
    setHistory(prev => [gameRecord, ...prev.slice(0, 9)]);
    
    // Добавляем в глобальную историю через контекст
    if (addGameHistory) {
      addGameHistory(gameRecord);
    }
  };

  const increaseBet = () => {
    const newBet = bet + 10;
    if (newBet <= MAX_BET && newBet <= balance) {
      setBet(newBet);
      setQuickBetMode('manual');
      setError('');
    } else if (newBet > balance) {
      setError('Недостаточно средств на балансе');
    }
  };

  const decreaseBet = () => {
    const newBet = bet - 10;
    if (newBet >= MIN_BET) {
      setBet(newBet);
      setQuickBetMode('manual');
      setError('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, md: 2 } }}>
      <Grid container spacing={3}>
        {/* Левая колонка - игра */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: theme.palette.warning.main }}>
                🎰 {gameInfo?.name || 'Слот-машина'}
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

              {/* Выбор ставки */}
              <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SavingsIcon /> Выбор ставки
                  </Typography>
                  
                  {/* Режим выбора ставки */}
                  <Box sx={{ mb: 3 }}>
                    <ToggleButtonGroup
                      value={quickBetMode}
                      exclusive
                      onChange={(e, newMode) => newMode && setQuickBetMode(newMode)}
                      size="small"
                      sx={{ mb: 2 }}
                    >
                      <ToggleButton value="manual" sx={{ fontSize: '0.8rem' }}>
                        Ручной ввод
                      </ToggleButton>
                      <ToggleButton value="preset" sx={{ fontSize: '0.8rem' }}>
                        Быстрые ставки
                      </ToggleButton>
                    </ToggleButtonGroup>

                    {quickBetMode === 'manual' ? (
                      <>
                        {/* Поле ввода ставки */}
                        <Box sx={{ mb: 2 }}>
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

                        {/* Слайдер для выбора ставки */}
                        <Box sx={{ px: 2, mb: 2 }}>
                          <Slider
                            value={bet}
                            onChange={handleSliderChange}
                            min={MIN_BET}
                            max={Math.min(MAX_BET, balance)}
                            step={10}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `$${value}`}
                            disabled={spinning}
                            sx={{
                              color: theme.palette.primary.main,
                              '& .MuiSlider-valueLabel': {
                                backgroundColor: theme.palette.primary.main,
                              }
                            }}
                          />
                        </Box>

                        {/* Кнопки +/- */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                          <IconButton 
                            onClick={decreaseBet} 
                            disabled={spinning || bet <= MIN_BET}
                            color="error"
                            size="large"
                          >
                            <DecreaseIcon fontSize="large" />
                          </IconButton>
                          
                          <Chip
                            label={`Ставка: $${bet}`}
                            color="primary"
                            sx={{ 
                              fontSize: '1.2rem', 
                              fontWeight: 'bold',
                              px: 3,
                              py: 2
                            }}
                          />
                          
                          <IconButton 
                            onClick={increaseBet} 
                            disabled={spinning || bet >= Math.min(MAX_BET, balance)}
                            color="success"
                            size="large"
                          >
                            <IncreaseIcon fontSize="large" />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      /* Быстрые ставки */
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {presetBets.map((presetBet) => (
                          <Grid item xs={4} sm={2} key={presetBet}>
                            <Button
                              fullWidth
                              variant={bet === presetBet ? "contained" : "outlined"}
                              onClick={() => handlePresetBet(presetBet)}
                              disabled={spinning || presetBet > balance || presetBet > MAX_BET}
                              sx={{
                                height: 60,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderColor: bet === presetBet ? theme.palette.success.main : theme.palette.divider,
                                bgcolor: bet === presetBet ? theme.palette.success.main + '20' : 'transparent',
                                '&:hover': {
                                  borderColor: theme.palette.primary.main,
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              ${presetBet}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Диапазон ставок: ${MIN_BET} - ${MAX_BET}
                  </Typography>
                </CardContent>
              </Card>

              {/* Кнопка вращения и информация */}
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
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <Chip
                    icon={<SavingsIcon />}
                    label={`Баланс: $${balance}`}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    icon={<SpeedIcon />}
                    label={`Ставка: $${bet}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
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
            </CardContent>
          </Card>
        </Grid>

        {/* Правая колонка - история */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <GameHistory 
                history={history}
                onClearHistory={clearHistory}
                title="История слотов"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Slots;