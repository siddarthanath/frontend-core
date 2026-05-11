"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useChangeRole } from "@/lib/api/orgs"
import type { MemberResponse, OrgRole } from "@/types/org"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChangeRoleDialogProps {
  orgId: string
  member: MemberResponse
  open: boolean
  onClose: () => void
}

export function ChangeRoleDialog({ orgId, member, open, onClose }: ChangeRoleDialogProps) {
  const [role, setRole] = useState<OrgRole>(member.role)
  const { mutateAsync, isPending } = useChangeRole(orgId)

  async function handleSubmit() {
    try {
      await mutateAsync({ userId: member.user_id, role })
      toast.success("Role updated")
      onClose()
    } catch {
      toast.error("Failed to update role")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit() }} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="change-role">New role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
              <SelectTrigger id="change-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || role === member.role}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
