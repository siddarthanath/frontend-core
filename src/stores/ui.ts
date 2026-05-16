"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SettingsSection } from "@/lib/modal-keys"

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  openModals: string[]
  openModal: (key: string) => void
  closeModal: (key: string) => void
  isModalOpen: (key: string) => boolean

  // Settings modal — section is tracked separately from the generic modal open state
  // so deep links like openSettings("billing") work without extra state threading.
  settingsSection: SettingsSection
  openSettings: (section?: SettingsSection) => void
  closeSettings: () => void
}

export const useUiStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      // Cookie mirrors localStorage so the server can read the correct initial
      // state on refresh — prevents the expanded→collapsed flash on first paint.
      toggleSidebar: () => set((s) => {
        const next = !s.sidebarCollapsed
        if (typeof document !== "undefined") {
          document.cookie = `sidebar_collapsed=${next};path=/;max-age=31536000`
        }
        return { sidebarCollapsed: next }
      }),

      openModals: [],
      openModal: (key) =>
        set((s) => ({
          openModals: s.openModals.includes(key)
            ? s.openModals
            : [...s.openModals, key],
        })),
      closeModal: (key) =>
        set((s) => ({ openModals: s.openModals.filter((k) => k !== key) })),
      isModalOpen: (key) => get().openModals.includes(key),

      settingsSection: "general",
      openSettings: (section = "general") =>
        set((s) => ({
          settingsSection: section,
          openModals: s.openModals.includes("settings")
            ? s.openModals
            : [...s.openModals, "settings"],
        })),
      closeSettings: () =>
        set((s) => ({ openModals: s.openModals.filter((k) => k !== "settings") })),
    }),
    {
      name: "ui-store",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
)
