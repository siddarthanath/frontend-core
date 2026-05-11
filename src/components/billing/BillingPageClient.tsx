"use client"

import { toast } from "sonner"
import { ExternalLink, CreditCard } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useAutoSelectOrg } from "@/hooks/useAutoSelectOrg"
import { useSubscription, useCreateCheckout, useCreatePortal } from "@/lib/api/billing"
import { PlanBadge } from "@/components/billing/PlanBadge"
import { PricingCard } from "@/components/billing/PricingCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RequireOrg } from "@/components/shared/RequireOrg"
import type { Plan } from "@/types/billing"

const PLANS: {
  plan: Plan
  price: string
  description: string
  features: string[]
  featured: boolean
}[] = [
  {
    plan: "free",
    price: "$0",
    description: "For individuals and small teams getting started.",
    features: ["Up to 3 members", "Basic org management", "Community support"],
    featured: false,
  },
  {
    plan: "pro",
    price: "$29",
    description: "For growing teams that need more power.",
    features: ["Unlimited members", "Priority support", "Advanced analytics", "API access"],
    featured: true,
  },
  {
    plan: "enterprise",
    price: "$99",
    description: "For large organisations with advanced needs.",
    features: ["Everything in Pro", "SSO / SAML", "Custom contracts", "Dedicated support"],
    featured: false,
  },
]

export function BillingPageClient() {
  const { currentOrg } = useAuthStore()
  useAutoSelectOrg()

  const { data: subscription, isLoading } = useSubscription(currentOrg?.id ?? "")
  const createCheckout = useCreateCheckout(currentOrg?.id ?? "")
  const createPortal = useCreatePortal(currentOrg?.id ?? "")

  async function handleUpgrade(plan: Plan) {
    try {
      const { checkout_url } = await createCheckout.mutateAsync({
        plan,
        success_url: `${window.location.origin}/app/settings/billing?success=1`,
        cancel_url: `${window.location.origin}/app/settings/billing`,
      })
      window.location.href = checkout_url
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

      {/* Pricing cards */}
      <div>
        <h2 className="text-base font-semibold text-fg mb-4">Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(({ plan, price, description, features, featured }) => (
            <PricingCard
              key={plan}
              plan={plan}
              price={price}
              description={description}
              features={features}
              isFeatured={featured}
              isCurrentPlan={subscription?.plan === plan}
              onUpgrade={plan !== "free" ? () => handleUpgrade(plan) : undefined}
              loading={createCheckout.isPending}
            />
          ))}
        </div>
      </div>
    </div>
    </RequireOrg>
  )
}
