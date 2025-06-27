import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة تفضيلات المنصة والحساب</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>التفضيلات العامة</CardTitle>
            <CardDescription>إعدادات عامة للمنصة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">الإشعارات</Label>
                <div className="text-sm text-muted-foreground">تلقي إشعارات عند إضافة أحاديث جديدة</div>
              </div>
              <Switch id="notifications" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">الحفظ التلقائي</Label>
                <div className="text-sm text-muted-foreground">حفظ التغييرات تلقائياً أثناء العمل</div>
              </div>
              <Switch id="auto-save" defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="default-source">المصدر الافتراضي لآراء العلماء</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المصدر الافتراضي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="albani">الألباني</SelectItem>
                  <SelectItem value="arnaut">شعيب الأرناؤوط</SelectItem>
                  <SelectItem value="ibnbaz">ابن باز</SelectItem>
                  <SelectItem value="ibnhajar">ابن حجر</SelectItem>
                  <SelectItem value="dhahabi">الذهبي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات العرض</CardTitle>
            <CardDescription>تخصيص طريقة عرض المحتوى</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="isnad-display">طريقة عرض الإسناد</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة العرض" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">عمودي</SelectItem>
                  <SelectItem value="horizontal">أفقي</SelectItem>
                  <SelectItem value="tree">شجري</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="date-format">نظام التاريخ</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نظام التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hijri">هجري</SelectItem>
                  <SelectItem value="gregorian">ميلادي</SelectItem>
                  <SelectItem value="both">كلاهما</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-tashkeel">إظهار التشكيل</Label>
                <div className="text-sm text-muted-foreground">عرض التشكيل في نصوص الأحاديث</div>
              </div>
              <Switch id="show-tashkeel" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات البحث</CardTitle>
            <CardDescription>تخصيص خيارات البحث الافتراضية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="search-suggestions">اقتراحات البحث</Label>
                <div className="text-sm text-muted-foreground">إظهار اقتراحات أثناء الكتابة</div>
              </div>
              <Switch id="search-suggestions" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="search-history">حفظ تاريخ البحث</Label>
                <div className="text-sm text-muted-foreground">حفظ عمليات البحث السابقة</div>
              </div>
              <Switch id="search-history" defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="results-per-page">عدد النتائج في الصفحة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر عدد النتائج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إعدادات التصدير</CardTitle>
            <CardDescription>خيارات تصدير البيانات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="export-format">تنسيق التصدير الافتراضي</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر تنسيق التصدير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                  <SelectItem value="txt">نص عادي</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="include-metadata">تضمين البيانات الوصفية</Label>
                <div className="text-sm text-muted-foreground">إضافة معلومات إضافية عند التصدير</div>
              </div>
              <Switch id="include-metadata" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">إعادة تعيين</Button>
          <Button>حفظ التغييرات</Button>
        </div>
      </div>
    </div>
  )
}
