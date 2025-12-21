// src/components/common/GameHistory.js
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  History as HistoryIcon,
  Casino as CasinoIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as WinIcon,
  TrendingDown as LoseIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const GameHistory = ({ history, onClearHistory, title = "История игр" }) => {
  const theme = useTheme();

  if (!history || history.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
        <HistoryIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          История игр пуста
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Сыграйте в казино, чтобы увидеть историю!
        </Typography>
      </Paper>
    );
  }

  const getGameIcon = (gameType) => {
    switch (gameType?.toLowerCase()) {
      case 'slots':
      case 'слот-машина':
        return '🎰';
      case 'roulette':
      case 'рулетка':
        return '🎡';
      case 'blackjack':
      case 'блэкджек':
        return '♠️';
      default:
        return '🎮';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--:--';
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '--:--';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon /> {title} ({history.length})
        </Typography>
        
        {onClearHistory && (
          <Tooltip title="Очистить историю">
            <IconButton 
              onClick={onClearHistory}
              size="small"
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Игра</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ставка</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Результат</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Выигрыш</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Время</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((game, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:hover': { 
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
                  },
                  borderLeft: `4px solid ${
                    game.win > 0 ? theme.palette.success.main : theme.palette.error.main
                  }`
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5">
                      {getGameIcon(game.type)}
                    </Typography>
                    <Typography variant="body2">
                      {game.type || 'Неизвестная игра'}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip
                    icon={<MoneyIcon />}
                    label={`$${game.bet || 0}`}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main
                    }}
                  />
                </TableCell>
                
                <TableCell>
                  {game.result ? (
                    <Chip
                      label={game.result}
                      size="small"
                      sx={{ 
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.1)' 
                          : 'rgba(0,0,0,0.05)'
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      --
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {game.win > 0 ? (
                      <WinIcon sx={{ color: theme.palette.success.main }} />
                    ) : (
                      <LoseIcon sx={{ color: theme.palette.error.main }} />
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: game.win > 0 ? theme.palette.success.main : theme.palette.error.main
                      }}
                    >
                      {game.win > 0 ? `+$${game.win}` : `-$${Math.abs(game.win)}`}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TimeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                    <Typography variant="body2" color="textSecondary">
                      {formatTime(game.timestamp)}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Показано: {history.length} игр
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Общий результат: $
          {history.reduce((sum, game) => sum + (game.win || 0), 0)}
        </Typography>
      </Box>
    </Box>
  );
};

export default GameHistory;