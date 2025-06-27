"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Link2, Plus, Search, Trash2, Edit } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { deleteHadith } from "@/lib/features/hadiths/hadithsSlice"
import { useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AhadithPage() {
  const { hadiths } = useAppSelector((state) => state.hadiths)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")

  const filteredHadiths = hadiths.filter((hadith) => {
    const matchesSearch = hadith.arabicText.includes(searchTerm) || hadith.narrator.includes(searchTerm)
    const matchesGrade = gradeFilter === "all" || hadith.grade === gradeFilter
    return matchesSearch && matchesGrade
  })

  const handleDeleteHadith = (id: string) => {
    dispatch(deleteHadith(id))
    toast({
      title: "تم الحذف",
      description: "تم حذف الحديث بنجاح",
    })
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الأحاديث</h1>
          <p className="text-muted-foreground">استعراض وإدارة الأحاديث النبوية الشريفة ({hadiths.length} حديث)</p>
        </div>
        <Button asChild>
          <Link href="/analysis">
            <Plus className="ml-2 h-4 w-4" /> إضافة حديث
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
            placeholder="بحث في الأحاديث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {filteredHadiths.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أحاديث</h3>
            <p className="text-muted-foreground text-center mb-4">
              {hadiths.length === 0
                ? "لم يتم إضافة أي أحاديث بعد. ابدأ بإضافة حديث من صفحة التخريج والتحليل."
                : "لا توجد أحاديث تطابق معايير البحث المحددة."}
            </p>
            <Button asChild>
              <Link href="/analysis">
                <Plus className="ml-2 h-4 w-4" />
                إضافة حديث جديد
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredHadiths.map((hadith) => (
            <HadithCard
              key={hadith.id}
              hadith={hadith}
              onDelete={handleDeleteHadith}
              getGradeColor={getGradeColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {filteredHadiths.length > 0 && filteredHadiths.length < hadiths.length && (
        <div className="text-center text-sm text-muted-foreground">
          عرض {filteredHadiths.length} من أصل {hadiths.length} حديث
        </div>
      )}
    </div>
  )
}

interface HadithCardProps {
  hadith: any
  onDelete: (id: string) => void
  getGradeColor: (grade: string) => string
  formatDate: (date: string) => string
}

function HadithCard({ hadith, onDelete, getGradeColor, formatDate }: HadithCardProps) {
  const [showFullText, setShowFullText] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showIsnad, setShowIsnad] = useState(false)

  const truncateText = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{hadith.narrator}</CardTitle>
              <Badge className={getGradeColor(hadith.grade)}>{hadith.grade}</Badge>
            </div>
            <CardDescription className="text-xs">أضيف في {formatDate(hadith.createdAt)}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/analysis?edit=${hadith.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(hadith.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-lg leading-relaxed">
            {showFullText ? hadith.arabicText : truncateText(hadith.arabicText)}
            {hadith.arabicText.length > 200 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-primary"
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText ? " عرض أقل" : " عرض المزيد"}
              </Button>
            )}
          </p>
        </div>

        {showDetails && (
          <div className="space-y-4 border-t pt-4">
            {/* Isnad */}
            {hadith.isnad.narrators.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">الإسناد:</h4>
                <div className="flex flex-wrap gap-2">
                  {hadith.isnad.narrators.map((narrator: any, index: number) => (
                    <Badge key={narrator.id} variant="outline">
                      {narrator.name}
                    </Badge>
                  ))}
                </div>
                {hadith.isnad.notes && <p className="text-sm text-muted-foreground mt-2">{hadith.isnad.notes}</p>}
              </div>
            )}

            {/* References */}
            {hadith.references.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">المراجع:</h4>
                <div className="space-y-1">
                  {hadith.references.map((ref: any) => (
                    <div key={ref.id} className="text-sm">
                      <span className="font-medium">{ref.source}</span>
                      {ref.volume && <span> - مج {ref.volume}</span>}
                      {ref.page && <span> - ص {ref.page}</span>}
                      {ref.hadithNumber && <span> - ح {ref.hadithNumber}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scholar Comments */}
            {hadith.scholarComments.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">أقوال العلماء:</h4>
                <div className="space-y-2">
                  {hadith.scholarComments.map((comment: any) => (
                    <div key={comment.id} className="border-r-2 border-primary/20 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.scholar}</span>
                        {comment.grade && (
                          <Badge variant="outline" className="text-xs">
                            {comment.grade}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Notes */}
            {hadith.analysisNotes && (
              <div>
                <h4 className="font-medium text-sm mb-2">ملاحظات التحليل:</h4>
                <p className="text-sm text-muted-foreground">{hadith.analysisNotes}</p>
              </div>
            )}
          </div>
        )}
        {showIsnad && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                سلسلة الإسناد:
              </h4>
              {hadith.isnad.narrators.length > 0 ? (
                <div className="flex flex-col items-center space-y-2">
                  {hadith.isnad.narrators.map((narrator: any, index: number) => (
                    <div key={narrator.id} className="flex flex-col items-center">
                      <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-center min-w-[120px]">
                        <div className="font-medium text-sm">{narrator.name}</div>
                        {narrator.fullName && (
                          <div className="text-xs text-muted-foreground mt-1">{narrator.fullName}</div>
                        )}
                        {narrator.reliability && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {narrator.reliability}
                          </Badge>
                        )}
                      </div>
                      {index < hadith.isnad.narrators.length - 1 && <div className="h-6 w-0.5 bg-primary/30"></div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">لم يتم تحديد سلسلة الإسناد لهذا الحديث</p>
              )}

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">درجة الإسناد:</span>
                  <Badge className={getGradeColor(hadith.isnad.grade)}>{hadith.isnad.grade}</Badge>
                </div>
                {hadith.isnad.notes && (
                  <div>
                    <span className="text-sm font-medium">ملاحظات:</span>
                    <p className="text-sm text-muted-foreground mt-1">{hadith.isnad.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/ahadith/${hadith.id}`}>
              <FileText className="ml-1 h-4 w-4" />
              عرض التفاصيل
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
            <FileText className="ml-1 h-4 w-4" />
            {showDetails ? "إخفاء التفاصيل" : "ملخص سريع"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowIsnad(!showIsnad)}>
            <Link2 className="ml-1 h-4 w-4" />
            {showIsnad ? "إخفاء الإسناد" : "عرض الإسناد"}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{hadith.references.length} مرجع</span>
          <span>•</span>
          <span>{hadith.isnad.narrators.length} راوٍ</span>
          <span>•</span>
          <span>{hadith.scholarComments.length} قول</span>
        </div>
      </CardFooter>
    </Card>
  )
}
