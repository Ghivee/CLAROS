import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

export const Navbar = () => {
  const { user } = useAudit();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('claros-theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('claros-theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('claros-theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Belief Audit', path: '/audit' },
    { name: 'Origin Map', path: '/map' },
    { name: 'Critical Gym', path: '/gym' },
    { name: 'Clarity Score', path: '/score' }
  ];

  return (
    <nav className="w-full top-0 sticky z-50 pt-4 md:pt-6 pb-4 px-4 transition-all">
      <div className="flex justify-between items-center max-w-[1100px] mx-auto px-4 md:px-10 h-20 bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <span className="material-symbols-outlined text-signal text-3xl group-hover:rotate-12 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
            radar
          </span>
          <span className="font-display-h1 text-headline-h2 font-extrabold text-signal tracking-tight select-none">
            Claros
          </span>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path} 
              className={({ isActive }) => 
                isActive 
                  ? "text-signal font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-signal after:rounded-full transition-all" 
                  : "text-on-surface-variant font-medium hover:text-pulse transition-colors duration-200"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 z-50">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {user ? (
            <div className="hidden sm:flex items-center space-x-3 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/40">
              <span className="text-xs font-semibold text-caution flex items-center gap-1 cursor-default select-none" title="Streak Days">
                🔥 {user.streakDays} Days
              </span>
              <span className="h-3 w-[1px] bg-outline-variant/40"></span>
              <span className="text-xs font-code font-bold text-pulse select-none" title="Total XP">
                ⚡ {user.totalXP.toLocaleString()} XP
              </span>
            </div>
          ) : (
            <button className="hidden sm:block px-4 py-1.5 border border-outline-variant rounded-full text-sm text-on-surface hover:border-signal hover:text-signal transition-all duration-200">
              Log In
            </button>
          )}
          
          <Link 
            to="/audit" 
            className="hidden sm:inline-block px-5 py-2 bg-gradient-signal-dark text-white rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(124,110,232,0.3)] hover:shadow-[0_0_20px_rgba(124,110,232,0.5)]"
          >
            Start Audit
          </Link>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-on-surface hover:bg-surface-variant rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-[85px] left-4 right-4 bg-surface/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-6 shadow-2xl lg:hidden flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `text-lg font-medium py-2 px-4 rounded-xl transition-all ${
                    isActive ? "bg-signal/10 text-signal font-bold" : "text-on-surface hover:bg-surface-variant"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="h-[1px] w-full bg-outline-variant/30 my-2"></div>

          {user ? (
            <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high rounded-xl border border-outline-variant/40">
              <span className="text-sm font-semibold text-caution">🔥 {user.streakDays} Days Streak</span>
              <span className="text-sm font-code font-bold text-pulse">⚡ {user.totalXP.toLocaleString()} XP</span>
            </div>
          ) : (
            <button className="w-full py-3 border border-outline-variant rounded-xl text-on-surface font-medium hover:bg-surface-variant transition-all duration-200">
              Log In
            </button>
          )}

          <Link 
            to="/audit" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 text-center bg-gradient-signal-dark text-white rounded-xl font-medium shadow-lg shadow-signal/30"
          >
            Start Audit
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
