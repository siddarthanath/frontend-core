import { cn } from "@/lib/utils"
import { PLAN_LABELS } from "@/types/billing"
import type { Plan } from "@/types/billing"

interface PlanBadgeProps {
  plan: Plan
  className?: string
}

const PLAN_STYLES: Record<Plan, string> = {
  free: "bg-bg-2 text-fg-2",
  pro: "bg-brand-dim text-brand-fg",
  enterprise: "bg-[hsl(var(--color-warning)/0.15)] text-[hsl(var(--color-warning))]",
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        PLAN_STYLES[plan],
        className
      )}
    >
      {PLAN_LABELS[plan]}
    </span>
  )
}
