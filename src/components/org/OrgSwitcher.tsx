"use client"

import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth"
import { useOrgs } from "@/lib/api/orgs"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface OrgSwitcherProps {
  collapsed?: boolean
}

export function OrgSwitcher({ collapsed = false }: OrgSwitcherProps) {
  const router = useRouter()
  const { currentOrg, setCurrentOrg } = useAuthStore()
  const { data: orgs = [] } = useOrgs()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm w-full",
            "text-fg hover:bg-bg-2 transition-colors",
            collapsed && "justify-center px-1.5"
          )}
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand text-white text-xs font-bold"
          >
            {currentOrg ? currentOrg.name[0].toUpperCase() : "?"}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left font-medium">
                {currentOrg?.name ?? "Select org"}
              </span>
              <ChevronsUpDown size={14} className="text-fg-3 shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setCurrentOrg({ id: org.id, name: org.name })}
            className="flex items-center gap-2"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-brand text-white text-xs font-bold shrink-0">
              {org.name[0].toUpperCase()}
            </span>
            <span className="flex-1 truncate">{org.name}</span>
            {currentOrg?.id === org.id && <Check size={14} className="text-brand shrink-0" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => router.push("/app/settings/org?create=1")}
          className="flex items-center gap-2 text-fg-2"
        >
          <Plus size={14} />
          <span>New organisation</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
