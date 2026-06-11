import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAudit } from '../context/AuditContext';

export const Navbar = () => {
  const { user } = useAudit();

  return (
    <nav className="w-full top-0 sticky z-50 pt-4 md:pt-6 pb-4 px-4 transition-all">
      <div className="flex justify-between items-center max-w-[1100px] mx-auto px-6 md:px-10 h-20 bg-surface/80 backdrop-blur-xl border border-outline-variant/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-signal text-3xl group-hover:rotate-12 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
            radar
          </span>
          <span className="font-display-h1 text-headline-h2 font-extrabold text-signal tracking-tight select-none">
            Claros
          </span>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-12">
          <NavLink 
            to="/audit" 
            className={({ isActive }) => 
              isActive 
                ? "text-signal font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-signal after:rounded-full transition-all" 
                : "text-on-surface-variant font-medium hover:text-pulse transition-colors duration-200"
            }
          >
            BeliefAudit
          </NavLink>
          <NavLink 
            to="/map" 
            className={({ isActive }) => 
              isActive 
                ? "text-signal font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-signal after:rounded-full transition-all" 
                : "text-on-surface-variant font-medium hover:text-pulse transition-colors duration-200"
            }
          >
            Origin Map
          </NavLink>
          <NavLink 
            to="/gym" 
            className={({ isActive }) => 
              isActive 
                ? "text-signal font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-signal after:rounded-full transition-all" 
                : "text-on-surface-variant font-medium hover:text-pulse transition-colors duration-200"
            }
          >
            Critical Thinking Gym
          </NavLink>
          <NavLink 
            to="/score" 
            className={({ isActive }) => 
              isActive 
                ? "text-signal font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-signal after:rounded-full transition-all" 
                : "text-on-surface-variant font-medium hover:text-pulse transition-colors duration-200"
            }
          >
            Clarity Score
          </NavLink>
        </div>

        {/* User Stats / Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 bg-surface-container-high px-3 py-1.5 rounded-full border border-outline-variant/40">
              <span className="text-xs font-semibold text-caution flex items-center gap-1 cursor-default select-none" title="Streak Days">
                🔥 {user.streakDays} Hari
              </span>
              <span className="h-3 w-[1px] bg-outline-variant/40"></span>
              <span className="text-xs font-code font-bold text-pulse select-none" title="Total XP">
                ⚡ {user.totalXP.toLocaleString()} XP
              </span>
            </div>
          ) : (
            <button className="hidden md:block px-4 py-2 border border-outline-variant rounded-full text-on-surface hover:border-signal hover:text-signal transition-all duration-200">
              Log In
            </button>
          )}
          <Link 
            to="/audit" 
            className="px-5 py-2 bg-gradient-signal-dark text-white rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(124,110,232,0.3)] hover:shadow-[0_0_20px_rgba(124,110,232,0.5)]"
          >
            Start Audit
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
