"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth"
import { useOrgs } from "@/lib/api/orgs"

// Called in every (app) page that needs an active org.
// Two behaviours:
//   1. No orgs at all → redirect to onboarding so the user creates one.
//   2. Has orgs but none selected → auto-select the first one.
// During onboarding itself this hook is NOT used, so no redirect loop.
export function useAutoSelectOrg() {
  const router = useRouter()
  const { currentOrg, setCurrentOrg } = useAuthStore()
  const { data: orgs = [], isLoading } = useOrgs()

  useEffect(() => {
    if (isLoading) return
    if (orgs.length === 0) {
      router.push("/onboarding/create-org")
      return
    }
    if (!currentOrg) {
      setCurrentOrg({ id: orgs[0].id, name: orgs[0].name })
    }
  }, [orgs, currentOrg, isLoading, router, setCurrentOrg])
}
