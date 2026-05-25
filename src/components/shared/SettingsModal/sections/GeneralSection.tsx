"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useCurrentUser, useUpdateProfile, useUpdatePassword, useUpdateEmail } from "@/lib/api/user"
import type { UserMeResponse } from "@/lib/api/user"
import { ErrorState } from "@/components/shared/ErrorState"
import { PasswordChecklist } from "@/components/auth/PasswordChecklist"
import { validatePassword } from "@/lib/auth/password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function GeneralSection() {
  const { data: me, isError, refetch } = useCurrentUser()

  if (isError) return <ErrorState message="Failed to load profile." onRetry={() => refetch()} />
  if (!me) return null

  return <GeneralForm me={me} />
}

function GeneralForm({ me }: { me: UserMeResponse }) {
  const { user } = useAuthStore()
  const updateProfile = useUpdateProfile()
  const updatePassword = useUpdatePassword()
  const updateEmail = useUpdateEmail()

  const [firstName, setFirstName] = useState(me.first_name ?? "")
  const [lastName, setLastName] = useState(me.last_name ?? "")
  const [newPassword, setNewPassword] = useState("")
  const [showEmailChange, setShowEmailChange] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  // OAuth-only users (Google, Microsoft) have no Supabase password to change.
  // identities contains one entry per sign-in method — absence of "email" means password auth was never set up.
  const hasEmailAuth = user?.identities?.some((id) => id.provider === "email") ?? false
  // Supabase sets new_email on the user object while a change is awaiting confirmation.
  const pendingEmail = user?.new_email

  async function handleChangeEmail() {
    try {
      await updateEmail.mutateAsync({ new_email: newEmail })
      setNewEmail("")
      setShowEmailChange(false)
      toast.success("Confirmation sent to both addresses — check your inbox.")
    } catch {
      toast.error("Failed to update email")
    }
  }

  async function handleSave() {
    try {
      await updateProfile.mutateAsync({ first_name: firstName || null, last_name: lastName || null })
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  async function handleChangePassword() {
    const error = validatePassword(newPassword)
    if (error) {
      toast.error(error)
      return
    }
    try {
      await updatePassword.mutateAsync({ new_password: newPassword })
      setNewPassword("")
      toast.success("Password updated")
    } catch {
      toast.error("Failed to update password")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-base font-semibold text-fg">General</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your name and account details.</p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled className="text-fg-3" />
          {pendingEmail && (
            <p className="text-xs text-amber-600">
              Confirmation sent to <strong>{pendingEmail}</strong> — check both inboxes.
            </p>
          )}
          {!pendingEmail && hasEmailAuth && !showEmailChange && (
            <button
              type="button"
              onClick={() => setShowEmailChange(true)}
              className="text-xs text-brand underline self-start"
            >
              Change email
            </button>
          )}
          {!pendingEmail && !hasEmailAuth && (
            <p className="text-xs text-fg-3">Managed by your social account provider.</p>
          )}
          {showEmailChange && (
            <div className="flex flex-col gap-2 mt-1">
              <Input
                id="new-email"
                type="email"
                placeholder="New email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleChangeEmail}
                  disabled={!newEmail || updateEmail.isPending}
                >
                  {updateEmail.isPending ? "Sending…" : "Send confirmation"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowEmailChange(false); setNewEmail("") }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
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

      <div className="flex flex-col gap-4 max-w-sm">
        <div>
          <h3 className="text-sm font-semibold text-fg">Change password</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            disabled={!hasEmailAuth}
          />
          <PasswordChecklist password={newPassword} />
        </div>

        <Button
          onClick={handleChangePassword}
          disabled={!hasEmailAuth || updatePassword.isPending || !newPassword || !!validatePassword(newPassword)}
          variant="outline"
          className="self-start"
        >
          {updatePassword.isPending ? "Updating…" : "Update password"}
        </Button>
      </div>
    </div>
  )
}
