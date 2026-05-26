import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { MemberResponse, OrgResponse, OrgRole } from "@/types/org"

// ── Query keys ────────────────────────────────────────────────────────────────

export const orgKeys = {
  all: ["orgs"] as const,
  detail: (id: string) => ["orgs", id] as const,
  members: (id: string) => ["orgs", id, "members"] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function useOrgs() {
  return useQuery({
    queryKey: orgKeys.all,
    queryFn: () => api.get("api/v1/orgs").json<OrgResponse[]>(),
  })
}

export function useOrg(orgId: string) {
  return useQuery({
    queryKey: orgKeys.detail(orgId),
    queryFn: () => api.get(`api/v1/orgs/${orgId}`).json<OrgResponse>(),
    enabled: !!orgId,
  })
}

export function useOrgMembers(orgId: string) {
  return useQuery({
    queryKey: orgKeys.members(orgId),
    queryFn: () => api.get(`api/v1/orgs/${orgId}/members`).json<MemberResponse[]>(),
    enabled: !!orgId,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateOrg() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; slug: string }) =>
      api.post("api/v1/orgs", { json: body }).json<OrgResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.all }),
  })
}

export function useUpdateOrg(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string }) =>
      api.patch(`api/v1/orgs/${orgId}`, { json: body }).json<OrgResponse>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orgKeys.detail(orgId) })
      qc.invalidateQueries({ queryKey: orgKeys.all })
    },
  })
}

export function useInviteMember(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { email: string; role: OrgRole }) =>
      api.post(`api/v1/orgs/${orgId}/members`, { json: body }).json<MemberResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.members(orgId) }),
  })
}

export function useAcceptInvite(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () =>
      api.post(`api/v1/orgs/${orgId}/members/accept`).json<MemberResponse>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orgKeys.members(orgId) })
      qc.invalidateQueries({ queryKey: orgKeys.all })
    },
  })
}

export function useChangeRole(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: OrgRole }) =>
      api
        .patch(`api/v1/orgs/${orgId}/members/${userId}`, { json: { role } })
        .json<MemberResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.members(orgId) }),
  })
}

export function useRemoveMember(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      api.delete(`api/v1/orgs/${orgId}/members/${userId}`).json<{ message: string }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.members(orgId) }),
  })
}

export function useTransferOwnership(orgId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (newOwnerId: string) =>
      api
        .post(`api/v1/orgs/${orgId}/transfer-ownership`, { json: { new_owner_id: newOwnerId } })
        .json<MemberResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: orgKeys.members(orgId) }),
  })
}
