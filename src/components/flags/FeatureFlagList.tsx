"use client"

import { useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useFlags, useUpsertFlag, useDeleteFlag } from "@/lib/api/flags"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface FeatureFlagListProps {
  orgId: string
}

export function FeatureFlagList({ orgId }: FeatureFlagListProps) {
  const { data: flags, isLoading } = useFlags(orgId)
  const upsert = useUpsertFlag(orgId)
  const deleteFlag = useDeleteFlag(orgId)
  const [showForm, setShowForm] = useState(false)
  const [newKey, setNewKey] = useState("")
  const [newDesc, setNewDesc] = useState("")

  async function handleToggle(key: string, enabled: boolean, description: string | null) {
    try {
      await upsert.mutateAsync({ key, enabled: !enabled, description: description ?? undefined })
    } catch {
      toast.error("Failed to update flag")
    }
  }

  async function handleDelete(flagId: string, key: string) {
    // window.confirm is intentional — this is an internal admin action; replace with
    // shadcn AlertDialog if a polished confirmation UI is needed in the product layer.
    if (!window.confirm(`Delete flag "${key}"? This will immediately affect all flag checks.`)) return
    try {
      await deleteFlag.mutateAsync(flagId)
      toast.success(`"${key}" deleted`)
    } catch {
      toast.error("Failed to delete flag")
    }
  }

  async function handleCreate() {
    const key = newKey.trim()
    if (!key || !/^[a-z0-9_]+$/.test(key)) {
      toast.error("Key must be lowercase letters, numbers, and underscores only")
      return
    }
    try {
      await upsert.mutateAsync({ key, enabled: false, description: newDesc.trim() || undefined })
      setShowForm(false)
      setNewKey("")
      setNewDesc("")
    } catch {
      toast.error("Failed to create flag")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-fg">Feature Flags</p>
          <p className="text-xs text-fg-3 mt-0.5">Toggle features on or off per org without redeploying.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} />
          Add flag
        </Button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-2">
          <Input
            placeholder="flag_key (lowercase, underscores)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="font-mono text-sm"
          />
          <Input
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button size="sm" disabled={!newKey.trim() || upsert.isPending} onClick={handleCreate}>
              {upsert.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !flags || flags.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-fg-3 text-center">
          No flags yet. Create one to start gating features per org.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border overflow-hidden">
          {flags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between px-4 py-3 bg-surface hover:bg-bg-2 transition-colors">
              <div className="flex flex-col gap-0.5 min-w-0">
                <code className="text-sm font-mono text-fg">{flag.key}</code>
                {flag.description && (
                  <p className="text-xs text-fg-3 truncate">{flag.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(flag.key, flag.enabled, flag.description)}
                  disabled={upsert.isPending}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    flag.enabled
                      ? "bg-brand-dim text-brand-fg"
                      : "bg-bg-2 text-fg-3 hover:bg-bg-3"
                  )}
                >
                  {flag.enabled ? "On" : "Off"}
                </button>
                <button
                  onClick={() => handleDelete(flag.id, flag.key)}
                  disabled={deleteFlag.isPending}
                  className="text-fg-3 hover:text-error transition-colors p-1"
                  aria-label={`Delete ${flag.key}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
