import { type Metadata } from "next"
import { ConfirmPasswordForm } from "@/components/auth/ConfirmPasswordForm"

export const metadata: Metadata = { title: "Set new password" }

export default function ConfirmPasswordPage() {
  return (
    <>
      <h1 className="text-xl font-bold mb-2 text-fg">Set new password</h1>
      <p className="text-sm mb-6 text-fg-3">Choose a new password for your account.</p>
      <ConfirmPasswordForm />
    </>
  )
}
