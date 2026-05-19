"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Shield } from "lucide-react"
import { useUpdatePassword, useUpdateEmail } from "@/lib/api/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SecuritySection() {
  const [newPassword, setNewPassword] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const updatePassword = useUpdatePassword()
  const updateEmail = useUpdateEmail()

  async function handlePasswordUpdate() {
    try {
      await updatePassword.mutateAsync({ new_password: newPassword })
      toast.success("Password updated")
      setNewPassword("")
    } catch {
      toast.error("Failed to update password")
    }
  }

  async function handleEmailUpdate() {
    try {
      await updateEmail.mutateAsync({ new_email: newEmail })
      toast.success("Check your new email address for a confirmation link")
      setNewEmail("")
    } catch {
      toast.error("Failed to update email")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Security</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your password, email, and two-factor authentication.</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-fg">Change password</p>
          <p className="text-xs text-fg-3 mt-0.5">Set a new password for your account.</p>
        </div>
        <div className="flex flex-col gap-1.5 max-w-xs">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <Button
          size="sm"
          className="self-start"
          disabled={!newPassword || updatePassword.isPending}
          onClick={handlePasswordUpdate}
        >
          {updatePassword.isPending ? "Updating…" : "Update password"}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-fg">Change email</p>
          <p className="text-xs text-fg-3 mt-0.5">A confirmation link will be sent to your new address.</p>
        </div>
        <div className="flex flex-col gap-1.5 max-w-xs">
          <Label htmlFor="new-email">New email</Label>
          <Input
            id="new-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <Button
          size="sm"
          className="self-start"
          disabled={!newEmail || updateEmail.isPending}
          onClick={handleEmailUpdate}
        >
          {updateEmail.isPending ? "Sending…" : "Update email"}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-fg-3 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-fg">Two-factor authentication</p>
            <p className="text-xs text-fg-3 mt-0.5">Add an extra layer of security with an authenticator app.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" disabled>
          Set up MFA
        </Button>
      </div>
    </div>
  )
}
