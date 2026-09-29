import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';
import { cn } from '../utils/helpers';

interface StatsProps {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

const statCards = [
  { key: 'total', label: 'Total', icon: Target, color: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
  { key: 'completed', label: 'Done', icon: CheckCircle, color: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'from-yellow-500 to-yellow-600', bg: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30' },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'from-red-500 to-red-600', bg: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30' },
] as const;

export function Stats({ total, completed, pending, overdue }: StatsProps) {
  const stats = { total, completed, pending, overdue };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
      role="region"
      aria-label="Task statistics"
    >
      {statCards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
          className={cn(
            'relative p-4 rounded-2xl overflow-hidden',
            'bg-gradient-to-br',
            card.bg,
            'border border-gray-200/50 dark:border-gray-700/50'
          )}
        >
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <motion.span
                key={stats[card.key as keyof typeof stats]}
                className="text-3xl font-bold text-gray-900 dark:text-gray-100"
              >
                {stats[card.key as keyof typeof stats]}
              </motion.span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={cn('w-12 h-12 rounded-xl flex items-center justify-center', 'bg-gradient-to-br', card.color)}
            >
              <card.icon className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" aria-hidden="true" />
        </motion.div>
      ))}
    </motion.div>
  );
}