import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Card,
  CardContent,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Security as SecurityIcon,
  AccountCircle as UserIcon,
  VpnKey as KeyIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const theme = useTheme();

  useEffect(() => {
    // Очищаем ошибки при размонтировании
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибку при изменении ввода
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      return;
    }
    
    try {
      await dispatch(loginUser({
        username: credentials.username,
        password: credentials.password
      })).unwrap();
    } catch (err) {
      // Ошибка уже обработана в slice
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: theme.palette.background.default,
        p: 2
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 450,
          width: '100%',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CasinoIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            🎰 Watsok Casino
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Логин"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            margin="normal"
            disabled={loading}
            error={!!error}
          />
         
          <TextField
            fullWidth
            type="password"
            label="Пароль"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            margin="normal"
            sx={{ mb: 3 }}
            disabled={loading}
            error={!!error}
          />
         
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}
         
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !credentials.username.trim() || !credentials.password.trim()}
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              position: 'relative'
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Войти в казино'
            )}
          </Button>
        </form>
        <Divider sx={{ my: 3 }} />
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Тестовые аккаунты
              </Typography>
            </Box>
           
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Администратор:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1 }}>
                admin / admin
              </Typography>
            </Box>
           
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Пользователь:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1 }}>
                user / user
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default LoginForm;