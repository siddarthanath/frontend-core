"use client"

// PROVIDER SWAP POINT (frontend)
// This component calls supabase.auth.signInWithOAuth — the only frontend change needed
// when switching auth providers. The provider string maps to Supabase's supported list.
// To swap to Firebase: replace supabase.auth.signInWithOAuth with firebase.signInWithPopup.
// To swap to a custom backend: replace with a redirect to your own /auth/{provider} endpoint.
// Everything above this file (pages, layouts, route protection) stays the same.

import { createClient } from "@/lib/supabase/client"

// Supabase supports: google | azure (Microsoft) | github | twitter | facebook | discord | ...
// Add new providers here — no other files need to change.
export type OAuthProvider = "google" | "azure"

interface OAuthButtonProps {
  provider: OAuthProvider
  label: string
  icon: React.ReactNode
  redirectTo?: string
}

export function OAuthButton({
  provider,
  label,
  icon,
  redirectTo = "/app/dashboard",
}: OAuthButtonProps) {
  async function handleClick() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
    // Supabase redirects the browser to Google/Microsoft — no response to handle here.
    // The user lands back at /auth/callback, which exchanges the code and redirects to `next`.
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
      style={{
        borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)",
        color: "var(--color-foreground)",
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ── Google ────────────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
    />
  </svg>
)

interface ProviderButtonProps {
  redirectTo?: string
}

export function GoogleButton({ redirectTo }: ProviderButtonProps) {
  return (
    <OAuthButton
      provider="google"
      label="Continue with Google"
      icon={<GoogleIcon />}
      redirectTo={redirectTo}
    />
  )
}

// ── Microsoft (Outlook / M365) ────────────────────────────────────────────────

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden>
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
)

export function MicrosoftButton({ redirectTo }: ProviderButtonProps) {
  return (
    <OAuthButton
      provider="azure"
      label="Continue with Microsoft"
      icon={<MicrosoftIcon />}
      redirectTo={redirectTo}
    />
  )
}
