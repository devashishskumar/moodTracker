import React from 'react';
import { useMoodDataContext } from '../../context/MoodDataContext';
import { formatDateDisplay, getRelativeDate } from '../../utils/dateUtils';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { entries, getAnalytics } = useMoodDataContext();
  const analytics = getAnalytics();

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'declining':
        return <TrendingDown className="text-red-500" size={20} />;
      default:
        return <Minus className="text-gray-500" size={20} />;
    }
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      happy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      sad: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      excited: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      calm: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      angry: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return colors[mood as keyof typeof colors] || colors.neutral;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your mood overview.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Entries
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalEntries}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Mood
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.averageMood.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Target className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.streakDays} days
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Activity className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Mood Trend
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {analytics.moodTrend}
                </p>
                {getTrendIcon(analytics.moodTrend)}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <TrendingUp className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Entries
          </h2>
        </div>
        <div className="p-6">
          {recentEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No entries yet. Start tracking your mood!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)}`}>
                      {entry.mood}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.note}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getRelativeDate(entry.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateDisplay(entry.date)}{' '}
                      {entry.timestamp && (
                        <span className="ml-1">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 