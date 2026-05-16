"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ExternalLink, CreditCard, ArrowRight } from "lucide-react"
import { useCurrentUser } from "@/lib/api/user"
import { useSubscription, useCreatePortal } from "@/lib/api/billing"
import { PlanBadge } from "@/components/billing/PlanBadge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
export function BillingSection() {
  const router = useRouter()
  const { data: me } = useCurrentUser()
  const orgId = me?.org_id ?? ""

  const { data: subscription, isLoading } = useSubscription(orgId)
  const createPortal = useCreatePortal(orgId)

  async function handlePortal() {
    try {
      const { portal_url } = await createPortal.mutateAsync({ return_url: window.location.href })
      window.location.assign(portal_url)
    } catch {
      toast.error("Failed to open billing portal")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-fg">Billing</h2>
          <p className="text-sm text-fg-3 mt-0.5">Manage your plan and payment details.</p>
        </div>
        {subscription?.stripe_subscription_id && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePortal}
            disabled={createPortal.isPending}
            className="flex items-center gap-2"
          >
            <CreditCard size={13} />
            Manage billing
            <ExternalLink size={11} className="text-fg-3" />
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-fg-3">Current plan</span>
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <div className="flex items-center gap-2">
              <PlanBadge plan={subscription?.plan ?? "free"} />
              {subscription?.cancel_at_period_end && (
                <span className="text-xs text-fg-3">Cancels at period end</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {subscription?.current_period_end && (
            <div className="text-right">
              <span className="text-xs text-fg-3">Renews </span>
              <span className="text-xs text-fg">
                {new Date(subscription.current_period_end).toLocaleDateString("en-GB")}
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/checkout?returnTo=${window.location.pathname}`)}
            className="flex items-center gap-1.5"
          >
            Adjust plan
            <ArrowRight size={12} />
          </Button>
        </div>
      </div>
    </div>
  )
}
