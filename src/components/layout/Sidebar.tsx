"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/types/nav"
import { useUiStore } from "@/stores/ui"
import { useAuthStore } from "@/stores/auth"
import { UserMenu } from "@/components/layout/UserMenu"


interface SidebarProps {
  defaultCollapsed?: boolean
}

export function Sidebar({ defaultCollapsed = false }: SidebarProps) {
  const items = NAV_ITEMS
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const { user, displayName } = useAuthStore()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  const collapsed = mounted ? sidebarCollapsed : defaultCollapsed

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-surface transition-all duration-200 shrink-0",
        collapsed ? "w-(--sidebar-collapsed)" : "w-(--sidebar-width)"
      )}
    >
      {/* Header */}
      <div
        className="flex items-center border-b border-border shrink-0 px-2.5 h-(--header-height)"
      >
        {collapsed ? (
          /* Collapsed: logo swaps to expand button on hover */
          <div className="group/logo flex flex-1 items-center justify-center">
            <Link href="/app/dashboard" className="flex items-center group-hover/logo:hidden">
              <Image src="/vercel.svg" alt="Logo" width={16} height={16} className="dark:invert" />
            </Link>
            <button
              onClick={toggleSidebar}
              className="hidden group-hover/logo:flex h-7 w-7 items-center justify-center rounded-md text-fg-2 hover:bg-bg-2 transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen size={15} />
            </button>
          </div>
        ) : (
          /* Expanded: logo + name on left, theme + collapse on right */
          <>
            <Link href="/app/dashboard" className="flex items-center gap-2 flex-1 min-w-0">
              <Image src="/vercel.svg" alt="Logo" width={16} height={16} className="dark:invert shrink-0" />
              <span className="text-sm font-semibold text-fg truncate">Template</span>
            </Link>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={toggleSidebar}
                className="flex h-7 w-7 items-center justify-center rounded-md text-fg-2 hover:bg-bg-2 transition-colors"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={15} />
              </button>
            </div>
          </>
        )}
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

      {/* Footer */}
      <div className="border-t border-border shrink-0">
        <UserMenu email={user?.email ?? ""} displayName={displayName} collapsed={collapsed} />
      </div>
    </aside>
  )
}
