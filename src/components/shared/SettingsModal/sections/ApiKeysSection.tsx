"use client"

import { useAuthStore } from "@/stores/auth"
import { ApiKeyList } from "@/components/api-keys/ApiKeyList"

export function ApiKeysSection() {
  const { currentOrg } = useAuthStore()
  const orgId = currentOrg?.id ?? ""

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">API Keys</h2>
        <p className="text-sm text-fg-3 mt-0.5">Generate keys for programmatic access to this org&apos;s resources.</p>
      </div>

      <ApiKeyList orgId={orgId} />
    </div>
  )
}
