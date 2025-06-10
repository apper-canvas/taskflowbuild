import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';

const TaskItem = ({ task, categories = [], onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { 
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const priorityColors = {
    High: 'bg-accent text-white',
    Medium: 'bg-secondary text-white',
    Low: 'bg-surface-300 text-surface-700'
  };

  const categoryData = categories.find(cat => cat.id === task.category) || categories.find(cat => cat.name === task.category);
  
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed && !isToday(parseISO(task.dueDate));
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate));

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-sm border border-surface-200 p-4 hover:shadow-md transition-all duration-200 ${
        task.completed ? 'opacity-60' : ''
      } ${isOverdue ? 'border-l-4 border-l-error' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleComplete}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
            task.completed 
              ? 'bg-success border-success text-white' 
              : 'border-surface-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-surface-300 text-surface-700 rounded text-sm hover:bg-surface-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium break-words ${
                    task.completed ? 'line-through text-surface-500' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 break-words ${
                      task.completed ? 'line-through text-surface-400' : 'text-surface-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-surface-400 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-surface-400 hover:text-error transition-colors"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Task Metadata */}
              <div className="flex items-center space-x-3 mt-3">
                {/* Priority */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>

                {/* Category */}
                {categoryData && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name={categoryData.icon} className="w-4 h-4 text-surface-500" />
                    <span className="text-sm text-surface-600">{categoryData.name}</span>
                  </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    isOverdue ? 'text-error' : isDueToday ? 'text-accent' : 'text-surface-600'
                  }`}>
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>
                      {isToday(parseISO(task.dueDate)) 
                        ? 'Today' 
                        : format(parseISO(task.dueDate), 'MMM d')
                      }
                    </span>
                  </div>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-surface-100 text-surface-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;