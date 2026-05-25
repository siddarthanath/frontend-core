"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut, signOutAll } from "@/lib/auth/client"
import { useDeleteAccount } from "@/lib/api/user"
import { useAuthStore } from "@/stores/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsCard } from "@/components/shared/SettingsModal/SettingsCard"

const CONFIRMATION_PHRASE = "DELETE MY ACCOUNT"

export function AccountSection() {
  const router = useRouter()
  const [confirmation, setConfirmation] = useState("")
  const [signingOut, setSigningOut] = useState(false)
  const deleteAccount = useDeleteAccount()
  const { setUser } = useAuthStore()

  async function handleSignOutAll() {
    setSigningOut(true)
    try {
      await signOutAll()
      setUser(null)
      router.push("/login")
    } catch {
      toast.error("Failed to sign out — try again")
      setSigningOut(false)
    }
  }

  async function handleDelete() {
    if (confirmation !== CONFIRMATION_PHRASE) return
    try {
      await deleteAccount.mutateAsync()
      await signOut()
      setUser(null)
      router.push("/")
    } catch {
      toast.error("Failed to delete account — contact support if this persists")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Account</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your session and account data.</p>
      </div>

      <SettingsCard
        title="Sign out of all devices"
        description="Revokes all active sessions including this one."
        action={
          <Button variant="outline" size="sm" disabled={signingOut} onClick={handleSignOutAll}>
            {signingOut ? "Signing out…" : "Sign out everywhere"}
          </Button>
        }
      />

      <SettingsCard
        title="Delete account"
        description="This action is permanent and cannot be undone. All your data will be deleted immediately."
        className="border-error/40 bg-error/5"
        footer={
          <Button
            variant="destructive"
            size="sm"
            disabled={confirmation !== CONFIRMATION_PHRASE || deleteAccount.isPending}
            onClick={handleDelete}
          >
            {deleteAccount.isPending ? "Deleting…" : "Delete my account"}
          </Button>
        }
      >
        <div className="flex flex-col gap-1.5 max-w-xs">
          <Label htmlFor="confirm-delete" className="text-xs text-fg-3">
            Type <span className="font-mono text-fg">{CONFIRMATION_PHRASE}</span> to confirm
          </Label>
          <Input
            id="confirm-delete"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={CONFIRMATION_PHRASE}
            className="font-mono text-xs"
          />
        </div>
      </SettingsCard>
    </div>
  )
}
