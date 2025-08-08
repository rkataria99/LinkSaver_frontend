// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onAddClick }) => {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow">
      <nav className="bg-gray-900 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-600/90">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none">
                <path d="M4 7h16M7 12h10M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            Link Saver
          </h1>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Add -> opens modal in Dashboard */}
            <button
              onClick={onAddClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded font-semibold text-sm"
            >
              Add
            </button>

            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onAddClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-semibold"
            >
              Add
            </button>

            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className="ml-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile dropdown (minimal) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-2">
            <button
              onClick={() => { onAddClick?.(); setIsMobileMenuOpen(false); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-semibold"
            >
              Add
            </button>
            <button
              onClick={() => { setIsDarkMode((v) => !v); setIsMobileMenuOpen(false); }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); logout(); }}
              className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
