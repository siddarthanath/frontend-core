"use client"

import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SecuritySection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Security</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage two-factor authentication and active sessions.</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-fg-3 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-fg">Two-factor authentication</p>
            <p className="text-xs text-fg-3 mt-0.5">Add an extra layer of security to your account with an authenticator app.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" disabled>
          Set up MFA
        </Button>
      </div>
    </div>
  )
}
