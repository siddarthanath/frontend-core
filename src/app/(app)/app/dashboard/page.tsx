import { type Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-foreground)" }}
      >
        Dashboard
      </h1>
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        Add your product dashboard here.
      </p>
    </div>
  )
}
