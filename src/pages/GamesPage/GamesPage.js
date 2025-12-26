import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  useTheme
} from '@mui/material';
import Slots from '../../components/Games/Slots/Slots';
import Roulette from '../../components/Games/Roulette/Roulette';
import Blackjack from '../../components/Games/Blackjack/Blackjack';

const GamesPage = ({ balance, updateBalance }) => {
  const [activeGame, setActiveGame] = useState('slots');
  const theme = useTheme();

  const games = [
    { id: 'slots', name: 'Слот-машина', icon: '🎰', component: Slots },
    { id: 'roulette', name: 'Рулетка', icon: '🎡', component: Roulette },
    { id: 'blackjack', name: 'Блэкджек', icon: '♠️', component: Blackjack }
  ];

  const ActiveGameComponent = games.find(game => game.id === activeGame)?.component;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 2 } }}>
      <Paper sx={{ mb: 3, bgcolor: 'background.paper', p: 2 }}>
        <Tabs
          value={activeGame}
          onChange={(e, newValue) => setActiveGame(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 'bold',
              py: 2
            }
          }}
        >
          {games.map(game => (
            <Tab
              key={game.id}
              value={game.id}
              icon={<span style={{ fontSize: '1.5rem' }}>{game.icon}</span>}
              label={game.name}
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.warning.main
                }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Paper sx={{ bgcolor: 'background.paper', p: { xs: 1, md: 3 } }}>
        {ActiveGameComponent && (
          <ActiveGameComponent
            balance={balance}
            updateBalance={updateBalance}
          />
        )}
      </Paper>
    </Box>
  );
};

export default GamesPage;