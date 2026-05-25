"use client"

import { useLayoutEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { useAuthStore } from "@/stores/auth"

interface Props {
  user: User
  initialOrg?: { id: string; name: string } | null
}

// useLayoutEffect runs synchronously after DOM mutations and before browser paint —
// no flash, and no "setState during render" violation that useState initializer causes
// when Zustand notifies subscribers (e.g. UserMenu) during the render phase.
export function HydrateAuthStore({ user, initialOrg }: Props) {
  useLayoutEffect(() => {
    const store = useAuthStore.getState()
    store.setUser(user)
    if (initialOrg) store.setCurrentOrg(initialOrg)
  }, [])
  return null
}
