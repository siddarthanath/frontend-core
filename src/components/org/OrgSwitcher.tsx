"use client"

import { useEffect } from "react"
import { Building2, Check, ChevronsUpDown } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useOrgs } from "@/lib/api/orgs"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface OrgSwitcherProps {
  collapsed?: boolean
}

function displayLabel(name: string, displayName: string | null): string {
  if (displayName) return `${displayName}'s workspace`
  return name
}

export function OrgSwitcher({ collapsed = false }: OrgSwitcherProps) {
  const { currentOrg, setCurrentOrg, displayName } = useAuthStore()
  const { data: orgs = [] } = useOrgs()
  const label = currentOrg ? displayLabel(currentOrg.name, displayName) : "Select workspace"

  // Safety net: if the settings modal opens before useAutoSelectOrg has fired on the
  // current page, currentOrg may still be null. Auto-select the first org here.
  useEffect(() => {
    if (!currentOrg && orgs.length > 0) {
      setCurrentOrg({ id: orgs[0].id, name: orgs[0].name })
    }
  }, [orgs, currentOrg, setCurrentOrg])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Switch organisation — current: ${label}`}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm w-full transition-colors",
            "text-fg-2 hover:bg-bg-2 hover:text-fg",
            collapsed && "justify-center"
          )}
          title={collapsed ? label : undefined}
        >
          <Building2 size={16} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left">{label}</span>
              <ChevronsUpDown size={14} className="text-fg-3 shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" side="top">
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => setCurrentOrg({ id: org.id, name: org.name })}
            className="flex items-center gap-2"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-brand text-white text-xs font-bold shrink-0">
              {(displayName ?? org.name).charAt(0).toUpperCase()}
            </span>
            <span className="flex-1 truncate">{displayLabel(org.name, displayName)}</span>
            {currentOrg?.id === org.id && <Check size={14} className="text-brand shrink-0" />}
          </DropdownMenuItem>
        ))}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
