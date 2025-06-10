import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterSidebar = ({ categories = [], filters, onFiltersChange, tasks = [] }) => {
  const dateRangeOptions = [
    { id: 'today', label: 'Today', icon: 'Calendar' },
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

  return (
    <aside className="w-64 bg-surface-50 border-r border-surface-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Date Range Filters */}
        <div>
          <h3 className="text-sm font-semibold text-surface-900 mb-3">Views</h3>
          <div className="space-y-1">
            {dateRangeOptions.map(option => {
              const count = getTaskCount(option.id);
              const isActive = filters.dateRange === option.id;
              
              return (
                <motion.button
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
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h3 className="text-sm font-semibold text-surface-900 mb-3">Priority</h3>
          <div className="space-y-2">
            {priorityOptions.map(priority => (
              <label key={priority.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.priorities.includes(priority.id)}
                  onChange={() => handlePriorityToggle(priority.id)}
                  className="rounded border-surface-300 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className={`text-sm font-medium ${priority.color}`}>
                  {priority.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="rounded border-surface-300 text-primary focus:ring-primary focus:ring-offset-0"
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
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Show Completed Toggle */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(e) => onFiltersChange(prev => ({
                ...prev,
                showCompleted: e.target.checked
              }))}
              className="rounded border-surface-300 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-sm font-medium text-surface-700">
              Show completed tasks
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        {(filters.categories.length > 0 || filters.priorities.length > 0 || filters.searchQuery) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onFiltersChange({
              categories: [],
              priorities: [],
              dateRange: 'today',
              searchQuery: '',
              showCompleted: false
            })}
            className="w-full px-3 py-2 text-sm text-surface-600 hover:text-surface-800 transition-colors"
          >
            Clear all filters
          </motion.button>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;