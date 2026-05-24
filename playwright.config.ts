import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    // Runs once — logs in and saves browser session to disk.
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Authenticated tests — start with the saved session, no login overhead per test.
    {
      name: "authenticated",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      testMatch: "**/authenticated/**/*.spec.ts",
    },
    // Public tests — marketing pages, auth forms, theme toggle. No session needed.
    {
      name: "public",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/public/**/*.spec.ts",
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
})
