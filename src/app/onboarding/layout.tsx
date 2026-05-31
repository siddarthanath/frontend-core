import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/auth/server"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { HydrateAuthStore } from "@/lib/auth/HydrateAuthStore"

// Onboarding is authenticated but has no AppShell.
// Session guard mirrors (app)/layout.tsx — unauthenticated users go to /login.
//
// B2C pattern (current): one-step flow — pick plan → /app/dashboard.
// Personal org is auto-created silently in get_me; user never sees it.
//
// B2B note: restore two-step flow by re-adding /onboarding/create-org before this page.
// Users should explicitly name their workspace (team concept, e.g. Linear, Vercel, Notion).
// Also revert signup redirectTo and useAutoSelectOrg fallback to /onboarding/create-org.
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect("/login")

  return (
    <>
      <HydrateAuthStore user={user} />
      <div className="min-h-screen flex flex-col bg-bg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/vercel.svg" alt="Logo" width={16} height={16} className="dark:invert" />
            <span className="text-sm font-semibold text-fg">Template</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          {children}
        </div>
      </div>
    </>
  )
}
