import { useCallback } from 'react';
import { MoodEntry, MoodType, MoodFilter } from '../types/mood.types';
import { useLocalStorage } from './useLocalStorage';
import { calculateMoodAnalytics, generateChartData } from '../utils/moodAnalytics';
import { formatDate } from '../utils/dateUtils';

export function useMoodData() {
  const [entries, setEntries] = useLocalStorage<MoodEntry[]>('mood-entries', []);

  const addEntry = useCallback((mood: MoodType, note: string, date?: string, intensity?: number) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: date || formatDate(new Date()),
      mood,
      note,
      timestamp: Date.now(),
      intensity,
    };

    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, [setEntries]);

  const updateEntry = useCallback((id: string, updates: Partial<MoodEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  }, [setEntries]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, [setEntries]);

  const getEntriesByDate = useCallback((date: string) => {
    return entries.filter(entry => entry.date === date);
  }, [entries]);

  const getEntriesByMood = useCallback((mood: MoodType) => {
    return entries.filter(entry => entry.mood === mood);
  }, [entries]);

  const filterEntries = useCallback((filter: MoodFilter) => {
    let filtered = [...entries];

    if (filter.startDate) {
      filtered = filtered.filter(entry => entry.date >= filter.startDate!);
    }

    if (filter.endDate) {
      filtered = filtered.filter(entry => entry.date <= filter.endDate!);
    }

    if (filter.moodTypes && filter.moodTypes.length > 0) {
      filtered = filtered.filter(entry => filter.moodTypes!.includes(entry.mood));
    }

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.note.toLowerCase().includes(searchLower) ||
        entry.mood.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [entries]);

  const getAnalytics = useCallback(() => {
    return calculateMoodAnalytics(entries);
  }, [entries]);

  const getChartData = useCallback((days: number = 30) => {
    return generateChartData(entries, days);
  }, [entries]);

  const exportData = useCallback(() => {
    const data = {
      entries,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-export-${formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [entries]);

  const importData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.entries && Array.isArray(data.entries)) {
        setEntries(data.entries);
        return { success: true, count: data.entries.length };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (error) {
      return { success: false, error: 'Invalid JSON format' };
    }
  }, [setEntries]);

  const clearAllData = useCallback(() => {
    setEntries([]);
  }, [setEntries]);

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByDate,
    getEntriesByMood,
    filterEntries,
    getAnalytics,
    getChartData,
    exportData,
    importData,
    clearAllData,
  };
} 