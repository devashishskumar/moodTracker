import { 
  formatDate, 
  formatDateDisplay, 
  formatDateTime, 
  getWeekRange, 
  getMonthRange, 
  getLastNDays, 
  isToday, 
  getRelativeDate 
} from './dateUtils';

describe('Date Utils', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    // Set to a specific UTC time to avoid timezone issues
    jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('2024-01-15');
    });

    it('should format date string correctly', () => {
      const dateStr = '2024-01-15';
      const formatted = formatDate(dateStr);
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle different date formats', () => {
      const dateStr = '2024-01-15T12:00:00Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toBe('2024-01-15');
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2024-01-05T12:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('2024-01-05');
    });
  });

  describe('formatDateDisplay', () => {
    it('should format date for display', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const formatted = formatDateDisplay(date);
      expect(formatted).toBe('Jan 15, 2024');
    });

    it('should handle date string', () => {
      const dateStr = '2024-01-15';
      const formatted = formatDateDisplay(dateStr);
      expect(formatted).toBe('Jan 15, 2024');
    });

    it('should handle different months', () => {
      const date = new Date('2024-12-25T12:00:00.000Z');
      const formatted = formatDateDisplay(date);
      expect(formatted).toBe('Dec 25, 2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date('2024-01-15T14:30:00.000Z');
      const formatted = formatDateTime(date);
      // Account for timezone conversion (UTC to local)
      expect(formatted).toBe('Jan 15, 2024 08:30');
    });

    it('should handle date string with time', () => {
      const dateStr = '2024-01-15T14:30:00';
      const formatted = formatDateTime(dateStr);
      expect(formatted).toBe('Jan 15, 2024 14:30');
    });

    it('should handle midnight time', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      const formatted = formatDateTime(date);
      // Account for timezone conversion (UTC to local)
      expect(formatted).toBe('Jan 14, 2024 18:00');
    });
  });

  describe('getWeekRange', () => {
    it('should return correct week range for Monday', () => {
      const monday = new Date('2024-01-15T12:00:00.000Z'); // Monday
      const range = getWeekRange(monday);
      expect(range.start).toBe('2024-01-15');
      expect(range.end).toBe('2024-01-21');
    });

    it('should return correct week range for Wednesday', () => {
      const wednesday = new Date('2024-01-17T12:00:00.000Z'); // Wednesday
      const range = getWeekRange(wednesday);
      expect(range.start).toBe('2024-01-15'); // Monday
      expect(range.end).toBe('2024-01-21'); // Sunday
    });

    it('should return correct week range for Sunday', () => {
      const sunday = new Date('2024-01-21T12:00:00.000Z'); // Sunday
      const range = getWeekRange(sunday);
      expect(range.start).toBe('2024-01-15'); // Monday
      expect(range.end).toBe('2024-01-21'); // Sunday
    });

    it('should handle week spanning month boundary', () => {
      const date = new Date('2024-01-29T12:00:00.000Z'); // Monday
      const range = getWeekRange(date);
      expect(range.start).toBe('2024-01-29');
      expect(range.end).toBe('2024-02-04');
    });
  });

  describe('getMonthRange', () => {
    it('should return correct month range for January', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const range = getMonthRange(date);
      expect(range.start).toBe('2024-01-01');
      expect(range.end).toBe('2024-01-31');
    });

    it('should return correct month range for February (leap year)', () => {
      const date = new Date('2024-02-15T12:00:00.000Z');
      const range = getMonthRange(date);
      expect(range.start).toBe('2024-02-01');
      expect(range.end).toBe('2024-02-29');
    });

    it('should return correct month range for February (non-leap year)', () => {
      const date = new Date('2023-02-15T12:00:00.000Z');
      const range = getMonthRange(date);
      expect(range.start).toBe('2023-02-01');
      expect(range.end).toBe('2023-02-28');
    });

    it('should return correct month range for April (30 days)', () => {
      const date = new Date('2024-04-15T12:00:00.000Z');
      const range = getMonthRange(date);
      expect(range.start).toBe('2024-04-01');
      expect(range.end).toBe('2024-04-30');
    });
  });

  describe('getLastNDays', () => {
    it('should return last 7 days', () => {
      const days = getLastNDays(7);
      expect(days).toHaveLength(7);
      expect(days[0]).toBe('2024-01-09'); // 7 days ago
      expect(days[6]).toBe('2024-01-15'); // today
    });

    it('should return last 30 days', () => {
      const days = getLastNDays(30);
      expect(days).toHaveLength(30);
      expect(days[0]).toBe('2023-12-17'); // 30 days ago (adjusted for timezone)
      expect(days[29]).toBe('2024-01-15'); // today
    });

    it('should return last 1 day', () => {
      const days = getLastNDays(1);
      expect(days).toHaveLength(1);
      expect(days[0]).toBe('2024-01-15'); // today
    });

    it('should handle month boundary', () => {
      const days = getLastNDays(20);
      expect(days).toHaveLength(20);
      expect(days[0]).toBe('2023-12-27'); // 20 days ago (adjusted for timezone)
      expect(days[19]).toBe('2024-01-15'); // today
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = '2024-01-15';
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = '2024-01-14';
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = '2024-01-16';
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should return false for different month', () => {
      const differentMonth = '2024-02-15';
      expect(isToday(differentMonth)).toBe(false);
    });
  });

  describe('getRelativeDate', () => {
    it('should return "Today" for today', () => {
      const today = '2024-01-15';
      expect(getRelativeDate(today)).toBe('Today');
    });

    it('should return "Yesterday" for yesterday', () => {
      const yesterday = '2024-01-14';
      expect(getRelativeDate(yesterday)).toBe('Yesterday');
    });

    it('should return formatted date for other days', () => {
      const otherDay = '2024-01-10';
      expect(getRelativeDate(otherDay)).toBe('Jan 10, 2024');
    });

    it('should handle different months', () => {
      const differentMonth = '2023-12-15';
      expect(getRelativeDate(differentMonth)).toBe('Dec 15, 2023');
    });

    it('should handle future dates', () => {
      const futureDate = '2024-01-20';
      expect(getRelativeDate(futureDate)).toBe('Jan 20, 2024');
    });
  });
}); 