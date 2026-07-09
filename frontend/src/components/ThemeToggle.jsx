import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-white/40 dark:bg-[#1E293B]/40 hover:bg-white dark:hover:bg-[#1E293B] text-gray-700 dark:text-gray-200 transition-all duration-300 backdrop-blur-md shadow-premium hover:shadow-premium-hover focus:outline-none hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <FiSun className="w-5 h-5 text-amber-500 transition-transform duration-300 rotate-0 hover:rotate-45" />
      )}
    </button>
  );
};

export default ThemeToggle;
