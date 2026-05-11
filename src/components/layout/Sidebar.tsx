"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/types/nav"
import { useUiStore } from "@/stores/ui"
import { useAuthStore } from "@/stores/auth"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { OrgSwitcher } from "@/components/org/OrgSwitcher"

interface SidebarProps {
  items: NavItem[]
  defaultCollapsed?: boolean
}

export function Sidebar({ items, defaultCollapsed = false }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const { user } = useAuthStore()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Before Zustand rehydrates from localStorage, use the server-read cookie value
  // so the sidebar width is correct on the first paint with no flash.
  const collapsed = mounted ? sidebarCollapsed : defaultCollapsed

  return (
    <aside
      className="hidden lg:flex flex-col border-r border-border bg-surface transition-all duration-200 shrink-0"
      style={{ width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)" }}
    >
      {/* Logo + collapse toggle */}
      <div
        className="flex items-center justify-between px-3 border-b border-border shrink-0"
        style={{ height: "var(--header-height)" }}
      >
        {!collapsed && (
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <Image src="/vercel.svg" alt="Logo" width={20} height={20} className="dark:invert" />
            <span className="text-sm font-semibold text-fg">Template</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-fg-2 hover:bg-bg-2 transition-colors",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      {/* Org switcher */}
      <div className="px-2 py-2 border-b border-border">
        <OrgSwitcher collapsed={collapsed} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                collapsed && "justify-center",
                active
                  ? "bg-brand-dim text-brand-fg font-medium"
                  : "text-fg-2 hover:bg-bg-2 hover:text-fg"
              )}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-brand-dim text-brand-fg px-1.5 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer: theme toggle + user email */}
      <div
        className={cn(
          "p-2 border-t border-border flex items-center gap-2 shrink-0",
          collapsed && "justify-center"
        )}
      >
        <ThemeToggle />
        {!collapsed && user?.email && (
          <span className="text-xs text-fg-3 truncate">{user.email}</span>
        )}
      </div>
    </aside>
  )
}
