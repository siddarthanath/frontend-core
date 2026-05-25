import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/auth/server"
import { AppShell } from "@/components/layout/AppShell"
import { HydrateAuthStore } from "@/components/shared/HydrateAuthStore"
import type { UserMeResponse } from "@/types/user"

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

  // Fetch user/me server-side to get org context for immediate hydration — eliminates the
  // flash where org-gated queries briefly show "free" defaults before the client-side fetch resolves.
  // getSession() here is safe: user identity is already verified above via getUser().
  const { data: { session } } = await supabase.auth.getSession()
  let initialOrg: { id: string; name: string } | null = null
  if (session?.access_token) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
      const res = await fetch(`${apiUrl}/api/v1/user/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        next: { revalidate: 0 },
      })
      if (res.ok) {
        const me: UserMeResponse = await res.json()
        if (me.org_id && me.org_name) {
          initialOrg = { id: me.org_id, name: me.org_name }
        }
      }
    } catch {
      // Non-fatal — client-side useAutoSelectOrg will recover
    }
  }

  const cookieStore = await cookies()
  const defaultCollapsed = cookieStore.get("sidebar_collapsed")?.value === "true"

  return (
    <>
      <HydrateAuthStore user={user} initialOrg={initialOrg} />
      <AppShell defaultCollapsed={defaultCollapsed}>{children}</AppShell>
    </>
  )
}
