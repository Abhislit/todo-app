import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

export function formatDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
}

export function getDateStatus(date: Date): { label: string; className: string; urgent: boolean } {
  if (isToday(date)) return { label: 'Due today', className: 'text-orange-600 dark:text-orange-400', urgent: true };
  if (isTomorrow(date)) return { label: 'Due tomorrow', className: 'text-yellow-600 dark:text-yellow-400', urgent: false };
  if (isPast(date)) {
    const days = Math.abs(differenceInDays(new Date(), date));
    return { label: `${days} day${days !== 1 ? 's' : ''} overdue`, className: 'text-red-600 dark:text-red-400', urgent: true };
  }
  return { label: formatDate(date), className: 'text-gray-500 dark:text-gray-400', urgent: false };
}

export function getPriorityStyles(priority: 'low' | 'medium' | 'high') {
  const styles = {
    low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
    high: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  };
  return styles[priority];
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}