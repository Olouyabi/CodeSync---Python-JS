
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
  progress: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onToggleSidebar: () => void;
  lessonTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ progress, theme, toggleTheme, onToggleSidebar, lessonTitle }) => {
  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
           <button onClick={onToggleSidebar} className="lg:hidden text-gray-500 dark:text-gray-400">
             <MenuIcon className="w-6 h-6" />
           </button>
           <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
            {lessonTitle}
           </h1>
        </div>
        <div className="flex items-center space-x-4 w-full max-w-xs md:max-w-sm">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{progress}%</span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
};
