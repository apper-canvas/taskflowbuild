import { Pin, Share, Trash2, Calendar, Tag, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const NoteCard = ({ 
  note, 
  isSelected, 
  viewMode, 
  collapsed, 
  onClick, 
  onTogglePin, 
  onDelete 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const getPreview = (content) => {
    const text = stripHtml(content);
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  if (collapsed) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          isSelected 
            ? 'bg-primary text-white' 
            : 'hover:bg-surface-100'
        }`}
        onClick={onClick}
      >
        <div className="w-8 h-8 bg-surface-200 rounded-md flex items-center justify-center">
          <span className="text-xs font-medium">
            {note.title.charAt(0).toUpperCase()}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected 
          ? 'bg-primary/5 border-primary shadow-md' 
          : 'bg-white border-surface-200 hover:border-surface-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium truncate ${
            isSelected ? 'text-primary' : 'text-surface-900'
          }`}>
            {note.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`flex items-center space-x-1 text-xs ${
              isSelected ? 'text-primary/70' : 'text-surface-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(note.updatedAt)}</span>
            </div>
            {note.isPinned && (
              <Pin className={`w-3 h-3 ${isSelected ? 'text-primary' : 'text-accent'}`} />
            )}
            {note.isShared && (
              <Share className={`w-3 h-3 ${isSelected ? 'text-primary/70' : 'text-surface-400'}`} />
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            variant="ghost"
            className={`p-1 rounded transition-colors duration-200 ${
              note.isPinned 
                ? 'text-accent hover:bg-accent/10' 
                : 'text-surface-400 hover:text-surface-600 hover:bg-surface-100'
            }`}
          >
            <Pin className="w-3 h-3" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            variant="ghost"
            className="p-1 rounded text-surface-400 hover:text-error hover:bg-error/10 transition-colors duration-200"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content Preview */}
      {viewMode === 'list' && (
        <p className={`text-sm mb-3 line-clamp-2 ${
          isSelected ? 'text-primary/80' : 'text-surface-600'
        }`}>
          {getPreview(note.content)}
        </p>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          {note.folder && (
            <div className={`flex items-center space-x-1 ${
              isSelected ? 'text-primary/70' : 'text-surface-500'
            }`}>
              <Folder className="w-3 h-3" />
              <span>{note.folder}</span>
            </div>
          )}
          {note.tags.length > 0 && (
            <div className={`flex items-center space-x-1 ${
              isSelected ? 'text-primary/70' : 'text-surface-500'
            }`}>
              <Tag className="w-3 h-3" />
              <span>{note.tags.slice(0, 2).join(', ')}</span>
              {note.tags.length > 2 && <span>+{note.tags.length - 2}</span>}
            </div>
          )}
        </div>
        
        <div className={`text-xs ${
          isSelected ? 'text-primary/70' : 'text-surface-400'
        }`}>
          {stripHtml(note.content).length} chars
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;