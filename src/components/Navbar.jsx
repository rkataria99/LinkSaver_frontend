import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onAddClick }) => {
  const navigate = useNavigate();

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

  // desktop buttons uniform size
  const desktopBtn =
    'h-10 px-4 inline-flex items-center justify-center rounded font-semibold text-sm transition';

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
            {/* Add */}
            <button
              onClick={onAddClick}
              className="h-9 px-3 inline-flex items-center justify-center rounded font-semibold text-sm bg-blue-600 hover:bg-blue-500"
            >
              Add
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className="h-9 w-9 grid place-items-center rounded bg-gray-800 hover:bg-gray-700 text-lg"
              aria-label="Toggle theme"
              title={isDarkMode ? 'Switch to light' : 'Switch to dark'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Logout icon button */}
            <button
              onClick={logout}
              className="h-9 w-9 grid place-items-center rounded bg-red-600 hover:bg-red-500"
              aria-label="Logout"
              title="Logout"
            >
              {/* logout icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Desktop / Tablet actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onAddClick}
              className={`${desktopBtn} bg-blue-600 hover:bg-blue-500`}
            >
              Add
            </button>

            <button
              onClick={() => setIsDarkMode((v) => !v)}
              className={`${desktopBtn} bg-gray-800 hover:bg-gray-700`}
              title={isDarkMode ? 'Switch to light' : 'Switch to dark'}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button
              onClick={logout}
              className={`${desktopBtn} bg-red-600 hover:bg-red-500`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
