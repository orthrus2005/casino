import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ArrowUpward as DepositIcon,
  ArrowDownward as WithdrawIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { depositFunds, withdrawFunds } from '../../store/slices/authSlice';

const BalanceManager = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const dispatch = useAppDispatch();
  const balance = useAppSelector(state => state.auth.balance);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setAmount('');
    setError('');
    setSuccess('');
  };
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };
  
  const handleSubmit = async () => {
    const numAmount = parseInt(amount);
    
    if (!numAmount || numAmount <= 0) {
      setError('Введите корректную сумму');
      return;
    }
    
    if (activeTab === 1 && numAmount > balance) { // Вывод
      setError('Недостаточно средств на балансе');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (activeTab === 0) {
        // Пополнение
        await dispatch(depositFunds(numAmount)).unwrap();
        setSuccess(`Баланс успешно пополнен на $${numAmount}`);
      } else {
        // Вывод
        await dispatch(withdrawFunds(numAmount)).unwrap();
        setSuccess(`$${numAmount} успешно выведено`);
      }
      
      setAmount('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setAmount('');
    setError('');
    setSuccess('');
    onClose();
  };
  
  const presetAmounts = [50, 100, 250, 500, 1000];
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WalletIcon />
          Управление балансом
        </Box>
      </DialogTitle>
      
      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <Tab 
          icon={<DepositIcon />} 
          label="Пополнение" 
          disabled={loading}
        />
        <Tab 
          icon={<WithdrawIcon />} 
          label="Вывод" 
          disabled={loading}
        />
      </Tabs>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Текущий баланс
          </Typography>
          <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
            ${balance}
          </Typography>
        </Box>
        
        <Typography variant="body1" gutterBottom>
          {activeTab === 0 ? 'Сумма пополнения' : 'Сумма вывода'}
        </Typography>
        
        <TextField
          fullWidth
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Введите сумму"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant="outlined"
              size="small"
              onClick={() => setAmount(preset.toString())}
              disabled={loading || (activeTab === 1 && preset > balance)}
            >
              ${preset}
            </Button>
          ))}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={handleClose} disabled={loading}>
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !amount || parseInt(amount) <= 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Обработка...' : activeTab === 0 ? 'Пополнить' : 'Вывести'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BalanceManager;