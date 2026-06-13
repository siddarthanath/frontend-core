export interface UserMeResponse {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  org_count: number
  /** B2C: personal org auto-created on first login. Use for checkout org_id. */
  org_id: string | null
  org_name: string | null
}

export interface UpdateProfileBody {
  first_name?: string | null
  last_name?: string | null
}

export interface UpdatePasswordBody {
  current_password: string
  new_password: string
}

/** Email change is disabled in the template (see SecuritySection.tsx); kept for re-enable. */
export interface UpdateEmailBody {
  current_password: string
  new_email: string
}
