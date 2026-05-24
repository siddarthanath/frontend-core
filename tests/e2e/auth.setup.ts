import fs from "fs"
import path from "path"
import { test as setup, expect } from "@playwright/test"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  // Ensure the directory exists before writing.
  fs.mkdirSync(path.dirname(authFile), { recursive: true })

  if (!email || !password) {
    // Save empty state — authenticated tests will skip via the auto fixture.
    await page.context().storageState({ path: authFile })
    return
  }

  await page.goto("/auth/login")
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole("button", { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/app/, { timeout: 10_000 })

  await page.context().storageState({ path: authFile })
})
