import { create } from 'zustand'

export interface Note {
  id: string
  content: string
  createdAt: number
}

interface NotesState {
  notes: Note[]
  addNote: (content: string) => void
  deleteNote: (id: string) => void
  updateNote: (id: string, content: string) => void
  load: () => void
}

function loadSaved(): Note[] {
  try {
    const raw = localStorage.getItem('study-notes')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function save(notes: Note[]) {
  localStorage.setItem('study-notes', JSON.stringify(notes))
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: loadSaved(),

  addNote: (content) => {
    const note: Note = {
      id: `note-${Date.now()}`,
      content,
      createdAt: Date.now(),
    }
    const notes = [note, ...get().notes]
    save(notes)
    set({ notes })
  },

  deleteNote: (id) => {
    const notes = get().notes.filter(n => n.id !== id)
    save(notes)
    set({ notes })
  },

  updateNote: (id, content) => {
    const notes = get().notes.map(n => n.id === id ? { ...n, content } : n)
    save(notes)
    set({ notes })
  },

  load: () => set({ notes: loadSaved() }),
}))
