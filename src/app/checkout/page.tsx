import { Suspense } from "react"
import { PlansPageClient } from "@/components/billing/PlansPageClient"

export default function CheckoutPage() {
  return (
    <Suspense>
      <PlansPageClient />
    </Suspense>
  )
}
