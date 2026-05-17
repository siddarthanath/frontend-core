import { test, expect } from "@playwright/test"

// Guard — skip entire suite if credentials are not provided.
// Set TEST_USER_EMAIL and TEST_USER_PASSWORD in your .env.test or CI secrets.
const email = process.env.TEST_USER_EMAIL
const password = process.env.TEST_USER_PASSWORD

test.describe("Authenticated flows", () => {
  test.beforeAll(() => {
    if (!email || !password) {
      test.skip(true, "TEST_USER_EMAIL / TEST_USER_PASSWORD not set — skipping authenticated E2E tests")
    }
  })

  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login")
    await page.getByLabel(/email/i).fill(email!)
    await page.getByLabel(/password/i).fill(password!)
    await page.getByRole("button", { name: /sign in/i }).click()
    // Wait for redirect into the app
    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 })
  })

  test("dashboard loads after login", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible()
  })

  test("settings modal opens and shows tabs", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("tab", { name: /billing/i })).toBeVisible()
  })

  test("billing tab shows current plan", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click()
    await page.getByRole("tab", { name: /billing/i }).click()
    // Plan badge should be visible — at minimum the Free plan
    await expect(page.getByText(/free|pro|max/i).first()).toBeVisible()
  })

  test("sign out returns to login page", async ({ page }) => {
    // Open user menu and click sign out
    await page.getByRole("button", { name: new RegExp(email!.split("@")[0], "i") }).click()
    await page.getByRole("menuitem", { name: /sign out/i }).click()
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10_000 })
  })
})
