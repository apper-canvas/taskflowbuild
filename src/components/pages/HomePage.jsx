import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

import AppHeader from '@/components/organisms/AppHeader';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import QuickAddForm from '@/components/organisms/QuickAddForm';
import TaskList from '@/components/organisms/TaskList';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';

const HomePage = () => {
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

  useEffect(() => {
    loadData();
  }, []);

  const handleCategoryRefresh = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      toast.error('Failed to refresh categories');
    }
  };

  const enhancedTasks = tasks.map(task => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const isOverdue = task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') < today && !task.completed;
    return { ...task, isOverdue };
  });


  const filteredTasks = enhancedTasks.filter(task => {
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
    const taskDueDate = task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : null;
    const today = format(new Date(), 'yyyy-MM-dd');

    if (filters.dateRange === 'today') {
      return taskDueDate === today;
    } else if (filters.dateRange === 'overdue') {
      return taskDueDate && taskDueDate < today && !task.completed;
    } else if (filters.dateRange === 'upcoming') {
      return taskDueDate && taskDueDate > today;
    }

    return true; // For 'all' tasks
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
      <AppHeader
        completedToday={completedToday}
        totalToday={totalToday}
        progressPercentage={progressPercentage}
        filters={filters}
        onFiltersChange={setFilters}
        onQuickAddToggle={() => setShowQuickAdd(!showQuickAdd)}
      />

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
          onCategoryRefresh={handleCategoryRefresh}
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

export default HomePage;