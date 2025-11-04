// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, balance, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>🎰 Watsok Casino</h1>
        </Link>
        
        <div className="user-info">
          <span className="welcome">Добро пожаловать, {user}!</span>
          <div className="balance">Баланс: ${balance}</div>
          
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Главная</Link>
            <Link to="/games" className="nav-link">Игры</Link>
            <Link to="/about" className="nav-link">О казино</Link>
          </nav>
          
          <button onClick={onLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;