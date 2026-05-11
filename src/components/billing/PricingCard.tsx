import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Plan } from "@/types/billing"

interface PricingCardProps {
  plan: Plan
  price: string
  description: string
  features: string[]
  isCurrentPlan: boolean
  isFeatured?: boolean
  onUpgrade?: () => void
  loading?: boolean
}

export function PricingCard({
  plan,
  price,
  description,
  features,
  isCurrentPlan,
  isFeatured = false,
  onUpgrade,
  loading = false,
}: PricingCardProps) {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-6 gap-5",
        isFeatured ? "border-brand bg-brand-dim/20" : "border-border bg-surface"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-fg uppercase tracking-wide">{planLabel}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-fg">{price}</span>
          {plan !== "free" && <span className="text-sm text-fg-3">/month</span>}
        </div>
        <p className="text-sm text-fg-2">{description}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-fg-2">
            <Check size={14} className="text-brand shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Button
        className="mt-auto w-full"
        variant={isFeatured ? "default" : "outline"}
        disabled={isCurrentPlan || loading}
        onClick={onUpgrade}
      >
        {isCurrentPlan ? "Current plan" : plan === "free" ? "Continue for free" : `Upgrade to ${planLabel}`}
      </Button>
    </div>
  )
}
