import { describe, it, expect } from "vitest"
import { validatePassword, PASSWORD_RULES } from "@/lib/auth/password"

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

describe("validatePassword", () => {
  it("returns undefined when all rules pass", () => {
    expect(validatePassword("Abcdefg1!")).toBeUndefined()
  })

  it("returns the failing rule label — not undefined", () => {
    expect(validatePassword("Abcd1!")).toBe("At least 8 characters")
    expect(validatePassword("abcdefg1!")).toBe("One uppercase letter (A–Z)")
    expect(validatePassword("Abcdefg!!")).toBe("One number (0–9)")
    expect(validatePassword("Abcdefg1")).toBe("One special character (!@#…)")
  })

  it("returns the first failing rule for an empty string", () => {
    const firstRule = PASSWORD_RULES[0]
    expect(validatePassword("")).toBe(firstRule.label)
  })
})
