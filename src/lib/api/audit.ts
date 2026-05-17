import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { AuditLogListResponse } from "@/types/audit"

export const auditKeys = {
  list: (orgId: string, offset: number) => ["audit", orgId, offset] as const,
}

export function useAuditLog(orgId: string, offset = 0, limit = 20) {
  return useQuery({
    queryKey: auditKeys.list(orgId, offset),
    queryFn: () =>
      api
        .get(`api/v1/orgs/${orgId}/audit-log`, { searchParams: { limit, offset } })
        .json<AuditLogListResponse>(),
    enabled: !!orgId,
  })
}
