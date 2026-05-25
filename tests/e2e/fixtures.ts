import { test as base, expect } from "@playwright/test"

export { expect }

// Auto-fixture: skips the entire test if no credentials are available.
// Set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.local to run authenticated tests locally.
export const test = base.extend<{ requireCredentials: void }>({
  requireCredentials: [
    async ({}, use) => {
      if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
        test.skip()
      }
      await use()
    },
    { auto: true },
  ],
})
