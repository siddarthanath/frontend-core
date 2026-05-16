export interface FeatureFlagResponse {
  id: string
  org_id: string
  key: string
  enabled: boolean
  description: string | null
}

export interface UpsertFlagRequest {
  key: string
  enabled: boolean
  description?: string
}
