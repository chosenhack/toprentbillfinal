import { format, formatDistanceToNow, parseISO, isValid, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from 'date-fns';
import { it } from 'date-fns/locale';
import type { PeriodType } from '../components/reports/PeriodSelector';

export const formatTimestamp = (timestamp: string | Date) => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    if (!isValid(date)) {
      return 'Data non valida';
    }
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: it 
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Data non valida';
  }
};

export const formatTime = (timestamp: string | Date) => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    if (!isValid(date)) {
      return '--:--';
    }
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '--:--';
  }
};

export const formatDate = (timestamp: string | Date) => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    if (!isValid(date)) {
      return 'Data non valida';
    }
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data non valida';
  }
};

export const getPeriodDates = (period: PeriodType, startDate?: string, endDate?: string) => {
  const now = new Date();
  
  switch (period) {
    case 'all':
      return {
        start: new Date(2000, 0, 1), // Far past date
        end: now
      };
    
    case 'current':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    
    case 'last':
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth)
      };
    
    case 'custom':
      if (!startDate || !endDate) {
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      }
      return {
        start: startOfDay(parseISO(startDate)),
        end: endOfDay(parseISO(endDate))
      };
    
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
  }
};

export const isDateInPeriod = (date: string | Date, start: Date, end: Date) => {
  try {
    const dateToCheck = typeof date === 'string' ? parseISO(date) : date;
    return dateToCheck >= start && dateToCheck <= end;
  } catch (error) {
    console.error('Error checking date in period:', error);
    return false;
  }
};