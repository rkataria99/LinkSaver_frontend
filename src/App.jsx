import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // 🌙 Handle light/dark theme
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // 🔐 Handle auth state (using JWT token from localStorage)
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLoggedIn = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);  // triggers rerender so "/" switches to Dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const isAuthenticated = !!token;

  // 🧪 DEBUG: Log VITE_API_URL to verify if Vercel is injecting it
  useEffect(() => {
    console.log("🌐 VITE_API_URL =", import.meta.env.VITE_API_URL);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - protected Dashboard */}
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
