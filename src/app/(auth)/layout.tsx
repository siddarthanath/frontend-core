import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/vercel.svg" alt="Logo" width={16} height={16} className="dark:invert" />
          <span className="text-sm font-semibold text-fg">Template</span>
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl p-8 shadow-sm bg-surface border border-border">
          {children}
        </div>
      </div>
    </div>
  )
}
