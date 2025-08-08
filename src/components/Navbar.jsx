// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleTheme }) => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="p-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold">Link Saver</h1>
      <div className="space-x-3">
        <button onClick={toggleTheme} className="px-3 py-1 border rounded">Toggle Theme</button>
        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
