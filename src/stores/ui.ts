"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  openModals: string[]
  openModal: (key: string) => void
  closeModal: (key: string) => void
  isModalOpen: (key: string) => boolean
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
    }),
    {
      name: "ui-store",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
)
