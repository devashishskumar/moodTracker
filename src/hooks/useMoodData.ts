import { useCallback, useEffect, useState } from 'react';
import { MoodEntry, MoodType, MoodFilter } from '../types/mood.types';
import { calculateMoodAnalytics, generateChartData } from '../utils/moodAnalytics';
import { formatDate } from '../utils/dateUtils';
import * as entriesApi from '../api/entriesApi';

export function useMoodData() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all entries on mount
  useEffect(() => {
    setLoading(true);
    entriesApi.getEntries()
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch entries');
        setLoading(false);
      });
  }, []);

  const addEntry = useCallback(async (mood: MoodType, note: string, date?: string, intensity?: number, tags?: string[]) => {
    const formattedDate = formatDate(date || new Date());
    const newEntry = await entriesApi.addEntry({ mood, note, date: formattedDate, intensity, tags });
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const updateEntry = useCallback(async (id: string, updates: Partial<MoodEntry>) => {
    const formattedUpdates = {
      ...updates,
      date: updates.date ? formatDate(updates.date) : undefined,
    };
    const updated = await entriesApi.updateEntry(id, formattedUpdates);
    setEntries(prev => prev.map(entry => entry._id === id ? updated : entry));
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    await entriesApi.deleteEntry(id);
    setEntries(prev => prev.filter(entry => entry._id !== id));
  }, []);

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

  // Export/import/clear can be left as-is or adapted for server-side if needed
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
  }, []);

  const clearAllData = useCallback(() => {
    setEntries([]);
  }, []);

  return {
    entries,
    loading,
    error,
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