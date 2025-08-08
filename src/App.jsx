import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // theme handling
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // auth in state so the app re-renders after login/logout
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLoggedIn = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);             // triggers rerender so "/" switches to Dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      <Routes>
        {/* Root acts as dashboard */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Dashboard toggleTheme={() => setDarkMode(!darkMode)} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login onLoggedIn={handleLoggedIn} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
