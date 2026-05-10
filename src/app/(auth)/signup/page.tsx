import { type Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/SignupForm"

export const metadata: Metadata = { title: "Create account" }

export default function SignupPage() {
  return (
    <>
      <h1
        className="text-xl font-bold mb-6"
        style={{ color: "var(--color-foreground)" }}
      >
        Create your account
      </h1>
      <SignupForm redirectTo="/app/dashboard" />
      <p className="text-sm mt-4 text-center" style={{ color: "var(--color-muted)" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline"
          style={{ color: "var(--color-brand)" }}
        >
          Sign in
        </Link>
      </p>
    </>
  )
}
