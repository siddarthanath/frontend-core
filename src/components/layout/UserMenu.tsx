"use client"

import { useRouter } from "next/navigation"
import { Settings, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth/client"
import { useAuthStore } from "@/stores/auth"
import { useUiStore } from "@/stores/ui"
import { useSubscription } from "@/lib/api/billing"
import { useCurrentUser } from "@/lib/api/user"
import { PLAN_LABELS_LONG } from "@/types/billing"
import { cn } from "@/lib/utils"
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

  const { setUser } = useAuthStore()

  async function handleSignOut() {
    await signOut()
    setUser(null)
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2.5 w-full px-3 h-13 hover:bg-bg-2 transition-colors text-left focus:outline-none"
          aria-label="User menu"
        >
          {/* Avatar — single persistent element, never remounts, prevents brand-colour flash on collapse */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-brand-on text-[16px] font-bold select-none">
            {initial}
          </span>
          <div
            className={cn(
              "flex flex-col min-w-0 overflow-hidden transition-[max-width,opacity] duration-200",
              collapsed ? "max-w-0 opacity-0" : "max-w-full flex-1 opacity-100"
            )}
          >
            {displayName && (
              <span className="text-sm font-medium text-fg truncate leading-tight">{displayName}</span>
            )}
            <span className="text-xs text-fg-3 leading-tight">{planLabel}</span>
          </div>
        </button>
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
