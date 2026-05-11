"use client"

import type { ReactNode } from "react"
import type { NavItem } from "@/types/nav"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileHeader } from "@/components/layout/MobileHeader"

interface AppShellProps {
  children: ReactNode
  navItems?: NavItem[]
  defaultCollapsed?: boolean
  /** Optional right panel — wired in the product layer (e.g. assistant chat panel). */
  rightPanel?: ReactNode
}

export function AppShell({ children, navItems = [], defaultCollapsed = false, rightPanel }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Desktop sidebar — hidden on < lg */}
      <Sidebar items={navItems} defaultCollapsed={defaultCollapsed} />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile header — hidden on lg+ */}
        <MobileHeader items={navItems} />

        {/* Scrollable content area */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>

          {/* Right panel: hidden below xl to avoid cramped layout on tablets */}
          {rightPanel && (
            <aside
              className="hidden xl:flex flex-col overflow-auto border-l border-border bg-surface shrink-0"
              style={{ width: "var(--panel-width)" }}
            >
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
