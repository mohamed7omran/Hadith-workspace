"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, FileText, Plus, Search, Trash2, Upload, Eye, Calendar } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addBook, removeBook } from "@/lib/features/books/booksSlice"
import type { Book } from "@/lib/features/books/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function BooksPage() {
  const dispatch = useAppDispatch()
  const { books, notes } = useAppSelector((state) => state.books)
  const { toast } = useToast()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: "",
    author: "",
    file: null as File | null,
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm((prev) => ({ ...prev, file }))
    }
  }

  const handleUploadBook = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان الكتاب واختيار ملف",
        variant: "destructive",
      })
      return
    }

    try {
      const fileType = uploadForm.file.type === "application/pdf" ? "pdf" : "text"
      let content = ""

      if (fileType === "text") {
        content = await uploadForm.file.text()
      }

      const newBook: Book = {
        id: Date.now().toString(),
        title: uploadForm.title,
        author: uploadForm.author || undefined,
        fileName: uploadForm.file.name,
        fileType,
        content: fileType === "text" ? content : undefined,
        totalPages: fileType === "pdf" ? undefined : Math.ceil(content.length / 2000), // Estimate pages for text
        uploadedAt: new Date().toISOString(),
        progress: 0,
      }

      dispatch(addBook(newBook))
      setIsUploadOpen(false)
      setUploadForm({ title: "", author: "", file: null })

      toast({
        title: "تم الرفع",
        description: "تم رفع الكتاب بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الكتاب",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBook = (bookId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الكتاب؟ سيتم حذف جميع الملاحظات المرتبطة به.")) {
      dispatch(removeBook(bookId))
      toast({
        title: "تم الحذف",
        description: "تم حذف الكتاب بنجاح",
      })
    }
  }

  const getBookNotes = (bookId: string) => {
    return notes.filter((note) => note.bookId === bookId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مكتبة الكتب</h1>
          <p className="text-muted-foreground">قراءة الكتب وإضافة التعليقات والفوائد</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" /> رفع كتاب
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>رفع كتاب جديد</DialogTitle>
              <DialogDescription>ارفع كتاباً بصيغة PDF أو نص عادي لبدء القراءة وإضافة التعليقات</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الكتاب *</Label>
                <Input
                  id="title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل عنوان الكتاب"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">المؤلف</Label>
                <Input
                  id="author"
                  value={uploadForm.author}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="أدخل اسم المؤلف (اختياري)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">الملف *</Label>
                <Input id="file" type="file" accept=".pdf,.txt" onChange={handleFileUpload} />
                <p className="text-xs text-muted-foreground">الصيغ المدعومة: PDF, TXT</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUploadBook} disabled={!uploadForm.file || !uploadForm.title}>
                <Upload className="ml-2 h-4 w-4" />
                رفع الكتاب
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في الكتب..."
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {books.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد كتب مرفوعة</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ برفع كتابك الأول لتتمكن من قراءته وإضافة التعليقات والفوائد
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="ml-2 h-4 w-4" />
              رفع كتاب
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => {
            const bookNotes = getBookNotes(book.id)
            return (
              <BookCard
                key={book.id}
                book={book}
                notesCount={bookNotes.length}
                onDelete={() => handleDeleteBook(book.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

interface BookCardProps {
  book: Book
  notesCount: number
  onDelete: () => void
}

function BookCard({ book, notesCount, onDelete }: BookCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
            {book.author && <CardDescription>{book.author}</CardDescription>}
          </div>
          <Badge variant="outline" className="shrink-0">
            {book.fileType === "pdf" ? "PDF" : "نص"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">التقدم:</span>
            <span>{book.progress || 0}%</span>
          </div>
          <Progress value={book.progress || 0} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{notesCount} ملاحظة</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(book.uploadedAt).toLocaleDateString("ar-SA")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/books/${book.id}`}>
            <Eye className="ml-1 h-4 w-4" />
            قراءة
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="ml-1 h-4 w-4" />
          حذف
        </Button>
      </CardFooter>
    </Card>
  )
}
