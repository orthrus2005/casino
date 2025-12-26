import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme
} from '@mui/material';
import {
  Casino as CasinoIcon,
  AccountBalanceWallet as WalletIcon,
  EmojiEvents as TrophyIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  SportsEsports as GameIcon
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

const Home = () => {
  const user = useAppSelector(state => state.auth.user);
  const balance = useAppSelector(state => state.auth.balance);
  const gameHistory = useAppSelector(state => state.auth.gameHistory);
  const theme = useTheme();

  const totalGames = gameHistory.length;
  const totalWins = gameHistory.filter(game => game.win > 0).length;
  const totalProfit = gameHistory.reduce((sum, game) => sum + game.win, 0);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 3 } }}>
      {/* Герой секция */}
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CasinoIcon sx={{ fontSize: 80, color: theme.palette.warning.main, mb: 2 }} />
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Добро пожаловать, {user}! 🎰
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Испытайте удачу в лучшем виртуальном казино
          </Typography>
          
          <Chip
            icon={<WalletIcon />}
            label={`Баланс: $${balance}`}
            color="success"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              px: 3,
              py: 2,
              mb: 3
            }}
          />
          
          <Button
            component={Link}
            to="/games"
            variant="contained"
            color="warning"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              background: `linear-gradient(45deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 10
              }
            }}
          >
            Начать играть
          </Button>
        </CardContent>
      </Card>

      {/* Статистика */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <GameIcon sx={{ fontSize: 50, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                {totalGames}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Всего игр
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <TrophyIcon sx={{ fontSize: 50, color: theme.palette.warning.main, mb: 2 }} />
              <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                {totalWins}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Побед
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <MoneyIcon sx={{ 
                fontSize: 50, 
                color: totalProfit >= 0 ? theme.palette.success.main : theme.palette.error.main, 
                mb: 2 
              }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  color: totalProfit >= 0 ? theme.palette.success.main : theme.palette.error.main, 
                  fontWeight: 'bold' 
                }}
              >
                ${totalProfit}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Общий результат
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Игры */}
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: theme.palette.text.primary, mb: 3 }}>
            Доступные игры
          </Typography>
          <Grid container spacing={3}>
            {[
              { id: 'slots', name: 'Слот-машина', icon: '🎰', desc: 'Классические игровые автоматы с большими выигрышами', min: 10, max: 500, feature: 'Джекпот x10' },
              { id: 'roulette', name: 'Рулетка', icon: '🎡', desc: 'Ставьте на цвет и выигрывайте до x14', min: 10, max: 500, feature: 'Коэф: x2-x14' },
              { id: 'blackjack', name: 'Блэкджек', icon: '♠️', desc: 'Наберите 21 очко и обыграйте дилера', min: 10, max: 500, feature: 'Блэкджек x2.5' }
            ].map((game) => (
              <Grid item xs={12} md={4} key={game.id}>
                <Button
                  component={Link}
                  to="/games"
                  onClick={() => localStorage.setItem('activeGame', game.id)}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    bgcolor: 'rgba(0,0,0,0.05)',
                    border: `2px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.1)',
                      borderColor: theme.palette.warning.main,
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Typography variant="h1" sx={{ mb: 2 }}>
                    {game.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    {game.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {game.desc}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Chip label={`Мин: $${game.min}`} size="small" />
                    <Chip label={`Макс: $${game.max}`} size="small" />
                    <Chip label={game.feature} size="small" color="warning" />
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* История игр */}
      {gameHistory.length > 0 && (
        <Card sx={{ bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.text.primary }}>
              <HistoryIcon /> Последние игры
            </Typography>
            <List>
              {gameHistory.slice(0, 5).map((game, index) => (
                <ListItem
                  key={game.id || index}
                  sx={{
                    bgcolor: game.win > 0
                      ? theme.palette.mode === 'dark' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(46, 204, 113, 0.05)'
                      : theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(231, 76, 60, 0.05)',
                    mb: 1,
                    borderRadius: 1,
                    borderLeft: `4px solid ${game.win > 0 ? theme.palette.success.main : theme.palette.error.main}`
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: game.win > 0 ? theme.palette.success.main : theme.palette.error.main }}>
                      <GameIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {game.type || 'Игра'}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {new Date(game.timestamp).toLocaleTimeString()}
                      </Typography>
                    }
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: game.win > 0 ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 'bold'
                    }}
                  >
                    {game.win > 0 ? `+$${game.win}` : `-$${Math.abs(game.win)}`}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Home;