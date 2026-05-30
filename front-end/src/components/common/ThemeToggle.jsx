import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

/* Apply theme to <html> immediately — called on every render */
function applyTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Default to DARK unless user explicitly chose light
    return saved !== 'light';
  });

  // Apply on every state change
  useEffect(() => { applyTheme(isDark); }, [isDark]);

  // Apply saved preference immediately on first mount
  useEffect(() => {
    applyTheme(isDark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => setIsDark(d => !d);

  return (
    <button
      className={`theme-toggle-btn ${isDark ? 'dark' : 'light'}`}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="toggle-track">
        <span className="toggle-thumb">
          {isDark ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;
