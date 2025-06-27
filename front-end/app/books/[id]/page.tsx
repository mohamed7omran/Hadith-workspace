"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, BookOpen, Download, Plus, Trash2, Edit3 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  setCurrentBook,
  setCurrentPage,
  updateBookProgress,
  addNote,
  removeNote,
  updateNote,
} from "@/lib/features/books/booksSlice"
import type { Note } from "@/lib/features/books/types"
import { useToast } from "@/hooks/use-toast"

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { books, notes, currentBook, currentPage } = useAppSelector((state) => state.books)
  const { toast } = useToast()

  const [selectedText, setSelectedText] = useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteForm, setNoteForm] = useState({
    text: "",
    category: "general" as Note["category"],
  })

  const bookId = params.id as string
  const book = books.find((b) => b.id === bookId)
  const bookNotes = notes.filter((note) => note.bookId === bookId)

  useEffect(() => {
    if (book) {
      dispatch(setCurrentBook(book))
    } else if (books.length > 0) {
      router.push("/books")
    }
  }, [book, books, dispatch, router])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
      setIsNoteDialogOpen(true)
    }
  }

  const handleAddNote = () => {
    if (!noteForm.text.trim() || !currentBook) return

    const newNote: Note = {
      id: Date.now().toString(),
      bookId: currentBook.id,
      text: noteForm.text,
      selectedText,
      category: noteForm.category,
      page: currentPage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (editingNote) {
      dispatch(updateNote({ ...newNote, id: editingNote.id, createdAt: editingNote.createdAt }))
      toast({
        title: "تم التحديث",
        description: "تم تحديث الملاحظة بنجاح",
      })
    } else {
      dispatch(addNote(newNote))
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الملاحظة بنجاح",
      })
    }

    setIsNoteDialogOpen(false)
    setEditingNote(null)
    setNoteForm({ text: "", category: "general" })
    setSelectedText("")
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNoteForm({ text: note.text, category: note.category })
    setSelectedText(note.selectedText)
    setIsNoteDialogOpen(true)
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
      dispatch(removeNote(noteId))
      toast({
        title: "تم الحذف",
        description: "تم حذف الملاحظة بنجاح",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!book?.totalPages || newPage <= book.totalPages)) {
      dispatch(setCurrentPage(newPage))

      // Update progress
      if (book?.totalPages) {
        const progress = Math.round((newPage / book.totalPages) * 100)
        dispatch(updateBookProgress({ bookId: book.id, progress }))
      }
    }
  }

  const exportNotes = () => {
    if (!currentBook || bookNotes.length === 0) return

    const notesText = bookNotes
      .sort((a, b) => (a.page || 0) - (b.page || 0))
      .map((note) => {
        const categoryName = {
          general: "ملاحظة عامة",
          benefit: "فائدة",
          commentary: "تعليق",
        }[note.category]

        return `${categoryName} - صفحة ${note.page || "غير محدد"}
النص المحدد: "${note.selectedText}"
الملاحظة: ${note.text}
التاريخ: ${new Date(note.createdAt).toLocaleDateString("ar-SA")}
---`
      })
      .join("\n\n")

    const content = `ملاحظات كتاب: ${currentBook.title}
${currentBook.author ? `المؤلف: ${currentBook.author}` : ""}
تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")}

${notesText}`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ملاحظات-${currentBook.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">الكتاب غير موجود</h3>
          <Button onClick={() => router.push("/books")}>العودة للمكتبة</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/books")}>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة للمكتبة
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            {book.author && <p className="text-muted-foreground">{book.author}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportNotes} disabled={bookNotes.length === 0}>
            <Download className="ml-2 h-4 w-4" />
            تصدير الملاحظات
          </Button>
          <Badge variant="outline">{bookNotes.length} ملاحظة</Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>التقدم في القراءة</span>
              <span>{book.progress || 0}%</span>
            </div>
            <Progress value={book.progress || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Book Content */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                صفحة {currentPage}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {book.totalPages || "?"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={book.totalPages ? currentPage >= book.totalPages : false}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {book.fileType === "pdf" ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">عارض PDF سيتم تطويره قريباً</p>
                  <p className="text-sm text-muted-foreground">الملف: {book.fileName}</p>
                </div>
              ) : (
                <div
                  className="prose prose-lg max-w-none text-right leading-relaxed"
                  onMouseUp={handleTextSelection}
                  style={{
                    direction: "rtl",
                    fontFamily: "var(--font-cairo)",
                    lineHeight: "2",
                    fontSize: "18px",
                  }}
                >
                  {book.content ? (
                    <div className="whitespace-pre-wrap">
                      {book.content.slice((currentPage - 1) * 2000, currentPage * 2000)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">لا يوجد محتوى للعرض</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">الملاحظات</CardTitle>
              <Button size="sm" onClick={() => setIsNoteDialogOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {bookNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">لا توجد ملاحظات بعد</p>
              ) : (
                bookNotes
                  .sort((a, b) => (b.page || 0) - (a.page || 0))
                  .map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={() => handleEditNote(note)}
                      onDelete={() => handleDeleteNote(note.id)}
                    />
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingNote ? "تعديل الملاحظة" : "إضافة ملاحظة جديدة"}</DialogTitle>
            <DialogDescription>
              {selectedText && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>النص المحدد:</strong> "{selectedText}"
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">نوع الملاحظة</Label>
              <Select
                value={noteForm.category}
                onValueChange={(value: Note["category"]) => setNoteForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">ملاحظة عامة</SelectItem>
                  <SelectItem value="benefit">فائدة</SelectItem>
                  <SelectItem value="commentary">تعليق</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-text">نص الملاحظة</Label>
              <Textarea
                id="note-text"
                value={noteForm.text}
                onChange={(e) => setNoteForm((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="اكتب ملاحظتك هنا..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsNoteDialogOpen(false)
                setEditingNote(null)
                setNoteForm({ text: "", category: "general" })
                setSelectedText("")
              }}
            >
              إلغاء
            </Button>
            <Button onClick={handleAddNote} disabled={!noteForm.text.trim()}>
              {editingNote ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface NoteCardProps {
  note: Note
  onEdit: () => void
  onDelete: () => void
}

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const categoryColors = {
    general: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    benefit: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    commentary: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  }

  const categoryNames = {
    general: "ملاحظة",
    benefit: "فائدة",
    commentary: "تعليق",
  }

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Badge className={categoryColors[note.category]}>{categoryNames[note.category]}</Badge>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {note.selectedText && (
        <div className="text-xs bg-muted p-2 rounded">
          <strong>النص:</strong> "{note.selectedText}"
        </div>
      )}

      <p className="text-sm">{note.text}</p>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>صفحة {note.page || "غير محدد"}</span>
        <span>{new Date(note.createdAt).toLocaleDateString("ar-SA")}</span>
      </div>
    </div>
  )
}
