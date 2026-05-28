"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth"
import { useCurrentUser, useUpdateProfile } from "@/lib/api/user"
import { useOrgs, useOrgMembers, useTransferOwnership, useInviteMember } from "@/lib/api/orgs"
import type { UserMeResponse } from "@/types/user"
import type { MemberResponse, OrgRole } from "@/types/org"
import { ErrorState } from "@/components/shared/FeedbackStates/ErrorState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsCard } from "@/components/shared/SettingsModal/SettingsCard"
import { cn } from "@/lib/utils"
import { FieldError } from "@/components/shared/FeedbackStates/FieldError"

export function GeneralSection() {
  const { data: me, isError, refetch } = useCurrentUser()

  if (isError) return <ErrorState message="Failed to load profile." onRetry={() => refetch()} />
  if (!me) return null

  return <GeneralForm me={me} />
}

function GeneralForm({ me }: { me: UserMeResponse }) {
  const { user } = useAuthStore()
  const updateProfile = useUpdateProfile()

  const [firstName, setFirstName] = useState(me.first_name ?? "")
  const [lastName, setLastName] = useState(me.last_name ?? "")

  async function handleSave() {
    try {
      await updateProfile.mutateAsync({ first_name: firstName || null, last_name: lastName || null })
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">General</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your name and account details.</p>
      </div>

      <SettingsCard
        title="Profile"
        description="Your name and email address."
        footer={
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving…" : "Save changes"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} disabled className="text-fg-3" />
            <p className="text-xs text-fg-3">To change your email or password, go to Security.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* To add workspace creation UI: expose a form calling useCreateOrg() → POST /api/v1/orgs with name + slug. Product-layer feature. */}
      <MembersCard userId={user?.id ?? ""} />
    </div>
  )
}

function MembersCard({ userId }: { userId: string }) {
  const { currentOrg } = useAuthStore()
  const { data: orgs = [] } = useOrgs()
  const org = orgs.find((o) => o.id === currentOrg?.id)
  const { data: members = [] } = useOrgMembers(currentOrg?.id ?? "")

  const myMembership = members.find((m) => m.user_id === userId)
  const isOwner = myMembership?.role === "owner"
  const isAdmin = myMembership?.role === "admin"
  const canManage = isOwner || isAdmin

  if (!org || org.is_personal || !canManage) return null

  return (
    <SettingsCard
      title="Members"
      description={`${members.length} member${members.length === 1 ? "" : "s"} in this workspace.`}
    >
      <div className="flex flex-col gap-4">
        {members.length > 0 && (
          <div className="flex flex-col divide-y divide-border">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                orgId={org.id}
                isCurrentUser={member.user_id === userId}
                canTransfer={isOwner && member.user_id !== userId && member.status === "active"}
              />
            ))}
          </div>
        )}
        <InviteForm orgId={org.id} />
      </div>
    </SettingsCard>
  )
}

function InviteForm({ orgId }: { orgId: string }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<OrgRole>("member")
  const [emailError, setEmailError] = useState<string | null>(null)
  const invite = useInviteMember(orgId)

  async function handleInvite(e: { preventDefault: () => void }) {
    e.preventDefault()
    setEmailError(null)
    try {
      await invite.mutateAsync({ email, role })
      toast.success(`Invite sent to ${email}`)
      setEmail("")
      setRole("member")
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("not found")) {
        setEmailError("No account found. Ask them to sign up first.")
      } else {
        toast.error("Failed to send invite")
      }
    }
  }

  return (
    <form onSubmit={handleInvite} className="flex flex-col gap-3 pt-1">
      <p className="text-xs font-medium text-fg-2">Invite member</p>
      <div className="flex gap-2 items-start">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <Label htmlFor="invite-email" className="sr-only">Email address</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(null) }}
            placeholder="colleague@example.com"
            className={cn(emailError && "border-error focus-visible:ring-error")}
            required
          />
          <FieldError message={emailError} />
        </div>
        <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
          <SelectTrigger className="w-28 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" disabled={!email || invite.isPending} className="shrink-0">
          {invite.isPending ? "Sending…" : "Invite"}
        </Button>
      </div>
    </form>
  )
}

const ROLE_LABELS: Record<OrgRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
}

function MemberRow({
  member,
  orgId,
  isCurrentUser,
  canTransfer,
}: {
  member: MemberResponse
  orgId: string
  isCurrentUser: boolean
  canTransfer: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const transfer = useTransferOwnership(orgId)

  async function handleTransfer() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    try {
      await transfer.mutateAsync(member.user_id)
      toast.success(`Ownership transferred to ${member.email ?? member.user_id}`)
      setConfirming(false)
    } catch {
      toast.error("Failed to transfer ownership")
      setConfirming(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-2 text-xs font-medium text-fg-2">
          {(member.email ?? member.user_id).charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-fg truncate">
            {member.email ?? member.user_id}
            {isCurrentUser && <span className="ml-1.5 text-fg-3 text-xs">(you)</span>}
          </p>
          {member.status === "invited" && (
            <p className="text-xs text-fg-3">Invite pending</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className="text-xs capitalize">
          {ROLE_LABELS[member.role] ?? member.role}
        </Badge>

        {canTransfer && (
          <Button
            size="sm"
            variant={confirming ? "destructive" : "ghost"}
            className="text-xs h-7 px-2"
            disabled={transfer.isPending}
            onClick={handleTransfer}
            onBlur={() => setConfirming(false)}
          >
            {confirming ? "Confirm?" : "Transfer"}
          </Button>
        )}
      </div>
    </div>
  )
}
