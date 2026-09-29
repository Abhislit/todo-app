import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, X, Keyboard } from 'lucide-react';
import { useState } from 'react';
import { useKeyboardShortcuts, useShortcutHelp } from '../hooks/useKeyboardShortcuts';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewTask: () => void;
  onFocusSearch: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEscape: () => void;
  onDeleteCompleted: () => void;
}

export function Header({
  darkMode,
  onToggleDarkMode,
  onNewTask,
  onFocusSearch,
  searchQuery,
  onSearchChange,
  onEscape,
  onDeleteCompleted,
}: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcuts = useShortcutHelp();

  useKeyboardShortcuts({
    onNewTask,
    onToggleTheme: onToggleDarkMode,
    onFocusSearch,
    onEscape,
    onDeleteCompleted,
  });

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">TodoList Pro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stay organized, get things done</p>
            </div>
          </motion.div>

          <div className="flex-1 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <label htmlFor="search" className="sr-only">Search tasks</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search tasks... (⌘K)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  autoComplete="off"
                />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5" aria-hidden="true" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShortcuts(true)}
              className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-5 h-5" aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewTask}
              className="ml-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium text-sm hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              aria-label="New task (⌘N)"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              New Task
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="shortcuts-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Keyboard Shortcuts
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShortcuts(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>
              <div className="space-y-3">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <motion.kbd
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-200"
                        >
                          {key}
                        </motion.kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}