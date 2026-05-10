import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/SignOutButton"

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
    <div style={{ background: "var(--color-background)", minHeight: "100vh" }}>
      {/* Minimal header — replaced by full AppShell + Sidebar in Round 3 */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b text-sm"
        style={{
          borderColor: "color-mix(in srgb, var(--color-muted) 20%, transparent)",
        }}
      >
        <span style={{ color: "var(--color-foreground)", fontWeight: 600 }}>
          frontend-core
        </span>
        <div className="flex items-center gap-4">
          <span style={{ color: "var(--color-muted)" }}>{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
