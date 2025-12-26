import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginForm from "./components/LoginForm/LoginForm.js";
import Header from "./components/Header/Header.js";
import Home from "./pages/Home/Home.js";
import GamesPage from "./pages/GamesPage/GamesPage.js";
import About from "./pages/About/About.js";
import { GlobalStyles } from '@mui/material';
import ProtectedApp from './components/ProtectedApp';

const GlobalStyle = () => (
  <GlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      body: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        color: 'white',
        minHeight: '100vh',
      },
      '@keyframes gradient': {
        '0%': {
          backgroundPosition: '0% 50%',
        },
        '50%': {
          backgroundPosition: '100% 50%',
        },
        '100%': {
          backgroundPosition: '0% 50%',
        },
      },
      '.App': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      '.app-content': {
        flex: 1,
        padding: '0 2rem 2rem',
      },
      '@media (max-width: 768px)': {
        '.app-content': {
          padding: '0 1rem 1rem',
        },
      },
      '@media (max-width: 480px)': {
        '.app-content': {
          padding: '0 0.5rem 0.5rem',
        },
      },
      '.text-center': {
        textAlign: 'center',
      },
      '.text-gold': {
        color: '#ffd700',
      },
      '.text-success': {
        color: '#2ecc71',
      },
      '.text-danger': {
        color: '#e74c3c',
      },
      '.mb-1': { marginBottom: '0.5rem' },
      '.mb-2': { marginBottom: '1rem' },
      '.mb-3': { marginBottom: '1.5rem' },
      '.mb-4': { marginBottom: '2rem' },
      '.mt-1': { marginTop: '0.5rem' },
      '.mt-2': { marginTop: '1rem' },
      '.mt-3': { marginTop: '1.5rem' },
      '.mt-4': { marginTop: '2rem' },
      '.p-1': { padding: '0.5rem' },
      '.p-2': { padding: '1rem' },
      '.p-3': { padding: '1.5rem' },
      '.p-4': { padding: '2rem' },
      '.card': {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
      },
      '.card:hover': {
        borderColor: 'rgba(255, 215, 0, 0.5)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      },
    }}
  />
);

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <ProtectedApp />
    </Provider>
  );
}

export default App;