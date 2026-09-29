export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: Priority;
  categoryId: string;
  order: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate?: Date;
  priority: Priority;
  categoryId: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'personal', name: 'Personal', color: '#0ea5e9', icon: 'user' },
  { id: 'work', name: 'Work', color: '#22c55e', icon: 'briefcase' },
  { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'shopping-cart' },
  { id: 'health', name: 'Health', color: '#ef4444', icon: 'heart' },
  { id: 'learning', name: 'Learning', color: '#a855f7', icon: 'book-open' },
];

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
];

export const PRIORITY_ICONS: Record<Priority, string> = {
  low: 'flag',
  medium: 'flag',
  high: 'alert-triangle',
};