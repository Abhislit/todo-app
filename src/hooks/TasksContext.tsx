import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import { Task, Category, TaskFormData, DEFAULT_CATEGORIES } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  TASKS: 'todolist_tasks',
  CATEGORIES: 'todolist_categories',
} as const;

interface TasksContextValue {
  tasks: Task[];
  categories: Category[];
  stats: { total: number; completed: number; pending: number; overdue: number };
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  addCategory: (data: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  clearCompleted: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function reviveTasks(tasks: Task[]): Task[] {
  return tasks.map((t) => ({
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
  }));
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => reviveTasks(readStorage<Task[]>(STORAGE_KEYS.TASKS, [])));
  const [categories, setCategories] = useState<Category[]>(() => readStorage<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const addTask = useCallback((data: TaskFormData) => {
    setTasks((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: data.title.trim(),
        description: data.description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: data.dueDate,
        priority: data.priority,
        categoryId: data.categoryId,
        order: prev.length,
      },
    ]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t)));
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string) => {
    setTasks((prev) => {
      const from = prev.findIndex((t) => t.id === activeId);
      const to = prev.findIndex((t) => t.id === overId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next.map((t, i) => ({ ...t, order: i }));
    });
  }, []);

  const addCategory = useCallback((data: Omit<Category, 'id'>) => {
    setCategories((prev) => [...prev, { ...data, id: uuidv4() }]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setTasks((prev) => prev.map((t) => (t.categoryId === id ? { ...t, categoryId: 'personal' } : t)));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter((t) => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()).length,
  };

  return (
    <TasksContext.Provider
      value={{
        tasks, categories, stats,
        addTask, updateTask, deleteTask, toggleComplete, reorderTasks,
        addCategory, updateCategory, deleteCategory, clearCompleted,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
  return ctx;
}
