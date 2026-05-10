"use client";

import type { ReactNode } from "react";
import { Sidebar, type NavItem } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { useUiStore } from "@/stores/ui";

interface AppShellProps {
  children: ReactNode;
  /** Optional right panel slot — used by product layer (e.g. Atlas assistant panel). */
  rightPanel?: ReactNode;
  navItems?: NavItem[];
}

/**
 * Authenticated app layout: Sidebar + header + main + optional rightPanel.
 * rightPanel slot is intentionally vague — wired up in the product layer.
 */
export function AppShell({ children, rightPanel, navItems }: AppShellProps) {
  const { toggleSidebar } = useUiStore();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-background)" }}>
      <Sidebar items={navItems} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-4"
          style={{
            height: "var(--header-height)",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="rounded-md p-2 text-sm transition-colors hover:bg-[var(--color-surface-raised)]"
          >
            ☰
          </button>
          <ThemeToggle />
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto p-6">{children}</main>
          {rightPanel && (
            <aside
              className="overflow-auto"
              style={{
                width: "320px",
                borderLeft: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                flexShrink: 0,
              }}
            >
              {rightPanel}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
