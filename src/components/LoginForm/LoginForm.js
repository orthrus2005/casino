import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Security as SecurityIcon,
  AccountCircle as UserIcon,
  VpnKey as KeyIcon
} from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      dispatch(login({ user: 'admin', isAdmin: true }));
      setError('');
    } else if (credentials.username === 'user' && credentials.password === 'user') {
      dispatch(login({ user: 'user', isAdmin: false }));
      setError('');
    } else {
      setError('Неверный логин или пароль');
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
          />
         
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
         
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            }}
          >
            Войти в казино
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