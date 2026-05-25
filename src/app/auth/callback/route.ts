import { createClient } from "@/lib/auth/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const rawNext = searchParams.get("next") ?? "/app/dashboard"
  // Reject absolute URLs and protocol-relative URLs to prevent open-redirect attacks.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/app/dashboard"
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, origin)
      )
    }
  }

  return NextResponse.redirect(new URL(next, origin))
}
