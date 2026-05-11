import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-fg hover:text-fg-2 transition-colors">
          <Image src="/vercel.svg" alt="Logo" width={20} height={20} className="dark:invert" />
          Template
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm text-fg-2 hover:text-fg transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-on hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
