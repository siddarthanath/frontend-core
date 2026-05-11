import { type Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard" }

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-2 text-fg">Dashboard</h1>
      <p className="text-sm text-fg-3">Add your product dashboard here.</p>
    </div>
  )
}
