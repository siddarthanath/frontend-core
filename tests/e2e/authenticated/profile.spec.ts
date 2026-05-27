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

  test("shows hint to use Security tab for email and password changes", async ({ page }) => {
    await expect(page.getByText(/to change your email or password, go to security/i)).toBeVisible()
  })

  test("does not show change password field in General", async ({ page }) => {
    await expect(page.getByLabel(/new password/i)).not.toBeVisible()
  })

  test("updates first and last name successfully", async ({ page }) => {
    await page.getByLabel(/first name/i).fill("Test")
    await page.getByLabel(/last name/i).fill("User")
    await page.getByRole("button", { name: /save changes/i }).click()
    await expect(page.getByText(/profile updated/i)).toBeVisible({ timeout: 6_000 })
  })
})
