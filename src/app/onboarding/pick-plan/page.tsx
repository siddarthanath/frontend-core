"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useCreateCheckout } from "@/lib/api/billing"
import { PricingCard } from "@/components/billing/PricingCard"
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

export default function PickPlanPage() {
  const router = useRouter()
  const { currentOrg } = useAuthStore()
  const createCheckout = useCreateCheckout(currentOrg?.id ?? "")

  async function handleUpgrade(plan: Plan) {
    if (plan === "free") {
      router.push("/app/dashboard")
      return
    }
    try {
      const { checkout_url } = await createCheckout.mutateAsync({
        plan,
        success_url: `${window.location.origin}/app/dashboard`,
        cancel_url: `${window.location.origin}/onboarding/pick-plan`,
      })
      window.location.assign(checkout_url)
    } catch {
      toast.error("Failed to start checkout")
    }
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(({ plan, price, description, features, featured }) => (
          <PricingCard
            key={plan}
            plan={plan}
            price={price}
            description={description}
            features={features}
            isFeatured={featured}
            isCurrentPlan={false}
            onUpgrade={() => handleUpgrade(plan)}
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
