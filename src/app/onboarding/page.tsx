"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function OnboardingWelcomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-md">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-fg">Welcome</h1>
        <p className="text-sm text-fg-2">
          Let&apos;s get you set up. It only takes a minute.
        </p>
      </div>
      <Button onClick={() => router.push("/checkout")} className="w-full max-w-xs">
        Get started
      </Button>
    </div>
  )
}
