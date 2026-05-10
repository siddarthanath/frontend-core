import { type Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export const metadata: Metadata = { title: "Reset password" }

export default function ResetPasswordPage() {
  return (
    <>
      <h1
        className="text-xl font-bold mb-2"
        style={{ color: "var(--color-foreground)" }}
      >
        Reset your password
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
        Enter your email and we&apos;ll send a reset link.
      </p>
      <ResetPasswordForm />
    </>
  )
}
