"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useCurrentUser, useUpdateProfile } from "@/lib/api/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function GeneralSection() {
  const { user } = useAuthStore()
  const { data: me } = useCurrentUser()
  const updateProfile = useUpdateProfile()

  const [firstName, setFirstName] = useState(me?.first_name ?? "")
  const [lastName, setLastName] = useState(me?.last_name ?? "")

  useEffect(() => {
    if (me) {
      setFirstName(me.first_name ?? "")
      setLastName(me.last_name ?? "")
    }
  }, [me])

  async function handleSave() {
    try {
      await updateProfile.mutateAsync({ first_name: firstName || null, last_name: lastName || null })
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">General</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your name and account details.</p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled className="text-fg-3" />
          <p className="text-xs text-fg-3">Email changes are managed via Supabase auth settings.</p>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="self-start"
        >
          {updateProfile.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
