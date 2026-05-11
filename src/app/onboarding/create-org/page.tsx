"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useCreateOrg } from "@/lib/api/orgs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

// B2B pattern: user explicitly names their workspace (visible to teammates).
// B2C: delete this page entirely. Auto-create the org in user.py and go straight to pick-plan.
export default function CreateOrgPage() {
  const router = useRouter()
  const { setCurrentOrg } = useAuthStore()
  const createOrg = useCreateOrg()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(toSlug(value))
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true)
    setSlug(toSlug(value))
  }

  async function handleSubmit() {
    try {
      const org = await createOrg.mutateAsync({ name: name.trim(), slug })
      // Auto-select the new org so pick-plan can read currentOrg.id from the store.
      setCurrentOrg({ id: org.id, name: org.name })
      router.push("/onboarding/pick-plan")
    } catch {
      toast.error("Failed to create organisation")
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-8">
      {/* Step indicator */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        <div className="text-center">
          <p className="text-xs text-fg-3 uppercase tracking-wide font-medium">Step 1 of 2</p>
          <h1 className="text-xl font-bold text-fg mt-1">Create your organisation</h1>
          <p className="text-sm text-fg-2 mt-1">This is your workspace — you can rename it anytime.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Organisation name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Acme Inc."
            required
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="acme-inc"
            required
          />
          <p className="text-xs text-fg-3">Lowercase, alphanumeric and hyphens only. Cannot be changed.</p>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={createOrg.isPending || !name.trim() || !slug.trim()}
        >
          {createOrg.isPending ? "Creating…" : "Continue"}
        </Button>
      </form>
    </div>
  )
}
