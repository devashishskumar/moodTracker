import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MoodEntry } from './components/MoodEntry/MoodEntry';
import { MoodCalendar } from './components/MoodCalendar/MoodCalendar';
import { MoodAnalytics } from './components/MoodAnalytics/MoodAnalytics';
import { Settings } from './components/Settings/Settings';
import { MoodDataProvider } from './context/MoodDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AllEntries from './components/AllEntries';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminPanel from './components/Admin/AdminPanel';
import './App.css';

type View = 'dashboard' | 'all-entries' | 'entry' | 'calendar' | 'analytics' | 'settings' | 'admin';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  
  const { user, isLoading } = useAuth();

  // Reset view to dashboard when user changes
  useEffect(() => {
    setCurrentView('dashboard');
  }, [user?.id]); // Reset when user ID changes (login/logout)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('dark-mode', JSON.stringify(!isDarkMode));
  };

  // Listen for dark mode toggle events from Navigation
  useEffect(() => {
    const handleDarkModeToggle = () => {
      toggleDarkMode();
    };

    window.addEventListener('toggleDarkMode', handleDarkModeToggle);
    
    return () => {
      window.removeEventListener('toggleDarkMode', handleDarkModeToggle);
    };
  }, [isDarkMode]);

  const renderView = () => {
    // Redirect non-admin users away from admin panel
    if (currentView === 'admin' && user?.role !== 'admin') {
      setCurrentView('dashboard');
      return <Dashboard />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'all-entries':
        return <AllEntries />;
      case 'entry':
        return <MoodEntry />;
      case 'calendar':
        return <MoodCalendar />;
      case 'analytics':
        return <MoodAnalytics />;
      case 'settings':
        return <Settings onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show authentication screens if not logged in
  if (!user) {
    if (showAuth === 'register') {
      return <Register onSwitchToLogin={() => setShowAuth('login')} />;
    }
    return <Login onSwitchToRegister={() => setShowAuth('register')} />;
  }

  // Show main app if authenticated
  return (
    <MoodDataProvider>
      <div className={`App ${isDarkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="flex">
            <Navigation 
              currentView={currentView} 
              onViewChange={setCurrentView}
              isDarkMode={isDarkMode}
            />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {renderView()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </MoodDataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 