import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { UserMenu } from "@/components/layout/UserMenu"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }))
vi.mock("@/lib/api/user", () => ({ useCurrentUser: () => ({ data: undefined }) }))
vi.mock("@/stores/auth", () => ({ useAuthStore: () => ({ currentOrg: null, setUser: vi.fn() }) }))
const mockUseSubscription = vi.fn().mockReturnValue({ data: undefined })
vi.mock("@/lib/api/billing", () => ({ useSubscription: () => mockUseSubscription() }))
vi.mock("@/lib/auth/client", () => ({ signOut: vi.fn() }))
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}))

describe("UserMenu", () => {
  it("shows first letter of displayName as avatar initial", () => {
    render(<UserMenu email="sid@example.com" displayName="Siddartha" collapsed={false} />)
    expect(screen.getByText("S")).toBeInTheDocument()
  })

  it("falls back to first letter of email when no displayName", () => {
    render(<UserMenu email="alex@example.com" displayName={null} collapsed={false} />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("shows name and plan label in expanded trigger", () => {
    render(<UserMenu email="sid@example.com" displayName="Siddartha" collapsed={false} />)
    expect(screen.getByText("Siddartha")).toBeInTheDocument()
    expect(screen.getByText("Free plan")).toBeInTheDocument()
  })

  it.each([
    ["pro",        "Pro plan"],
    ["max",        "Max plan"],
    ["enterprise", "Enterprise plan"],
  ] as const)("shows correct label for %s plan", (plan, label) => {
    mockUseSubscription.mockReturnValueOnce({ data: { plan } })
    render(<UserMenu email="sid@example.com" displayName="Sid" collapsed={false} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("hides name and plan text visually when collapsed", () => {
    render(<UserMenu email="sid@example.com" displayName="Siddartha" collapsed />)
    // Text stays in the DOM (no remount) but the wrapper is opacity-0 / max-w-0
    const name = screen.getByText("Siddartha")
    expect(name.closest("div")).toHaveClass("opacity-0")
    expect(name.closest("div")).toHaveClass("max-w-0")
  })
})
