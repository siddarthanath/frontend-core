"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal, UserMinus, Shield } from "lucide-react"
import { useOrgMembers, useRemoveMember } from "@/lib/api/orgs"
import type { MemberResponse, OrgRole } from "@/types/org"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChangeRoleDialog } from "@/components/org/ChangeRoleDialog"

const ROLE_VARIANT: Record<OrgRole, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
}

interface MemberListProps {
  orgId: string
  /** Current user's role — used to show/hide action menu. */
  currentUserRole: OrgRole
  currentUserId: string
}

export function MemberList({ orgId, currentUserRole, currentUserId }: MemberListProps) {
  const { data: members = [], isLoading } = useOrgMembers(orgId)
  const remove = useRemoveMember(orgId)
  const [roleTarget, setRoleTarget] = useState<MemberResponse | null>(null)

  const canManage = currentUserRole === "owner" || currentUserRole === "admin"

  async function handleRemove(member: MemberResponse) {
    try {
      await remove.mutateAsync(member.user_id)
      toast.success("Member removed")
    } catch {
      toast.error("Failed to remove member")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead className="w-10" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-mono text-xs text-fg-2">{m.user_id}</TableCell>
              <TableCell>
                <Badge variant={ROLE_VARIANT[m.role]}>{m.role}</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-fg-2 capitalize">{m.status}</span>
              </TableCell>
              {canManage && (
                <TableCell>
                  {m.user_id !== currentUserId && m.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {currentUserRole === "owner" && (
                          <DropdownMenuItem
                            onSelect={() => setRoleTarget(m)}
                            className="flex items-center gap-2"
                          >
                            <Shield size={14} />
                            Change role
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onSelect={() => handleRemove(m)}
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                        >
                          <UserMinus size={14} />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {roleTarget && (
        <ChangeRoleDialog
          orgId={orgId}
          member={roleTarget}
          open={!!roleTarget}
          onClose={() => setRoleTarget(null)}
        />
      )}
    </>
  )
}
