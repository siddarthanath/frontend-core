import { type Metadata } from "next"
import { OrgSettingsClient } from "@/components/org/OrgSettingsClient"

export const metadata: Metadata = { title: "Organisation Settings" }

export default function OrgSettingsPage() {
  return <OrgSettingsClient />
}
