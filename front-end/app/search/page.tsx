import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">البحث المتقدم</h1>
        <p className="text-muted-foreground">بحث متقدم في الأحاديث والرواة والمصادر</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>خيارات البحث</CardTitle>
          <CardDescription>حدد معايير البحث المطلوبة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-text">نص البحث</Label>
                <div className="relative">
                  <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="search-text"
                    type="text"
                    placeholder="أدخل كلمات البحث..."
                    className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>نوع البحث</Label>
                <RadioGroup defaultValue="text">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">نص الحديث</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="narrator" id="narrator" />
                    <Label htmlFor="narrator">الراوي</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="source" id="source" />
                    <Label htmlFor="source">المصدر</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>درجة الحديث</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="sahih" />
                    <Label htmlFor="sahih">صحيح</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="hasan" />
                    <Label htmlFor="hasan">حسن</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="daeef" />
                    <Label htmlFor="daeef">ضعيف</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="mawdoo" />
                    <Label htmlFor="mawdoo">موضوع</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book">المصدر</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المصدر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المصادر</SelectItem>
                    <SelectItem value="bukhari">صحيح البخاري</SelectItem>
                    <SelectItem value="muslim">صحيح مسلم</SelectItem>
                    <SelectItem value="tirmidhi">سنن الترمذي</SelectItem>
                    <SelectItem value="abudawud">سنن أبي داود</SelectItem>
                    <SelectItem value="nasai">سنن النسائي</SelectItem>
                    <SelectItem value="ibnmajah">سنن ابن ماجه</SelectItem>
                    <SelectItem value="ahmad">مسند أحمد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scholar">رأي العالم</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العالم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="albani">الألباني</SelectItem>
                    <SelectItem value="arnaut">شعيب الأرناؤوط</SelectItem>
                    <SelectItem value="ibnbaz">ابن باز</SelectItem>
                    <SelectItem value="ibnhajar">ابن حجر</SelectItem>
                    <SelectItem value="dhahabi">الذهبي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>خيارات إضافية</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="exact-match" />
                    <Label htmlFor="exact-match">تطابق تام</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="include-explanation" />
                    <Label htmlFor="include-explanation">تضمين الشروح</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="include-takhrij" />
                    <Label htmlFor="include-takhrij">تضمين التخريج</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">إعادة تعيين</Button>
          <Button>
            <SearchIcon className="ml-2 h-4 w-4" />
            بحث
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
