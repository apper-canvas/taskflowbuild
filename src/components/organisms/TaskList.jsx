import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/organisms/TaskItem';

const TaskList = ({ tasks, categories = [], onUpdateTask, onDeleteTask }) => {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: index * 0.1 }}
          >
            <TaskItem
              task={task}
              categories={categories}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;