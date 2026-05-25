/**
 * Single source of truth for password policy.
 * Mirror these rules exactly in Supabase: Auth → Policies → Password strength.
 * NOTE: If you change any rule here, update the Supabase dashboard to match — they are
 * not linked automatically. Drift means frontend allows a password that Supabase rejects.
 */

export interface PasswordRule {
  id: string
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length",    label: "At least 8 characters",       test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A–Z)",   test: (p) => /[A-Z]/.test(p) },
  { id: "number",    label: "One number (0–9)",             test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "One special character (!@#…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
]

/** Returns an error string if any rule fails, undefined if all pass. */
export function validatePassword(password: string): string | undefined {
  const failing = PASSWORD_RULES.find((r) => !r.test(password))
  return failing ? failing.label : undefined
}
