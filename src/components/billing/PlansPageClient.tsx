"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUiStore } from "@/stores/ui"
import { useCurrentUser } from "@/lib/api/user"
import { useSubscription, useCreateCheckout, useCreatePortal, useUpgradeSubscription } from "@/lib/api/billing"
import { PricingCard } from "@/components/billing/PricingCard"
import { PLAN_CONFIGS, PLAN_ORDER } from "@/types/billing"
import type { BillingPeriod, Plan } from "@/types/billing"

interface PlansPageClientProps {
  defaultReturnTo?: string
}

export function PlansPageClient({ defaultReturnTo = "/app/billing" }: PlansPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams.get("returnTo") ?? defaultReturnTo
  // Reject absolute URLs to prevent open-redirect attacks
  const returnTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : defaultReturnTo
  const [period, setPeriod] = useState<BillingPeriod>("monthly")

  const closeSettings = useUiStore((s) => s.closeSettings)
  const { data: me, isLoading: meLoading } = useCurrentUser()
  const orgId = me?.org_id ?? ""
  const { data: subscription } = useSubscription(orgId)
  const createCheckout = useCreateCheckout(orgId)
  const createPortal = useCreatePortal(orgId)
  const upgradeSubscription = useUpgradeSubscription(orgId)

  async function handleUpgrade(plan: Plan) {
    if (plan === "enterprise") {
      window.location.assign("mailto:hello@example.com?subject=Enterprise enquiry")
      return
    }

    if (subscription?.stripe_subscription_id) {
      const currentOrder = PLAN_ORDER[subscription.plan]
      const targetOrder = PLAN_ORDER[plan]

      if (targetOrder > currentOrder) {
        // Upgrade — swap price in-place, no redirect needed
        try {
          await upgradeSubscription.mutateAsync({ plan, period })
          toast.success("Plan upgraded successfully")
          closeSettings()
          router.push(returnTo)
        } catch {
          toast.error("Failed to upgrade plan")
        }
      } else {
        // Downgrade or same plan — send to Stripe portal
        try {
          const { portal_url } = await createPortal.mutateAsync({
            return_url: `${window.location.origin}${returnTo}`,
          })
          closeSettings()
          window.location.assign(portal_url)
        } catch {
          toast.error("Failed to open billing portal")
        }
      }
      return
    }

    // No subscription yet — free means just go back
    if (plan === "free") {
      closeSettings()
      router.push(returnTo)
      return
    }

    if (!orgId) {
      toast.error("Account not ready — please refresh and try again")
      return
    }
    try {
      const { checkout_url } = await createCheckout.mutateAsync({
        plan,
        period,
        success_url: `${window.location.origin}/app/dashboard`,
        cancel_url: `${window.location.origin}${returnTo}`,
      })
      window.location.assign(checkout_url)
    } catch {
      toast.error("Failed to start checkout")
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-xl font-bold text-fg">Choose a plan</h1>
        <p className="text-sm text-fg-2 mt-1">You can change your plan at any time.</p>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-lg bg-bg-2 border border-border p-1">
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              period === "monthly" ? "bg-fg/10 text-fg shadow-sm" : "text-fg-2 hover:text-fg"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              period === "yearly" ? "bg-fg/10 text-fg shadow-sm" : "text-fg-2 hover:text-fg"
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
            onUpgrade={contactUs ? () => handleUpgrade("enterprise") : () => handleUpgrade(plan)}
            loading={meLoading || createCheckout.isPending || createPortal.isPending || upgradeSubscription.isPending}
          />
        ))}
      </div>

      <p className="text-center text-xs text-fg-3">
        Free plan selected by default — no card required.
      </p>
    </div>
  )
}
