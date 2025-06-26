import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('default-value');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should initialize with stored value when localStorage has data', () => {
      localStorageMock.getItem.mockReturnValue('"stored-value"');

      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('stored-value');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle JSON parsing errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('default-value');
    });

    it('should handle null values from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('default-value');
    });
  });

  describe('Setting Values', () => {
    it('should set value in localStorage and update state', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
    });

    it('should handle setting null value', () => {
      const { result } = renderHook(() => useLocalStorage<string | null>('test-key', 'default-value'));

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBe(null);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'null');
    });

    it('should handle setting undefined value', () => {
      const { result } = renderHook(() => useLocalStorage<string | undefined>('test-key', 'default-value'));

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBe(undefined);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', undefined);
    });

    it('should handle setting object values', () => {
      const { result } = renderHook(() => useLocalStorage<object>('test-key', {}));

      const testObject = { name: 'test', value: 123 };
      act(() => {
        result.current[1](testObject);
      });

      expect(result.current[0]).toEqual(testObject);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testObject));
    });

    it('should handle setting array values', () => {
      const { result } = renderHook(() => useLocalStorage<(string | number)[]>('test-key', []));

      const testArray = [1, 2, 3, 'test'];
      act(() => {
        result.current[1](testArray);
      });

      expect(result.current[0]).toEqual(testArray);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testArray));
    });
  });

  describe('Getting Values', () => {
    it('should return current value from state', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('default-value');
    });

    it('should return updated value after setting', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      act(() => {
        result.current[1]('updated-value');
      });

      expect(result.current[0]).toBe('updated-value');
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage getItem errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

      expect(result.current[0]).toBe('default-value');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Multiple Instances', () => {
    it('should handle multiple hooks with different keys', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('key1', 'default1'));
      const { result: result2 } = renderHook(() => useLocalStorage('key2', 'default2'));

      expect(result1.current[0]).toBe('default1');
      expect(result2.current[0]).toBe('default2');

      act(() => {
        result1.current[1]('value1');
        result2.current[1]('value2');
      });

      expect(result1.current[0]).toBe('value1');
      expect(result2.current[0]).toBe('value2');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key1', '"value1"');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key2', '"value2"');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', ''));

      expect(result.current[0]).toBe('');

      act(() => {
        result.current[1]('new-empty');
      });

      expect(result.current[0]).toBe('new-empty');
    });

    it('should handle zero values', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 0));

      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    it('should handle boolean values', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', false));

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });
  });
}); 