# Testing — frontend-core

---

## Two-Tier Model

| Tier | Tool | Location | Purpose |
|---|---|---|---|
| Unit | vitest + Testing Library | `tests/unit/` | Component rendering, store logic, utility functions |
| E2E | Playwright | `tests/e2e/` | Full user flows in a real browser |

---

## Unit Tests (vitest)

### File Naming

Mirror the source file path under `tests/unit/`:

```
src/components/shared/guards/RequireOrg.tsx  →  tests/unit/RequireOrg.test.tsx
src/lib/auth/password.ts                     →  tests/unit/password.test.ts
src/components/layout/UserMenu.tsx           →  tests/unit/UserMenu.test.tsx
```

### Mocking Pattern

Mock at the module boundary — the import, not the implementation. Use `vi.mock()` at the top of the file, before any test code.

**Stores:**
```typescript
vi.mock("@/stores/auth", () => ({
  useAuthStore: () => ({ currentOrg: null, setUser: vi.fn() }),
}))
```

**Next.js navigation:**
```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))
```

**API hooks:**
```typescript
const mockUseSubscription = vi.fn().mockReturnValue({ data: undefined })
vi.mock("@/lib/api/billing", () => ({
  useSubscription: () => mockUseSubscription(),
}))
```

Use `mockReturnValueOnce` to override for a specific test without affecting others:
```typescript
mockUseSubscription.mockReturnValueOnce({ data: { plan: "pro" } })
```

**shadcn UI components** — mock the ones that use Radix portals (they break in jsdom):
```typescript
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  // ...
}))
```

### What to Test

Test **behaviour**, not implementation:

```typescript
// Good — tests what the user sees
expect(screen.getByText("Siddartha")).toBeInTheDocument()

// Good — tests CSS state for visually-hidden elements (DOM present, not visible)
expect(name.closest("div")).toHaveClass("opacity-0")

// Avoid — tests internal implementation
expect(component.state.collapsed).toBe(true)
```

For components that hide content via CSS (opacity, max-width) rather than conditional rendering, assert the CSS class rather than `not.toBeInTheDocument()`:

```typescript
// Wrong — element IS in DOM, just visually hidden
expect(screen.queryByText("Siddartha")).not.toBeInTheDocument()

// Correct
const name = screen.getByText("Siddartha")
expect(name.closest("div")).toHaveClass("opacity-0")
```

### Example Unit Test

```typescript
describe("RequireOrg", () => {
  it("renders children when an org is selected", () => {
    mockStore.mockReturnValue({ currentOrg: { id: "org-1", name: "Acme" } })
    render(<RequireOrg><div>Protected content</div></RequireOrg>)
    expect(screen.getByText("Protected content")).toBeInTheDocument()
  })

  it("shows empty state when no org selected", () => {
    mockStore.mockReturnValue({ currentOrg: null })
    render(<RequireOrg><div>Protected content</div></RequireOrg>)
    expect(screen.getByText("No organisation selected")).toBeInTheDocument()
  })
})
```

### Running Unit Tests

```bash
npm run test          # watch mode
npm run test -- --run # single pass (CI)
```

---

## E2E Tests (Playwright)

### Structure

```
tests/e2e/
  public/              # No auth required
    hub.spec.ts
    theme.spec.ts
    maintenance.spec.ts
  authenticated/       # Requires TEST_USER_EMAIL + TEST_USER_PASSWORD in .env.local
    auth.spec.ts       # Login, logout, password reset
    billing.spec.ts    # Upgrade, cancel, reactivate
    profile.spec.ts    # Update name, change email
```

Authenticated tests are skipped automatically if credentials are absent:

```typescript
test.skip(!process.env.TEST_USER_EMAIL, "No test credentials")
```

### Page Object Pattern

For flows with multiple steps, extract selectors and actions into a page object to avoid brittle inline selectors:

```typescript
class SettingsPage {
  constructor(private page: Page) {}

  async openBilling() {
    await this.page.getByRole("button", { name: "User menu" }).click()
    await this.page.getByText("Settings").click()
    await this.page.getByText("Billing").click()
  }

  async clickAdjustPlan() {
    await this.page.getByRole("button", { name: "Adjust plan" }).click()
  }
}
```

### Assertions

Prefer role-based selectors over CSS or test IDs:

```typescript
// Good
await page.getByRole("button", { name: "Save changes" }).click()
await expect(page.getByText("Profile updated")).toBeVisible()

// Avoid
await page.locator(".twk-btn").click()
```

### Running E2E Tests

```bash
# All E2E
npx playwright test

# Specific file
npx playwright test tests/e2e/public/theme.spec.ts

# With browser UI (debugging)
npx playwright test --headed

# Authenticated flows (requires .env.local credentials)
TEST_USER_EMAIL=you@example.com TEST_USER_PASSWORD=secret npx playwright test tests/e2e/authenticated/
```
