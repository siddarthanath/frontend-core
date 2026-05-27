"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ExternalLink, CreditCard, ArrowRight } from "lucide-react"
import { useSubscription, useCreatePortal } from "@/lib/api/billing"
import { PlanBadge } from "@/components/billing/PlanBadge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/shared/FeedbackStates/ErrorState"
import { SettingsCard } from "@/components/shared/SettingsModal/SettingsCard"
import { useAuthStore } from "@/stores/auth"

export function BillingSection() {
  const router = useRouter()
  const { currentOrg } = useAuthStore()
  const orgId = currentOrg?.id ?? ""

  const { data: subscription, isLoading, isError, refetch } = useSubscription(orgId)
  const createPortal = useCreatePortal(orgId)

  async function handlePortal() {
    try {
      const { portal_url } = await createPortal.mutateAsync({ return_url: window.location.href })
      window.location.assign(portal_url)
    } catch {
      toast.error("Failed to open billing portal")
    }
  }

  if (isError) return <ErrorState message="Failed to load billing info." onRetry={() => refetch()} />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-fg">Billing</h2>
        <p className="text-sm text-fg-3 mt-0.5">Manage your plan and payment details.</p>
      </div>

      <SettingsCard
        title="Plan"
        description="See your current plan and modify."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/checkout")}
              className="flex items-center gap-1.5"
            >
              Adjust plan
              <ArrowRight size={12} />
            </Button>
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
          </>
        }
      >
        <div className="flex flex-col gap-1 items-start">
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <PlanBadge plan={subscription?.plan ?? "free"} />
          )}
          {subscription?.cancel_at_period_end && (
            <span className="text-xs text-fg-3">Cancels at period end</span>
          )}
          {subscription?.current_period_end && !subscription.cancel_at_period_end && (
            <span className="text-xs text-fg-3" suppressHydrationWarning>
              Renews {new Date(subscription.current_period_end).toLocaleDateString(undefined)}
            </span>
          )}
        </div>
      </SettingsCard>
    </div>
  )
}
