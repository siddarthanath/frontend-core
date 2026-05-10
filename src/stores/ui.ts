"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface UIState {
  sidebarCollapsed: boolean
  sidebarOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void

  theme: Theme
  setTheme: (theme: Theme) => void

  openModals: string[]
  openModal: (key: string) => void
  closeModal: (key: string) => void
  isModalOpen: (key: string) => boolean
}

export const useUiStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),

      theme: "system",
      setTheme: (theme) => {
        set({ theme })
        const dark =
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.documentElement.classList.toggle("dark", dark)
      },

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
      partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
)
