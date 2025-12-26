import React, { useState, useEffect } from 'react';
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
  Divider,
  TextField,
  Alert,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import {
  Casino as SpinIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon,
  Savings as SavingsIcon,
  RadioButtonChecked as BetIcon
} from '@mui/icons-material';
import GameHistory from '../../common/GameHistory';
import CasinoService from '../../../api/casinoService';

const Roulette = ({ balance, updateBalance }) => {
  const dispatch = useAppDispatch();
  
  const [bet, setBet] = useState(10);
  const [betInput, setBetInput] = useState('10');
  const [selectedBet, setSelectedBet] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('Сделайте ставку и выберите цвет!');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [quickBetMode, setQuickBetMode] = useState('manual');

  const theme = useTheme();
  const gameInfo = CasinoService.getGameInfo('roulette');
  const bets = gameInfo?.bets || [
    { type: 'red', label: 'Красное', multiplier: 2, color: '#e74c3c' },
    { type: 'black', label: 'Черное', multiplier: 2, color: '#2c3e50' },
    { type: 'green', label: 'Зеленое', multiplier: 14, color: '#2ecc71' }
  ];

  const MIN_BET = gameInfo?.minBet || 10;
  const MAX_BET = gameInfo?.maxBet || 500;
  const presetBets = [10, 25, 50, 100, 250, 500];

  // Синхронизация betInput с bet
  useEffect(() => {
    setBetInput(bet.toString());
  }, [bet]);

  // Валидация ввода ставки
  const validateBetInput = (value) => {
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

  const spinWheel = () => {
    if (!selectedBet) {
      setMessage('Выберите цвет для ставки!');
      return;
    }
    
    const validation = CasinoService.validateBet('roulette', bet, balance);
    if (!validation.valid) {
      setMessage(validation.error);
      return;
    }

    setSpinning(true);
    setMessage('Крутим рулетку...');
    
    setTimeout(() => {
      const winColor = CasinoService.spinRoulette();
      setResult(winColor);
      
      const winAmount = CasinoService.calculateRouletteWin(selectedBet, winColor, bet);
      
      if (selectedBet.type === winColor) {
        setMessage(`Поздравляем! Вы выиграли $${winAmount}`);
      } else {
        setMessage(`Выпало ${winColor === 'red' ? '🔴' : winColor === 'black' ? '⚫' : '🟢'}. Попробуйте еще!`);
      }
      
      const newBalance = updateBalance(winAmount);
      
      // Создаем запись об игре
      const gameRecord = {
        type: 'Рулетка',
        bet: bet,
        win: winAmount,
        result: `${selectedBet.label} → ${winColor}`,
        timestamp: new Date().toLocaleTimeString(),
        details: {
          selected: selectedBet.type,
          result: winColor,
          multiplier: selectedBet.multiplier,
          balance: newBalance
        }
      };
      
      // Добавляем в локальную историю
      setHistory(prev => [gameRecord, ...prev.slice(0, 9)]);
      
      // Используем Redux dispatch
      dispatch(addGameHistory(gameRecord));
      
      setSpinning(false);
    }, 2000);
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
                🎡 {gameInfo?.name || 'Рулетка'}
              </Typography>
              
              {/* Рулетка */}
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  mb: 3,
                  textAlign: 'center',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
                  border: `2px solid ${theme.palette.warning.main}`,
                  borderRadius: 3,
                  position: 'relative'
                }}
              >
                <Box sx={{
                  width: 200,
                  height: 200,
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #2c3e50, #34495e)',
                  borderRadius: '50%',
                  border: `5px solid ${theme.palette.warning.main}`,
                  animation: spinning ? 'spin 2s ease-out' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(1080deg)' },
                  }
                }}>
                  <Box sx={{
                    fontSize: '3rem',
                    color: result === 'red' ? '#e74c3c' : result === 'black' ? '#2c3e50' : '#2ecc71'
                  }}>
                    {result === 'red' && '🔴'}
                    {result === 'black' && '⚫'}
                    {result === 'green' && '🟢'}
                    {!result && '?'}
                  </Box>
                </Box>
                
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '15px solid transparent',
                  borderRight: '15px solid transparent',
                  borderBottom: '30px solid #ffd700',
                  zIndex: 2
                }} />
              </Paper>
              
              {/* Выбор ставки на цвет */}
              <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BetIcon /> Выберите цвет
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {bets.map((betOption) => (
                      <Grid item xs={12} sm={4} key={betOption.type}>
                        <Button
                          fullWidth
                          variant={selectedBet?.type === betOption.type ? "contained" : "outlined"}
                          style={{
                            backgroundColor: selectedBet?.type === betOption.type ? betOption.color : 'transparent',
                            borderColor: betOption.color,
                            color: selectedBet?.type === betOption.type ? 'white' : betOption.color,
                            height: 80
                          }}
                          onClick={() => setSelectedBet(betOption)}
                          disabled={spinning}
                          sx={{
                            '&:hover': {
                              backgroundColor: `${betOption.color}20`,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {betOption.label}
                            </Typography>
                            <Typography variant="body2">
                              Коэффициент: x{betOption.multiplier}
                            </Typography>
                          </Box>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
              
              {/* Выбор суммы ставки */}
              <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SavingsIcon /> Выбор суммы ставки
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
                        <Box sx={{ px: 2, mb: 3 }}>
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
                        
                        {/* Отображение текущей ставки */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            label={`Текущая ставка: $${bet}`}
                            color="primary"
                            sx={{
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              px: 3,
                              py: 2
                            }}
                          />
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
                  onClick={spinWheel}
                  disabled={spinning || !selectedBet || bet > balance || bet < MIN_BET || bet > MAX_BET || error !== ''}
                  startIcon={<SpinIcon />}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: '1.2rem',
                    background: `linear-gradient(45deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
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
                  {spinning ? 'Крутим...' : 'Крутить рулетку!'}
                </Button>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
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
                  {selectedBet && (
                    <Chip
                      icon={<BetIcon />}
                      label={selectedBet.label}
                      sx={{
                        fontWeight: 'bold',
                        bgcolor: selectedBet.color,
                        color: 'white'
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              {/* Сообщение о результате */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mb: 3,
                  textAlign: 'center',
                  bgcolor: message.includes('Поздравляем')
                    ? theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)'
                    : theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(231, 76, 60, 0.1)',
                  border: `1px solid ${
                    message.includes('Поздравляем')
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
                    color: message.includes('Поздравляем')
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }}
                >
                  {message}
                </Typography>
                {selectedBet && result && (
                  <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                    Коэффициент: x{selectedBet.multiplier}
                  </Typography>
                )}
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
                title="История рулетки"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Roulette;