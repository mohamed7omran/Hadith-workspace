import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, Search, TrendingUp, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            مرحباً بك في مكتب المحدث
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            منصة متكاملة لمساعدة علماء الإسلام وباحثي الحديث في جمع وتحليل وتوثيق الأحاديث النبوية الشريفة
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/ahadith">
              <BookOpen className="ml-2 h-4 w-4" />
              استعراض الأحاديث
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">
              <FileText className="ml-2 h-4 w-4" />
              مشاريعي
            </Link>
          </Button>
        </div>
      </section>

      {/* Quote Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
        <CardContent className="pt-6">
          <blockquote className="text-center text-xl italic font-medium">
            "من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة"
          </blockquote>
          <p className="text-center text-muted-foreground mt-2">- رواه مسلم</p>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأحاديث</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرواة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+3 مشاريع جديدة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% من الأسبوع الماضي</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>آخر الأحاديث</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "حديث الإيمان: عن عمر بن الخطاب رضي الله عنه...",
                "حديث النية: إنما الأعمال بالنيات...",
                "حديث جبريل: بينما نحن جلوس عند رسول الله ﷺ...",
              ].map((hadith, i) => (
                <li key={i} className="border-b pb-2 last:border-0">
                  <Link href="#" className="hover:text-primary transition-colors">
                    {hadith}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/ahadith">عرض المزيد</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>مشاريعي النشطة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {["تخريج أحاديث كتاب رياض الصالحين", "دراسة أسانيد صحيح البخاري", "تحقيق كتاب الأربعين النووية"].map(
                (project, i) => (
                  <li key={i} className="border-b pb-2 last:border-0">
                    <Link href="#" className="hover:text-primary transition-colors">
                      {project}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/projects">عرض المزيد</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span>بحث سريع</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن حديث أو راوٍ..."
                className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                الصحيحين
              </Button>
              <Button variant="outline" size="sm">
                الإيمان
              </Button>
              <Button variant="outline" size="sm">
                الصلاة
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/search">البحث المتقدم</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
