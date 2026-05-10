"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import type { NavItem } from "@/types/nav"

interface MobileHeaderProps {
  items: NavItem[]
}

export function MobileHeader({ items }: MobileHeaderProps) {
  const pathname = usePathname()

  return (
    <header
      className="lg:hidden flex items-center justify-between px-4 border-b border-border bg-surface shrink-0"
      style={{ height: "var(--header-height)" }}
    >
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-fg-2 hover:bg-bg-2 transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-surface border-border">
          <div className="flex h-full flex-col">
            <div
              className="flex items-center gap-2 px-4 border-b border-border shrink-0"
              style={{ height: "var(--header-height)" }}
            >
              <Image src="/vercel.svg" alt="Logo" width={18} height={18} className="dark:invert" />
              <span className="text-sm font-semibold text-fg">Template</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-brand-dim text-brand-fg font-medium"
                        : "text-fg-2 hover:bg-bg-2 hover:text-fg"
                    )}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-brand-dim text-brand-fg px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/app/dashboard" className="flex items-center gap-1.5">
        <Image src="/vercel.svg" alt="Logo" width={18} height={18} className="dark:invert" />
        <span className="text-sm font-semibold text-fg">Template</span>
      </Link>
      <ThemeToggle />
    </header>
  )
}
