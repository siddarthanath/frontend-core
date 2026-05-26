"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useUpdatePassword, useUpdateEmail } from "@/lib/api/user"
import { createClient } from "@/lib/auth/client"
import { validatePassword } from "@/lib/auth/password"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsCard } from "@/components/shared/SettingsModal/SettingsCard"

export function SecuritySection() {
  const { user } = useAuthStore()
  const hasEmailProvider = user?.identities?.some((i) => i.provider === "email") ?? false

  const [currentPassword, setCurrentPassword] = useState("")
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState("")

  const updatePassword = useUpdatePassword()
  const updateEmail = useUpdateEmail()

  async function handlePasswordUpdate() {
    const strengthError = validatePassword(newPassword)
    if (strengthError) {
      setNewPasswordError(strengthError)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: currentPassword,
    })
    if (authError) {
      setCurrentPasswordError("Incorrect password")
      return
    }

    try {
      await updatePassword.mutateAsync({ new_password: newPassword })
      toast.success("Password updated")
      setCurrentPassword("")
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

      {hasEmailProvider && (
        <form onSubmit={(e) => { e.preventDefault(); handlePasswordUpdate() }}>
          <SettingsCard
            title="Change password"
            description="Set a new password for your account."
            footer={
              <Button
                type="submit"
                size="sm"
                disabled={!currentPassword || !newPassword || updatePassword.isPending}
              >
                {updatePassword.isPending ? "Updating…" : "Update password"}
              </Button>
            }
          >
            <div className="flex flex-col gap-3 max-w-xs">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    setCurrentPasswordError(null)
                  }}
                  placeholder="••••••••"
                  className={cn(currentPasswordError && "border-error focus-visible:ring-error")}
                  required
                />
                {currentPasswordError && (
                  <p className="text-xs text-error">{currentPasswordError}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setNewPasswordError(null)
                  }}
                  onBlur={() => {
                    if (newPassword) setNewPasswordError(validatePassword(newPassword) ?? null)
                  }}
                  placeholder="••••••••"
                  className={cn(newPasswordError && "border-error focus-visible:ring-error")}
                  required
                />
                {newPasswordError && (
                  <p className="text-xs text-error">{newPasswordError}</p>
                )}
              </div>
            </div>
          </SettingsCard>
        </form>
      )}

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
