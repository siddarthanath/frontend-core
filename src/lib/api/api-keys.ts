import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { ApiKeyCreatedResponse, ApiKeyResponse, CreateApiKeyRequest } from "@/types/api-key"

export const apiKeyKeys = {
  list: (orgId: string) => ["api-keys", orgId] as const,
}

export function useApiKeys(orgId: string) {
  return useQuery({
    queryKey: apiKeyKeys.list(orgId),
    queryFn: () => api.get(`api/v1/orgs/${orgId}/api-keys`).json<ApiKeyResponse[]>(),
    enabled: !!orgId,
  })
}

export function useCreateApiKey(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateApiKeyRequest) =>
      api.post(`api/v1/orgs/${orgId}/api-keys`, { json: body }).json<ApiKeyCreatedResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: apiKeyKeys.list(orgId) }),
  })
}

export function useRevokeApiKey(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (keyId: string) =>
      api.delete(`api/v1/orgs/${orgId}/api-keys/${keyId}`).json<{ message: string }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: apiKeyKeys.list(orgId) }),
  })
}
