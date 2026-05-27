"use client"

import { ErrorState } from "@/components/shared/FeedbackStates/ErrorState"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorState message="Something went wrong." onRetry={reset} onHome />
    </div>
  )
}
