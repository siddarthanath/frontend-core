"use client"

import { useTheme } from "next-themes"
import { Monitor, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { OrgSwitcher } from "@/components/org/OrgSwitcher"
import { SettingsCard } from "@/components/shared/SettingsModal/SettingsCard"

const APPEARANCE_OPTIONS = [
  { value: "system", icon: Monitor, label: "System" },
  { value: "light",  icon: Sun,     label: "Light" },
  { value: "dark",   icon: Moon,    label: "Dark" },
] as const

export function PersonalisationSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Personalisation</h2>
        <p className="text-sm text-fg-3 mt-0.5">Customise your workspace and appearance.</p>
      </div>

      <SettingsCard title="Workspace" description="Switch between your workspaces.">
        <OrgSwitcher />
      </SettingsCard>

      <SettingsCard title="Appearance" description="Choose your preferred theme.">
        <div className="flex items-center justify-between">
          <span className="text-sm text-fg-2">Theme</span>
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {APPEARANCE_OPTIONS.map(({ value, icon: Icon, label }) => (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setTheme(value)}
                    aria-label={label}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                      theme === value ? "bg-bg-2 text-fg shadow-sm" : "text-fg-3 hover:text-fg"
                    )}
                  >
                    <Icon size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
