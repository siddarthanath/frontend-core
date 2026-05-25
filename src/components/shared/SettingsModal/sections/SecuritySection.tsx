"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useUpdatePassword, useUpdateEmail } from "@/lib/api/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsCard } from "@/components/shared/SettingsModal/SettingsCard"

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

      <form onSubmit={(e) => { e.preventDefault(); handlePasswordUpdate() }}>
        <SettingsCard
          title="Change password"
          description="Set a new password for your account."
          footer={
            <Button type="submit" size="sm" disabled={!newPassword || updatePassword.isPending}>
              {updatePassword.isPending ? "Updating…" : "Update password"}
            </Button>
          }
        >
          <div className="flex flex-col gap-1.5 max-w-xs">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </SettingsCard>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); handleEmailUpdate() }}>
        <SettingsCard
          title="Change email"
          description="A confirmation link will be sent to your new address."
          footer={
            <Button type="submit" size="sm" disabled={!newEmail || updateEmail.isPending}>
              {updateEmail.isPending ? "Sending…" : "Update email"}
            </Button>
          }
        >
          <div className="flex flex-col gap-1.5 max-w-xs">
            <Label htmlFor="new-email">New email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </SettingsCard>
      </form>

      <SettingsCard
        title="Two-factor authentication"
        description="Add an extra layer of security with an authenticator app."
        action={
          <Button variant="outline" size="sm" disabled>
            Set up MFA
          </Button>
        }
      />
    </div>
  )
}
