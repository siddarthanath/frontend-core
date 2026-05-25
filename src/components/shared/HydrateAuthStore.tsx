"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { useAuthStore } from "@/stores/auth"

// useState initializer runs synchronously before the first render, so children
// read the hydrated store state immediately — no useEffect flash.
export function HydrateAuthStore({ user }: { user: User }) {
  useState(() => useAuthStore.getState().setUser(user))
  return null
}
