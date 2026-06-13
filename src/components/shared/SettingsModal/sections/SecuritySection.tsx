"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useUpdatePassword } from "@/lib/api/user"
import { ApiResponseError } from "@/lib/api/client"
import { validatePassword } from "@/lib/auth/password"
import { cn } from "@/lib/utils"
import { FieldError } from "@/components/shared/FeedbackStates/FieldError"
import { PasswordChecklist } from "@/components/auth/PasswordChecklist"
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

  const updatePassword = useUpdatePassword()

  async function handlePasswordUpdate() {
    const strengthError = validatePassword(newPassword)
    if (strengthError) {
      setNewPasswordError(strengthError)
      return
    }

    // The current password is verified server-side (the API re-authenticates it).
    // A wrong password returns VALIDATION_ERROR, which we surface on the field below.
    try {
      await updatePassword.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
      })
      toast.success("Password updated")
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      // The API tags a wrong current password with detail="current_password" so we
      // attribute it to the right field — any other VALIDATION_ERROR isn't about
      // this field (new-password strength is already checked above), so we toast it.
      if (
        err instanceof ApiResponseError &&
        err.error.code === "VALIDATION_ERROR" &&
        err.error.detail === "current_password"
      ) {
        setCurrentPasswordError("Incorrect password")
      } else {
        toast.error("Failed to update password")
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Security</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your password.</p>
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
                <FieldError message={currentPasswordError} />
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
                  placeholder="••••••••"
                  className={cn(newPasswordError && "border-error focus-visible:ring-error")}
                  required
                />
                <PasswordChecklist password={newPassword} />
                <FieldError message={newPasswordError} />
              </div>
            </div>
          </SettingsCard>
        </form>
      )}

      {/*
        EMAIL CHANGE — intentionally disabled in this template.
        Email is treated as fixed (as it is for OAuth accounts) because changing it
        safely requires infrastructure this template does not ship:
          1. A transactional email provider (e.g. Resend) to send a confirmation link
             to the NEW address before the change takes effect.
          2. Server-side re-authentication (current password), same pattern as the
             password change above — a stolen JWT must not be able to seize the
             account by swapping the email.
          3. Syncing the new address into user_profiles.email AND updating Supabase
             auth, so the app-level row and the auth row never diverge.
        To re-enable: implement the above, then uncomment the backend
        PUT /user/email handler (src/api/v1/user.py) and restore a "Change email"
        SettingsCard here wired to a useUpdateEmail() mutation.
      */}

      {/*
        TWO-FACTOR AUTH — not implemented. Supabase supports MFA (TOTP) via
        supabase.auth.mfa.*. To add: enrol a factor, show the QR code, verify the
        first code, then require a challenge on sign-in. Left out of the template
        to keep the auth surface minimal.
      */}
    </div>
  )
}
