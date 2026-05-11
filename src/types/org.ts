export type OrgRole = "owner" | "admin" | "member"
export type MembershipStatus = "invited" | "active"

export interface OrgResponse {
  id: string
  name: string
  slug: string
  is_personal: boolean
  created_at: string
}

export interface MemberResponse {
  id: string
  user_id: string
  org_id: string
  role: OrgRole
  status: MembershipStatus
  invited_by: string | null
  email: string | null
  created_at: string
}
