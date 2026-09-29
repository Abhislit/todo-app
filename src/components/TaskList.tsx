import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Filter } from 'lucide-react';
import { TaskComponent } from './Task';
import { useTasks } from '../hooks/TasksContext';

interface TaskListProps {
  filter: 'all' | 'active' | 'completed';
  categoryFilter: string | 'all';
  searchQuery: string;
}

export function TaskList({ filter, categoryFilter, searchQuery }: TaskListProps) {
  const { tasks, categories, reorderTasks } = useTasks();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const query = searchQuery.trim().toLowerCase();

  const visibleTasks = tasks
    .filter((t) => (filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : true))
    .filter((t) => (categoryFilter === 'all' ? true : t.categoryId === categoryFilter))
    .filter((t) =>
      query === ''
        ? true
        : t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
    )
    .sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) reorderTasks(String(active.id), String(over.id));
  }

  if (visibleTasks.length === 0) {
    const title = query
      ? 'No matching tasks'
      : filter === 'completed'
        ? 'No completed tasks'
        : 'No tasks yet';
    const subtitle = query
      ? 'Try a different search term'
      : filter === 'completed'
        ? 'Finish a task and it will show up here'
        : 'Add your first task to get started';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 grid place-items-center mb-4"
        >
          <Filter className="w-8 h-8 text-primary-500 dark:text-primary-400" aria-hidden="true" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
      </motion.div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(String(active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={visibleTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-3" role="list" aria-label={`${filter} tasks`}>
          <AnimatePresence initial={false}>
            {visibleTasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                <TaskComponent task={task} categories={categories} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </SortableContext>
      <span className="sr-only" aria-live="polite">
        {activeId ? 'Dragging task' : ''}
      </span>
    </DndContext>
  );
}
