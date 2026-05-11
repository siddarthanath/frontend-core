import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { UserMenu } from "@/components/shared/UserMenu"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }))
vi.mock("@/stores/auth", () => ({ useAuthStore: (s: (state: object) => unknown) => s({ currentOrg: null }) }))
vi.mock("@/lib/api/billing", () => ({ useSubscription: () => ({ data: undefined }) }))
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

  it("renders collapsed trigger without name or plan text", () => {
    render(<UserMenu email="sid@example.com" displayName="Siddartha" collapsed />)
    expect(screen.queryByText("Siddartha")).not.toBeInTheDocument()
    expect(screen.queryByText("Free plan")).not.toBeInTheDocument()
  })
})
