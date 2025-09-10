import { Moon, Sun, User, Languages, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm(t('auth.confirmLogout'))) {
      logout();
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('header.title')}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
          aria-label="Toggle language"
        >
          <Languages className="w-5 h-5" />
          <span className="text-sm font-medium">{language.toUpperCase()}</span>
        </button>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentUser?.username || t('header.user')}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
            aria-label={t('auth.logout')}
            title={t('auth.logout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}