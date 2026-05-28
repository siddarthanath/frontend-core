import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { CancelSubscriptionBody, CheckoutResponse, CreateCheckoutBody, CreatePortalBody, PortalResponse, SubscriptionResponse, UpgradeSubscriptionBody } from "@/types/billing"

export const billingKeys = {
  subscription: (orgId: string) => ["billing", orgId, "subscription"] as const,
}

export function useSubscription(orgId: string) {
  return useQuery({
    queryKey: billingKeys.subscription(orgId),
    queryFn: () => api.get(`api/v1/orgs/${orgId}/billing`).json<SubscriptionResponse>(),
    enabled: !!orgId,
  })
}

export function useCreateCheckout(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCheckoutBody) =>
      api.post(`api/v1/orgs/${orgId}/billing/checkout`, { json: body }).json<CheckoutResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: billingKeys.subscription(orgId) }),
  })
}

export function useCreatePortal(orgId: string) {
  return useMutation({
    mutationFn: (body: CreatePortalBody) =>
      api.post(`api/v1/orgs/${orgId}/billing/portal`, { json: body }).json<PortalResponse>(),
  })
}

export function useUpgradeSubscription(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpgradeSubscriptionBody) =>
      api.post(`api/v1/orgs/${orgId}/billing/upgrade`, { json: body }).json<{ message: string }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: billingKeys.subscription(orgId) }),
  })
}

export function useCancelSubscription(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CancelSubscriptionBody) =>
      api.post(`api/v1/orgs/${orgId}/billing/cancel`, { json: body }).json<{ message: string }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: billingKeys.subscription(orgId) }),
  })
}
