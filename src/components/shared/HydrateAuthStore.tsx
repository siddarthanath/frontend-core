"use client"

import { useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { useAuthStore } from "@/stores/auth"

export function HydrateAuthStore({ user }: { user: User }) {
  const setUser = useAuthStore((s) => s.setUser)
  useEffect(() => { setUser(user) }, [user, setUser])
  return null
}
