import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import taskService from '../services/api/taskService';
import categoryService from '../services/api/categoryService';
import MainFeature from '../components/MainFeature';
import TaskList from '../components/TaskList';
import QuickAddForm from '../components/QuickAddForm';
import FilterSidebar from '../components/FilterSidebar';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import ApperIcon from '../components/ApperIcon';
import { format } from 'date-fns';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
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
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    // Show completed filter
    if (!filters.showCompleted && task.completed) return false;
    
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
      return false;
    }

    // Priority filter
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange === 'today') {
      const today = format(new Date(), 'yyyy-MM-dd');
      return task.dueDate === today;
    } else if (filters.dateRange === 'overdue') {
      const today = format(new Date(), 'yyyy-MM-dd');
      return task.dueDate < today && !task.completed;
    } else if (filters.dateRange === 'upcoming') {
      const today = format(new Date(), 'yyyy-MM-dd');
      return task.dueDate > today;
    }

    return true;
  });

  const completedToday = tasks.filter(task => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return task.completed && task.dueDate === today;
  }).length;

  const totalToday = tasks.filter(task => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return task.dueDate === today;
  }).length;

  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

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

  if (loading) {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        <div className="w-64 bg-surface-50 border-r border-surface-200 p-4">
          <SkeletonLoader type="sidebar" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <SkeletonLoader count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow Pro</h1>
          <div className="flex items-center space-x-2">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#5B21B6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${progressPercentage * 1.257} 125.7`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {completedToday} of {totalToday} completed today
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
              className="w-80 pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <ApperIcon name="Search" className="absolute left-3 top-2.5 w-5 h-5 text-surface-400" />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Quick Add</span>
          </motion.button>
        </div>
      </header>

      {/* Quick Add Form */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-shrink-0 bg-surface-50 border-b border-surface-200 p-6"
        >
          <QuickAddForm
            categories={categories}
            onSubmit={handleCreateTask}
            onCancel={() => setShowQuickAdd(false)}
          />
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          tasks={tasks}
        />

        {/* Task List */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {filteredTasks.length === 0 ? (
              <EmptyState
                title="No tasks found"
                description={filters.searchQuery || filters.categories.length > 0 || filters.priorities.length > 0 
                  ? "Try adjusting your filters or search query"
                  : "Add your first task to get started with TaskFlow Pro"
                }
                actionLabel="Add Task"
                onAction={() => setShowQuickAdd(true)}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                categories={categories}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;