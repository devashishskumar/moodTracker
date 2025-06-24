import React, { useState } from 'react';
import { useMoodDataContext } from '../../context/MoodDataContext';
import { formatDate, formatDateDisplay } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MoodCalendar: React.FC = () => {
  const { entries, getEntriesByDate } = useMoodDataContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: 'bg-green-500',
      sad: 'bg-blue-500',
      anxious: 'bg-yellow-500',
      excited: 'bg-red-500',
      calm: 'bg-purple-500',
      angry: 'bg-red-600',
      neutral: 'bg-gray-500',
    };
    return colors[mood as keyof typeof colors] || colors.neutral;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDate(date);
      const dayEntries = getEntriesByDate(dateStr);
      
      days.push(
        <div key={day} className="h-24 border border-gray-200 dark:border-gray-700 p-2">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {day}
            </span>
            {dayEntries.length > 0 && (
              <div className="flex space-x-1">
                {dayEntries.slice(0, 3).map((entry, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`}
                    title={`${entry.mood}: ${entry.note}`}
                  />
                ))}
                {dayEntries.length > 3 && (
                  <div className="w-2 h-2 rounded-full bg-gray-400 text-xs flex items-center justify-center">
                    +
                  </div>
                )}
              </div>
            )}
          </div>
          {dayEntries.length > 0 && (
            <div className="mt-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {dayEntries[0].note}
              </p>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mood Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your mood patterns over time
          </p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
}; 