"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, Home, Link2, ListChecks, Search, Settings, Users, FileText, Brain, Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  description?: string
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      title: "الصفحة الرئيسية",
      href: "/",
      icon: <Home className="h-4 w-4" />,
      description: "الصفحة الرئيسية للمنصة",
    },
    {
      title: "الأحاديث",
      href: "/ahadith",
      icon: <BookOpen className="h-4 w-4" />,
      description: "استعراض وإدارة الأحاديث",
    },
    {
      title: "الأسانيد",
      href: "/isnads",
      icon: <Link2 className="h-4 w-4" />,
      description: "تحليل سلاسل الإسناد",
    },
    {
      title: "الرواة",
      href: "/narrators",
      icon: <Users className="h-4 w-4" />,
      description: "قاعدة بيانات الرواة",
    },
    {
      title: "الكتب",
      href: "/books",
      icon: <FileText className="h-4 w-4" />,
      description: "قراءة الكتب وإضافة التعليقات",
    },
    {
      title: "التخريج والتحليل",
      href: "/analysis",
      icon: <Brain className="h-4 w-4" />,
      description: "تخريج وتحليل الأحاديث",
    },
    {
      title: "المشاريع",
      href: "/projects",
      icon: <ListChecks className="h-4 w-4" />,
      description: "إدارة مشاريع البحث",
    },
    {
      title: "البحث المتقدم",
      href: "/search",
      icon: <Search className="h-4 w-4" />,
      description: "بحث متقدم في المحتوى",
    },
    {
      title: "المصادر والروابط",
      href: "/sources",
      icon: <FileText className="h-4 w-4" />,
      description: "إدارة المصادر والمراجع",
    },
    {
      title: "الإعدادات",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
      description: "إعدادات المنصة",
    },
  ]

  const mainNavItems = navItems.slice(0, 6)
  const secondaryNavItems = navItems.slice(6)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/90">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold">مكتب المحدث</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex gap-1">
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      pathname === item.href && "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10">المزيد</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {item.icon}
                        {item.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Mobile menu button */}
          <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="border-t bg-background p-4">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.icon}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
