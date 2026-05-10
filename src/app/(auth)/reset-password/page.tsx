import { type Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export const metadata: Metadata = { title: "Reset password" }

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-xl font-bold mb-2 text-fg">Reset your password</h1>
      <p className="text-sm mb-6 text-fg-3">
        Enter your email and we&apos;ll send a reset link.
      </p>
      <ResetPasswordForm />
    </>
  )
}
