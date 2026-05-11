import { type Metadata } from "next"
import { MembersPageClient } from "@/components/org/MembersPageClient"

export const metadata: Metadata = { title: "Members" }

export default function MembersPage() {
  return <MembersPageClient />
}
