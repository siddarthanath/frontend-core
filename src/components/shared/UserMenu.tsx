"use client"

import { useRouter } from "next/navigation"
import { Settings, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth/client"
import { useUiStore } from "@/stores/ui"
import { useSubscription } from "@/lib/api/billing"
import { useCurrentUser } from "@/lib/api/user"
import { PLAN_LABELS_LONG } from "@/types/billing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
  email: string
  displayName: string | null
  collapsed: boolean
}

export function UserMenu({ email, displayName, collapsed }: UserMenuProps) {
  const router = useRouter()
  const { openSettings } = useUiStore()
  const { data: me } = useCurrentUser()
  const orgId = me?.org_id ?? ""
  const { data: subscription } = useSubscription(orgId)
  const planLabel = PLAN_LABELS_LONG[subscription?.plan ?? "free"]
  const initial = (displayName ?? email).charAt(0).toUpperCase()

  async function handleSignOut() {
    await signOut()
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

        <DropdownMenuItem onSelect={() => openSettings("general")} className="flex items-center gap-2 text-fg-2">
          <Settings size={14} className="shrink-0" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleSignOut} className="flex items-center gap-2 text-fg-2">
          <LogOut size={14} className="shrink-0" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
