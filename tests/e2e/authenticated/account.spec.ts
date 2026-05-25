import { test, expect } from "../fixtures"

test.describe("Account settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/app/dashboard")
    await page.getByRole("button", { name: /settings/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.getByRole("button", { name: /account/i }).click()
  })

  test("renders the account section heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /account/i })).toBeVisible()
  })

  test("shows sign out of all devices button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sign out everywhere/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /sign out everywhere/i })).toBeEnabled()
  })

  test("delete button is disabled before confirmation phrase is typed", async ({ page }) => {
    await expect(page.getByRole("button", { name: /delete my account/i })).toBeDisabled()
  })

  test("delete button enables only after correct phrase is typed", async ({ page }) => {
    const confirmInput = page.getByPlaceholder("DELETE MY ACCOUNT")
    await confirmInput.fill("DELETE MY ACCOUN") // one char short
    await expect(page.getByRole("button", { name: /delete my account/i })).toBeDisabled()

    await confirmInput.fill("DELETE MY ACCOUNT")
    await expect(page.getByRole("button", { name: /delete my account/i })).toBeEnabled()
  })
})
