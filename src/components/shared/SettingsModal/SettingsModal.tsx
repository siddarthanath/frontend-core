"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/stores/ui"
import { SettingsNav } from "./SettingsNav"
import { GeneralSection } from "./sections/GeneralSection"
import { BillingSection } from "./sections/BillingSection"
import { SecuritySection } from "./sections/SecuritySection"
import { AccountSection } from "./sections/AccountSection"
import type { SettingsSection } from "@/lib/modal-keys"

const VALID_SECTIONS: SettingsSection[] = ["general", "billing", "security", "account"]

function SectionContent({ section }: { section: SettingsSection }) {
  switch (section) {
    case "general":  return <GeneralSection />
    case "billing":  return <BillingSection />
    case "security": return <SecuritySection />
    case "account":  return <AccountSection />
  }
}

export function SettingsModal() {
  const { isModalOpen, settingsSection, openSettings, closeSettings } = useUiStore()
  const open = isModalOpen("settings")

  // Open from URL hash on mount (e.g. /app/dashboard#settings-billing)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash.startsWith("settings")) {
      const section = hash.split("-")[1] as SettingsSection
      openSettings(VALID_SECTIONS.includes(section) ? section : "general")
    }
  }, [openSettings])

  // Sync URL hash with modal state
  useEffect(() => {
    if (open) {
      history.replaceState(null, "", `${window.location.pathname}#settings-${settingsSection}`)
    } else {
      history.replaceState(null, "", window.location.pathname)
    }
  }, [open, settingsSection])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeSettings() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, closeSettings])

  // Trap scroll on body while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeSettings}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal
        aria-label="Settings"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "flex w-[min(860px,95vw)] h-[min(620px,90vh)] overflow-hidden",
          "rounded-xl border border-border bg-bg shadow-2xl"
        )}
      >
        {/* Left nav */}
        <div className="w-48 shrink-0 border-r border-border bg-surface flex flex-col">
          <div className="px-4 py-4 border-b border-border">
            <p className="text-xs font-semibold text-fg-3 uppercase tracking-wider">Settings</p>
          </div>
          <SettingsNav active={settingsSection} onSelect={(s) => openSettings(s)} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <button
            onClick={closeSettings}
            className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-md text-fg-3 hover:bg-bg-2 hover:text-fg transition-colors"
            aria-label="Close settings"
          >
            <X size={15} />
          </button>

          <SectionContent section={settingsSection} />
        </div>
      </div>
    </>
  )
}
