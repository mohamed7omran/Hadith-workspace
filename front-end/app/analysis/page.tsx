"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Trash2, Users, BookOpen } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { addHadith } from "@/lib/features/hadiths/hadithsSlice"
import type { Hadith, Narrator, Reference, ScholarComment } from "@/lib/features/hadiths/types"
import { useToast } from "@/hooks/use-toast"

export default function AnalysisPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  // Form state
  const [arabicText, setArabicText] = useState("")
  const [narrator, setNarrator] = useState("")
  const [grade, setGrade] = useState<"صحيح" | "حسن" | "ضعيف" | "موضوع">("صحيح")
  const [analysisNotes, setAnalysisNotes] = useState("")

  // Isnad state
  const [isnadNarrators, setIsnadNarrators] = useState<Narrator[]>([
    { id: "1", name: "", fullName: "", reliability: "" },
  ])
  const [isnadGrade, setIsnadGrade] = useState<"صحيح" | "حسن" | "ضعيف" | "موضوع">("صحيح")
  const [isnadNotes, setIsnadNotes] = useState("")

  // References state
  const [references, setReferences] = useState<Reference[]>([
    { id: "1", source: "", volume: "", page: "", hadithNumber: "" },
  ])

  // Scholar comments state
  const [scholarComments, setScholarComments] = useState<ScholarComment[]>([
    { id: "1", scholar: "", comment: "", grade: "" },
  ])

  const addNarrator = () => {
    const newNarrator: Narrator = {
      id: Date.now().toString(),
      name: "",
      fullName: "",
      reliability: "",
    }
    setIsnadNarrators([...isnadNarrators, newNarrator])
  }

  const updateNarrator = (id: string, field: keyof Narrator, value: string) => {
    setIsnadNarrators((prev) =>
      prev.map((narrator) => (narrator.id === id ? { ...narrator, [field]: value } : narrator)),
    )
  }

  const removeNarrator = (id: string) => {
    if (isnadNarrators.length > 1) {
      setIsnadNarrators((prev) => prev.filter((narrator) => narrator.id !== id))
    }
  }

  const addReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      source: "",
      volume: "",
      page: "",
      hadithNumber: "",
    }
    setReferences([...references, newReference])
  }

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    setReferences((prev) => prev.map((ref) => (ref.id === id ? { ...ref, [field]: value } : ref)))
  }

  const removeReference = (id: string) => {
    if (references.length > 1) {
      setReferences((prev) => prev.filter((ref) => ref.id !== id))
    }
  }

  const addScholarComment = () => {
    const newComment: ScholarComment = {
      id: Date.now().toString(),
      scholar: "",
      comment: "",
      grade: "",
    }
    setScholarComments([...scholarComments, newComment])
  }

  const updateScholarComment = (id: string, field: keyof ScholarComment, value: string) => {
    setScholarComments((prev) => prev.map((comment) => (comment.id === id ? { ...comment, [field]: value } : comment)))
  }

  const removeScholarComment = (id: string) => {
    if (scholarComments.length > 1) {
      setScholarComments((prev) => prev.filter((comment) => comment.id !== id))
    }
  }

  const handleSaveHadith = () => {
    if (!arabicText.trim() || !narrator.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال نص الحديث والراوي",
        variant: "destructive",
      })
      return
    }

    const newHadith: Hadith = {
      id: Date.now().toString(),
      arabicText: arabicText.trim(),
      narrator: narrator.trim(),
      isnad: {
        id: Date.now().toString(),
        narrators: isnadNarrators.filter((n) => n.name.trim()),
        grade: isnadGrade,
        notes: isnadNotes.trim(),
      },
      grade,
      references: references.filter((r) => r.source.trim()),
      scholarComments: scholarComments.filter((c) => c.scholar.trim() && c.comment.trim()),
      analysisNotes: analysisNotes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch(addHadith(newHadith))

    toast({
      title: "تم الحفظ",
      description: "تم حفظ الحديث بنجاح وإضافته إلى قاعدة البيانات",
    })

    // Reset form
    setArabicText("")
    setNarrator("")
    setGrade("صحيح")
    setAnalysisNotes("")
    setIsnadNarrators([{ id: "1", name: "", fullName: "", reliability: "" }])
    setIsnadGrade("صحيح")
    setIsnadNotes("")
    setReferences([{ id: "1", source: "", volume: "", page: "", hadithNumber: "" }])
    setScholarComments([{ id: "1", scholar: "", comment: "", grade: "" }])
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
          <h1 className="text-3xl font-bold tracking-tight">التخريج والتحليل</h1>
          <p className="text-muted-foreground">تخريج الأحاديث وتحليل الأسانيد</p>
        </div>
        <Button onClick={handleSaveHadith}>
          <Save className="ml-2 h-4 w-4" /> حفظ الحديث
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Hadith Information */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحديث الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arabic-text">نص الحديث</Label>
                <Textarea
                  id="arabic-text"
                  placeholder="أدخل نص الحديث باللغة العربية..."
                  value={arabicText}
                  onChange={(e) => setArabicText(e.target.value)}
                  className="min-h-[120px] text-lg leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="narrator">الراوي</Label>
                  <Input
                    id="narrator"
                    placeholder="اسم الراوي"
                    value={narrator}
                    onChange={(e) => setNarrator(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">درجة الحديث</Label>
                  <Select value={grade} onValueChange={(value: any) => setGrade(value)}>
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
              </div>
            </CardContent>
          </Card>

          {/* Isnad Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  تحليل الإسناد
                </CardTitle>
                <Button variant="outline" size="sm" onClick={addNarrator}>
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة راوٍ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isnadNarrators.map((narrator, index) => (
                <div key={narrator.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">الراوي {index + 1}</h4>
                    {isnadNarrators.length > 1 && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>درجة الإسناد</Label>
                  <Select value={isnadGrade} onValueChange={(value: any) => setIsnadGrade(value)}>
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
              </div>

              <div className="space-y-2">
                <Label>ملاحظات على الإسناد</Label>
                <Textarea
                  placeholder="ملاحظات وتعليقات على الإسناد..."
                  value={isnadNotes}
                  onChange={(e) => setIsnadNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* References */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  المراجع والمصادر
                </CardTitle>
                <Button variant="outline" size="sm" onClick={addReference}>
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة مرجع
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {references.map((reference, index) => (
                <div key={reference.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">المرجع {index + 1}</h4>
                    {references.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeReference(reference.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Input
                      placeholder="المصدر"
                      value={reference.source}
                      onChange={(e) => updateReference(reference.id, "source", e.target.value)}
                    />
                    <Input
                      placeholder="المجلد"
                      value={reference.volume || ""}
                      onChange={(e) => updateReference(reference.id, "volume", e.target.value)}
                    />
                    <Input
                      placeholder="الصفحة"
                      value={reference.page || ""}
                      onChange={(e) => updateReference(reference.id, "page", e.target.value)}
                    />
                    <Input
                      placeholder="رقم الحديث"
                      value={reference.hadithNumber || ""}
                      onChange={(e) => updateReference(reference.id, "hadithNumber", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Scholar Comments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>أقوال العلماء</CardTitle>
                <Button variant="outline" size="sm" onClick={addScholarComment}>
                  <Plus className="h-4 w-4 ml-1" />
                  إضافة قول
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholarComments.map((comment, index) => (
                <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">قول العالم {index + 1}</h4>
                    {scholarComments.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeScholarComment(comment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="اسم العالم"
                      value={comment.scholar}
                      onChange={(e) => updateScholarComment(comment.id, "scholar", e.target.value)}
                    />
                    <Input
                      placeholder="حكمه على الحديث"
                      value={comment.grade || ""}
                      onChange={(e) => updateScholarComment(comment.id, "grade", e.target.value)}
                    />
                  </div>

                  <Textarea
                    placeholder="نص قول العالم..."
                    value={comment.comment}
                    onChange={(e) => updateScholarComment(comment.id, "comment", e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Analysis Notes */}
          <Card>
            <CardHeader>
              <CardTitle>ملاحظات التحليل</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ملاحظات وتعليقات إضافية على التخريج والتحليل..."
                value={analysisNotes}
                onChange={(e) => setAnalysisNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معاينة الحديث</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">النص:</h4>
                  <p className="text-base leading-relaxed">{arabicText || "لم يتم إدخال نص الحديث بعد..."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">الراوي:</h4>
                  <p className="text-base">{narrator || "لم يتم تحديد الراوي بعد..."}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">الحكم:</h4>
                  <Badge className={getGradeColor(grade)}>{grade}</Badge>
                </div>
                {isnadNarrators.some((n) => n.name.trim()) && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">الإسناد:</h4>
                    <div className="space-y-1">
                      {isnadNarrators
                        .filter((n) => n.name.trim())
                        .map((narrator, index) => (
                          <div key={narrator.id} className="text-sm">
                            {index + 1}. {narrator.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الإحصائيات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد الرواة:</span>
                  <span>{isnadNarrators.filter((n) => n.name.trim()).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد المراجع:</span>
                  <span>{references.filter((r) => r.source.trim()).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">أقوال العلماء:</span>
                  <span>{scholarComments.filter((c) => c.scholar.trim() && c.comment.trim()).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
