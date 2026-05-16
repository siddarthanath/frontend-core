export interface AuditLogResponse {
  id: string
  org_id: string
  actor_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  event_metadata: Record<string, unknown> | null
  created_at: string
}

export interface AuditLogListResponse {
  items: AuditLogResponse[]
  total: number
  limit: number
  offset: number
}
