import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import taskService from '../services/api/taskService';
import TaskList from './TaskList';
import QuickAddForm from './QuickAddForm';
import FilterSidebar from './FilterSidebar';
import EmptyState from './EmptyState';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';
import ApperIcon from './ApperIcon';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    priorities: [],
    dateRange: 'today',
    searchQuery: '',
    showCompleted: false
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await taskService.getAll();
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowQuickAdd(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? 'Task completed!' : 'Task reopened');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (!filters.showCompleted && task.completed) return false;
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
      return false;
    }

    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }

    return true;
  });

  if (loading) {
    return <SkeletonLoader count={3} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Add Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Your Tasks</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Task</span>
        </motion.button>
      </div>

      {/* Quick Add Form */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <QuickAddForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowQuickAdd(false)}
          />
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <ApperIcon name="Search" className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Add your first task to get started"
          actionLabel="Add Task"
          onAction={() => setShowQuickAdd(true)}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default MainFeature;