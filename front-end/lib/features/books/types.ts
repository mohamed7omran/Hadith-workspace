export interface Book {
  id: string
  title: string
  author?: string
  fileName: string
  fileType: "pdf" | "text"
  content?: string
  totalPages?: number
  uploadedAt: string
  progress: number
}

export interface Note {
  id: string
  bookId: string
  text: string
  selectedText: string
  category: "general" | "benefit" | "commentary"
  page?: number
  createdAt: string
  updatedAt: string
}

export interface BooksState {
  books: Book[]
  notes: Note[]
  currentBook: Book | null
  currentPage: number
  loading: boolean
  error: string | null
}
