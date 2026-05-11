import { test, expect } from "@playwright/test"

test.describe("Marketing page (/)", () => {
  test("renders header with sign in and get started links", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /get started/i })).toBeVisible()
  })

  test("renders footer", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("footer")).toBeVisible()
  })

  test("sign in link navigates to /login", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("get started link navigates to /signup", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /get started/i }).click()
    await expect(page).toHaveURL(/\/signup/)
  })
})
