"use client";

// PROVIDER SWAP POINT (frontend)
// If/when you swap auth providers, you rewrite this file + get_current_user in the backend —
// the rest of the app (repositories, services, endpoints) doesn't change.
// Supabase → Firebase: replace createBrowserClient with initializeApp + getAuth.
// Supabase → custom backend: replace with a fetch to your own /auth/session endpoint.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function signOut(): Promise<void> {
  const { error } = await createClient().auth.signOut()
  if (error) throw error
}

export async function signOutAll(): Promise<void> {
  const { error } = await createClient().auth.signOut({ scope: "global" })
  if (error) throw error
}
