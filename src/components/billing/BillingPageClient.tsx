"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ExternalLink, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { useAutoSelectOrg } from "@/hooks/useAutoSelectOrg"
import { useSubscription, useCreateCheckout, useCreatePortal } from "@/lib/api/billing"
import { PlanBadge } from "@/components/billing/PlanBadge"
import { PricingCard } from "@/components/billing/PricingCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RequireOrg } from "@/components/shared/RequireOrg"
import { PLAN_CONFIGS } from "@/types/billing"
import type { BillingPeriod, Plan } from "@/types/billing"

export function BillingPageClient() {
  const { currentOrg } = useAuthStore()
  const [period, setPeriod] = useState<BillingPeriod>("monthly")

  useAutoSelectOrg()

  const { data: subscription, isLoading } = useSubscription(currentOrg?.id ?? "")
  const createCheckout = useCreateCheckout(currentOrg?.id ?? "")
  const createPortal = useCreatePortal(currentOrg?.id ?? "")

  async function handleUpgrade(plan: Plan) {
    if (plan === "enterprise") {
      window.location.assign("mailto:hello@example.com?subject=Enterprise enquiry")
      return
    }
    try {
      const { checkout_url } = await createCheckout.mutateAsync({
        plan,
        period,
        success_url: `${window.location.origin}/app/settings/billing?success=1`,
        cancel_url: `${window.location.origin}/app/settings/billing`,
      })
      window.location.assign(checkout_url)
    } catch {
      toast.error("Failed to start checkout")
    }
  }

  async function handlePortal() {
    try {
      const { portal_url } = await createPortal.mutateAsync({
        return_url: window.location.href,
      })
      window.open(portal_url, "_blank")
    } catch {
      toast.error("Failed to open billing portal")
    }
  }

  return (
    <RequireOrg>
      <div className="p-6 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-fg">Billing</h1>
            <p className="text-sm text-fg-2 mt-1">{currentOrg!.name}</p>
          </div>
          {subscription?.stripe_subscription_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePortal}
              disabled={createPortal.isPending}
              className="flex items-center gap-2"
            >
              <CreditCard size={14} />
              Manage billing
              <ExternalLink size={12} className="text-fg-3" />
            </Button>
          )}
        </div>

        {/* Current plan summary */}
        <div className="rounded-xl border border-border bg-surface p-5 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-fg-2">Current plan</span>
            {isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <div className="flex items-center gap-2">
                <PlanBadge plan={subscription?.plan ?? "free"} />
                {subscription?.cancel_at_period_end && (
                  <span className="text-xs text-fg-3">Cancels at period end</span>
                )}
              </div>
            )}
          </div>
          {subscription?.current_period_end && (
            <div className="text-right">
              <span className="text-xs text-fg-3">Renews</span>
              <p className="text-sm text-fg">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-fg">Plans</h2>
            {/* Period toggle */}
            <div className="flex items-center gap-1 rounded-lg bg-bg-2 border border-border p-1">
              <button
                onClick={() => setPeriod("monthly")}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                  period === "monthly" ? "bg-surface text-fg shadow-sm" : "text-fg-2 hover:text-fg"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setPeriod("yearly")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-colors",
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
                isCurrentPlan={subscription?.plan === plan}
                showYearlyBanner={period === "yearly"}
                onUpgrade={contactUs ? () => handleUpgrade("enterprise") : plan !== "free" ? () => handleUpgrade(plan) : undefined}
                loading={createCheckout.isPending}
              />
            ))}
          </div>
        </div>
      </div>
    </RequireOrg>
  )
}
