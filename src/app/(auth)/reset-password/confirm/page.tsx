import { type Metadata } from "next"
import { ConfirmPasswordForm } from "@/components/auth/ConfirmPasswordForm"

export const metadata: Metadata = { title: "Set new password" }

export default function ConfirmPasswordPage() {
  return (
    <>
      <h1
        className="text-xl font-bold mb-2"
        style={{ color: "var(--color-foreground)" }}
      >
        Set new password
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Choose a new password for your account.
      </p>
      <ConfirmPasswordForm />
    </>
  )
}
