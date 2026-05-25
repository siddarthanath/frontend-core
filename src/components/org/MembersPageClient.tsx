"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useOrgMembers } from "@/lib/api/orgs"
import { useAutoSelectOrg } from "@/hooks/useAutoSelectOrg"
import type { OrgRole } from "@/types/org"
import { Button } from "@/components/ui/button"
import { MemberList } from "@/components/org/MemberList"
import { InviteModal } from "@/components/org/InviteModal"
import { RequireOrg } from "@/components/shared/RequireOrg"

export function MembersPageClient() {
  const { currentOrg, user } = useAuthStore()
  const { data: members = [] } = useOrgMembers(currentOrg?.id ?? "")
  const [inviteOpen, setInviteOpen] = useState(false)

  useAutoSelectOrg()

  const currentMember = members.find((m) => m.user_id === user?.id)
  const currentUserRole: OrgRole = currentMember?.role ?? "member"
  const canInvite = currentUserRole === "owner" || currentUserRole === "admin"

  return (
    <RequireOrg>
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-fg">Members</h1>
          <p className="text-sm text-fg-2 mt-1">{currentOrg?.name}</p>
        </div>
        {canInvite && (
          <Button onClick={() => setInviteOpen(true)} className="flex items-center gap-2">
            <UserPlus size={15} />
            Invite member
          </Button>
        )}
      </div>

      <MemberList
        orgId={currentOrg?.id ?? ""}
        currentUserRole={currentUserRole}
        currentUserId={user?.id ?? ""}
      />

      <InviteModal
        orgId={currentOrg?.id ?? ""}
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
    </RequireOrg>
  )
}
