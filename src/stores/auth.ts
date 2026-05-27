"use client"

import { create } from "zustand"
import type { User } from "@supabase/supabase-js"

interface OrgContext {
  id: string
  name: string
}

interface AuthState {
  user: User | null
  displayName: string | null
  setUser: (user: User | null) => void
  setDisplayName: (name: string | null) => void

  currentOrg: OrgContext | null
  setCurrentOrg: (org: OrgContext | null) => void

  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  displayName: null,
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    displayName: (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? null,
    ...(user === null ? { currentOrg: null } : {}),
  }),
  setDisplayName: (name) => set({ displayName: name }),

  currentOrg: null,
  setCurrentOrg: (org) => set({ currentOrg: org }),

  isAuthenticated: false,
}))
