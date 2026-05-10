import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/layout/AppShell"
import { HydrateAuthStore } from "@/components/shared/HydrateAuthStore"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  // getUser() contacts Supabase Auth server to verify the token — use this in server components.
  // Never use getSession() in server components: it reads from cookies only and can be spoofed.
  // proxy.ts uses getSession() intentionally — it's an optimistic check only, and the backend
  // re-verifies the JWT on every API call, so cookie spoofing there has no real security impact.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect("/login")

  return (
    <>
      <HydrateAuthStore user={user} />
      <AppShell>{children}</AppShell>
    </>
  )
}
