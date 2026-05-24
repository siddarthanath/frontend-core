import { test, expect } from "@playwright/test"

test.describe("Login page", () => {
  test("renders email and password fields", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })

  test("shows error on wrong password", async ({ page }) => {
    await page.goto("/auth/login")
    await page.getByLabel(/email/i).fill("wrong@example.com")
    await page.getByLabel(/password/i).fill("wrongpassword")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page.getByRole("alert").or(page.getByText(/invalid|incorrect|error/i))).toBeVisible({
      timeout: 8_000,
    })
  })

  test("has link to signup page", async ({ page }) => {
    await page.goto("/auth/login")
    await page.getByRole("link", { name: /sign up/i }).click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test("has forgot password link", async ({ page }) => {
    await page.goto("/auth/login")
    await page.getByRole("link", { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/\/reset-password/)
  })
})

test.describe("Signup page", () => {
  test("renders email and password fields", async ({ page }) => {
    await page.goto("/auth/signup")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("has link back to login", async ({ page }) => {
    await page.goto("/auth/signup")
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible()
  })
})

test.describe("Reset password page", () => {
  test("renders email field and submit button", async ({ page }) => {
    await page.goto("/auth/reset-password")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /send|reset/i })).toBeVisible()
  })

  test("accepts a valid email", async ({ page }) => {
    await page.goto("/auth/reset-password")
    await page.getByLabel(/email/i).fill("user@example.com")
    await page.getByRole("button", { name: /send|reset/i }).click()
    // Should show confirmation or disable the button — not an error state.
    await expect(page.getByText(/invalid|error/i)).not.toBeVisible({ timeout: 4_000 })
  })
})

test.describe("Auth guard", () => {
  test("unauthenticated visit to /app redirects to login", async ({ page }) => {
    await page.goto("/app/dashboard")
    await expect(page).toHaveURL(/\/auth\/login|\/login/, { timeout: 8_000 })
  })
})
