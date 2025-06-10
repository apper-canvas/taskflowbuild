// Note service for handling note-related API operations
import { mockNotes } from '@/services/mockData/notes.json';

let notes = [...mockNotes];
let nextId = Math.max(...notes.map(n => n.id)) + 1;

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
        const note = notes.find(n => n.id === parseInt(id));
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
          id: nextId++,
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
        const noteIndex = notes.findIndex(n => n.id === parseInt(id));
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
        const noteIndex = notes.findIndex(n => n.id === parseInt(id));
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
        const noteIndex = notes.findIndex(n => n.id === parseInt(id));
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
        const filteredNotes = notes.filter(note => 
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve([...filteredNotes]);
      }, 100);
    });
  },

  // Get notes by folder
  getByFolder: async (folder) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredNotes = notes.filter(note => note.folder === folder);
        resolve([...filteredNotes]);
      }, 100);
    });
  },

  // Get notes by tag
  getByTag: async (tag) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredNotes = notes.filter(note => note.tags.includes(tag));
        resolve([...filteredNotes]);
      }, 100);
    });
  }
};

// Default export for backward compatibility
export default noteService;