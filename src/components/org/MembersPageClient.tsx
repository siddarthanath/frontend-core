"use client"

import { useState, useEffect } from "react"
import { UserPlus, Building2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useOrgMembers, useOrgs } from "@/lib/api/orgs"
import type { OrgRole } from "@/types/org"
import { Button } from "@/components/ui/button"
import { MemberList } from "@/components/org/MemberList"
import { InviteModal } from "@/components/org/InviteModal"
import { EmptyState } from "@/components/shared/EmptyState"

export function MembersPageClient() {
  const { currentOrg, user, setCurrentOrg } = useAuthStore()
  const { data: orgs = [] } = useOrgs()
  const { data: members = [] } = useOrgMembers(currentOrg?.id ?? "")
  const [inviteOpen, setInviteOpen] = useState(false)

  // Auto-select first org if none selected
  useEffect(() => {
    if (!currentOrg && orgs.length > 0) {
      setCurrentOrg({ id: orgs[0].id, name: orgs[0].name })
    }
  }, [orgs, currentOrg, setCurrentOrg])

  const currentMember = members.find((m) => m.user_id === user?.id)
  const currentUserRole: OrgRole = currentMember?.role ?? "member"
  const canInvite = currentUserRole === "owner" || currentUserRole === "admin"

  if (!currentOrg) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Building2 size={32} />}
          title="No organisation selected"
          description="Select or create an organisation from the sidebar."
        />
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-fg">Members</h1>
          <p className="text-sm text-fg-2 mt-1">{currentOrg.name}</p>
        </div>
        {canInvite && (
          <Button onClick={() => setInviteOpen(true)} className="flex items-center gap-2">
            <UserPlus size={15} />
            Invite member
          </Button>
        )}
      </div>

      <MemberList
        orgId={currentOrg.id}
        currentUserRole={currentUserRole}
        currentUserId={user?.id ?? ""}
      />

      <InviteModal
        orgId={currentOrg.id}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  )
}
