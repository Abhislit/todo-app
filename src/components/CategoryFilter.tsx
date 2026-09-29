import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, X } from 'lucide-react';
import { useTasks } from '../hooks/TasksContext';
import { cn } from '../utils/helpers';

interface CategoryFilterProps {
  selectedCategory: string | 'all';
  onSelectCategory: (id: string | 'all') => void;
}

const COLORS = [
  '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { categories, addCategory } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm) inputRef.current?.focus();
  }, [showForm]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory({ name: name.trim(), color, icon: 'tag' });
    setName('');
    setShowForm(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary-500" aria-hidden="true" />
          Categories
        </h3>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowForm((v) => !v)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
          aria-label="Add category"
          aria-expanded={showForm}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="space-y-3 overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoComplete="off"
                maxLength={24}
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-2 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 transition-all',
                    color === c
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                />
              ))}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-1" role="group" aria-label="Filter by category">
        <button
          onClick={() => onSelectCategory('all')}
          aria-pressed={selectedCategory === 'all'}
          className={cn(
            'w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors flex items-center gap-2',
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <span
            className="w-5 h-5 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 grid place-items-center flex-shrink-0"
            aria-hidden="true"
          >
            <Tag className="w-3 h-3 text-white" />
          </span>
          All
        </button>

        <AnimatePresence initial={false}>
          {categories.map((category) => {
            const active = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectCategory(category.id)}
                aria-pressed={active}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors flex items-center gap-2 border',
                  active
                    ? 'border-transparent'
                    : 'border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                style={
                  active
                    ? {
                        backgroundColor: `${category.color}1f`,
                        borderColor: `${category.color}66`,
                        color: category.color,
                      }
                    : undefined
                }
              >
                <span
                  className="w-5 h-5 rounded-lg grid place-items-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Tag className="w-3 h-3" style={{ color: category.color }} aria-hidden="true" />
                </span>
                <span className="truncate">{category.name}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
