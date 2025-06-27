import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import Header from "@/components/header"

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "مكتب المحدث - منصة بحث الحديث",
  description: "منصة لمساعدة علماء الإسلام وباحثي الحديث في جمع وتحليل وتوثيق الأحاديث",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-cairo antialiased", cairo.variable)}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
            storageKey="hadith-platform-theme"
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <div className="container py-6">{children}</div>
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
