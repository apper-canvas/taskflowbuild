import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Palette } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import categoryService from '@/services/api/categoryService';

const CategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B21B6',
    icon: 'Tag'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colorOptions = [
    '#5B21B6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444',
    '#3B82F6', '#F97316', '#84CC16', '#06B6D4', '#8B5A2B'
  ];

  const iconOptions = [
    'Tag', 'BookOpen', 'Briefcase', 'Home', 'Settings',
    'Users', 'Calendar', 'Star', 'Heart', 'Shield',
    'Target', 'Zap', 'Coffee', 'Music', 'Camera'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newCategory = await categoryService.create({
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon
      });

      if (newCategory) {
        toast.success('Category created successfully');
        setFormData({ name: '', color: '#5B21B6', icon: 'Tag' });
        setErrors({});
        onSuccess?.(newCategory);
        onClose();
      }
    } catch (error) {
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', color: '#5B21B6', icon: 'Tag' });
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-200">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                Create Category
              </h2>
              <Button
                onClick={handleClose}
                variant="ghost"
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Name */}
              <div>
                <Label htmlFor="categoryName" className="block text-sm font-medium text-surface-700 mb-2">
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  className={`w-full ${errors.name ? 'border-error focus:ring-error/20' : ''}`}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error">{errors.name}</p>
                )}
              </div>

              {/* Color Picker */}
              <div>
                <Label className="block text-sm font-medium text-surface-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Color
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? 'border-surface-400 ring-2 ring-primary/20' 
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                      style={{ backgroundColor: color }}
                      disabled={loading}
                    >
                      {formData.color === color && (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <Label className="block text-sm font-medium text-surface-700 mb-2">
                  Icon
                </Label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`p-2 rounded-lg border-2 transition-all hover:bg-surface-50 ${
                        formData.icon === icon 
                          ? 'border-primary bg-primary/5' 
                          : 'border-surface-200'
                      }`}
                      disabled={loading}
                    >
                      <ApperIcon 
                        name={icon} 
                        className={`w-5 h-5 mx-auto ${
                          formData.icon === icon ? 'text-primary' : 'text-surface-500'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-surface-50 rounded-lg">
                <Label className="block text-sm font-medium text-surface-700 mb-2">
                  Preview
                </Label>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${formData.color}20` }}
                  >
                    <ApperIcon 
                      name={formData.icon} 
                      className="w-4 h-4" 
                      style={{ color: formData.color }}
                    />
                  </div>
                  <span className="font-medium text-surface-900">
                    {formData.name || 'Category name'}
                  </span>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-surface-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !formData.name.trim()}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Create Category'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;