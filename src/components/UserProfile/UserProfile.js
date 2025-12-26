import React, { useState } from 'react';
// ... остальные импорты
import BalanceManager from '../BalanceManager/BalanceManager';

const UserProfile = ({ user, balance, gameHistory }) => {
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  
  // ... остальной код
  
  return (
    <>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 1, md: 2 } }}>
        {/* ... существующий код */}
        
        {/* Обновите кнопки управления балансом: */}
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
                    onClick={() => setBalanceDialogOpen(true)}
                    sx={{
                      py: 1.5,
                      background: `linear-gradient(45deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 8
                      }
                    }}
                  >
                    Управление балансом
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Box>
      
      <BalanceManager 
        open={balanceDialogOpen} 
        onClose={() => setBalanceDialogOpen(false)} 
      />
    </>
  );
};