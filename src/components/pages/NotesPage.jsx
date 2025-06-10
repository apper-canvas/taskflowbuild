import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import NoteEditor from '@/components/organisms/NoteEditor';
import NoteSidebar from '@/components/organisms/NoteSidebar';
import ExportModal from '@/components/molecules/ExportModal';
import ShareModal from '@/components/molecules/ShareModal';
import noteService from '@/services/api/noteService';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load initial data
  useEffect(() => {
    loadNotes();
    loadFolders();
    loadTags();
  }, []);

  // Load notes with filters
  useEffect(() => {
    loadNotes();
  }, [searchTerm, selectedFolder, selectedTags]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getAll(searchTerm, selectedFolder, selectedTags);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await noteService.getFolders();
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const loadTags = async () => {
    try {
      const data = await noteService.getTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await noteService.create({
        title: 'New Note',
        content: '',
        folder: selectedFolder || 'General'
      });
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
      toast.success('New note created');
    } catch (error) {
      toast.error('Failed to create note');
      console.error('Error creating note:', error);
    }
  };

  const handleSelectNote = async (noteId) => {
    try {
      const note = await noteService.getById(noteId);
      setSelectedNote(note);
    } catch (error) {
      toast.error('Failed to load note');
      console.error('Error loading note:', error);
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await noteService.delete(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Error deleting note:', error);
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const updatedNote = await noteService.togglePin(noteId);
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
      toast.success(updatedNote.isPinned ? 'Note pinned' : 'Note unpinned');
    } catch (error) {
      toast.error('Failed to toggle pin');
      console.error('Error toggling pin:', error);
    }
  };

  const handleExport = async (noteId, format) => {
    try {
      const exportData = await noteService.exportNote(noteId, format);
      
      if (format === 'markdown') {
        const blob = new Blob([exportData], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedNote.title}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'html') {
        const blob = new Blob([exportData], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedNote.title}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Note exported as ${format.toUpperCase()}`);
      setShowExportModal(false);
    } catch (error) {
      toast.error('Failed to export note');
      console.error('Error exporting note:', error);
    }
  };

  const handleShare = async (noteId, emails) => {
    try {
      const updatedNote = await noteService.shareNote(noteId, emails);
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      if (selectedNote?.id === noteId) {
        setSelectedNote(updatedNote);
      }
      toast.success(emails.length > 0 ? 'Note shared successfully' : 'Note sharing disabled');
      setShowShareModal(false);
    } catch (error) {
      toast.error('Failed to share note');
      console.error('Error sharing note:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFolder('');
    setSelectedTags([]);
  };

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Sidebar */}
      <NoteSidebar
        notes={notes}
        folders={folders}
        tags={tags}
        loading={loading}
        selectedNote={selectedNote}
        searchTerm={searchTerm}
        selectedFolder={selectedFolder}
        selectedTags={selectedTags}
        viewMode={viewMode}
        collapsed={sidebarCollapsed}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onSearchChange={setSearchTerm}
        onFolderChange={setSelectedFolder}
        onTagsChange={setSelectedTags}
        onViewModeChange={setViewMode}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onClearFilters={clearFilters}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-heading font-bold text-surface-900">
                Notes
              </h1>
              <Button
                onClick={handleCreateNote}
                className="bg-primary hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {selectedNote && (
                <>
                  <Button
                    onClick={() => setShowExportModal(true)}
                    variant="outline"
                    className="px-3 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors duration-200"
                  >
                    Export
                  </Button>
                  <Button
                    onClick={() => setShowShareModal(true)}
                    variant="outline"
                    className="px-3 py-2 border border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg transition-colors duration-200"
                  >
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={handleUpdateNote}
              folders={folders}
              tags={tags}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-surface-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-surface-500" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-surface-900 mb-2">
                  Create your first note
                </h3>
                <p className="text-surface-600 mb-4">
                  Select a note from the sidebar or create a new one to get started.
                </p>
                <Button
                  onClick={handleCreateNote}
                  className="bg-primary hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Create Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showExportModal && selectedNote && (
        <ExportModal
          note={selectedNote}
          onExport={handleExport}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showShareModal && selectedNote && (
        <ShareModal
          note={selectedNote}
          onShare={handleShare}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default NotesPage;