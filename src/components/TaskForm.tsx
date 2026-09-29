import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Tag, Save } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TaskFormData, Category, Priority } from '../types';
import { getPriorityStyles, cn } from '../utils/helpers';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  categories: Category[];
  initialData?: Partial<TaskFormData>;
  editingTaskId?: string;
}

export function TaskForm({ isOpen, onClose, onSubmit, categories, initialData, editingTaskId }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: undefined,
    priority: 'medium',
    categoryId: 'personal',
    ...initialData,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        dueDate: undefined,
        priority: 'medium',
        categoryId: 'personal',
        ...initialData,
      });
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit(e);
  };

  const priorities: Priority[] = ['low', 'medium', 'high'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id="form-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {editingTaskId ? 'Edit Task' : 'New Task'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                ref={titleInputRef}
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details..."
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      {formData.dueDate ? formData.dueDate.toLocaleDateString() : 'No date'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {showDatePicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10"
                      >
                        <input
                          type="date"
                          value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value) : undefined });
                            setShowDatePicker(false);
                          }}
                          className="w-full px-3 py-2 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-gray-100"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPriorityPicker(!showPriorityPicker)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Flag className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      <span className={cn('capitalize font-medium', getPriorityStyles(formData.priority).text)}>
                        {formData.priority}
                      </span>
                    </span>
                  </button>
                  <AnimatePresence>
                    {showPriorityPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
                      >
                        {priorities.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { setFormData({ ...formData, priority: p }); setShowPriorityPicker(false); }}
                            className={cn(
                              'w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2',
                              formData.priority === p ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                              getPriorityStyles(p).text
                            )}
                          >
                            <span className={cn('w-2 h-2 rounded-full', getPriorityStyles(p).bg.replace('bg-', 'bg-'))} />
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    {categories.find(c => c.id === formData.categoryId)?.name || 'Select category'}
                  </span>
                </button>
                <AnimatePresence>
                  {showCategoryPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 max-h-60 overflow-y-auto"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => { setFormData({ ...formData, categoryId: cat.id }); setShowCategoryPicker(false); }}
                          className="w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-gray-700 dark:text-gray-200">{cat.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!formData.title.trim()}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-semibold text-white transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                formData.title.trim()
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              )}
            >
              <span className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" aria-hidden="true" />
                {editingTaskId ? 'Save Changes' : 'Add Task'}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}