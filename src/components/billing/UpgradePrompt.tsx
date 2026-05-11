import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"

interface UpgradePromptProps {
  message?: string
}

export function UpgradePrompt({ message = "This feature requires a Pro plan." }: UpgradePromptProps) {
  const { currentOrg } = useAuthStore()

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dim">
        <Zap size={18} className="text-brand" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-fg">{message}</p>
        <p className="text-xs text-fg-3">Upgrade your plan to unlock this feature.</p>
      </div>
      {currentOrg && (
        <Button size="sm" asChild>
          <Link href="/app/settings/billing">View plans</Link>
        </Button>
      )}
    </div>
  )
}
