// src/components/UserProfile/UserProfile.js
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme
} from '@mui/material';
import {
  AccountCircle as UserIcon,
  AccountBalanceWallet as WalletIcon,
  Security as AdminIcon,
  Casino as GameIcon,
  EmojiEvents as TrophyIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  ArrowUpward as DepositIcon,
  ArrowDownward as WithdrawIcon
} from '@mui/icons-material';

const UserProfile = ({ user, balance, gameHistory }) => {
  const theme = useTheme();
  const isAdmin = user === 'admin';

  // Статистика (можно вынести в пропсы или контекст)
  const totalGames = gameHistory.length;
  const totalWins = gameHistory.filter(game => game.win > 0).length;
  const totalProfit = gameHistory.reduce((sum, game) => sum + game.win, 0);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, md: 2 } }}>
      {/* Заголовок */}
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: theme.palette.primary.main,
              fontSize: '2.5rem'
            }}
          >
            <UserIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
            👤 Профиль пользователя
          </Typography>
          <Chip
            label={isAdmin ? 'Администратор' : 'Игрок'}
            color={isAdmin ? 'warning' : 'primary'}
            icon={isAdmin ? <AdminIcon /> : <UserIcon />}
            sx={{ fontWeight: 'bold' }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Основная информация */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UserIcon /> Основная информация
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Имя пользователя
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                  {user}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Текущий баланс
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WalletIcon sx={{ color: theme.palette.success.main }} />
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: theme.palette.success.main,
                      fontWeight: 'bold'
                    }}
                  >
                    ${balance}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Статус аккаунта
              </Typography>
              <Chip
                label={isAdmin ? 'Администратор' : 'Активный игрок'}
                color={isAdmin ? 'warning' : 'success'}
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика игр */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingIcon /> Статистика игр
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <GameIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                      {totalGames}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Всего игр
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <TrophyIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                    <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
                      {totalWins}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Побед
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <MoneyIcon sx={{ fontSize: 40, color: totalProfit >= 0 ? theme.palette.success.main : theme.palette.error.main, mb: 1 }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: totalProfit >= 0 ? theme.palette.success.main : theme.palette.error.main
                      }}
                    >
                      ${totalProfit}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Общий результат
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Win Rate
                </Typography>
                <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
                  {totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* История игр */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon /> История последних игр
              </Typography>
              
              {gameHistory && gameHistory.length > 0 ? (
                <List>
                  {gameHistory.slice(0, 5).map((game, index) => (
                    <React.Fragment key={index}>
                      <ListItem
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
                              {game.time || new Date().toLocaleTimeString()}
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
                      {index < Math.min(4, gameHistory.length - 1) && <Divider variant="inset" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <GameIcon sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    История игр пуста
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Сыграйте в казино, чтобы увидеть статистику!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Действия с балансом */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Управление балансом
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DepositIcon />}
                    sx={{
                      py: 1.5,
                      background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 8
                      }
                    }}
                  >
                    Пополнить баланс
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<WithdrawIcon />}
                    sx={{
                      py: 1.5,
                      background: `linear-gradient(45deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 8
                      }
                    }}
                  >
                    Вывести средства
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;