import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect("/login")

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
          <span style={{ color: "var(--color-muted)" }}>{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
