import { test as base, expect } from "@playwright/test"

export { expect }

// Auto-fixture: skips the entire test if auth credentials are not set.
// This means CI passes cleanly even without TEST_USER_EMAIL / TEST_USER_PASSWORD — it
// just reports authenticated tests as skipped rather than failing.
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
