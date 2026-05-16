"use client"

import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { useApiKeys, useRevokeApiKey } from "@/lib/api/api-keys"
import { CreateApiKeyModal } from "./CreateApiKeyModal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ApiKeyListProps {
  orgId: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB")
}

export function ApiKeyList({ orgId }: ApiKeyListProps) {
  const { data: keys, isLoading } = useApiKeys(orgId)
  const revoke = useRevokeApiKey(orgId)

  async function handleRevoke(keyId: string, name: string) {
    try {
      await revoke.mutateAsync(keyId)
      toast.success(`"${name}" revoked`)
    } catch {
      toast.error("Failed to revoke key")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-fg">API Keys</p>
          <p className="text-xs text-fg-3 mt-0.5">Keys for programmatic access. The raw key is shown once at creation.</p>
        </div>
        <CreateApiKeyModal orgId={orgId} />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !keys || keys.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-fg-3 text-center">
          No API keys yet. Generate one to enable programmatic access.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border overflow-hidden">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-4 py-3 bg-surface hover:bg-bg-2 transition-colors">
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium text-fg truncate">{key.name}</p>
                <div className="flex items-center gap-3 text-xs text-fg-3">
                  <code className="font-mono">{key.key_prefix}…</code>
                  <span>Created {formatDate(key.created_at)}</span>
                  {key.expires_at && <span>Expires {formatDate(key.expires_at)}</span>}
                  {key.last_used_at
                    ? <span>Last used {formatDate(key.last_used_at)}</span>
                    : <span>Never used</span>
                  }
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-fg-3 hover:text-error shrink-0"
                disabled={revoke.isPending}
                onClick={() => handleRevoke(key.id, key.name)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
