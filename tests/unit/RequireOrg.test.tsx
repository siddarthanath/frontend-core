import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { RequireOrg } from "@/components/shared/guards/RequireOrg"

const mockStore = vi.fn()

vi.mock("@/stores/auth", () => ({
  useAuthStore: (selector: (s: { currentOrg: { id: string; name: string } | null }) => unknown) =>
    selector(mockStore()),
}))

describe("RequireOrg", () => {
  it("renders children when an org is selected", () => {
    mockStore.mockReturnValue({ currentOrg: { id: "org-1", name: "Acme" } })
    render(<RequireOrg><div>Protected content</div></RequireOrg>)
    expect(screen.getByText("Protected content")).toBeInTheDocument()
    expect(screen.queryByText("No organisation selected")).not.toBeInTheDocument()
  })

  it("shows empty state when no org selected", () => {
    mockStore.mockReturnValue({ currentOrg: null })
    render(<RequireOrg><div>Protected content</div></RequireOrg>)
    expect(screen.getByText("No organisation selected")).toBeInTheDocument()
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument()
  })

  it("accepts a custom description", () => {
    mockStore.mockReturnValue({ currentOrg: null })
    render(<RequireOrg description="Create one below."><div /></RequireOrg>)
    expect(screen.getByText("Create one below.")).toBeInTheDocument()
  })
})
