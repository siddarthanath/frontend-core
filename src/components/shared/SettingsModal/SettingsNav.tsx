"use client"

import { User, Palette, CreditCard, Shield, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SettingsSection } from "@/lib/modal-keys"

// NOTE: ApiKeysSection and FlagsSection are intentionally absent from this nav.
// Add them here when the product layer is ready to expose them to end users.
const NAV_ITEMS: { section: SettingsSection; label: string; icon: React.ElementType }[] = [
  { section: "general",         label: "General",         icon: User },
  { section: "personalisation", label: "Personalisation", icon: Palette },
  { section: "billing",         label: "Billing",         icon: CreditCard },
  { section: "security",        label: "Security",        icon: Shield },
  { section: "account",         label: "Account",         icon: Trash2 },
]

interface SettingsNavProps {
  active: SettingsSection
  onSelect: (section: SettingsSection) => void
}

export function SettingsNav({ active, onSelect }: SettingsNavProps) {
  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {NAV_ITEMS.map(({ section, label, icon: Icon }) => (
        <button
          key={section}
          onClick={() => onSelect(section)}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors text-left w-full",
            active === section
              ? "bg-brand-dim text-brand-fg font-medium"
              : "text-fg-2 hover:bg-bg-2 hover:text-fg"
          )}
        >
          <Icon size={15} className="shrink-0" />
          {label}
        </button>
      ))}
    </nav>
  )
}
