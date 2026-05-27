"use client"

import { useEffect, useLayoutEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { useAuthStore } from "@/stores/auth"

interface Props {
  user: User
  initialOrg?: { id: string; name: string } | null
}

const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

export function HydrateAuthStore({ user, initialOrg }: Props) {
  useSafeLayoutEffect(() => {
    const store = useAuthStore.getState()
    store.setUser(user)
    if (initialOrg) store.setCurrentOrg(initialOrg)
  }, [user, initialOrg])
  return null
}
