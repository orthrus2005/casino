import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExitToApp as LogoutIcon,
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logoutUser } from '../../store/slices/authSlice'; // ИЗМЕНЕНО ЗДЕСЬ

const Header = ({ user, balance }) => { // Убрали onLogout из props
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const muiTheme = useTheme();
  const mode = useAppSelector(state => state.theme.mode);
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleLogoutClick = () => {
    setOpenLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setOpenLogoutConfirm(false);
    dispatch(logoutUser()); // ИЗМЕНЕНО ЗДЕСЬ
  };

  const handleCancelLogout = () => {
    setOpenLogoutConfirm(false);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: muiTheme.palette.mode === 'dark'
            ? 'rgba(15, 15, 35, 0.95)'
            : 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: `2px solid ${muiTheme.palette.warning.main}33`,
          mb: 4,
          boxShadow: 3
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, mx: 'auto', width: '100%', py: 1 }}>
          {/* Логотип и баланс слева */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Логотип */}
            <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CasinoIcon sx={{ fontSize: 34, color: muiTheme.palette.warning.main }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: muiTheme.palette.warning.main,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                Watsok Casino
              </Typography>
            </Box>

            {/* БАЛАНС - ВИДЕН ВСЕГДА */}
            <Chip
              icon={<WalletIcon />}
              label={`$${balance}`}
              color="success"
              variant="outlined"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderWidth: 2,
                borderColor: muiTheme.palette.success.main,
                bgcolor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(46, 204, 113, 0.1)'
                  : 'rgba(46, 204, 113, 0.05)',
                '& .MuiChip-icon': {
                  color: muiTheme.palette.success.main
                },
                '& .MuiChip-label': {
                  color: muiTheme.palette.success.main,
                  fontWeight: 'bold',
                  px: 1
                }
              }}
            />
          </Box>

          {/* Правая часть - пользователь и управление */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {/* Имя пользователя (скрыто на мобилках) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: muiTheme.palette.primary.main,
                    fontSize: '1rem'
                  }}
                >
                  {user.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: muiTheme.palette.text.secondary, fontSize: '0.8rem' }}>
                    Игрок
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: muiTheme.palette.text.primary }}>
                    {user}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Навигация (скрыта на мобилках) */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': {
                      color: muiTheme.palette.warning.main
                    }
                  }}
                >
                  Главная
                </Button>
                <Button
                  component={Link}
                  to="/games"
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': {
                      color: muiTheme.palette.warning.main
                    }
                  }}
                >
                  Игры
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': {
                      color: muiTheme.palette.warning.main
                    }
                  }}
                >
                  О казино
                </Button>
              </Box>
            )}

            {/* Переключатель темы */}
            <IconButton
              onClick={handleToggleTheme}
              sx={{
                color: muiTheme.palette.warning.main,
                bgcolor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255, 215, 0, 0.1)'
                  : 'rgba(255, 215, 0, 0.05)',
                '&:hover': {
                  bgcolor: muiTheme.palette.mode === 'dark'
                    ? 'rgba(255, 215, 0, 0.2)'
                    : 'rgba(255, 215, 0, 0.1)'
                }
              }}
              aria-label="Переключить тему"
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {/* Кнопка выхода */}
            <IconButton
              onClick={handleLogoutClick}
              sx={{
                color: muiTheme.palette.error.main,
                bgcolor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(231, 76, 60, 0.1)'
                  : 'rgba(231, 76, 60, 0.05)',
                '&:hover': {
                  bgcolor: muiTheme.palette.mode === 'dark'
                    ? 'rgba(231, 76, 60, 0.2)'
                    : 'rgba(231, 76, 60, 0.1)'
                }
              }}
              aria-label="Выйти"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Мобильная навигация */}
        {isMobile && (
          <Toolbar sx={{
            justifyContent: 'center',
            borderTop: `1px solid ${muiTheme.palette.divider}`,
            py: 1
          }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Информация о пользователе на мобилке */}
              <Chip
                icon={<PersonIcon />}
                label={user}
                size="small"
                sx={{
                  color: muiTheme.palette.primary.main,
                  bgcolor: muiTheme.palette.mode === 'dark'
                    ? 'rgba(102, 126, 234, 0.1)'
                    : 'rgba(102, 126, 234, 0.05)'
                }}
              />
             
              {/* Навигация на мобилке */}
              <Button
                component={Link}
                to="/"
                size="small"
                sx={{
                  color: muiTheme.palette.text.primary,
                  minWidth: 'auto',
                  fontSize: '0.8rem'
                }}
              >
                Главная
              </Button>
              <Button
                component={Link}
                to="/games"
                size="small"
                sx={{
                  color: muiTheme.palette.text.primary,
                  minWidth: 'auto',
                  fontSize: '0.8rem'
                }}
              >
                Игры
              </Button>
              <Button
                component={Link}
                to="/about"
                size="small"
                sx={{
                  color: muiTheme.palette.text.primary,
                  minWidth: 'auto',
                  fontSize: '0.8rem'
                }}
              >
                О казино
              </Button>
            </Box>
          </Toolbar>
        )}
      </AppBar>

      {/* Модальное окно подтверждения выхода */}
      <Dialog
        open={openLogoutConfirm}
        onClose={handleCancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            bgcolor: muiTheme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(231, 76, 60, 0.05)',
            borderBottom: `1px solid ${muiTheme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoutIcon sx={{ color: muiTheme.palette.error.main }} />
            Подтверждение выхода
          </Box>
        </DialogTitle>
       
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: muiTheme.palette.primary.main }}>
              {user.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Игрок
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user}
              </Typography>
            </Box>
          </Box>
         
          <Typography variant="body1" id="logout-dialog-description" sx={{ mb: 2 }}>
            Вы уверены, что хотите выйти из аккаунта?
          </Typography>
         
          <Box sx={{
            mt: 3,
            p: 2,
            bgcolor: muiTheme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            borderRadius: 2,
            border: `1px solid ${muiTheme.palette.divider}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WalletIcon sx={{ color: muiTheme.palette.success.main }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Текущий баланс
              </Typography>
            </Box>
            <Typography variant="h4" sx={{
              color: muiTheme.palette.success.main,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              ${balance}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
              После выхода вы сможете снова войти в систему
            </Typography>
          </Box>
        </DialogContent>
       
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${muiTheme.palette.divider}` }}>
          <Button
            onClick={handleCancelLogout}
            variant="outlined"
            sx={{
              borderColor: muiTheme.palette.divider,
              color: muiTheme.palette.text.primary,
              '&:hover': {
                borderColor: muiTheme.palette.primary.main
              }
            }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            sx={{
              background: `linear-gradient(45deg, ${muiTheme.palette.error.main} 0%, ${muiTheme.palette.error.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(45deg, ${muiTheme.palette.error.dark} 0%, ${muiTheme.palette.error.main} 100%)`,
                transform: 'translateY(-1px)',
                boxShadow: 3
              }
            }}
          >
            Выйти
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;