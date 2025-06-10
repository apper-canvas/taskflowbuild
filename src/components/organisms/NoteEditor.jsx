import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import debounce from 'lodash.debounce';
import { Save, Pin, PinOff, Calendar, Tag as TagIcon, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TagInput from '@/components/molecules/TagInput';
import noteService from '@/services/api/noteService';

const NoteEditor = ({ note, onUpdate, folders, tags }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedFolder, setSelectedFolder] = useState(note.folder);
  const [selectedTags, setSelectedTags] = useState(note.tags);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date(note.updatedAt));
  const quillRef = useRef(null);

  // Auto-save functionality
  const debouncedSave = useRef(
    debounce(async (noteId, updates) => {
      try {
        setSaving(true);
        const updatedNote = await noteService.update(noteId, updates);
        onUpdate(updatedNote);
        setLastSaved(new Date());
      } catch (error) {
        toast.error('Failed to auto-save note');
        console.error('Auto-save error:', error);
      } finally {
        setSaving(false);
      }
    }, 1000)
  ).current;

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedFolder(note.folder);
    setSelectedTags(note.tags);
    setLastSaved(new Date(note.updatedAt));
  }, [note]);

  // Auto-save when content changes
  useEffect(() => {
    if (note.id && (title !== note.title || content !== note.content || 
        selectedFolder !== note.folder || JSON.stringify(selectedTags) !== JSON.stringify(note.tags))) {
      debouncedSave(note.id, {
        title,
        content,
        folder: selectedFolder,
        tags: selectedTags
      });
    }
  }, [title, content, selectedFolder, selectedTags, note.id, note.title, note.content, note.folder, note.tags, debouncedSave]);

  const handleManualSave = async () => {
    try {
      setSaving(true);
      const updatedNote = await noteService.update(note.id, {
        title,
        content,
        folder: selectedFolder,
        tags: selectedTags
      });
      onUpdate(updatedNote);
      setLastSaved(new Date());
      toast.success('Note saved');
    } catch (error) {
      toast.error('Failed to save note');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      const updatedNote = await noteService.togglePin(note.id);
      onUpdate(updatedNote);
      toast.success(updatedNote.isPinned ? 'Note pinned' : 'Note unpinned');
    } catch (error) {
      toast.error('Failed to toggle pin');
      console.error('Pin toggle error:', error);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'color', 'background', 'align', 'link'
  ];

  const formatLastSaved = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const folderOptions = [
    { value: '', label: 'Select folder...' },
    ...folders.map(folder => ({ value: folder, label: folder })),
    { value: 'new', label: '+ Create new folder' }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Editor Header */}
      <div className="border-b border-surface-200 p-4 space-y-4">
        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-heading font-semibold border-none shadow-none px-0 py-2 focus:ring-0 focus:border-none bg-transparent"
          />
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleTogglePin}
              variant="ghost"
              className={`p-2 rounded-lg transition-colors duration-200 ${
                note.isPinned 
                  ? 'text-accent bg-accent/10 hover:bg-accent/20' 
                  : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
              }`}
            >
              {note.isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={handleManualSave}
              disabled={saving}
              className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-surface-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Last saved {formatLastSaved(lastSaved)}</span>
            </div>
            {saving && (
              <div className="flex items-center space-x-1 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Auto-saving...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs">
            <span>{content.replace(/<[^>]*>/g, '').length} characters</span>
          </div>
        </div>

        {/* Organization */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-surface-500" />
            <Select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              options={folderOptions}
              className="min-w-[150px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <TagIcon className="w-4 h-4 text-surface-500" />
            <TagInput
              tags={selectedTags}
              availableTags={tags}
              onChange={setSelectedTags}
              placeholder="Add tags..."
            />
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="flex-1 p-4">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
          theme="snow"
          placeholder="Start writing your note..."
          className="h-full"
          style={{
            height: 'calc(100% - 42px)', // Account for toolbar height
            display: 'flex',
            flexDirection: 'column'
          }}
        />
      </div>
    </div>
  );
};

export default NoteEditor;