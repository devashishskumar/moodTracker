import React, { useState } from 'react';
import { useMoodDataContext } from '../../context/MoodDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const MoodAnalytics: React.FC = () => {
  const { getAnalytics, getChartData } = useMoodDataContext();
  const [timeRange, setTimeRange] = useState(30);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = normal, 2 = zoomed in, 0.5 = zoomed out
  const [scrollPosition, setScrollPosition] = useState(0); // 0 = start, 1 = end
  
  const analytics = getAnalytics();
  const chartData = getChartData(timeRange);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#dc2626', '#6b7280'];

  const pieData = Object.entries(analytics.moodDistribution)
    .filter(([, count]) => count > 0)
    .map(([mood, count]) => ({
      name: mood,
      value: count,
    }));

  const timeRangeOptions = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 30, label: '30 Days' },
    { value: 60, label: '60 Days' },
    { value: 90, label: '90 Days' },
    { value: 365, label: '1 Year' },
  ];

  // Calculate zoomed data based on zoom level and scroll position
  const getZoomedData = () => {
    if (zoomLevel === 1 && chartData.length <= 30) return chartData;
    
    const totalPoints = chartData.length;
    const visiblePoints = Math.max(5, Math.round(totalPoints / zoomLevel));
    const maxScroll = Math.max(0, totalPoints - visiblePoints);
    const scrollOffset = Math.round(scrollPosition * maxScroll);
    const startIndex = Math.max(0, scrollOffset);
    const endIndex = Math.min(totalPoints, startIndex + visiblePoints);
    return chartData.slice(startIndex, endIndex);
  };

  const zoomedData = getZoomedData();

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 2, 8)); // Max 8x zoom
    setScrollPosition(0); // Reset scroll when zooming in
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 2, 0.25)); // Min 0.25x zoom
    setScrollPosition(0); // Reset scroll when zooming out
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setScrollPosition(0);
  };

  // Slider logic
  const totalPoints = chartData.length;
  const visiblePoints = Math.max(5, Math.round(totalPoints / zoomLevel));
  const maxScroll = Math.max(0, totalPoints - visiblePoints);
  const showSlider = maxScroll > 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrollPosition(Number(e.target.value));
  };

  const getZoomDescription = () => {
    if (zoomLevel === 1) return 'Normal';
    if (zoomLevel > 1) return `${zoomLevel}x Zoomed In`;
    return `${(1/zoomLevel).toFixed(1)}x Zoomed Out`;
  };

  // Custom tooltip for PieChart
  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div style={{ background: '#1f2937', color: '#f9fafb', borderRadius: 8, padding: 12, minWidth: 120, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
          <div style={{ fontSize: 13 }}>Entries: <span style={{ color: '#fbbf24' }}>{value}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Understand your mood patterns and trends
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mood Trend
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-500 dark:text-gray-400" size={16} />
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(Number(e.target.value));
                  setScrollPosition(0); // Reset scroll when changing time range
                }}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Zoom:</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{getZoomDescription()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.25}
                className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 8}
                className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Slider for scrolling */}
          {showSlider && (
            <div className="flex flex-col items-center mb-4">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={scrollPosition}
                onChange={handleSliderChange}
                className="w-full max-w-lg accent-blue-600"
                aria-label="Scroll through data"
              />
            </div>
          )}
          
          {zoomedData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <p>No data available for the selected time range</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={zoomedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange <= 14) {
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } else if (timeRange <= 90) {
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } else {
                      // For yearly view, show month and year
                      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    }
                  }}
                  interval={Math.max(1, Math.floor(zoomedData.length / 10))} // Adjust tick interval based on zoom
                />
                <YAxis stroke="#6b7280" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    if (timeRange <= 90) {
                      return date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                    } else {
                      // For yearly view, show month and year
                      return date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                    }
                  }}
                  formatter={(value: any) => [
                    `Mood: ${value}/10`,
                    'Intensity'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Showing mood trends over the last {timeRange} days</p>
            <p>Scale: 1 (Low) to 10 (High)</p>
            {timeRange === 365 && (
              <p className="text-blue-600 dark:text-blue-400 mt-1">
                💡 Yearly view shows monthly patterns and long-term trends
              </p>
            )}
            {zoomLevel !== 1 && (
              <p className="text-orange-600 dark:text-orange-400 mt-1">
                🔍 Showing {zoomedData.length} of {chartData.length} data points
              </p>
            )}
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Mood Distribution
          </h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <p>No mood data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-400">Most Common Mood</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 capitalize">
              {analytics.mostFrequentMood}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-medium text-green-900 dark:text-green-400">Current Streak</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {analytics.streakDays} days
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-medium text-purple-900 dark:text-purple-400">Average Mood</h3>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {analytics.averageMood.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-medium text-yellow-900 dark:text-yellow-400">Trend</h3>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 capitalize">
              {analytics.moodTrend}
            </p>
          </div>
        </div>
      </div>

      {/* Time Range Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Time Range Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Selected Period</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Last {timeRange} Days
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Data Points</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {chartData.filter(point => point.value > 0).length} entries
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Coverage</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {chartData.length > 0 ? Math.round((chartData.filter(point => point.value > 0).length / chartData.length) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 