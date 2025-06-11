import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Label from '@/components/atoms/Label';
import CategoryModal from '@/components/molecules/CategoryModal';

const FilterSidebar = ({ categories = [], filters, onFiltersChange, tasks = [], onCategoryRefresh }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const dateRangeOptions = [
    { id: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { id: 'overdue', label: 'Overdue', icon: 'AlertCircle' },
    { id: 'all', label: 'All Tasks', icon: 'List' }
  ];

  const priorityOptions = [
    { id: 'High', label: 'High Priority', color: 'text-accent' },
    { id: 'Medium', label: 'Medium Priority', color: 'text-secondary' },
    { id: 'Low', label: 'Low Priority', color: 'text-surface-500' }
  ];

  const handleDateRangeChange = (range) => {
    onFiltersChange(prev => ({ ...prev, dateRange: range }));
  };

  const handleCategoryToggle = (categoryId) => {
    onFiltersChange(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handlePriorityToggle = (priority) => {
    onFiltersChange(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }));
  };

  const getTaskCount = (dateRange) => {
    if (dateRange === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(task => task.dueDate === today && !task.completed).length;
    } else if (dateRange === 'overdue') {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(task => task.dueDate < today && !task.completed).length;
    } else if (dateRange === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(task => task.dueDate > today && !task.completed).length;
    }
    return tasks.filter(task => !task.completed).length;
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.priorities.length > 0 || filters.searchQuery || filters.dateRange !== 'today' || filters.showCompleted;

  return (
    <aside className="w-64 bg-surface-50 border-r border-surface-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Date Range Filters */}
        <div>
          <Heading level="h3" className="text-sm font-semibold mb-3">Views</Heading>
          <div className="space-y-1">
            {dateRangeOptions.map(option => {
              const count = getTaskCount(option.id);
              const isActive = filters.dateRange === option.id;
              
              return (
                <Button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDateRangeChange(option.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-surface-700 hover:bg-surface-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon 
                      name={option.icon} 
                      className={`w-4 h-4 ${isActive ? 'text-white' : 'text-surface-500'}`} 
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-surface-200 text-surface-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <Heading level="h3" className="text-sm font-semibold mb-3">Priority</Heading>
          <div className="space-y-2">
            {priorityOptions.map(priority => (
              <Label key={priority.id} className="flex items-center space-x-3 cursor-pointer">
                <Checkbox
                  checked={filters.priorities.includes(priority.id)}
                  onChange={() => handlePriorityToggle(priority.id)}
                />
                <span className={`text-sm font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </Label>
            ))}
          </div>
        </div>
{/* Category Filters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Heading level="h3" className="text-sm font-semibold">Categories</Heading>
            <Heading level="h3" className="text-sm font-semibold">Categories</Heading>
            <Button
              onClick={() => setShowCategoryModal(true)}
              variant="ghost"
              className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
              title="Add Category"
            >
              <Plus className="w-4 h-4 text-surface-500" />
            </Button>
          </div>
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map(category => (
                <Label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                  <Checkbox
                    checked={filters.categories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                  />
                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={category.icon} 
                      className="w-4 h-4 text-surface-500" 
                    />
                    <span className="text-sm font-medium text-surface-700">
                      {category.name}
                    </span>
                  </div>
                </Label>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-surface-500 mb-2">No categories yet</p>
              <Button
                onClick={() => setShowCategoryModal(true)}
                variant="outline"
                className="text-xs px-3 py-1 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors"
              >
                Create First Category
              </Button>
            </div>
          )}
        </div>
        {/* Show Completed Toggle */}
        <div>
          <Label className="flex items-center space-x-3 cursor-pointer">
            <Checkbox
              checked={filters.showCompleted}
              onChange={(e) => onFiltersChange(prev => ({
                ...prev,
                showCompleted: e.target.checked
              }))}
            />
            <span className="text-sm font-medium text-surface-700">
              Show completed tasks
            </span>
          </Label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFiltersChange({
              categories: [],
              priorities: [],
              dateRange: 'today',
              searchQuery: '',
              showCompleted: false
            })}
            className="w-full px-3 py-2 text-sm text-surface-600 hover:text-surface-800 transition-colors bg-transparent border-none"
>
            Clear all filters
          </Button>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={(newCategory) => {
          onCategoryRefresh?.();
          setShowCategoryModal(false);
        }}
      />
</aside>
  );
};

export default FilterSidebar;