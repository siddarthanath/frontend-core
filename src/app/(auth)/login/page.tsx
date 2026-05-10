import { type Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <>
      <h1
        className="text-xl font-bold mb-6"
        style={{ color: "var(--color-foreground)" }}
      >
        Sign in
      </h1>
      <LoginForm redirectTo="/app/dashboard" />
      <p className="text-sm mt-4 text-center" style={{ color: "var(--color-muted)" }}>
        No account?{" "}
        <Link
          href="/signup"
          className="underline"
          style={{ color: "var(--color-brand)" }}
        >
          Sign up free
        </Link>
      </p>
      <p className="text-sm mt-2 text-center">
        <Link
          href="/reset-password"
          className="underline"
          style={{ color: "var(--color-muted)" }}
        >
          Forgot password?
        </Link>
      </p>
    </>
  )
}
