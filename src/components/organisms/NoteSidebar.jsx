import { useState } from 'react';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, X, Pin, Share, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import NoteCard from '@/components/molecules/NoteCard';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';

const NoteSidebar = ({
  notes,
  folders,
  tags,
  loading,
  selectedNote,
  searchTerm,
  selectedFolder,
  selectedTags,
  viewMode,
  collapsed,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
  onSearchChange,
  onFolderChange,
  onTagsChange,
  onViewModeChange,
  onToggleCollapse,
  onClearFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const folderOptions = [
    { value: '', label: 'All folders' },
    ...folders.map(folder => ({ value: folder, label: folder }))
  ];

  const tagOptions = [
    { value: '', label: 'All tags' },
    ...tags.map(tag => ({ value: tag, label: tag }))
  ];

  const hasActiveFilters = selectedFolder || selectedTags.length > 0;

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 60 : 400 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-surface-200 flex flex-col relative"
    >
      {/* Header */}
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <h2 className="text-lg font-heading font-semibold text-surface-900">
              Notes
            </h2>
          )}
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {!collapsed && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 w-full border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Filter Toggle and View Mode */}
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className={`px-3 py-2 border border-surface-300 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  hasActiveFilters ? 'bg-primary/10 border-primary text-primary' : 'text-surface-700 hover:bg-surface-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                    {(selectedFolder ? 1 : 0) + selectedTags.length}
                  </span>
                )}
              </Button>

              <div className="flex items-center border border-surface-300 rounded-lg overflow-hidden">
                <Button
                  onClick={() => onViewModeChange('list')}
                  variant="ghost"
                  className={`p-2 rounded-none ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onViewModeChange('grid')}
                  variant="ghost"
                  className={`p-2 rounded-none ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 space-y-3 overflow-hidden"
                >
                  {/* Folder Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Folder
                    </label>
                    <Select
                      value={selectedFolder}
                      onChange={(e) => onFolderChange(e.target.value)}
                      options={folderOptions}
                      className="w-full"
                    />
                  </div>

                  {/* Tag Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Tags
                    </label>
                    <div className="space-y-2">
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {selectedTags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                            >
                              <span>#{tag}</span>
                              <button
                                onClick={() => removeTag(tag)}
                                className="hover:bg-primary/20 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {tags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagSelect(tag)}
                            className="text-xs px-2 py-1 bg-surface-100 text-surface-700 rounded-md hover:bg-surface-200 transition-colors duration-200"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      onClick={onClearFilters}
                      variant="outline"
                      className="w-full px-3 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors duration-200"
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} className="h-24" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No notes found"
              description={
                hasActiveFilters || searchTerm
                  ? "Try adjusting your search or filters"
                  : "Create your first note to get started"
              }
              size="sm"
            />
          </div>
        ) : (
          <div className={`p-4 space-y-2 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : ''}`}>
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={selectedNote?.id === note.id}
                viewMode={viewMode}
                collapsed={collapsed}
                onClick={() => onSelectNote(note.id)}
                onTogglePin={() => onTogglePin(note.id)}
                onDelete={() => onDeleteNote(note.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {!collapsed && notes.length > 0 && (
        <div className="p-4 border-t border-surface-200 text-center">
          <span className="text-sm text-surface-600">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
            {hasActiveFilters && (
              <span className="text-primary"> (filtered)</span>
            )}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default NoteSidebar;