import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const TagInput = ({ tags = [], availableTags = [], onChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = availableTags.filter(tag => 
    !tags.includes(tag) && 
    tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
    }
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionClick = (tag) => {
    addTag(tag);
  };

  return (
    <div className="relative flex-1">
      <div className="flex flex-wrap items-center gap-1 p-2 border border-surface-300 rounded-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary min-h-[40px]">
        {/* Existing Tags */}
        <AnimatePresence>
          {tags.map(tag => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
            >
              <span>#{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] border-none outline-none bg-transparent text-sm placeholder-surface-400"
        />
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-surface-200 rounded-lg shadow-lg max-h-40 overflow-y-auto"
          >
            {filteredSuggestions.map(tag => (
              <button
                key={tag}
                onClick={() => handleSuggestionClick(tag)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-50 flex items-center space-x-2 transition-colors duration-200"
              >
                <span className="text-surface-600">#{tag}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Suggestions */}
      {!showSuggestions && availableTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {availableTags.filter(tag => !tags.includes(tag)).slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="text-xs px-2 py-1 bg-surface-100 text-surface-600 rounded-md hover:bg-surface-200 transition-colors duration-200 flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>#{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;