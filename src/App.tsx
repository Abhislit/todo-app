import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ListTodo, ListChecks, Circle, Plus } from 'lucide-react';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { CategoryFilter } from './components/CategoryFilter';
import { Stats } from './components/Stats';
import { TasksProvider, useTasks } from './hooks/TasksContext';
import { Task, TaskFormData } from './types';
import { cn } from './utils/helpers';

const FILTERS = [
  { key: 'all', label: 'All', icon: ListTodo },
  { key: 'active', label: 'Active', icon: Circle },
  { key: 'completed', label: 'Completed', icon: ListChecks },
] as const;

function Workspace() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { categories, stats, addTask, updateTask, clearCompleted } = useTasks();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const openNew = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleSubmit = useCallback(
    (data: TaskFormData) => {
      if (editingTask) updateTask(editingTask.id, data);
      else addTask(data);
      closeForm();
    },
    [editingTask, addTask, updateTask, closeForm]
  );

  const focusSearch = useCallback(() => {
    document.getElementById('search')?.focus();
  }, []);

  const handleEscape = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
    setCategoryFilter('all');
    setSearchQuery('');
  }, []);

  const editingInitial = useMemo(
    () =>
      editingTask
        ? {
            title: editingTask.title,
            description: editingTask.description,
            dueDate: editingTask.dueDate,
            priority: editingTask.priority,
            categoryId: editingTask.categoryId,
          }
        : undefined,
    [editingTask]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
        onNewTask={openNew}
        onFocusSearch={focusSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEscape={handleEscape}
        onDeleteCompleted={clearCompleted}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-soft">
                <CategoryFilter
                  selectedCategory={categoryFilter}
                  onSelectCategory={setCategoryFilter}
                />
              </div>

              <div
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-soft space-y-1"
                role="group"
                aria-label="Filter by status"
              >
                {FILTERS.map(({ key, label, icon: Icon }) => {
                  const count = key === 'all' ? stats.total : key === 'active' ? stats.pending : stats.completed;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      aria-pressed={filter === key}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors flex items-center gap-2',
                        filter === key
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span className="flex-1">{label}</span>
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          filter === key
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </aside>

          <section className="lg:col-span-3 space-y-6">
            <Stats
              total={stats.total}
              completed={stats.completed}
              pending={stats.pending}
              overdue={stats.overdue}
            />

            <TaskList
              filter={filter}
              categoryFilter={categoryFilter}
              searchQuery={searchQuery}
            />
          </section>
        </div>
      </main>

      <TaskForm
        isOpen={formOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingInitial}
        editingTaskId={editingTask?.id}
      />

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={openNew}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-xl hover:shadow-2xl transition-shadow grid place-items-center lg:hidden"
        aria-label="Add new task"
      >
        <Plus className="w-7 h-7" aria-hidden="true" />
      </motion.button>

      <AnimatePresence>
        {stats.overdue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md"
          >
            <div
              className="flex items-start gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg backdrop-blur"
              role="status"
            >
              <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 grid place-items-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {stats.overdue} overdue {stats.overdue === 1 ? 'task' : 'tasks'}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                  Consider completing or rescheduling {stats.overdue === 1 ? 'it' : 'them'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <TasksProvider>
      <Workspace />
    </TasksProvider>
  );
}

export default App;
