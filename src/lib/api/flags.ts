import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { FeatureFlagResponse, UpsertFlagRequest } from "@/types/flag"

export const flagKeys = {
  list: (orgId: string) => ["flags", orgId] as const,
}

export function useFlags(orgId: string) {
  return useQuery({
    queryKey: flagKeys.list(orgId),
    queryFn: () => api.get(`api/v1/orgs/${orgId}/flags`).json<FeatureFlagResponse[]>(),
    enabled: !!orgId,
  })
}

export function useUpsertFlag(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpsertFlagRequest) =>
      api.post(`api/v1/orgs/${orgId}/flags`, { json: body }).json<FeatureFlagResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: flagKeys.list(orgId) }),
  })
}

export function useDeleteFlag(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (flagId: string) =>
      api.delete(`api/v1/orgs/${orgId}/flags/${flagId}`).json<{ message: string }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: flagKeys.list(orgId) }),
  })
}
