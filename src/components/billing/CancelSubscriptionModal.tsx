"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCancelSubscription } from "@/lib/api/billing"

interface CancelSubscriptionModalProps {
  orgId: string
  periodEnd: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelSubscriptionModal({
  orgId,
  periodEnd,
  open,
  onOpenChange,
}: CancelSubscriptionModalProps) {
  const [reason, setReason] = useState("")
  const cancel = useCancelSubscription(orgId)

  const formattedDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString(undefined, { dateStyle: "long" })
    : "the end of your billing period"

  async function handleCancel() {
    try {
      await cancel.mutateAsync({ reason: reason.trim() || undefined })
      toast.success("Subscription cancelled — access continues until " + formattedDate)
      onOpenChange(false)
    } catch {
      toast.error("Failed to cancel subscription")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel subscription?</DialogTitle>
          <DialogDescription>
            Your plan stays active until <strong>{formattedDate}</strong>. After that you move to
            the Free plan and lose access to paid features.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cancel-reason">Reason (optional)</Label>
          <Textarea
            id="cancel-reason"
            placeholder="Tell us why you're leaving — this helps us improve."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            rows={3}
          />
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={cancel.isPending}>
            Keep subscription
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={cancel.isPending}>
            {cancel.isPending ? "Cancelling…" : "Cancel subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
