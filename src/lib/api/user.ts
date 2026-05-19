import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserMeResponse {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  org_count: number
  /** B2C: personal org auto-created on first login. Use for checkout org_id. */
  org_id: string | null
}

export interface UpdateProfileBody {
  first_name?: string | null
  last_name?: string | null
}

// ── Query keys ────────────────────────────────────────────────────────────────

export const userKeys = {
  me: ["user", "me"] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

/** Fetches /user/me — triggers personal org creation on first call (B2C). */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () => api.get("api/v1/user/me").json<UserMeResponse>(),
    staleTime: 5 * 60 * 1000,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateProfileBody) =>
      api.patch("api/v1/user/me", { json: body }).json<UserMeResponse>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.me }),
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () =>
      api.delete("api/v1/user/account", { json: { confirmation: "DELETE MY ACCOUNT" } }).json<{ message: string }>(),
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (body: { new_password: string }) =>
      api.put("api/v1/user/password", { json: body }).json<{ message: string }>(),
  })
}

export function useUpdateEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { new_email: string }) =>
      api.put("api/v1/user/email", { json: body }).json<{ message: string }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.me }),
  })
}
