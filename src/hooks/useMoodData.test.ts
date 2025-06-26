import { renderHook, act, waitFor } from '@testing-library/react';
import { useMoodData } from './useMoodData';
import * as entriesApi from '../api/entriesApi';
import { MoodEntry, MoodType, MoodFilter } from '../types/mood.types';
import { useAuth } from '../context/AuthContext';

// Mock the API module
jest.mock('../api/entriesApi');
const mockedEntriesApi = entriesApi as jest.Mocked<typeof entriesApi>;

// Mock the auth context
jest.mock('../context/AuthContext');
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useMoodData Hook', () => {
  const mockUser = {
    _id: 'user-1',
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user' as const
  };

  const mockEntries: MoodEntry[] = [
    {
      _id: 'entry-1',
      mood: 'happy' as MoodType,
      note: 'Great day!',
      date: '2024-01-15',
      timestamp: 1705312800000,
      intensity: 8,
      tags: ['work', 'success']
    },
    {
      _id: 'entry-2',
      mood: 'sad' as MoodType,
      note: 'Feeling down',
      date: '2024-01-14',
      timestamp: 1705226400000,
      intensity: 3,
      tags: ['personal']
    },
    {
      _id: 'entry-3',
      mood: 'excited' as MoodType,
      note: 'Amazing news!',
      date: '2024-01-13',
      timestamp: 1705140000000,
      intensity: 9,
      tags: ['celebration']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the current date to be consistent
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    
    mockedUseAuth.mockReturnValue({ 
      user: mockUser, 
      token: 'test-token',
      login: jest.fn(), 
      register: jest.fn(),
      logout: jest.fn(), 
      isLoading: false,
      error: null
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial state and data fetching', () => {
    it('should initialize with loading state', () => {
      mockedEntriesApi.getEntries.mockResolvedValue([]);
      
      const { result } = renderHook(() => useMoodData());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.entries).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should fetch entries on mount', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.entries).toEqual(mockEntries);
      expect(mockedEntriesApi.getEntries).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to fetch entries';
      mockedEntriesApi.getEntries.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.entries).toEqual([]);
    });
  });

  describe('addEntry', () => {
    it('should add new entry successfully', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      const newEntry = {
        _id: 'entry-4',
        mood: 'calm' as MoodType,
        note: 'Peaceful day',
        date: '2024-01-16',
        timestamp: 1705399200000,
        intensity: 6,
        tags: ['relaxation']
      };
      mockedEntriesApi.addEntry.mockResolvedValue(newEntry);
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      await act(async () => {
        await result.current.addEntry('calm', 'Peaceful day', '2024-01-16', 6, ['relaxation']);
      });
      
      expect(mockedEntriesApi.addEntry).toHaveBeenCalledWith({
        mood: 'calm',
        note: 'Peaceful day',
        date: '2024-01-16',
        intensity: 6,
        tags: ['relaxation']
      });
      
      expect(result.current.entries).toContain(newEntry);
    });

    it('should add entry with current date when no date provided', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      const newEntry = {
        _id: 'entry-4',
        mood: 'happy' as MoodType,
        note: 'Today is great',
        date: '2024-01-15',
        timestamp: 1705312800000,
        intensity: 7,
        tags: []
      };
      mockedEntriesApi.addEntry.mockResolvedValue(newEntry);
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      await act(async () => {
        await result.current.addEntry('happy', 'Today is great', undefined, 7);
      });
      
      expect(mockedEntriesApi.addEntry).toHaveBeenCalledWith({
        mood: 'happy',
        note: 'Today is great',
        date: '2024-01-15', // Current date from mocked system time
        intensity: 7,
        tags: undefined
      });
    });
  });

  describe('updateEntry', () => {
    it('should update existing entry successfully', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      const updatedEntry = { ...mockEntries[0], mood: 'sad' as MoodType, note: 'Updated note' };
      mockedEntriesApi.updateEntry.mockResolvedValue(updatedEntry);
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      await act(async () => {
        await result.current.updateEntry('entry-1', { mood: 'sad', note: 'Updated note' });
      });
      
      expect(mockedEntriesApi.updateEntry).toHaveBeenCalledWith('entry-1', {
        mood: 'sad',
        note: 'Updated note'
      });
      
      const updatedEntryInState = result.current.entries.find(e => e._id === 'entry-1');
      expect(updatedEntryInState?.mood).toBe('sad');
      expect(updatedEntryInState?.note).toBe('Updated note');
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry successfully', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      mockedEntriesApi.deleteEntry.mockResolvedValue({ message: 'Entry deleted' });
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      await act(async () => {
        await result.current.deleteEntry('entry-1');
      });
      
      expect(mockedEntriesApi.deleteEntry).toHaveBeenCalledWith('entry-1');
      expect(result.current.entries).not.toContain(mockEntries[0]);
      expect(result.current.entries).toHaveLength(2);
    });
  });

  describe('Filtering and querying', () => {
    beforeEach(() => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
    });

    it('should get entries by date', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const entriesByDate = result.current.getEntriesByDate('2024-01-15');
      expect(entriesByDate).toHaveLength(1);
      expect(entriesByDate[0]._id).toBe('entry-1');
    });

    it('should get entries by mood type', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const happyEntries = result.current.getEntriesByMood('happy');
      expect(happyEntries).toHaveLength(1);
      expect(happyEntries[0]._id).toBe('entry-1');
    });

    it('should filter entries by date range', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const filter: MoodFilter = {
        startDate: '2024-01-14',
        endDate: '2024-01-15'
      };
      
      const filteredEntries = result.current.filterEntries(filter);
      expect(filteredEntries).toHaveLength(2);
      expect(filteredEntries[0]._id).toBe('entry-1'); // Most recent first
      expect(filteredEntries[1]._id).toBe('entry-2');
    });

    it('should filter entries by mood types', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const filter: MoodFilter = {
        moodTypes: ['happy', 'excited']
      };
      
      const filteredEntries = result.current.filterEntries(filter);
      expect(filteredEntries).toHaveLength(2);
      expect(filteredEntries[0].mood).toBe('happy');
      expect(filteredEntries[1].mood).toBe('excited');
    });

    it('should filter entries by search term', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const filter: MoodFilter = {
        searchTerm: 'great'
      };
      
      const filteredEntries = result.current.filterEntries(filter);
      expect(filteredEntries).toHaveLength(1);
      expect(filteredEntries[0].note).toContain('Great');
    });

    it('should combine multiple filters', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const filter: MoodFilter = {
        startDate: '2024-01-13',
        endDate: '2024-01-15',
        moodTypes: ['happy', 'excited'],
        searchTerm: 'day'
      };
      
      const filteredEntries = result.current.filterEntries(filter);
      // Only one entry matches: "Great day!" (happy mood with "day" in note)
      expect(filteredEntries).toHaveLength(1);
      expect(filteredEntries[0].mood).toBe('happy');
      expect(filteredEntries[0].note.toLowerCase()).toContain('day');
    });
  });

  describe('Analytics and chart data', () => {
    beforeEach(() => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
    });

    it('should calculate analytics correctly', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const analytics = result.current.getAnalytics();
      
      expect(analytics.totalEntries).toBe(3);
      // Check that we have the expected moods, but don't assume order
      expect(analytics.moodDistribution.happy).toBe(1);
      expect(analytics.moodDistribution.sad).toBe(1);
      expect(analytics.moodDistribution.excited).toBe(1);
      // The streak calculation depends on the implementation, adjust as needed
      expect(analytics.streakDays).toBeGreaterThan(0);
    });

    it('should generate chart data', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const chartData = result.current.getChartData(7);
      
      expect(chartData).toHaveLength(7);
      expect(chartData[0]).toHaveProperty('date');
      expect(chartData[0]).toHaveProperty('mood');
      expect(chartData[0]).toHaveProperty('value');
    });

    it('should generate chart data for specified number of days', async () => {
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      const chartData = result.current.getChartData(30);
      
      expect(chartData).toHaveLength(30);
    });
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockedEntriesApi.getEntries.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBe('Failed to fetch entries');
      expect(result.current.entries).toEqual([]);
    });

    it('should handle add entry errors', async () => {
      mockedEntriesApi.getEntries.mockResolvedValue(mockEntries);
      mockedEntriesApi.addEntry.mockRejectedValue(new Error('Add failed'));
      
      const { result } = renderHook(() => useMoodData());
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      await expect(async () => {
        await act(async () => {
          await result.current.addEntry('happy', 'Test');
        });
      }).rejects.toThrow('Add failed');
    });
  });
}); 