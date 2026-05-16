"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { MoreHorizontal, UserMinus, Shield } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"
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
import { DataTable } from "@/components/shared/DataTable"
import { ChangeRoleDialog } from "@/components/org/ChangeRoleDialog"

const ROLE_VARIANT: Record<OrgRole, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
}

interface MemberListProps {
  orgId: string
  currentUserRole: OrgRole
  currentUserId: string
}

export function MemberList({ orgId, currentUserRole, currentUserId }: MemberListProps) {
  const { data: members = [], isLoading } = useOrgMembers(orgId)
  const remove = useRemoveMember(orgId)
  const [roleTarget, setRoleTarget] = useState<MemberResponse | null>(null)

  const canManage = currentUserRole === "owner" || currentUserRole === "admin"

  const columns: ColumnDef<MemberResponse>[] = useMemo(() => {
    const base: ColumnDef<MemberResponse>[] = [
      {
        accessorKey: "user_id",
        header: "User",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-fg-2">{row.original.user_id}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <Badge variant={ROLE_VARIANT[row.original.role]}>{row.original.role}</Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="text-sm text-fg-2 capitalize">{row.original.status}</span>
        ),
      },
    ]

    if (!canManage) return base

    return [
      ...base,
      {
        id: "actions",
        size: 40,
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => {
          const m = row.original
          if (m.user_id === currentUserId || m.role === "owner") return null
          return (
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
                  onSelect={async () => {
                    try {
                      await remove.mutateAsync(m.user_id)
                      toast.success("Member removed")
                    } catch {
                      toast.error("Failed to remove member")
                    }
                  }}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <UserMinus size={14} />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ]
  }, [canManage, currentUserRole, currentUserId, remove])

  return (
    <>
      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        emptyMessage="No members yet."
      />

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
