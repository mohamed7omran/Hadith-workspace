"use client"

import { useParams, useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { deleteHadith } from "@/lib/features/hadiths/hadithsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  BookOpen,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Link2,
  Copy,
  Download,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function HadithDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  const hadithId = params.id as string
  const { hadiths } = useAppSelector((state) => state.hadiths)
  const hadith = hadiths.find((h) => h.id === hadithId)

  if (!hadith) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">الحديث غير موجود</h3>
            <p className="text-muted-foreground text-center mb-4">
              لم يتم العثور على الحديث المطلوب. قد يكون محذوفاً أو غير متاح.
            </p>
            <Button asChild>
              <Link href="/ahadith">
                <ArrowLeft className="ml-2 h-4 w-4" />
                العودة إلى الأحاديث
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDeleteHadith = () => {
    dispatch(deleteHadith(hadith.id))
    toast({
      title: "تم الحذف",
      description: "تم حذف الحديث بنجاح",
    })
    router.push("/ahadith")
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(hadith.arabicText)
    toast({
      title: "تم النسخ",
      description: "تم نسخ نص الحديث إلى الحافظة",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `حديث: ${hadith.narrator}`,
        text: hadith.arabicText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط الحديث إلى الحافظة",
      })
    }
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/ahadith" className="hover:text-foreground">
          الأحاديث
        </Link>
        <span>/</span>
        <span className="text-foreground">تفاصيل الحديث</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Section */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge className={getGradeColor(hadith.grade)} className="text-sm px-3 py-1">
                      {hadith.grade}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Calendar className="h-3 w-3 ml-1" />
                      {formatDate(hadith.createdAt)}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{hadith.narrator}</CardTitle>
                  <CardDescription className="text-base">راوي الحديث الشريف</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/analysis?edit=${hadith.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteHadith}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-6">
                  <p className="text-xl leading-relaxed font-medium text-center">{hadith.arabicText}</p>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" onClick={handleCopyText}>
                    <Copy className="h-4 w-4 ml-2" />
                    نسخ النص
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="isnad">الإسناد</TabsTrigger>
              <TabsTrigger value="references">المراجع</TabsTrigger>
              <TabsTrigger value="scholars">أقوال العلماء</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    تفاصيل الحديث
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">الراوي الأساسي</h4>
                      <p className="text-base">{hadith.narrator}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">درجة الحديث</h4>
                      <Badge className={getGradeColor(hadith.grade)}>{hadith.grade}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">عدد الرواة في الإسناد</h4>
                      <p className="text-base">{hadith.isnad.narrators.length} راوٍ</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">عدد المراجع</h4>
                      <p className="text-base">{hadith.references.length} مرجع</p>
                    </div>
                  </div>

                  {hadith.analysisNotes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">ملاحظات التحليل</h4>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-sm leading-relaxed">{hadith.analysisNotes}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="isnad" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    سلسلة الإسناد
                  </CardTitle>
                  <CardDescription>سلسلة الرواة الذين نقلوا هذا الحديث</CardDescription>
                </CardHeader>
                <CardContent>
                  {hadith.isnad.narrators.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center space-y-4">
                        {hadith.isnad.narrators.map((narrator, index) => (
                          <div key={narrator.id} className="flex flex-col items-center">
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
                            {index < hadith.isnad.narrators.length - 1 && (
                              <div className="h-8 w-0.5 bg-primary/30"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">درجة الإسناد:</span>
                          <Badge className={getGradeColor(hadith.isnad.grade)}>{hadith.isnad.grade}</Badge>
                        </div>
                        {hadith.isnad.notes && (
                          <div>
                            <span className="font-medium text-sm">ملاحظات:</span>
                            <p className="text-sm text-muted-foreground mt-1">{hadith.isnad.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم يتم تحديد سلسلة الإسناد لهذا الحديث</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="references" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    المراجع والمصادر
                  </CardTitle>
                  <CardDescription>المصادر التي ورد فيها هذا الحديث</CardDescription>
                </CardHeader>
                <CardContent>
                  {hadith.references.length > 0 ? (
                    <div className="space-y-4">
                      {hadith.references.map((reference, index) => (
                        <Card key={reference.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{reference.source}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  {reference.volume && <span>المجلد: {reference.volume}</span>}
                                  {reference.page && <span>الصفحة: {reference.page}</span>}
                                  {reference.hadithNumber && <span>رقم الحديث: {reference.hadithNumber}</span>}
                                </div>
                              </div>
                              <Badge variant="outline">مرجع {index + 1}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم يتم إضافة مراجع لهذا الحديث</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scholars" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    أقوال العلماء
                  </CardTitle>
                  <CardDescription>آراء وأحكام العلماء على هذا الحديث</CardDescription>
                </CardHeader>
                <CardContent>
                  {hadith.scholarComments.length > 0 ? (
                    <div className="space-y-4">
                      {hadith.scholarComments.map((comment, index) => (
                        <Card key={comment.id} className="border-r-4 border-r-primary">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{comment.scholar}</h3>
                                <div className="flex gap-2">
                                  {comment.grade && <Badge variant="outline">{comment.grade}</Badge>}
                                  <Badge variant="secondary">قول {index + 1}</Badge>
                                </div>
                              </div>
                              <div className="bg-muted/30 rounded-lg p-4">
                                <p className="text-sm leading-relaxed">{comment.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">لم يتم إضافة أقوال العلماء لهذا الحديث</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href={`/analysis?edit=${hadith.id}`}>
                  <Edit className="h-4 w-4 ml-2" />
                  تعديل الحديث
                </Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCopyText}>
                <Copy className="h-4 w-4 ml-2" />
                نسخ النص
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="h-4 w-4 ml-2" />
                مشاركة
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 ml-2" />
                تصدير PDF
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full" onClick={handleDeleteHadith}>
                <Trash2 className="h-4 w-4 ml-2" />
                حذف الحديث
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">عدد الكلمات:</span>
                <span className="font-medium">{hadith.arabicText.split(" ").length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">عدد الأحرف:</span>
                <span className="font-medium">{hadith.arabicText.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">الرواة:</span>
                <span className="font-medium">{hadith.isnad.narrators.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">المراجع:</span>
                <span className="font-medium">{hadith.references.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">أقوال العلماء:</span>
                <span className="font-medium">{hadith.scholarComments.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات إضافية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">تاريخ الإضافة:</span>
                <p className="text-sm font-medium">{formatDate(hadith.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">آخر تحديث:</span>
                <p className="text-sm font-medium">{formatDate(hadith.updatedAt)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">معرف الحديث:</span>
                <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{hadith.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">التنقل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/ahadith">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  العودة إلى الأحاديث
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/analysis">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة حديث جديد
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
