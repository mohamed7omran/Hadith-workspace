import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Plus, Search, Globe } from "lucide-react"

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المصادر والروابط</h1>
          <p className="text-muted-foreground">إدارة المصادر والمراجع الخارجية</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" /> إضافة مصدر
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="books">كتب</TabsTrigger>
            <TabsTrigger value="websites">مواقع</TabsTrigger>
            <TabsTrigger value="databases">قواعد بيانات</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث في المصادر..."
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SourceCard
          title="موقع الدرر السنية"
          description="موقع متخصص في الحديث النبوي وعلومه"
          url="dorar.net"
          type="موقع"
          typeColor="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          hadithCount={50000}
        />

        <SourceCard
          title="المكتبة الشاملة"
          description="مكتبة إلكترونية شاملة للتراث الإسلامي"
          url="shamela.ws"
          type="مكتبة"
          typeColor="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          hadithCount={75000}
        />

        <SourceCard
          title="موقع المحدث"
          description="موقع متخصص في تخريج الأحاديث"
          url="mohadith.com"
          type="موقع"
          typeColor="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          hadithCount={30000}
        />

        <SourceCard
          title="صحيح البخاري"
          description="الجامع المسند الصحيح المختصر من أمور رسول الله ﷺ"
          url="local-database"
          type="كتاب"
          typeColor="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          hadithCount={7563}
        />

        <SourceCard
          title="صحيح مسلم"
          description="المسند الصحيح المختصر بنقل العدل عن العدل"
          url="local-database"
          type="كتاب"
          typeColor="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          hadithCount={5362}
        />

        <SourceCard
          title="سنن أبي داود"
          description="كتاب السنن للإمام أبي داود السجستاني"
          url="local-database"
          type="كتاب"
          typeColor="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          hadithCount={4800}
        />
      </div>

      <div className="flex justify-center">
        <Button variant="outline">تحميل المزيد</Button>
      </div>
    </div>
  )
}

interface SourceCardProps {
  title: string
  description: string
  url: string
  type: string
  typeColor: string
  hadithCount: number
}

function SourceCard({ title, description, url, type, typeColor, hadithCount }: SourceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge className={typeColor}>{type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">الرابط:</span>
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {url}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">عدد الأحاديث:</span>
          <span>{hadithCount.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <ExternalLink className="ml-1 h-4 w-4" />
          زيارة
        </Button>
        <Button variant="ghost" size="sm">
          تفاصيل
        </Button>
      </CardFooter>
    </Card>
  )
}
