import { MoodEntry, MoodType, MoodAnalytics, ChartDataPoint, WeeklyReport, MonthlyReport } from '../types/mood.types';
import { formatDate, getWeekRange, getMonthRange } from './dateUtils';

const MOOD_VALUES: Record<MoodType, number> = {
  happy: 9,
  excited: 8,
  calm: 7,
  neutral: 5,
  anxious: 3,
  sad: 2,
  angry: 1,
};

export const calculateMoodAnalytics = (entries: MoodEntry[]): MoodAnalytics => {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      averageMood: 0,
      moodDistribution: {
        happy: 0, sad: 0, anxious: 0, excited: 0, calm: 0, angry: 0, neutral: 0
      },
      mostFrequentMood: 'neutral',
      moodTrend: 'stable',
      streakDays: 0,
      lastEntryDate: '',
    };
  }

  // Calculate mood distribution
  const moodDistribution: Record<MoodType, number> = {
    happy: 0, sad: 0, anxious: 0, excited: 0, calm: 0, angry: 0, neutral: 0
  };

  let totalMoodValue = 0;
  entries.forEach(entry => {
    moodDistribution[entry.mood]++;
    totalMoodValue += MOOD_VALUES[entry.mood];
  });

  const averageMood = totalMoodValue / entries.length;
  const mostFrequentMood = Object.entries(moodDistribution)
    .reduce((a, b) => moodDistribution[a[0] as MoodType] > moodDistribution[b[0] as MoodType] ? a : b)[0] as MoodType;

  // Calculate mood trend
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const recentEntries = sortedEntries.slice(-7);
  const olderEntries = sortedEntries.slice(-14, -7);

  let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentEntries.length > 0 && olderEntries.length > 0) {
    const recentAvg = recentEntries.reduce((sum, entry) => sum + MOOD_VALUES[entry.mood], 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, entry) => sum + MOOD_VALUES[entry.mood], 0) / olderEntries.length;
    
    if (recentAvg > olderAvg + 1) moodTrend = 'improving';
    else if (recentAvg < olderAvg - 1) moodTrend = 'declining';
  }

  // Calculate streak - look for consecutive days with entries
  const streakDays = calculateStreakDays(sortedEntries);

  return {
    totalEntries: entries.length,
    averageMood,
    moodDistribution,
    mostFrequentMood,
    moodTrend,
    streakDays,
    lastEntryDate: sortedEntries[sortedEntries.length - 1]?.date || '',
  };
};

export const calculateStreakDays = (entries: MoodEntry[]): number => {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  
  // Get unique dates from entries
  const uniqueDates = [...new Set(sortedEntries.map(entry => entry.date))].sort().reverse();
  
  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date(uniqueDates[0]); // Start from the most recent entry date

  for (let i = 0; i < uniqueDates.length; i++) {
    const dateStr = formatDate(currentDate);
    
    if (uniqueDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
    } else {
      break; // Streak broken
    }
  }

  return streak;
};

export const generateChartData = (entries: MoodEntry[], days: number = 30): ChartDataPoint[] => {
  const chartData: ChartDataPoint[] = [];
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  
  if (sortedEntries.length === 0) {
    // Return empty data for the requested number of days
    const endDate = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      
      chartData.push({
        date: dateStr,
        mood: 'neutral',
        value: 0,
      });
    }
    return chartData;
  }
  
  // Group entries by date
  const entriesByDate = new Map<string, MoodEntry[]>();
  sortedEntries.forEach(entry => {
    if (!entriesByDate.has(entry.date)) {
      entriesByDate.set(entry.date, []);
    }
    entriesByDate.get(entry.date)!.push(entry);
  });

  // Generate data points for the last N days from today
  const endDate = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    
    const dayEntries = entriesByDate.get(dateStr) || [];
    const averageMood = dayEntries.length > 0 
      ? dayEntries.reduce((sum, entry) => sum + MOOD_VALUES[entry.mood], 0) / dayEntries.length
      : 0;

    chartData.push({
      date: dateStr,
      mood: dayEntries[0]?.mood || 'neutral',
      value: averageMood,
    });
  }

  return chartData;
};

export const generateWeeklyReport = (entries: MoodEntry[], weekStartDate: Date): WeeklyReport => {
  const { start, end } = getWeekRange(weekStartDate);
  const weekEntries = entries.filter(entry => entry.date >= start && entry.date <= end);
  
  const analytics = calculateMoodAnalytics(weekEntries);
  const moodSwings = calculateMoodSwings(weekEntries);

  return {
    weekStart: start,
    weekEnd: end,
    entries: weekEntries,
    averageMood: analytics.averageMood,
    dominantMood: analytics.mostFrequentMood,
    moodSwings,
  };
};

export const generateMonthlyReport = (entries: MoodEntry[], monthDate: Date): MonthlyReport => {
  const { start, end } = getMonthRange(monthDate);
  const monthEntries = entries.filter(entry => entry.date >= start && entry.date <= end);
  
  const analytics = calculateMoodAnalytics(monthEntries);
  const topTriggers = extractTopTriggers(monthEntries);
  const recommendations = generateRecommendations(analytics, monthEntries);

  return {
    month: formatDate(monthDate).substring(0, 7), // YYYY-MM format
    entries: monthEntries,
    averageMood: analytics.averageMood,
    moodDistribution: analytics.moodDistribution,
    topTriggers,
    recommendations,
  };
};

const calculateMoodSwings = (entries: MoodEntry[]): number => {
  if (entries.length < 2) return 0;

  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  let swings = 0;

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevMood = MOOD_VALUES[sortedEntries[i - 1].mood];
    const currentMood = MOOD_VALUES[sortedEntries[i].mood];
    
    if (Math.abs(currentMood - prevMood) >= 3) {
      swings++;
    }
  }

  return swings;
};

const extractTopTriggers = (entries: MoodEntry[]): string[] => {
  const triggerWords = [
    'work', 'stress', 'family', 'friend', 'exercise', 'sleep', 'food', 'weather',
    'meeting', 'deadline', 'celebration', 'travel', 'health', 'money', 'relationship'
  ];

  const triggerCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    const note = entry.note.toLowerCase();
    triggerWords.forEach(word => {
      if (note.includes(word)) {
        triggerCounts[word] = (triggerCounts[word] || 0) + 1;
      }
    });
  });

  return Object.entries(triggerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
};

const generateRecommendations = (analytics: MoodAnalytics, entries: MoodEntry[]): string[] => {
  const recommendations: string[] = [];

  if (analytics.averageMood < 4) {
    recommendations.push('Consider talking to a friend or family member about your feelings');
    recommendations.push('Try some light exercise or outdoor activities');
  }

  if (analytics.moodDistribution.anxious > analytics.totalEntries * 0.3) {
    recommendations.push('Practice deep breathing exercises or meditation');
    recommendations.push('Consider reducing caffeine intake');
  }

  if (analytics.streakDays < 3) {
    recommendations.push('Try to log your mood daily to build a consistent habit');
  }

  if (analytics.moodTrend === 'declining') {
    recommendations.push('Consider reaching out to a mental health professional');
  }

  if (recommendations.length === 0) {
    recommendations.push('Keep up the great work! Your mood tracking is consistent');
  }

  return recommendations.slice(0, 3);
}; 