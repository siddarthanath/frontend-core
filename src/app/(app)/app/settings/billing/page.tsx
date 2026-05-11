import { type Metadata } from "next"
import { BillingPageClient } from "@/components/billing/BillingPageClient"

export const metadata: Metadata = { title: "Billing" }

export default function BillingPage() {
  return <BillingPageClient />
}
