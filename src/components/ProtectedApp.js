import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./LoginForm/LoginForm.js";
import Header from "./Header/Header.js";
import Home from "../pages/Home/Home.js";
import GamesPage from "../pages/GamesPage/GamesPage.js";
import About from "../pages/About/About.js";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout, updateBalance } from "../store/slices/authSlice";
import { ThemeProvider } from './ThemeProvider';

const ProtectedApp = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const user = useAppSelector(state => state.auth.user);
  const balance = useAppSelector(state => state.auth.balance);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateBalance = (amount) => {
    dispatch(updateBalance(amount));
    return balance + amount;
  };

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Header
            user={user}
            balance={balance}
            onLogout={handleLogout}
          />
          
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/games"
                element={
                  <GamesPage
                    balance={balance}
                    updateBalance={handleUpdateBalance}
                  />
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default ProtectedApp;