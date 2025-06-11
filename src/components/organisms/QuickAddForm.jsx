import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import FormField from '@/components/molecules/FormField';

const QuickAddForm = ({ categories = [], onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category || 'General',
      due_date: dueDate,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      completed: false
    };

    onSubmit(taskData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setTags('');
  };

  const quickDateOptions = [
    { label: 'Today', value: format(new Date(), 'yyyy-MM-dd') },
    { label: 'Tomorrow', value: format(addDays(new Date(), 1), 'yyyy-MM-dd') },
    { label: 'This Week', value: format(addDays(new Date(), 7), 'yyyy-MM-dd') }
  ];

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-xl border border-surface-200 shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-100">
              <Heading level="h3" className="text-xl font-semibold text-surface-900">Add New Task</Heading>
              <Button
                type="button"
                onClick={onCancel}
                className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="py-4 text-lg font-medium border-2 focus:border-primary focus:ring-4 focus:ring-primary/10"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                rows={3}
                className="border-2 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Priority */}
              <FormField label="Priority" className="space-y-2">
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border-2 focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormField>

              {/* Category */}
              <FormField label="Category" className="space-y-2">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-2 focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            {/* Due Date */}
            <FormField label="Due Date" className="space-y-3">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {quickDateOptions.map(option => (
                    <Button
                      key={option.label}
                      type="button"
                      onClick={() => setDueDate(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        dueDate === option.value
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-surface-50 text-surface-700 hover:bg-surface-100 border border-surface-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-2 focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </FormField>

            {/* Tags */}
            <FormField label="Tags" className="space-y-2">
              <Input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                className="border-2 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </FormField>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-surface-100">
              <Button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-6 py-3 text-surface-700 bg-surface-50 border border-surface-200 rounded-lg hover:bg-surface-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-surface-300 focus:ring-offset-2 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!title.trim()}
                className="px-8 py-3 min-w-[140px] bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:transform-none shadow-md hover:shadow-lg active:shadow-md font-medium"
              >
                Add Task
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickAddForm;