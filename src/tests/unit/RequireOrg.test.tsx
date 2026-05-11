import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { RequireOrg } from "@/components/shared/RequireOrg"

vi.mock("@/stores/auth", () => ({
  useAuthStore: (selector: (s: { currentOrg: { id: string; name: string } | null }) => unknown) =>
    selector({ currentOrg: null }),
}))

describe("RequireOrg", () => {
  it("shows empty state when no org selected", () => {
    render(<RequireOrg><div>Protected content</div></RequireOrg>)
    expect(screen.getByText("No organisation selected")).toBeInTheDocument()
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument()
  })

  it("accepts a custom description", () => {
    render(<RequireOrg description="Create one below."><div /></RequireOrg>)
    expect(screen.getByText("Create one below.")).toBeInTheDocument()
  })
})
