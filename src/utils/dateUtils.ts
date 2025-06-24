import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, addDays, isSameDay, parseISO } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatDateDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const getWeekRange = (date: Date): { start: string; end: string } => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

export const getMonthRange = (date: Date): { start: string; end: string } => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

export const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(formatDate(subDays(new Date(), i)));
  }
  return dates;
};

export const isToday = (date: string): boolean => {
  return isSameDay(parseISO(date), new Date());
};

export const getRelativeDate = (date: string): string => {
  const dateObj = parseISO(date);
  const today = new Date();
  
  if (isSameDay(dateObj, today)) {
    return 'Today';
  }
  
  const yesterday = subDays(today, 1);
  if (isSameDay(dateObj, yesterday)) {
    return 'Yesterday';
  }
  
  return formatDateDisplay(dateObj);
}; 