import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-[#f0f0f0] dark:hover:bg-[#333333] rounded-lg transition-colors text-[#111111] dark:text-[#E0E0E0]"
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};
