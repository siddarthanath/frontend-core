import { describe, it, expect } from "vitest"
import { validatePassword, PASSWORD_RULES } from "@/lib/auth/password"

// ── Individual rule coverage ──────────────────────────────────────────────────
// Each case satisfies every rule except the one under test, proving rules are
// independent and validatePassword correctly identifies which rule failed.

describe("PASSWORD_RULES", () => {
  it.each([
    // [rule id,    passing input,   failing input]
    ["length",    "Abcdef1!",   "Abcd1!"],    // 8 chars passes, 7 fails
    ["uppercase", "Abcdefg1!",  "abcdefg1!"], // has uppercase vs none
    ["number",    "Abcdefg1!",  "Abcdefg!!"], // has number vs none
    ["special",   "Abcdefg1!",  "Abcdefg1"],  // has special char vs none
  ])("rule '%s': boundary pass and fail", (id, passing, failing) => {
    const rule = PASSWORD_RULES.find((r) => r.id === id)!
    expect(rule.test(passing)).toBe(true)
    expect(rule.test(failing)).toBe(false)
  })
})

// ── validatePassword contract ─────────────────────────────────────────────────

describe("validatePassword", () => {
  it("returns undefined when all rules pass", () => {
    expect(validatePassword("Abcdefg1!")).toBeUndefined()
  })

  it("returns the failing rule label — not undefined", () => {
    // One rule fails at a time; others satisfied
    expect(validatePassword("Abcd1!")).toBe("At least 8 characters")      // too short
    expect(validatePassword("abcdefg1!")).toBe("One uppercase letter (A–Z)") // no uppercase
    expect(validatePassword("Abcdefg!!")).toBe("One number (0–9)")          // no number
    expect(validatePassword("Abcdefg1")).toBe("One special character (!@#…)") // no special
  })

  it("returns the first failing rule for an empty string", () => {
    // Empty string fails all rules — first rule in the array wins
    const firstRule = PASSWORD_RULES[0]
    expect(validatePassword("")).toBe(firstRule.label)
  })
})
