import { test, expect } from "../fixtures"

test.describe("Profile — General settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app/dashboard")
    await page.getByRole("button", { name: /settings/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    // General is the default active section.
  })

  test("shows email as read-only", async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toBeDisabled()
    await expect(emailInput).toHaveValue(process.env.TEST_USER_EMAIL!)
  })

  test("updates first and last name successfully", async ({ page }) => {
    await page.getByLabel(/first name/i).fill("Test")
    await page.getByLabel(/last name/i).fill("User")
    await page.getByRole("button", { name: /save changes/i }).click()
    await expect(page.getByText(/profile updated/i)).toBeVisible({ timeout: 6_000 })
  })

  test("rejects password shorter than 8 characters", async ({ page }) => {
    await page.getByLabel(/new password/i).fill("short")
    await page.getByRole("button", { name: /update password/i }).click()
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible({ timeout: 4_000 })
  })

  test("update password button is disabled when field is empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: /update password/i })).toBeDisabled()
  })
})
