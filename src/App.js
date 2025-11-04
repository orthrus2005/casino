// src/App.js
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from "./components/LoginForm/LoginForm.js";
import Header from "./components/Header/Header.js";
import Home from "./pages/Home/Home.js";
import GamesPage from "./pages/GamesPage/GamesPage.js";
import About from "./pages/About/About.js";
import { useAuth } from './context/AuthContext';

// Компонент для защищенных маршрутов
const ProtectedApp = () => {
  const { isLoggedIn, user, balance, logout, updateBalance } = useAuth();

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <Router>
      <div className="App">
        <Header 
          user={user} 
          balance={balance} 
          onLogout={logout}
        />
        
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/games" 
              element={
                <GamesPage 
                  balance={balance} 
                  updateBalance={updateBalance} 
                />
              } 
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Главный компонент App
function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}

export default App;