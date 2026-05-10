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
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

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
