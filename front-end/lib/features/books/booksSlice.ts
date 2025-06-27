import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Book, Note, BooksState } from "./types"

// Load initial state from localStorage
const loadBooksFromLocalStorage = (): Book[] => {
  if (typeof window === "undefined") return []
  try {
    const serializedState = localStorage.getItem("books")
    if (serializedState === null) return []
    return JSON.parse(serializedState)
  } catch (err) {
    return []
  }
}

const loadNotesFromLocalStorage = (): Note[] => {
  if (typeof window === "undefined") return []
  try {
    const serializedState = localStorage.getItem("book-notes")
    if (serializedState === null) return []
    return JSON.parse(serializedState)
  } catch (err) {
    return []
  }
}

// Save to localStorage
const saveBooksToLocalStorage = (books: Book[]) => {
  if (typeof window === "undefined") return
  try {
    const serializedState = JSON.stringify(books)
    localStorage.setItem("books", serializedState)
  } catch (err) {
    console.error("Could not save books to localStorage:", err)
  }
}

const saveNotesToLocalStorage = (notes: Note[]) => {
  if (typeof window === "undefined") return
  try {
    const serializedState = JSON.stringify(notes)
    localStorage.setItem("book-notes", serializedState)
  } catch (err) {
    console.error("Could not save notes to localStorage:", err)
  }
}

const initialState: BooksState = {
  books: loadBooksFromLocalStorage(),
  notes: loadNotesFromLocalStorage(),
  currentBook: null,
  currentPage: 1,
  loading: false,
  error: null,
}

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.unshift(action.payload)
      saveBooksToLocalStorage(state.books)
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((book) => book.id !== action.payload)
      state.notes = state.notes.filter((note) => note.bookId !== action.payload)
      saveBooksToLocalStorage(state.books)
      saveNotesToLocalStorage(state.notes)
    },
    setCurrentBook: (state, action: PayloadAction<Book>) => {
      state.currentBook = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    updateBookProgress: (state, action: PayloadAction<{ bookId: string; progress: number }>) => {
      const book = state.books.find((b) => b.id === action.payload.bookId)
      if (book) {
        book.progress = action.payload.progress
        saveBooksToLocalStorage(state.books)
      }
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload)
      saveNotesToLocalStorage(state.notes)
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id)
      if (index !== -1) {
        state.notes[index] = action.payload
        saveNotesToLocalStorage(state.notes)
      }
    },
    removeNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload)
      saveNotesToLocalStorage(state.notes)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  addBook,
  removeBook,
  setCurrentBook,
  setCurrentPage,
  updateBookProgress,
  addNote,
  updateNote,
  removeNote,
  setLoading,
  setError,
} = booksSlice.actions

export default booksSlice.reducer
