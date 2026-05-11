import { test, expect } from "@playwright/test"

test.describe("Theme toggle", () => {
  test("defaults to light mode", async ({ page }) => {
    await page.goto("/")
    const html = page.locator("html")
    await expect(html).not.toHaveClass(/dark/)
  })

  test("toggle switches to dark mode", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: /toggle theme/i }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)
  })

  test("theme persists after navigation", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: /toggle theme/i }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)

    await page.getByRole("link", { name: /sign in/i }).click()
    await expect(page.locator("html")).toHaveClass(/dark/)
  })

  test("toggle switches back to light mode", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: /toggle theme/i }).click()
    await page.getByRole("button", { name: /toggle theme/i }).click()
    await expect(page.locator("html")).not.toHaveClass(/dark/)
  })
})
