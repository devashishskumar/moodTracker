export type MoodType = 'happy' | 'sad' | 'anxious' | 'excited' | 'calm' | 'angry' | 'neutral';

export interface MoodEntry {
  _id?: string; // MongoDB document id
  id?: string; // legacy/local id
  date: string;
  mood: MoodType;
  note: string;
  timestamp: number;
  intensity?: number; // 1-10 scale
  tags?: string[];
}

export interface MoodAnalytics {
  totalEntries: number;
  averageMood: number;
  moodDistribution: Record<MoodType, number>;
  mostFrequentMood: MoodType;
  moodTrend: 'improving' | 'declining' | 'stable';
  streakDays: number;
  lastEntryDate: string;
}

export interface MoodFilter {
  startDate?: string;
  endDate?: string;
  moodTypes?: MoodType[];
  searchTerm?: string;
}

export interface ChartDataPoint {
  date: string;
  mood: MoodType;
  value: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  entries: MoodEntry[];
  averageMood: number;
  dominantMood: MoodType;
  moodSwings: number;
}

export interface MonthlyReport {
  month: string;
  entries: MoodEntry[];
  averageMood: number;
  moodDistribution: Record<MoodType, number>;
  topTriggers: string[];
  recommendations: string[];
} 