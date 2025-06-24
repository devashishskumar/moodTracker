import React, { useState } from 'react';
import { Navigation } from './components/Navigation/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MoodEntry } from './components/MoodEntry/MoodEntry';
import { MoodCalendar } from './components/MoodCalendar/MoodCalendar';
import { MoodAnalytics } from './components/MoodAnalytics/MoodAnalytics';
import { Settings } from './components/Settings/Settings';
import { MoodDataProvider } from './context/MoodDataContext';
import './App.css';

type View = 'dashboard' | 'entry' | 'calendar' | 'analytics' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('dark-mode', JSON.stringify(!isDarkMode));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'entry':
        return <MoodEntry />;
      case 'calendar':
        return <MoodCalendar />;
      case 'analytics':
        return <MoodAnalytics />;
      case 'settings':
        return <Settings onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
      default:
        return <Dashboard />;
    }
  };

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

export default App; 