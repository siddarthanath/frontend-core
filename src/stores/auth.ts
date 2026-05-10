"use client"

import { create } from "zustand"
import type { User } from "@supabase/supabase-js"

interface OrgContext {
  id: string
  name: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void

  currentOrg: OrgContext | null
  setCurrentOrg: (org: OrgContext | null) => void

  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  currentOrg: null,
  setCurrentOrg: (org) => set({ currentOrg: org }),

  isAuthenticated: false,
}))
