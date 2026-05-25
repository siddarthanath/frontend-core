import Link from "next/link"

interface ErrorStateProps {
  code?: string
  message?: string
  onRetry?: () => void
  onHome?: boolean
}

export function ErrorState({ code, message, onRetry, onHome }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="font-semibold text-error">{code ?? "Error"}</p>
      <p className="text-sm text-fg-2">{message ?? "Something went wrong."}</p>
      <div className="flex items-center gap-4">
        {onRetry && (
          <button type="button" onClick={onRetry} className="text-sm underline text-brand">
            Try again
          </button>
        )}
        {onHome && (
          <Link href="/app/dashboard" className="text-sm underline text-fg-3">
            Go to dashboard
          </Link>
        )}
      </div>
    </div>
  )
}
