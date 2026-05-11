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
  showYearlyBanner?: boolean
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
  showYearlyBanner = false,
  onUpgrade,
  loading = false,
}: PricingCardProps) {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const isEnterprise = plan === "enterprise"
  const isFree = plan === "free"

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-6 gap-5 overflow-hidden",
        isFeatured ? "border-brand bg-brand-dim/20" : "border-border bg-surface"
      )}
    >
      {/* Yearly 10% off ribbon */}
      {showYearlyBanner && !isFree && !isEnterprise && (
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
          <div className="absolute top-5 -right-5 rotate-45 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-8 py-0.5 text-center">
            10% off
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-fg uppercase tracking-wide">{planLabel}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-fg">{price}</span>
          {!isFree && !isEnterprise && <span className="text-sm text-fg-3">/mo</span>}
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
        disabled={isCurrentPlan || (!isEnterprise && !onUpgrade) || loading}
        onClick={onUpgrade}
      >
        {isCurrentPlan
          ? "Current plan"
          : isEnterprise
          ? "Contact us"
          : isFree
          ? "Continue for free"
          : `Upgrade to ${planLabel}`}
      </Button>
    </div>
  )
}
