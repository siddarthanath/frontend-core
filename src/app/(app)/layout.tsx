import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LayoutDashboard, Users, Settings, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AppShell } from "@/components/layout/AppShell"
import { HydrateAuthStore } from "@/components/shared/HydrateAuthStore"
import type { NavItem } from "@/types/nav"

const NAV_ITEMS: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/settings/members", label: "Members", icon: Users },
  { href: "/app/settings/org", label: "Organisation", icon: Settings },
  { href: "/app/settings/billing", label: "Billing", icon: CreditCard },
]

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

  const cookieStore = await cookies()
  const defaultCollapsed = cookieStore.get("sidebar_collapsed")?.value === "true"

  return (
    <>
      <HydrateAuthStore user={user} />
      <AppShell navItems={NAV_ITEMS} defaultCollapsed={defaultCollapsed}>{children}</AppShell>
    </>
  )
}
