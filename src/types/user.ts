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
