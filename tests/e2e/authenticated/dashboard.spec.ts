import { test, expect } from "../fixtures"

test.describe("Dashboard", () => {
  test("loads with sidebar navigation", async ({ page }) => {
    await page.goto("/app/dashboard")
    await expect(page).toHaveURL(/\/app\/dashboard/)
    await expect(page.locator("aside")).toBeVisible()
  })

  test("settings modal opens and shows all nav sections", async ({ page }) => {
    await page.goto("/app/dashboard")
    await page.getByRole("button", { name: /settings/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("button", { name: /general/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /billing/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /security/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /account/i })).toBeVisible()
  })

  test("sign out returns to login", async ({ page }) => {
    await page.goto("/app/dashboard")
    const email = process.env.TEST_USER_EMAIL!
    await page.getByRole("button", { name: new RegExp(email.split("@")[0], "i") }).click()
    await page.getByRole("menuitem", { name: /sign out/i }).click()
    await expect(page).toHaveURL(/\/auth\/login|\/login/, { timeout: 10_000 })
  })
})
