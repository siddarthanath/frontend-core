"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth"
import { useOrgs } from "@/lib/api/orgs"

// Called in every (app) page that needs an active org.
// Two behaviours:
//   1. No orgs → redirect to /onboarding/pick-plan (B2C fallback — shouldn't happen
//      because get_me auto-creates a personal org on first login).
//      B2B note: change redirect to /onboarding/create-org so users name their workspace.
//   2. Has orgs but none selected → auto-select the first one.
// During onboarding this hook is NOT used, so no redirect loop.
export function useAutoSelectOrg() {
  const router = useRouter()
  const { currentOrg, setCurrentOrg } = useAuthStore()
  const { data: orgs = [], isLoading } = useOrgs()

  useEffect(() => {
    if (isLoading) return
    if (orgs.length === 0) {
      router.push("/checkout")
      return
    }
    if (!currentOrg) {
      setCurrentOrg({ id: orgs[0].id, name: orgs[0].name })
    }
  }, [orgs, currentOrg, isLoading, router, setCurrentOrg])
}
