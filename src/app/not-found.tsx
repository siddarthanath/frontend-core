import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg">
      <h1 className="text-6xl font-bold text-fg">404</h1>
      <p className="text-sm text-fg-3">Page not found</p>
      <Link href="/" className="text-sm text-brand underline underline-offset-4">
        Go home
      </Link>
    </div>
  )
}
