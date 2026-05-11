import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { CheckoutResponse, Plan, PortalResponse, SubscriptionResponse } from "@/types/billing"

// ── Query keys ────────────────────────────────────────────────────────────────

export const billingKeys = {
  subscription: (orgId: string) => ["billing", orgId, "subscription"] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function useSubscription(orgId: string) {
  return useQuery({
    queryKey: billingKeys.subscription(orgId),
    queryFn: () => api.get(`api/v1/orgs/${orgId}/billing`).json<SubscriptionResponse>(),
    enabled: !!orgId,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateCheckout(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { plan: Plan; success_url: string; cancel_url: string }) =>
      api.post(`api/v1/orgs/${orgId}/billing/checkout`, { json: body }).json<CheckoutResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: billingKeys.subscription(orgId) }),
  })
}

export function useCreatePortal(orgId: string) {
  return useMutation({
    mutationFn: (body: { return_url: string }) =>
      api.post(`api/v1/orgs/${orgId}/billing/portal`, { json: body }).json<PortalResponse>(),
  })
}
