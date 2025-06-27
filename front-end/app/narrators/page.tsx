import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Plus, Search } from "lucide-react"

export default function NarratorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الرواة</h1>
          <p className="text-muted-foreground">قاعدة بيانات الرواة وتراجمهم</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" /> إضافة راوٍ
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="thiqah">ثقة</TabsTrigger>
            <TabsTrigger value="saduq">صدوق</TabsTrigger>
            <TabsTrigger value="daeef">ضعيف</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث عن راوٍ..."
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NarratorCard
          name="أبو هريرة"
          fullName="عبد الرحمن بن صخر الدوسي"
          lifespan="21 ق.هـ - 59 هـ"
          grade="صحابي"
          gradeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          narrations={5374}
        />

        <NarratorCard
          name="عبد الله بن عمر"
          fullName="عبد الله بن عمر بن الخطاب"
          lifespan="10 ق.هـ - 73 هـ"
          grade="صحابي"
          gradeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          narrations={2630}
        />

        <NarratorCard
          name="عائشة بنت أبي بكر"
          fullName="عائشة بنت أبي بكر الصديق"
          lifespan="9 ق.هـ - 58 هـ"
          grade="صحابية"
          gradeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          narrations={2210}
        />

        <NarratorCard
          name="أنس بن مالك"
          fullName="أنس بن مالك بن النضر الأنصاري"
          lifespan="10 ق.هـ - 93 هـ"
          grade="صحابي"
          gradeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          narrations={2286}
        />

        <NarratorCard
          name="الزهري"
          fullName="محمد بن مسلم بن عبيد الله بن شهاب"
          lifespan="58 هـ - 124 هـ"
          grade="ثقة"
          gradeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          narrations={2220}
        />

        <NarratorCard
          name="قتادة"
          fullName="قتادة بن دعامة السدوسي"
          lifespan="61 هـ - 117 هـ"
          grade="ثقة"
          gradeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          narrations={1875}
        />
      </div>

      <div className="flex justify-center">
        <Button variant="outline">تحميل المزيد</Button>
      </div>
    </div>
  )
}

interface NarratorCardProps {
  name: string
  fullName: string
  lifespan: string
  grade: string
  gradeColor: string
  narrations: number
}

function NarratorCard({ name, fullName, lifespan, grade, gradeColor, narrations }: NarratorCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{fullName}</CardDescription>
          </div>
          <Badge className={gradeColor}>{grade}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">الفترة:</span>
          <span>{lifespan}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">عدد المرويات:</span>
          <span>{narrations}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <BookOpen className="ml-1 h-4 w-4" />
          المرويات
        </Button>
        <Button variant="ghost" size="sm">
          <FileText className="ml-1 h-4 w-4" />
          ترجمة كاملة
        </Button>
      </CardFooter>
    </Card>
  )
}
