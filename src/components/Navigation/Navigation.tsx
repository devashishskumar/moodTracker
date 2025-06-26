import React from 'react';
import { 
  Home, 
  Plus, 
  Calendar, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon,
  List,
  Shield,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: any) => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  isDarkMode 
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'all-entries', label: 'All Entries', icon: List },
    { id: 'entry', label: 'Add Entry', icon: Plus },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Add admin panel for admin users
  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  const handleDarkModeToggle = () => {
    const event = new CustomEvent('toggleDarkMode');
    window.dispatchEvent(event);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Mood Tracker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your daily emotions
            </p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Theme
            </span>
            <button
              onClick={handleDarkModeToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 