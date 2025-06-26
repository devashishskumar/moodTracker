import axios from 'axios';
import * as entriesApi from './entriesApi';
import { MoodEntry, MoodType } from '../types/mood.types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Entries API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    localStorageMock.getItem.mockReset();
    // Default: no token
    localStorageMock.getItem.mockReturnValue(null);
  });

  const setToken = (token: string | null) => {
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'token') {
        return token;
      }
      return null;
    });
  };

  const mockEntry: MoodEntry = {
    _id: 'test-id',
    mood: 'happy' as MoodType,
    note: 'Test entry',
    date: '2024-01-15',
    timestamp: 1705312800000,
    intensity: 8,
    tags: ['test']
  };

  describe('getEntries', () => {
    it('should fetch entries successfully', async () => {
      setToken('test-token');
      const mockResponse = { data: [mockEntry] };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await entriesApi.getEntries();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/entries', {
        headers: { Authorization: 'Bearer test-token' }
      });
      expect(result).toEqual([mockEntry]);
    });

    it('should handle errors when fetching entries', async () => {
      setToken('test-token');
      const errorMessage = 'Network error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(entriesApi.getEntries()).rejects.toThrow(errorMessage);
    });

    it('should call without auth headers when no token', () => {
      setToken(null);
      mockedAxios.get.mockResolvedValue({ data: [] });

      entriesApi.getEntries();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/entries', {
        headers: {}
      });
    });
  });

  describe('getEntriesByDate', () => {
    it('should fetch entries by date successfully', async () => {
      setToken('test-token');
      const date = '2024-01-15';
      const mockResponse = { data: [mockEntry] };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await entriesApi.getEntriesByDate(date);

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/entries', {
        params: { date },
        headers: { Authorization: 'Bearer test-token' }
      });
      expect(result).toEqual([mockEntry]);
    });

    it('should handle errors when fetching entries by date', async () => {
      setToken('test-token');
      const date = '2024-01-15';
      const errorMessage = 'Date not found';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(entriesApi.getEntriesByDate(date)).rejects.toThrow(errorMessage);
    });
  });

  describe('addEntry', () => {
    it('should add entry successfully', async () => {
      setToken('test-token');
      const newEntry = {
        mood: 'happy' as MoodType,
        note: 'New entry',
        date: '2024-01-15',
        intensity: 8,
        tags: ['new']
      };
      const mockResponse = { data: mockEntry };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await entriesApi.addEntry(newEntry);

      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:4000/api/entries', newEntry, {
        headers: { Authorization: 'Bearer test-token' }
      });
      expect(result).toEqual(mockEntry);
    });

    it('should handle errors when adding entry', async () => {
      setToken('test-token');
      const newEntry = {
        mood: 'happy' as MoodType,
        note: 'New entry',
        date: '2024-01-15'
      };
      const errorMessage = 'Invalid entry data';
      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(entriesApi.addEntry(newEntry)).rejects.toThrow(errorMessage);
    });

    it('should handle validation errors', async () => {
      setToken('test-token');
      const invalidEntry = {
        mood: 'invalid' as any,
        note: '',
        date: 'invalid-date'
      };
      const errorResponse = {
        response: {
          status: 400,
          data: { error: 'Validation failed' }
        }
      };
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(entriesApi.addEntry(invalidEntry)).rejects.toEqual(errorResponse);
    });
  });

  describe('updateEntry', () => {
    it('should update entry successfully', async () => {
      setToken('test-token');
      const entryId = 'test-id';
      const updates = {
        mood: 'sad' as MoodType,
        note: 'Updated note'
      };
      const updatedEntry = { ...mockEntry, ...updates };
      const mockResponse = { data: updatedEntry };
      mockedAxios.put.mockResolvedValue(mockResponse);

      const result = await entriesApi.updateEntry(entryId, updates);

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `http://localhost:4000/api/entries/${entryId}`,
        updates,
        { headers: { Authorization: 'Bearer test-token' } }
      );
      expect(result).toEqual(updatedEntry);
    });

    it('should handle errors when updating entry', async () => {
      setToken('test-token');
      const entryId = 'test-id';
      const updates = { mood: 'sad' as MoodType };
      const errorMessage = 'Entry not found';
      mockedAxios.put.mockRejectedValue(new Error(errorMessage));

      await expect(entriesApi.updateEntry(entryId, updates)).rejects.toThrow(errorMessage);
    });

    it('should handle 404 errors for non-existent entry', async () => {
      setToken('test-token');
      const entryId = 'non-existent-id';
      const updates = { mood: 'sad' as MoodType };
      const errorResponse = {
        response: {
          status: 404,
          data: { error: 'Entry not found' }
        }
      };
      mockedAxios.put.mockRejectedValue(errorResponse);

      await expect(entriesApi.updateEntry(entryId, updates)).rejects.toEqual(errorResponse);
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry successfully', async () => {
      setToken('test-token');
      const entryId = 'test-id';
      const mockResponse = { data: { message: 'Entry deleted' } };
      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await entriesApi.deleteEntry(entryId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `http://localhost:4000/api/entries/${entryId}`,
        { headers: { Authorization: 'Bearer test-token' } }
      );
      expect(result).toEqual({ message: 'Entry deleted' });
    });

    it('should handle errors when deleting entry', async () => {
      setToken('test-token');
      const entryId = 'test-id';
      const errorMessage = 'Delete failed';
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(entriesApi.deleteEntry(entryId)).rejects.toThrow(errorMessage);
    });

    it('should handle 403 errors for unauthorized deletion', async () => {
      setToken('test-token');
      const entryId = 'test-id';
      const errorResponse = {
        response: {
          status: 403,
          data: { error: 'Access denied' }
        }
      };
      mockedAxios.delete.mockRejectedValue(errorResponse);

      await expect(entriesApi.deleteEntry(entryId)).rejects.toEqual(errorResponse);
    });
  });

  describe('API URL configuration', () => {
    it('should use correct API base URL', () => {
      // This test ensures the API URL is correctly configured
      expect(mockedAxios.get).not.toHaveBeenCalled();
      
      // Trigger a call to verify URL
      mockedAxios.get.mockResolvedValue({ data: [] });
      entriesApi.getEntries();
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:4000/api/entries',
        expect.any(Object)
      );
    });
  });

  describe('Authentication headers', () => {
    it('should include auth headers when token exists', () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      mockedAxios.get.mockResolvedValue({ data: [] });

      entriesApi.getEntries();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:4000/api/entries',
        { headers: { Authorization: 'Bearer valid-token' } }
      );
    });

    it('should not include auth headers when token is null', () => {
      localStorageMock.getItem.mockReturnValue(null);
      mockedAxios.get.mockResolvedValue({ data: [] });

      entriesApi.getEntries();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:4000/api/entries',
        { headers: {} }
      );
    });

    it('should not include auth headers when token is empty string', () => {
      localStorageMock.getItem.mockReturnValue('');
      mockedAxios.get.mockResolvedValue({ data: [] });

      entriesApi.getEntries();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:4000/api/entries',
        { headers: {} }
      );
    });
  });
}); 