"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { useCreateCheckout } from "@/lib/api/billing"
import { PricingCard } from "@/components/billing/PricingCard"
import { PLAN_CONFIGS } from "@/types/billing"
import type { BillingPeriod, Plan } from "@/types/billing"

export default function PickPlanPage() {
  const router = useRouter()
  const { currentOrg } = useAuthStore()
  const [period, setPeriod] = useState<BillingPeriod>("monthly")
  const createCheckout = useCreateCheckout(currentOrg?.id ?? "")

  async function handleUpgrade(plan: Plan) {
    if (plan === "free") {
      router.push("/app/dashboard")
      return
    }
    if (plan === "enterprise") {
      window.location.assign("mailto:hello@example.com?subject=Enterprise enquiry")
      return
    }
    try {
      const { checkout_url } = await createCheckout.mutateAsync({
        plan,
        period,
        success_url: `${window.location.origin}/app/dashboard`,
        cancel_url: `${window.location.origin}/onboarding/pick-plan`,
      })
      window.location.assign(checkout_url)
    } catch {
      toast.error("Failed to start checkout")
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      {/* Step indicator */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="h-2 w-2 rounded-full bg-brand" />
        </div>
        <div className="text-center">
          <p className="text-xs text-fg-3 uppercase tracking-wide font-medium">Step 2 of 2</p>
          <h1 className="text-xl font-bold text-fg mt-1">Choose a plan</h1>
          <p className="text-sm text-fg-2 mt-1">
            You can upgrade or downgrade at any time from billing settings.
          </p>
        </div>
      </div>

      {/* Period toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-lg bg-bg-2 border border-border p-1">
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              period === "monthly" ? "bg-surface text-fg shadow-sm" : "text-fg-2 hover:text-fg"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              period === "yearly" ? "bg-surface text-fg shadow-sm" : "text-fg-2 hover:text-fg"
            )}
          >
            Yearly
            <span className={cn("text-xs", period === "yearly" ? "text-brand" : "text-fg-3")}>
              save 10%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PLAN_CONFIGS.map(({ plan, monthlyPrice, yearlyPrice, description, features, featured, contactUs }) => (
          <PricingCard
            key={plan}
            plan={plan}
            price={period === "yearly" ? yearlyPrice : monthlyPrice}
            description={description}
            features={features}
            isFeatured={featured}
            isCurrentPlan={false}
            showYearlyBanner={period === "yearly"}
            onUpgrade={contactUs ? () => handleUpgrade("enterprise") : () => handleUpgrade(plan)}
            loading={createCheckout.isPending}
          />
        ))}
      </div>

      <p className="text-center text-xs text-fg-3">
        Free plan selected by default — no card required.
      </p>
    </div>
  )
}
