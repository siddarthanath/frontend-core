import { type Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/SignupForm"

export const metadata: Metadata = { title: "Create account" }

export default function SignupPage() {
  return (
    <>
      <h1 className="text-xl font-bold mb-6 text-fg">Create your account</h1>
      <SignupForm redirectTo="/onboarding/create-org" />
      <p className="text-sm mt-4 text-center text-fg-3">
        Already have an account?{" "}
        <Link href="/login" className="underline text-brand">
          Sign in
        </Link>
      </p>
    </>
  )
}
