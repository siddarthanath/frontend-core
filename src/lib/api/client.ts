import ky, { type KyResponse } from "ky";
import { createClient } from "@/lib/auth/client";

/** Shape every backend error is normalised to before reaching query hooks. */
export interface ApiError {
  code: string;
  message: string;
  detail: string | null;
  request_id: string | null;
}

export class ApiResponseError extends Error {
  constructor(public readonly error: ApiError) {
    super(error.message);
    this.name = "ApiResponseError";
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Global ky instance. All API calls go through here.
 *
 * Error interceptor normalises every non-2xx response to ApiResponseError
 * so individual hooks never inspect raw HTTP errors.
 *
 * PROVIDER SWAP POINT: swap getAuthHeader() if moving away from Supabase JWT.
 */
export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  retry: { limit: 2, statusCodes: [408, 429, 500, 502, 503, 504] },
  hooks: {
    beforeRequest: [
      async (request) => {
        const headers = await getAuthHeader();
        Object.entries(headers).forEach(([k, v]) => request.headers.set(k, v));
      },
    ],
    afterResponse: [
      async (_request, _options, response: KyResponse) => {
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          const envelope = (body as { error?: ApiError }).error;
          throw new ApiResponseError(
            envelope ?? {
              code: "UNKNOWN_ERROR",
              message: "An unexpected error occurred",
              detail: null,
              request_id: null,
            }
          );
        }
      },
    ],
  },
});
