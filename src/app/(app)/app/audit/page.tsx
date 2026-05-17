import { type Metadata } from "next"
import { AuditLogTable } from "@/components/audit/AuditLogTable"

export const metadata: Metadata = { title: "Audit Log" }

export default function AuditLogPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-fg">Audit Log</h1>
        <p className="text-sm text-fg-3 mt-0.5">A full history of actions taken in this org.</p>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <AuditLogTable />
      </div>
    </div>
  )
}
