import { useCallback, useEffect, useState } from 'react';
import { MoodEntry, MoodType, MoodFilter } from '../types/mood.types';
import { calculateMoodAnalytics, generateChartData } from '../utils/moodAnalytics';
import { formatDate } from '../utils/dateUtils';
import * as entriesApi from '../api/entriesApi';
import { useAuth } from '../context/AuthContext';

export function useMoodData() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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

  // Enhanced export function with user information
  const exportData = useCallback(() => {
    // Group entries by user for better organization
    const entriesByUser = entries.reduce((acc, entry) => {
      const userId = entry.user?._id || 'unknown';
      const username = entry.user?.username || 'Unknown User';
      
      if (!acc[userId]) {
        acc[userId] = {
          user: {
            _id: userId,
            username: username,
            email: entry.user?.email || 'unknown@email.com',
            role: entry.user?.role || 'user'
          },
          entries: []
        };
      }
      
      acc[userId].entries.push({
        _id: entry._id,
        date: entry.date,
        mood: entry.mood,
        note: entry.note,
        timestamp: entry.timestamp,
        intensity: entry.intensity,
        tags: entry.tags || []
      });
      
      return acc;
    }, {} as Record<string, { user: any; entries: any[] }>);

    const data = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportedBy: user ? `${user.username} (${user.email})` : 'Unknown',
        totalEntries: entries.length,
        totalUsers: Object.keys(entriesByUser).length,
        version: '1.0.0'
      },
      users: Object.values(entriesByUser),
      summary: {
        totalEntries: entries.length,
        dateRange: entries.length > 0 ? {
          earliest: Math.min(...entries.map(e => e.timestamp)),
          latest: Math.max(...entries.map(e => e.timestamp))
        } : null,
        moodDistribution: entries.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
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
  }, [entries, user]);

  const importData = useCallback(async (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      let entriesToImport: any[] = [];

      // Handle new format (with user information)
      if (data.users && Array.isArray(data.users)) {
        // New format: entries grouped by users
        data.users.forEach((userGroup: any) => {
          if (userGroup.entries && Array.isArray(userGroup.entries)) {
            entriesToImport.push(...userGroup.entries);
          }
        });
      }
      // Handle old format (direct entries array)
      else if (data.entries && Array.isArray(data.entries)) {
        entriesToImport = data.entries;
      }
      // Handle legacy format (direct array of entries)
      else if (Array.isArray(data)) {
        entriesToImport = data;
      }
      else {
        return { success: false, error: 'Invalid data format: No entries found' };
      }

      if (entriesToImport.length === 0) {
        return { success: false, error: 'No entries found in the file' };
      }

      // Validate and clean entries
      const validEntries = entriesToImport.filter(entry => {
        return entry.mood && entry.note && entry.date;
      });

      if (validEntries.length === 0) {
        return { success: false, error: 'No valid entries found in the file' };
      }

      // Save entries to backend one by one
      const savedEntries: MoodEntry[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (const entry of validEntries) {
        try {
          const entryData = {
            mood: entry.mood,
            note: entry.note,
            date: entry.date,
            intensity: entry.intensity,
            tags: entry.tags || []
          };

          const savedEntry = await entriesApi.addEntry(entryData);
          savedEntries.push(savedEntry);
          successCount++;
        } catch (error) {
          console.error('Failed to save entry:', entry, error);
          errorCount++;
        }
      }

      // Update local state with new entries
      setEntries(prev => [...savedEntries, ...prev]);

      if (successCount === 0) {
        return { success: false, error: 'Failed to save any entries to the database' };
      }

      const message = `Successfully imported ${successCount} entries${errorCount > 0 ? ` (${errorCount} failed)` : ''}`;
      return { success: true, count: successCount, message };
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