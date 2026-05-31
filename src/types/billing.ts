export type Plan = "free" | "pro" | "max" | "enterprise"

export const PLAN_ORDER: Record<Plan, number> = {
  free: 0,
  pro: 1,
  max: 2,
  enterprise: 3,
}
export type BillingPeriod = "monthly" | "yearly"

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  max: "Max",
  enterprise: "Enterprise",
}

export const PLAN_LABELS_LONG: Record<Plan, string> = {
  free: "Free plan",
  pro: "Pro plan",
  max: "Max plan",
  enterprise: "Enterprise plan",
}

export interface PlanConfig {
  plan: Plan
  monthlyPrice: string
  yearlyPrice: string
  description: string
  features: string[]
  featured: boolean
  contactUs?: boolean
}

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    plan: "free",
    monthlyPrice: "£0",
    yearlyPrice: "£0",
    description: "For individuals getting started.",
    features: ["Up to 3 members", "Basic org management", "Community support"],
    featured: false,
  },
  {
    plan: "pro",
    monthlyPrice: "£20",
    yearlyPrice: "£18",
    description: "For growing teams that need more power.",
    features: ["Unlimited members", "Priority support", "Advanced analytics", "API access"],
    featured: true,
  },
  {
    plan: "max",
    monthlyPrice: "£50",
    yearlyPrice: "£45",
    description: "For power users who need everything.",
    features: ["Everything in Pro", "AI sessions", "Unlimited usage", "Dedicated support"],
    featured: false,
  },
  {
    plan: "enterprise",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    description: "For schools and organisations at scale.",
    features: ["Everything in Max", "SSO / SAML", "Custom contracts", "Volume licensing"],
    featured: false,
    contactUs: true,
  },
]

export interface SubscriptionResponse {
  id: string
  org_id: string
  plan: Plan
  status: SubscriptionStatus
  stripe_subscription_id: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  cancellation_reason: string | null
  created_at: string
}

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete"

export interface CheckoutResponse {
  checkout_url: string
}

export interface PortalResponse {
  portal_url: string
}

export interface CreateCheckoutBody {
  plan: Plan
  period: BillingPeriod
  success_url: string
  cancel_url: string
}

export interface CreatePortalBody {
  return_url: string
}

export interface UpgradeSubscriptionBody {
  plan: Plan
  period: BillingPeriod
}

export interface CancelSubscriptionBody {
  reason?: string
}
