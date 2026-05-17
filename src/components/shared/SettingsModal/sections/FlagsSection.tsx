"use client"

import { useAuthStore } from "@/stores/auth"
import { FeatureFlagList } from "@/components/flags/FeatureFlagList"

export function FlagsSection() {
  const { currentOrg } = useAuthStore()
  const orgId = currentOrg?.id ?? ""

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Feature Flags</h2>
        <p className="text-sm text-fg-3 mt-0.5">Toggle features on or off for this org without redeploying.</p>
      </div>

      <FeatureFlagList orgId={orgId} />
    </div>
  )
}
