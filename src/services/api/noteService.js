// Note service for handling note-related API operations
import mockNotesData from '@/services/mockData/notes.json';

// Initialize notes with defensive checks
let notes = Array.isArray(mockNotesData) ? [...mockNotesData] : [];

// Handle string IDs from mock data properly
let nextId = notes.length > 0 
  ? Math.max(...notes.map(n => parseInt(n.id) || 0)) + 1 
  : 1;
export const noteService = {
  // Get all notes
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...notes]), 100);
    });
  },

  // Get note by ID
getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Handle both string and numeric IDs consistently
        const note = notes.find(n => n.id === String(id));
        if (note) {
          resolve({ ...note });
        } else {
          reject(new Error('Note not found'));
        }
      }, 100);
    });
  },

  // Create new note
create: async (noteData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNote = {
          id: String(nextId++), // Ensure string ID consistency
          ...noteData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPinned: false
        };
        notes.unshift(newNote);
        resolve({ ...newNote });
      }, 100);
    });
  },

  // Update existing note
update: async (id, updates) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const noteIndex = notes.findIndex(n => n.id === String(id));
        if (noteIndex === -1) {
          reject(new Error('Note not found'));
          return;
        }

        notes[noteIndex] = {
          ...notes[noteIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        resolve({ ...notes[noteIndex] });
      }, 100);
    });
  },

  // Delete note
delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const noteIndex = notes.findIndex(n => n.id === String(id));
        if (noteIndex === -1) {
          reject(new Error('Note not found'));
          return;
        }

        const deletedNote = notes.splice(noteIndex, 1)[0];
        resolve({ ...deletedNote });
      }, 100);
    });
  },

  // Toggle pin status
togglePin: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const noteIndex = notes.findIndex(n => n.id === String(id));
        if (noteIndex === -1) {
          reject(new Error('Note not found'));
          return;
        }

        notes[noteIndex] = {
          ...notes[noteIndex],
          isPinned: !notes[noteIndex].isPinned,
          updatedAt: new Date().toISOString()
        };

        resolve({ ...notes[noteIndex] });
      }, 100);
    });
  },

  // Search notes
search: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || typeof query !== 'string') {
          resolve([...notes]);
          return;
        }
        
        const filteredNotes = notes.filter(note => {
          const title = note.title?.toLowerCase() || '';
          const content = note.content?.toLowerCase() || '';
          const tags = Array.isArray(note.tags) ? note.tags : [];
          const queryLower = query.toLowerCase();
          
          return title.includes(queryLower) ||
                 content.includes(queryLower) ||
                 tags.some(tag => tag?.toLowerCase().includes(queryLower));
        });
        resolve([...filteredNotes]);
      }, 100);
    });
  },

  // Get notes by folder
getByFolder: async (folder) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!folder) {
          resolve([...notes]);
          return;
        }
        const filteredNotes = notes.filter(note => note.folder === folder);
        resolve([...filteredNotes]);
      }, 100);
    });
  },

  // Get notes by tag
  getByTag: async (tag) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!tag) {
          resolve([...notes]);
          return;
        }
        const filteredNotes = notes.filter(note => 
          Array.isArray(note.tags) && note.tags.includes(tag)
        );
        resolve([...filteredNotes]);
      }, 100);
    });
  }
};

// Default export for backward compatibility
export default noteService;