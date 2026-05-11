"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useOrg, useUpdateOrg, useCreateOrg, useOrgs } from "@/lib/api/orgs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { Building2 } from "lucide-react"

export function OrgSettingsClient() {
  const { currentOrg, setCurrentOrg } = useAuthStore()
  const { data: org, isLoading } = useOrg(currentOrg?.id ?? "")
  const { data: orgs = [] } = useOrgs()
  const updateOrg = useUpdateOrg(currentOrg?.id ?? "")
  const createOrg = useCreateOrg()

  const [name, setName] = useState("")
  const [newOrgName, setNewOrgName] = useState("")
  const [newOrgSlug, setNewOrgSlug] = useState("")

  useEffect(() => {
    if (org) setName(org.name)
  }, [org])

  // Auto-select first org if none selected
  useEffect(() => {
    if (!currentOrg && orgs.length > 0) {
      setCurrentOrg({ id: orgs[0].id, name: orgs[0].name })
    }
  }, [orgs, currentOrg, setCurrentOrg])

  async function handleUpdate() {
    try {
      const updated = await updateOrg.mutateAsync({ name })
      setCurrentOrg({ id: updated.id, name: updated.name })
      toast.success("Organisation updated")
    } catch {
      toast.error("Failed to update organisation")
    }
  }

  async function handleCreate() {
    try {
      const created = await createOrg.mutateAsync({ name: newOrgName, slug: newOrgSlug })
      setCurrentOrg({ id: created.id, name: created.name })
      setNewOrgName("")
      setNewOrgSlug("")
      toast.success("Organisation created")
    } catch {
      toast.error("Failed to create organisation")
    }
  }

  return (
    <div className="max-w-lg flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-xl font-semibold text-fg">Organisation settings</h1>
        <p className="text-sm text-fg-2 mt-1">Manage your organisation profile.</p>
      </div>

      {/* Edit current org */}
      {currentOrg ? (
        isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-24" />
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); void handleUpdate() }} className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-fg">Edit organisation</h2>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="org-name">Name</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Slug</Label>
              <Input value={org?.slug ?? ""} disabled className="text-fg-3" />
              <p className="text-xs text-fg-3">Slug cannot be changed after creation.</p>
            </div>
            <div>
              <Button type="submit" disabled={updateOrg.isPending || name === org?.name}>
                {updateOrg.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        )
      ) : (
        <EmptyState
          icon={<Building2 size={32} />}
          title="No organisation selected"
          description="Create one below or select from the sidebar."
        />
      )}

      {/* Create new org */}
      <div className="border-t border-border pt-8">
        <form onSubmit={(e) => { e.preventDefault(); void handleCreate() }} className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-fg">Create new organisation</h2>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-slug">Slug</Label>
            <Input
              id="new-slug"
              value={newOrgSlug}
              onChange={(e) => setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="acme-inc"
              required
            />
            <p className="text-xs text-fg-3">Lowercase, alphanumeric and hyphens only.</p>
          </div>
          <div>
            <Button type="submit" variant="outline" disabled={createOrg.isPending}>
              {createOrg.isPending ? "Creating…" : "Create organisation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
