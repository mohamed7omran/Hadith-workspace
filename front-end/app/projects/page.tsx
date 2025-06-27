import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, FileText, Plus, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المشاريع</h1>
          <p className="text-muted-foreground">إدارة مشاريع البحث والتحقيق</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" /> مشروع جديد
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="active">نشط</TabsTrigger>
            <TabsTrigger value="completed">مكتمل</TabsTrigger>
            <TabsTrigger value="archived">مؤرشف</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في المشاريع..."
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          title="تخريج أحاديث كتاب رياض الصالحين"
          description="مشروع لتخريج ودراسة أسانيد أحاديث كتاب رياض الصالحين للإمام النووي"
          type="تخريج"
          status="نشط"
          statusColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          progress={65}
          deadline="15 رمضان 1445"
          hadithCount={1896}
        />

        <ProjectCard
          title="دراسة أسانيد صحيح البخاري"
          description="دراسة تحليلية لأسانيد الإمام البخاري في الجامع الصحيح"
          type="دراسة أسانيد"
          status="نشط"
          statusColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          progress={32}
          deadline="1 محرم 1446"
          hadithCount={7563}
        />

        <ProjectCard
          title="تحقيق كتاب الأربعين النووية"
          description="تحقيق علمي لكتاب الأربعين النووية مع دراسة الأسانيد والمتون"
          type="تحقيق"
          status="نشط"
          statusColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          progress={85}
          deadline="10 شوال 1445"
          hadithCount={42}
        />

        <ProjectCard
          title="جمع طرق حديث من كذب علي"
          description="جمع وتخريج طرق حديث: من كذب علي متعمداً فليتبوأ مقعده من النار"
          type="جمع طرق"
          status="مكتمل"
          statusColor="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          progress={100}
          deadline="مكتمل"
          hadithCount={1}
        />

        <ProjectCard
          title="تخريج أحاديث كتاب الإيمان"
          description="تخريج ودراسة أحاديث كتاب الإيمان من صحيح مسلم"
          type="تخريج"
          status="مؤرشف"
          statusColor="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          progress={100}
          deadline="مؤرشف"
          hadithCount={380}
        />
      </div>

      <div className="flex justify-center">
        <Button variant="outline">تحميل المزيد</Button>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  title: string
  description: string
  type: string
  status: string
  statusColor: string
  progress: number
  deadline: string
  hadithCount: number
}

function ProjectCard({
  title,
  description,
  type,
  status,
  statusColor,
  progress,
  deadline,
  hadithCount,
}: ProjectCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge className={statusColor}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">نوع المشروع:</span>
            <span>{type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">عدد الأحاديث:</span>
            <span>{hadithCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الموعد النهائي:</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {deadline}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">التقدم:</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <CheckCircle2 className="ml-1 h-4 w-4" />
          المهام
        </Button>
        <Button variant="ghost" size="sm">
          <FileText className="ml-1 h-4 w-4" />
          تفاصيل
        </Button>
      </CardFooter>
    </Card>
  )
}
