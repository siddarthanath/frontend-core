import { test, expect } from "../fixtures"

test.describe("Billing settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app/dashboard")
    await page.getByRole("button", { name: /settings/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.getByRole("button", { name: /billing/i }).click()
  })

  test("shows current plan", async ({ page }) => {
    await expect(page.getByText(/current plan/i)).toBeVisible()
    // Plan badge renders one of these values.
    await expect(page.getByText(/free|pro|max|enterprise/i).first()).toBeVisible({ timeout: 6_000 })
  })

  test("adjust plan button navigates to checkout", async ({ page }) => {
    await page.getByRole("button", { name: /adjust plan/i }).click()
    await expect(page).toHaveURL(/\/checkout/, { timeout: 8_000 })
  })
})
