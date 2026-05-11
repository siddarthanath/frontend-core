"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Settings, CreditCard, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/stores/auth"
import { useSubscription } from "@/lib/api/billing"
import type { Plan } from "@/types/billing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MENU_ITEMS = [
  { href: "/app/settings/members", label: "Members", icon: Users },
  { href: "/app/settings/org", label: "Organisation", icon: Settings },
  { href: "/app/settings/billing", label: "Billing", icon: CreditCard },
]

const PLAN_LABELS: Record<Plan, string> = {
  free: "Free plan",
  pro: "Pro plan",
  enterprise: "Enterprise plan",
}

interface UserMenuProps {
  email: string
  displayName: string | null
  collapsed: boolean
}

export function UserMenu({ email, displayName, collapsed }: UserMenuProps) {
  const router = useRouter()
  const currentOrg = useAuthStore((s) => s.currentOrg)
  const { data: subscription } = useSubscription(currentOrg?.id ?? "")
  const planLabel = PLAN_LABELS[subscription?.plan ?? "free"]
  const initial = (displayName ?? email).charAt(0).toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const avatar = (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-on text-xs font-semibold">
      {initial}
    </span>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {collapsed ? (
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-on text-xs font-semibold hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="User menu"
          >
            {initial}
          </button>
        ) : (
          <button className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-bg-2 transition-colors text-left focus:outline-none">
            {avatar}
            <div className="flex flex-col flex-1 min-w-0">
              {displayName && (
                <span className="text-sm font-medium text-fg truncate leading-tight">{displayName}</span>
              )}
              <span className="text-xs text-fg-3 leading-tight">{planLabel}</span>
            </div>
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" side="top" align="start">
        <DropdownMenuLabel className="text-xs font-normal text-fg-3 truncate py-2">
          {email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-center gap-2">
              <Icon size={14} className="shrink-0" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleSignOut}
          className="flex items-center gap-2 text-fg-2"
        >
          <LogOut size={14} className="shrink-0" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
