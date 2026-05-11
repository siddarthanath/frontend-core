export type Plan = "free" | "pro" | "enterprise"
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete"

export interface SubscriptionResponse {
  id: string
  org_id: string
  plan: Plan
  status: SubscriptionStatus
  stripe_subscription_id: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
}

export interface CheckoutResponse {
  checkout_url: string
}

export interface PortalResponse {
  portal_url: string
}
