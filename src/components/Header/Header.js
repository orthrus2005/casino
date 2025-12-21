// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import { 
  Casino as CasinoIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExitToApp as LogoutIcon,
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext'; // ИМПОРТИРУЙТЕ useTheme

const Header = ({ user, balance, onLogout }) => {
  const { mode, toggleTheme } = useTheme(); // ИСПОЛЬЗУЙТЕ ХУК

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
        mb: 4
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Логотип */}
        <Box component={Link} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CasinoIcon sx={{ fontSize: 32, color: '#ffd700' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#ffd700',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Watsok Casino
          </Typography>
        </Box>

        {/* Правая часть */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            icon={<PersonIcon />} 
            label={`Привет, ${user}!`} 
            sx={{ 
              fontWeight: 'bold', 
              color: '#ffd700',
              bgcolor: 'rgba(255, 215, 0, 0.1)'
            }} 
          />
          
          <Badge 
            badgeContent={balance} 
            color="success" 
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: '1rem', 
                fontWeight: 'bold',
                bgcolor: '#2ecc71'
              } 
            }}
          >
            <WalletIcon sx={{ color: '#ffd700', fontSize: 28 }} />
          </Badge>

          {/* Навигация */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              component={Link} 
              to="/" 
              sx={{ color: 'white', fontWeight: 500 }}
            >
              Главная
            </Button>
            <Button 
              component={Link} 
              to="/games" 
              sx={{ color: 'white', fontWeight: 500 }}
            >
              Игры
            </Button>
            <Button 
              component={Link} 
              to="/about" 
              sx={{ color: 'white', fontWeight: 500 }}
            >
              О казино
            </Button>
          </Box>

          {/* ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ */}
          <IconButton 
            onClick={toggleTheme} 
            sx={{ 
              color: '#ffd700',
              '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' }
            }}
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* Кнопка выхода */}
          <IconButton 
            onClick={onLogout} 
            sx={{ 
              color: '#e74c3c',
              '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.1)' }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;