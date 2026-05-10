"use client";

import Link from "next/link";
import { useUiStore } from "@/stores/ui";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items?: NavItem[];
}

/**
 * Navigation sidebar. Reads sidebarOpen from ui store.
 * Items are injected by the product layer — template ships empty by default.
 */
export function Sidebar({ items = [] }: SidebarProps) {
  const { sidebarOpen } = useUiStore();

  if (!sidebarOpen) return null;

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        borderRight: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        height: "100vh",
        flexShrink: 0,
      }}
    >
      <nav className="flex flex-col gap-1 p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-[var(--color-surface-raised)]"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        {items.length === 0 && (
          <p className="px-3 py-2 text-xs" style={{ color: "var(--color-muted)" }}>
            No navigation items
          </p>
        )}
      </nav>
    </aside>
  );
}
