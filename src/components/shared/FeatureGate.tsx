"use client"

import { useFlags } from "@/lib/api/flags"

interface FeatureGateProps {
  flag: string
  orgId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ flag, orgId, children, fallback = null }: FeatureGateProps) {
  const { data: flags } = useFlags(orgId)
  const enabled = flags?.find((f) => f.key === flag)?.enabled ?? false
  if (!enabled) return <>{fallback}</>
  return <>{children}</>
}
