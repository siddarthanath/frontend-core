import { type Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <>
      <h1 className="text-xl font-bold mb-6 text-fg">Sign in</h1>
      <LoginForm redirectTo="/app/dashboard" />
      <p className="text-sm mt-4 text-center text-fg-3">
        No account?{" "}
        <Link href="/signup" className="underline text-brand">
          Sign up free
        </Link>
      </p>
      <p className="text-sm mt-2 text-center">
        <Link href="/reset-password" className="underline text-fg-3">
          Forgot password?
        </Link>
      </p>
    </>
  )
}
