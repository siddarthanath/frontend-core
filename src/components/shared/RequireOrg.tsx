"use client"

import { Building2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { EmptyState } from "@/components/shared/FeedbackStates/EmptyState"

interface RequireOrgProps {
  children: React.ReactNode
  description?: string
}

export function RequireOrg({
  children,
  description = "Select or create an organisation from the sidebar.",
}: RequireOrgProps) {
  const currentOrg = useAuthStore((s) => s.currentOrg)

  if (!currentOrg) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Building2 size={32} />}
          title="No organisation selected"
          description={description}
        />
      </div>
    )
  }

  return <>{children}</>
}
