// src/components/LoginForm/LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Простая проверка логина/пароля
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      login('admin', true);
      setError('');
    } else if (credentials.username === 'user' && credentials.password === 'user') {
      login('user', false);
      setError('');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>🎰 Вход в Watsok Casino</h2>
        
        <div className="form-group">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            placeholder="Введите ваш логин"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Введите ваш пароль"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="login-btn">
          Войти в казино
        </button>
        
        <div className="login-hint">
          <p><strong>Тестовые аккаунты:</strong></p>
          <div className="account-info">
            <div className="account">
              <span className="role">Администратор:</span>
              <span className="credentials">admin / admin</span>
            </div>
            <div className="account">
              <span className="role">Пользователь:</span>
              <span className="credentials">user / user</span>
            </div>
          </div>
          <p className="bonus-info">🎁 Каждый новый игрок получает <strong>1000$</strong> начального баланса!</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;