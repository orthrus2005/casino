import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import {
  Casino as CasinoIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  SportsEsports as GameIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, md: 3 } }}>
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <CasinoIcon sx={{ fontSize: 60, color: theme.palette.warning.main, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            О нашем казино
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Добро пожаловать в лучшее виртуальное казино!
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                🎯 Наша миссия
              </Typography>
              <Typography variant="body1" paragraph>
                Мы создали Watsok Casino, чтобы предоставить вам незабываемые впечатления от азартных игр 
                в безопасной и честной среде. Наша платформа сочетает в себе классические казино игры с 
                современными технологиями.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                🎰 Наши игры
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(0,0,0,0.05)' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h3">🎰</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.warning.main }}>
                      Слот-машины
                    </Typography>
                    <Typography variant="body2">
                      Классические игровые автоматы с тремя барабанами. Выигрышные комбинации: пары и тройки одинаковых символов.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(0,0,0,0.05)' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h3">🎡</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.warning.main }}>
                      Рулетка
                    </Typography>
                    <Typography variant="body2">
                      Европейская рулетка с ставками на красное, черное и зеленое. Максимальный коэффициент x14!
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(0,0,0,0.05)' }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h3">♠️</Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.warning.main }}>
                      Блэкджек
                    </Typography>
                    <Typography variant="body2">
                      Классическая карточная игра. Наберите 21 очко и обыграйте дилера. Блэкджек оплачивается x2.5!
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                💰 Система баланса
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                      $1000
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Стартовый баланс
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}>
                      $10
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Мин. ставка
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: theme.palette.error.main, fontWeight: 'bold' }}>
                      $500
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Макс. ставка
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: theme.palette.info.main, fontWeight: 'bold' }}>
                      Мгновенно
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Выплаты
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                <SecurityIcon /> Безопасность и честность
              </Typography>
              <Typography variant="body1" paragraph>
                Мы используем передовые технологии для обеспечения честности игр. Все результаты генерируются 
                случайным образом, а алгоритмы проверяются на соответствие стандартам азартных игр.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ 
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              border: `1px solid ${theme.palette.warning.main}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              ⚠️ Важно
            </Typography>
            <Typography>
              Помните, что азартные игры могут вызывать зависимость. Играйте ответственно и устанавливайте лимиты. 
              Наше казино предназначено исключительно для развлекательных целей.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;