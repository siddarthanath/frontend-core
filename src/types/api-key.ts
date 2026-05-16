export interface ApiKeyResponse {
  id: string
  name: string
  key_prefix: string
  created_at: string
  expires_at: string | null
  last_used_at: string | null
}

export interface ApiKeyCreatedResponse extends ApiKeyResponse {
  raw_key: string
}

export interface CreateApiKeyRequest {
  name: string
  expires_at?: string
}
