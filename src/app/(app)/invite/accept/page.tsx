"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { useAcceptInvite } from "@/lib/api/orgs"
import { useAuthStore } from "@/stores/auth"

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setCurrentOrg } = useAuthStore()
  const orgId = searchParams.get("org_id") ?? ""
  const acceptInvite = useAcceptInvite(orgId)

  useEffect(() => {
    if (!orgId) {
      toast.error("Invalid invite link — missing org_id")
      router.replace("/app/dashboard")
      return
    }

    acceptInvite.mutate(undefined, {
      onSuccess: (membership) => {
        setCurrentOrg({ id: membership.org_id, name: "" })
        toast.success("Invite accepted — welcome to the org")
        router.replace("/app/dashboard")
      },
      onError: () => {
        toast.error("Failed to accept invite — it may have expired or already been accepted")
        router.replace("/app/dashboard")
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId])

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-sm text-fg-3">Accepting invite…</p>
    </div>
  )
}
