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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-surface-200 p-6 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h3" className="text-lg font-semibold">Add New Task</Heading>
          <Button
            type="button"
            onClick={onCancel}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Title */}
        <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="py-3 text-lg"
            autoFocus
        />

        {/* Description */}
        <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={2}
        />

        {/* Priority and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority */}
          <FormField label="Priority">
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </FormField>

          {/* Category */}
          <FormField label="Category">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </Select>
          </FormField>
        </div>

        {/* Due Date */}
        <FormField label="Due Date">
          <div className="flex flex-wrap gap-2">
            {quickDateOptions.map(option => (
              <Button
                key={option.label}
                type="button"
                onClick={() => setDueDate(option.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  dueDate === option.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </Button>
            ))}
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2"
            />
          </div>
        </FormField>

        {/* Tags */}
        <FormField label="Tags">
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas"
            className="px-3 py-2"
          />
        </FormField>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-4 py-2 text-surface-700 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!title.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuickAddForm;