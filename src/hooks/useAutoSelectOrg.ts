"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth"
import { useOrgs } from "@/lib/api/orgs"

/** Selects the first org if none is currently active. Call at page level. */
export function useAutoSelectOrg() {
  const { currentOrg, setCurrentOrg } = useAuthStore()
  const { data: orgs = [] } = useOrgs()

  useEffect(() => {
    if (!currentOrg && orgs.length > 0) {
      setCurrentOrg({ id: orgs[0].id, name: orgs[0].name })
    }
  }, [orgs, currentOrg, setCurrentOrg])
}
