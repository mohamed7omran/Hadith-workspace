"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus, Search, Eye, Edit, Trash2, Link2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { updateHadith, deleteHadith } from "@/lib/features/hadiths/hadithsSlice"
import type { Hadith, Narrator } from "@/lib/features/hadiths/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function IsnadsPage() {
  const { hadiths } = useAppSelector((state) => state.hadiths)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [selectedIsnad, setSelectedIsnad] = useState<Hadith | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingIsnad, setEditingIsnad] = useState<Hadith | null>(null)
  const [editForm, setEditForm] = useState({
    narrators: [] as Narrator[],
    grade: "صحيح" as "صحيح" | "حسن" | "ضعيف" | "موضوع",
    notes: "",
  })

  // Get all hadiths that have isnads
  const hadithsWithIsnads = hadiths.filter((hadith) => hadith.isnad.narrators.length > 0)

  // Filter isnads based on search and grade
  const filteredIsnads = hadithsWithIsnads.filter((hadith) => {
    const matchesSearch =
      hadith.arabicText.includes(searchTerm) ||
      hadith.narrator.includes(searchTerm) ||
      hadith.isnad.narrators.some((narrator) => narrator.name.includes(searchTerm))

    const matchesGrade = gradeFilter === "all" || hadith.isnad.grade === gradeFilter
    return matchesSearch && matchesGrade
  })

  const handleViewDetails = (hadith: Hadith) => {
    setSelectedIsnad(hadith)
    setIsDetailDialogOpen(true)
  }

  const handleEditIsnad = (hadith: Hadith) => {
    setEditingIsnad(hadith)
    setEditForm({
      narrators: [...hadith.isnad.narrators],
      grade: hadith.isnad.grade,
      notes: hadith.isnad.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingIsnad) return

    const updatedHadith: Hadith = {
      ...editingIsnad,
      isnad: {
        ...editingIsnad.isnad,
        narrators: editForm.narrators,
        grade: editForm.grade,
        notes: editForm.notes,
      },
      updatedAt: new Date().toISOString(),
    }

    dispatch(updateHadith(updatedHadith))
    setIsEditDialogOpen(false)
    setEditingIsnad(null)

    toast({
      title: "تم التحديث",
      description: "تم تحديث الإسناد بنجاح",
    })
  }

  const handleDeleteIsnad = (hadithId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإسناد؟ سيتم حذف الحديث كاملاً.")) {
      dispatch(deleteHadith(hadithId))
      toast({
        title: "تم الحذف",
        description: "تم حذف الإسناد والحديث بنجاح",
      })
    }
  }

  const addNarrator = () => {
    const newNarrator: Narrator = {
      id: Date.now().toString(),
      name: "",
      fullName: "",
      reliability: "",
    }
    setEditForm((prev) => ({
      ...prev,
      narrators: [...prev.narrators, newNarrator],
    }))
  }

  const updateNarrator = (id: string, field: keyof Narrator, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      narrators: prev.narrators.map((narrator) => (narrator.id === id ? { ...narrator, [field]: value } : narrator)),
    }))
  }

  const removeNarrator = (id: string) => {
    if (editForm.narrators.length > 1) {
      setEditForm((prev) => ({
        ...prev,
        narrators: prev.narrators.filter((narrator) => narrator.id !== id),
      }))
    }
  }

  const exportIsnad = (hadith: Hadith) => {
    const content = `إسناد حديث: ${hadith.narrator}

نص الحديث:
${hadith.arabicText}

سلسلة الإسناد:
${hadith.isnad.narrators
  .map(
    (narrator, index) =>
      `${index + 1}. ${narrator.name}${narrator.fullName ? ` (${narrator.fullName})` : ""}${narrator.reliability ? ` - ${narrator.reliability}` : ""}`,
  )
  .join("\n")}

درجة الإسناد: ${hadith.isnad.grade}

${hadith.isnad.notes ? `ملاحظات:\n${hadith.isnad.notes}` : ""}

تاريخ التصدير: ${new Date().toLocaleDateString("ar-SA")}
`

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `إسناد-${hadith.narrator.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "صحيح":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "حسن":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ضعيف":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "موضوع":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الأسانيد</h1>
          <p className="text-muted-foreground">استعراض وتحليل سلاسل الإسناد ({filteredIsnads.length} إسناد)</p>
        </div>
        <Button asChild>
          <Link href="/analysis">
            <Plus className="ml-2 h-4 w-4" /> إضافة حديث بإسناد
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={gradeFilter} onValueChange={setGradeFilter} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="صحيح">صحيح</TabsTrigger>
            <TabsTrigger value="حسن">حسن</TabsTrigger>
            <TabsTrigger value="ضعيف">ضعيف</TabsTrigger>
            <TabsTrigger value="موضوع">موضوع</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في الأسانيد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {filteredIsnads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أسانيد</h3>
            <p className="text-muted-foreground text-center mb-4">
              {hadithsWithIsnads.length === 0
                ? "لم يتم إضافة أي أحاديث بأسانيد بعد. ابدأ بإضافة حديث من صفحة التخريج والتحليل."
                : "لا توجد أسانيد تطابق معايير البحث المحددة."}
            </p>
            <Button asChild>
              <Link href="/analysis">
                <Plus className="ml-2 h-4 w-4" />
                إضافة حديث بإسناد
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredIsnads.map((hadith) => (
            <IsnadCard
              key={hadith.id}
              hadith={hadith}
              onViewDetails={() => handleViewDetails(hadith)}
              onEdit={() => handleEditIsnad(hadith)}
              onDelete={() => handleDeleteIsnad(hadith.id)}
              onExport={() => exportIsnad(hadith)}
              getGradeColor={getGradeColor}
            />
          ))}
        </div>
      )}

      {filteredIsnads.length > 0 && filteredIsnads.length < hadithsWithIsnads.length && (
        <div className="text-center text-sm text-muted-foreground">
          عرض {filteredIsnads.length} من أصل {hadithsWithIsnads.length} إسناد
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              تفاصيل الإسناد
            </DialogTitle>
            <DialogDescription>
              {selectedIsnad && (
                <div className="mt-2">
                  <strong>الحديث:</strong> {selectedIsnad.arabicText.substring(0, 100)}...
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedIsnad && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">نص الحديث:</h4>
                <p className="text-sm leading-relaxed">{selectedIsnad.arabicText}</p>
              </div>

              <div>
                <h4 className="font-medium mb-3">سلسلة الإسناد:</h4>
                <div className="flex flex-col items-center space-y-3">
                  {selectedIsnad.isnad.narrators.map((narrator, index) => (
                    <div key={narrator.id} className="flex flex-col items-center w-full">
                      <Card className="w-full max-w-md">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold text-lg mb-1">{narrator.name}</h3>
                          {narrator.fullName && (
                            <p className="text-sm text-muted-foreground mb-2">{narrator.fullName}</p>
                          )}
                          {narrator.reliability && (
                            <Badge variant="outline" className="text-xs">
                              {narrator.reliability}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                      {index < selectedIsnad.isnad.narrators.length - 1 && (
                        <div className="h-6 w-0.5 bg-primary/30"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">درجة الإسناد:</span>
                  <Badge className={getGradeColor(selectedIsnad.isnad.grade)}>{selectedIsnad.isnad.grade}</Badge>
                </div>
                {selectedIsnad.isnad.notes && (
                  <div>
                    <span className="font-medium text-sm">ملاحظات:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedIsnad.isnad.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الإسناد</DialogTitle>
            <DialogDescription>تعديل سلسلة الإسناد ودرجته وملاحظاته</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">الرواة في الإسناد:</h4>
              <Button variant="outline" size="sm" onClick={addNarrator}>
                <Plus className="h-4 w-4 ml-1" />
                إضافة راوٍ
              </Button>
            </div>

            {editForm.narrators.map((narrator, index) => (
              <div key={narrator.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">الراوي {index + 1}</h4>
                  {editForm.narrators.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeNarrator(narrator.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="الاسم"
                    value={narrator.name}
                    onChange={(e) => updateNarrator(narrator.id, "name", e.target.value)}
                  />
                  <Input
                    placeholder="الاسم الكامل"
                    value={narrator.fullName || ""}
                    onChange={(e) => updateNarrator(narrator.id, "fullName", e.target.value)}
                  />
                  <Input
                    placeholder="التوثيق"
                    value={narrator.reliability || ""}
                    onChange={(e) => updateNarrator(narrator.id, "reliability", e.target.value)}
                  />
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <Label>درجة الإسناد</Label>
              <Select
                value={editForm.grade}
                onValueChange={(value: any) => setEditForm((prev) => ({ ...prev, grade: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="صحيح">صحيح</SelectItem>
                  <SelectItem value="حسن">حسن</SelectItem>
                  <SelectItem value="ضعيف">ضعيف</SelectItem>
                  <SelectItem value="موضوع">موضوع</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ملاحظات على الإسناد</Label>
              <Textarea
                placeholder="ملاحظات وتعليقات على الإسناد..."
                value={editForm.notes}
                onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveEdit}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface IsnadCardProps {
  hadith: Hadith
  onViewDetails: () => void
  onEdit: () => void
  onDelete: () => void
  onExport: () => void
  getGradeColor: (grade: string) => string
}

function IsnadCard({ hadith, onViewDetails, onEdit, onDelete, onExport, getGradeColor }: IsnadCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">إسناد حديث: {hadith.narrator}</CardTitle>
            <CardDescription className="line-clamp-2">{hadith.arabicText}</CardDescription>
          </div>
          <Badge className={getGradeColor(hadith.isnad.grade)}>{hadith.isnad.grade}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center w-full">
            {hadith.isnad.narrators.slice(0, 3).map((narrator, index) => (
              <div key={narrator.id} className="flex flex-col items-center">
                <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-center min-w-[120px]">
                  <div className="font-medium text-sm">{narrator.name}</div>
                  {narrator.reliability && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {narrator.reliability}
                    </Badge>
                  )}
                </div>
                {index < Math.min(hadith.isnad.narrators.length - 1, 2) && (
                  <div className="h-4 w-0.5 bg-primary/30"></div>
                )}
              </div>
            ))}
            {hadith.isnad.narrators.length > 3 && (
              <div className="text-xs text-muted-foreground mt-2">+{hadith.isnad.narrators.length - 3} راوٍ آخر</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <Eye className="ml-1 h-4 w-4" />
            عرض التفاصيل
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="ml-1 h-4 w-4" />
            تعديل
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onExport}>
            <Download className="ml-1 h-4 w-4" />
            تصدير
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <Trash2 className="ml-1 h-4 w-4" />
            حذف
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
