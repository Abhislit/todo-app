import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Trash2, Edit, Flag, Calendar, Tag, GripVertical, Check } from 'lucide-react';
import { Task, Category } from '../types';
import { getDateStatus, getPriorityStyles, cn } from '../utils/helpers';
import { useTasks } from '../hooks/TasksContext';

interface TaskProps {
  task: Task;
  categories: Category[];
}

export function TaskComponent({ task, categories }: TaskProps) {
  const { toggleComplete, updateTask, deleteTask } = useTasks();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: task.completed,
  });

  useEffect(() => {
    if (!showMenu) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showMenu]);

  const category = categories.find((c) => c.id === task.categoryId);
  const priorityStyles = getPriorityStyles(task.priority);
  const dateStatus = task.dueDate ? getDateStatus(new Date(task.dueDate)) : null;

  const cyclePriority = () => {
    const order: Task['priority'][] = ['low', 'medium', 'high'];
    updateTask(task.id, { priority: order[(order.indexOf(task.priority) + 1) % 3] });
  };

  return (
    <motion.div
      ref={setNodeRef}
      layout
      style={{ transform: CSS.Transform.toString(transform), transition }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'group relative flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700 shadow-soft',
        'hover:shadow-soft-lg transition-shadow',
        task.completed && 'opacity-60',
        isDragging && 'z-10 shadow-soft-lg ring-2 ring-primary-500/60 cursor-grabbing'
      )}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: category?.color || '#0ea5e9' }}
        aria-hidden="true"
      />

      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        onClick={() => toggleComplete(task.id)}
        className={cn(
          'mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 grid place-items-center transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          task.completed
            ? 'bg-primary-500 border-primary-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        )}
        aria-label={task.completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
        aria-pressed={task.completed}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check className="w-4 h-4" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3
            className={cn(
              'font-medium text-gray-900 dark:text-gray-100 break-words',
              task.completed && 'line-through text-gray-400 dark:text-gray-500'
            )}
          >
            {task.title}
          </h3>
          {task.priority !== 'low' && (
            <span
              className={cn(
                'flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full',
                priorityStyles.bg,
                priorityStyles.text
              )}
            >
              {task.priority}
            </span>
          )}
        </div>

        {task.description && (
          <p
            className={cn(
              'mt-1 text-sm break-words',
              task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'
            )}
          >
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {category && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border"
              style={{
                backgroundColor: `${category.color}15`,
                borderColor: `${category.color}40`,
                color: category.color,
              }}
            >
              <Tag className="w-3 h-3" aria-hidden="true" />
              {category.name}
            </span>
          )}

          {dateStatus && (
            <span
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
                'border-gray-200 dark:border-gray-700',
                dateStatus.className
              )}
            >
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {dateStatus.label}
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-0.5 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity"
        ref={menuRef}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={cyclePriority}
          className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
          aria-label={`Priority: ${task.priority}. Activate to change.`}
        >
          <Flag className="w-4 h-4" aria-hidden="true" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMenu((v) => !v)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={`More options for "${task.title}"`}
          aria-haspopup="menu"
          aria-expanded={showMenu}
        >
          <MoreVertical className="w-4 h-4" aria-hidden="true" />
        </motion.button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-4 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20"
              role="menu"
            >
              <button
                onClick={() => {
                  const next = window.prompt('Edit task title', task.title);
                  if (next && next.trim()) updateTask(task.id, { title: next.trim() });
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                role="menuitem"
              >
                <Edit className="w-4 h-4" aria-hidden="true" />
                Edit
              </button>
              <button
                onClick={() => {
                  deleteTask(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                role="menuitem"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 flex-shrink-0 p-1 text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Reorder "${task.title}"`}
      >
        <GripVertical className="w-5 h-5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
